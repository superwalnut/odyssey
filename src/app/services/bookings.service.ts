import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { FirestoreBaseService } from "./firestore-base.service";
import { map, concatMap, finalize } from "rxjs/operators";
import { Booking } from "../models/booking";
//import { BookingPerson } from "../models/booking-person";

import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;

@Injectable({
  providedIn: 'root'
})
export class BookingsService extends FirestoreBaseService<Booking>{

  constructor(private firestore: AngularFirestore) {
    super(firestore.collection('bookings'));
  }


  public createGroupExpense(booking: Booking) {
    return this.create(booking);
  }

  //get 1 booking by bookingDocId
  public get(bookingDocId: string) {
    return super.getByDocId(bookingDocId);
  }

  //Get all bookings by GroupDocId
  public getByGroupDocId(groupDocId: string) {
    return this.firestore.collection('bookings', q => q.where('groupDocId', '==', groupDocId).orderBy('date', 'desc')).snapshotChanges().pipe(
      map(actions => {
        var items = actions.map(p => {
          var data = p.payload.doc.data() as Booking;
          return { ...data, docId: p.payload.doc.id } as Booking;
        });
        return items;
      })
    );
  }

  //Get bookings by date range
  public getByDateRange(groupdDocId: string, startDate: Timestamp, endDate: Timestamp) {

  }

}
