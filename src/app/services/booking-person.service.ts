import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { FirestoreBaseService } from "./firestore-base.service";
import { map, concatMap, finalize, timestamp } from "rxjs/operators";
import { BookingPerson } from "../models/booking-person";
import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;
import { Booking } from '../models/booking';
import { CreditService } from './credit.service';
import { Credit } from '../models/credit';
import { LocalBookingUser } from '../models/custom-models';

@Injectable({
  providedIn: 'root'
})
export class BookingPersonService extends FirestoreBaseService<BookingPerson>{

  constructor(private firestore: AngularFirestore, private creditService:CreditService) {
    super(firestore.collection('bookingPersons'));
  }

  public createBookingPerson(bookingPerson: BookingPerson) {
    return super.create(bookingPerson);
  }

  public async createBookingPersonBatch(bookingPersons:BookingPerson[]) {
    //throw new Error("test throw error");
    //return throwError(new Error("test throw error"));
    console.log('createBookingPersonBatch service: ', bookingPersons);

    var credit = {
      userDocId: bookingPersons[0].userId,
      userDisplayName: bookingPersons[0].userDisplayName,
      createdBy:bookingPersons[0].parentUserId,
      createdByDisplayName:bookingPersons[0].parentUserDisplayName,
    } as Credit;
    let fees=0;
    let notes = "booking: ";

    var batch = this.firestore.firestore.batch();
    bookingPersons.forEach(bp=>{
      var ref = this.firestore.collection('bookingPersons').doc().ref;
      batch.set(ref, bp);
      fees+=bp.amount;
      notes+=bp.userDisplayName+"|";
    });

    credit.amount = -fees;
    credit.note = notes;
    var ref = this.firestore.collection('credits').doc().ref;
    batch.set(ref, credit);

    console.log('createBookingPersonBatch service: ', credit);

    await batch.commit()
  }

   public get(bookingPersonDocId: string) {
      return super.getByDocId(bookingPersonDocId);
    }

  public getByUserDocId(userDocId: string) {
    return this.firestore.collection('bookingPersons', q=>q.where('parentUserId', '==', userDocId).orderBy('createdOn','desc')).snapshotChanges().pipe(
      map(actions=> {
        var items = actions.map(p=>{
          var data = p.payload.doc.data() as BookingPerson;
          return { ...data, docId:p.payload.doc.id} as BookingPerson;
        });
        return items;
      })
    )
  }

  public getByBookingDocId(bookingDocId: string) {
    return this.firestore.collection('bookingPersons', q => q.where('bookingDocId', '==', bookingDocId).orderBy('createdOn', 'asc')).snapshotChanges().pipe(
      map(actions => {
        var items = actions.map(p => {
          var data = p.payload.doc.data() as BookingPerson;
          console.log('getByBookingDocId()', data);
          return { ...data, docId: p.payload.doc.id } as BookingPerson;
        });
        return items;
      })
    );
  }

  public getCustomByBookingDocId(bookingDocId: string, myUserDocId:string) {
    return this.firestore.collection('bookingPersons', q => q.where('bookingDocId', '==', bookingDocId).orderBy('createdOn', 'asc')).snapshotChanges().pipe(
      map(actions => {
        var items = actions.map(p => {
          var u = p.payload.doc.data() as BookingPerson;

          var user = {
            docId: u.docId,
            userDocId: u.userId,
            name: u.userDisplayName,
            amount: u.amount,
            paymentMethod: u.paymentMethod,
            isMyBooking: u.userId == myUserDocId || u.parentUserId == myUserDocId,
            isFamily: u.parentUserId == myUserDocId || u.userId == myUserDocId,
            isForSale: u.isForSale,
            createdOn: u.createdOn,
          } as LocalBookingUser;

          console.log('getCustomByBookingDocId()', user);
          return { ...user, docId: p.payload.doc.id } as LocalBookingUser;
        });
        return items;
      })
    );
  }


  public markForSale(bookingPersonDocId:string, bookingPerson:BookingPerson) {
    bookingPerson.updatedOn = Timestamp.now();
    bookingPerson.isForSale = true;
    return this.update(bookingPersonDocId, bookingPerson);
  }

  public buySeat(forSaleDocId:string, buyer:BookingPerson) {

    //1. check is spot is still up for sale
    this.get(forSaleDocId).subscribe(result => {
      if (result && result.isForSale) {
        var batch = this.firestore.firestore.batch();
        //2. delete 
        var ref = this.firestore.collection('bookingPersons').doc(forSaleDocId).ref;
        batch.delete(ref);

        //3. buy 
        var ref = this.firestore.collection('bookingPersons').doc().ref;
        batch.set(ref, buyer);

        //refund and deduct
        var ref = this.firestore.collection('credits').doc().ref;
        var sellerCredit = {
          userDocId: forSaleDocId,
          userDisplayName: result.userDisplayName,
          createdBy:result.parentUserId,
          createdByDisplayName:result.parentUserDisplayName,
          amount: result.amount,
          created: Timestamp.now(),
          note: 'seat sold to ' + buyer.userDisplayName,
        } as Credit;
        
        batch.set(ref, sellerCredit);
        console.log('seller credit...', sellerCredit);

        var ref = this.firestore.collection('credits').doc().ref;
        var buyerCredit = {
          userDocId: buyer.userId,
          userDisplayName: buyer.userDisplayName,
          createdBy: buyer.userId,
          createdByDisplayName:buyer.userDisplayName,
          amount: -buyer.amount,
          created: Timestamp.now(),
          note: 'purchased seat from ' + result.userDisplayName,
        } as Credit;
        batch.set(ref, buyerCredit);
        console.log('buyer credit...', buyerCredit);

        batch.commit();
      }
    })
  }
  
  public async deleteBatch(bookingPersons:BookingPerson[]) {
    
    var credit = {
      userDocId: bookingPersons[0].userId,
      userDisplayName: bookingPersons[0].userDisplayName,
      createdBy:bookingPersons[0].parentUserId,
      createdByDisplayName:bookingPersons[0].parentUserDisplayName,
    } as Credit;
    let fees=0;
    let notes="withdraw: ";

    var batch = this.firestore.firestore.batch();

    bookingPersons.forEach(bp=>{
      batch.delete(this.firestore.collection('bookingPersons').doc(bp.docId).ref);
      fees+=bp.amount;
      notes+=bp.userDisplayName+"|";
    });

    //now dealing with credit table
    
    var ref = this.firestore.collection('credits').doc().ref;
    credit.amount = fees; //credit back to user
    credit.note = notes;
    batch.set(ref, credit);
    return await batch.commit();
    //return true;
  }

  public async delete(bookingPersonDocId:string) {
    await super.delete(bookingPersonDocId);
  }


}
