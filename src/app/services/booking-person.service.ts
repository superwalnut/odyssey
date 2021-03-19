import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { FirestoreBaseService } from "./firestore-base.service";
import { map, concatMap, finalize } from "rxjs/operators";
import { BookingPerson } from "../models/booking-person";
import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;
import { Booking } from '../models/booking';
import { CreditService } from './credit.service';
import { Credit } from '../models/credit';
import { CreditstatementComponent } from '../views/settings/creditstatement/creditstatement.component';

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
  
    var credit = {
      userDocId: bookingPersons[0].userId,
      userDisplayName: bookingPersons[0].userDisplayName,
      createdBy:bookingPersons[0].parentUserId,
      createdByDisplayName:bookingPersons[0].parentUserDisplayName,
    } as Credit;
    let fees=0;

    var batch = this.firestore.firestore.batch();
    bookingPersons.forEach(bp=>{
      var ref = this.firestore.collection('bookingPersons').doc().ref;
      batch.set(ref, bp);
      fees+=bp.amount;
    });
    credit.amount = -fees;
    await batch.commit().then(()=>{
      
      this.creditService.createCredit(credit);
    });
  }

   public get(bookingPersonDocId: string) {
      return super.getByDocId(bookingPersonDocId);
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

  public async deleteBatch(bookingPersons:BookingPerson[]) {
    
    var batch = this.firestore.firestore.batch();

    bookingPersons.forEach(bp=>{
      batch.delete(this.firestore.collection('bookingPersons').doc(bp.docId).ref);
    });
    return await batch.commit();
    //return true;
  }


}
