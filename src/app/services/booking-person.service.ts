import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { FirestoreBaseService } from "./firestore-base.service";
import { map, concatMap, finalize } from "rxjs/operators";
import { BookingPerson } from "../models/booking-person";
import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;
import { Booking } from '../models/booking';

@Injectable({
  providedIn: 'root'
})
export class BookingPersonService extends FirestoreBaseService<BookingPerson>{

  constructor(private firestore: AngularFirestore) {
    super(firestore.collection('bookingPersons'));
  }


  public createBookingPerson(bookingPerson: BookingPerson) {
    return super.create(bookingPerson);
  }

  public async createBookingPersonBatch(bookingPersons:BookingPerson[]) {

    bookingPersons.forEach(bp=> this.createBookingPerson(bp));
    //Batch inserts doesn't work
    // var batch = this.firestore.firestore.batch();
    // var refx = this.firestore.collection('bookingPersons').doc().ref;

    // bookingPersons.forEach(b=>{
    //   console.log('batch inserting: ', b);
    //   batch.set(refx, b);
    // });
    // await batch.commit();
  }

   public get(bookingPersonDocId: string) {
    return super.getByDocId(bookingPersonDocId);
  }


  public getByBookingDocId(bookingDocId: string) {
    this.firestore.collection('bookingPersons')
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

  public deleteBatch(bookingPersons:BookingPerson[]) {
    bookingPersons.forEach(x=>{
      super.delete(x.docId);
    })
  }


}
