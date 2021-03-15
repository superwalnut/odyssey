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


  public createBooking(booking: Booking) {
    super.create(booking);
  }

  public createGroupExpense(booking: Booking) {
    return this.create(booking);
  }

  //get 1 booking by bookingDocId
  public get(bookingDocId: string) {
    return super.getByDocId(bookingDocId);
  }

  //Get all bookings by GroupDocId, sorted by date
  public getByGroupDocId(groupDocId: string) {
    return this.firestore.collection('bookings', q => q.where('groupDocId', '==', groupDocId).orderBy('eventStartDateTime', 'desc')).snapshotChanges().pipe(
      map(actions => {
        var items = actions.map(p => {
          var data = p.payload.doc.data() as Booking;
          console.log('getByGroupDocId()', data);
          return { ...data, docId: p.payload.doc.id } as Booking;
        });
        return items;
      })
    );
  }

  //Get last booking by GroupDocId
  public getLastBookingByGroupDocId(groupDocId: string) {
    return this.firestore.collection('bookings', q => q.where('groupDocId', '==', groupDocId).orderBy('eventStartDateTime', 'desc').limit(1)).snapshotChanges().pipe(
      map(actions => {
        if (actions && actions.length > 0) {
          var booking = actions[0].payload.doc.data() as Booking;
          console.log('getLastBookingByGroupDocId() ', booking);
          return { ...booking, docId: actions[0].payload.doc.id } as Booking;
        } else {
          return null;
        }
      })
    );
  }


  //Get bookings by date range
  public getByDateRange(groupdDocId: string, startDate: Timestamp, endDate: Timestamp) {

  }

}
