import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { FirestoreBaseService } from "./firestore-base.service";
import { map, concatMap, finalize, timestamp } from "rxjs/operators";
import { BookingPerson } from "../models/booking-person";
import { BookingSchedule } from '../models/booking-schedule';
import { GroupTransaction } from "../models/group-transaction";
import { Booking } from '../models/booking';
import { Account } from '../models/account';
import { Credit } from '../models/credit';

import { CreditService } from './credit.service';
import { HelperService } from '../common/helper.service';
import { UserSelection } from "../models/custom-models";

import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;
import { Group } from '../models/group';
import { GlobalConstants } from '../common/global-constants';

@Injectable({
  providedIn: 'root'
})
export class BookingScheduleService extends FirestoreBaseService<BookingSchedule>{

  constructor(private firestore: AngularFirestore, private creditService: CreditService, private helperService: HelperService) {
    super(firestore.collection('bookingSchedules'));
  }

  updateIsPaused(docId: string, bookingSchedule: BookingSchedule) {
    return super.update(docId, bookingSchedule);

  }

  getMyBookingSchedules(userDocId: string) {
    return this.firestore.collection('bookingSchedules', q => q.where('createdBy', '==', userDocId).orderBy('createdOn', 'desc')).snapshotChanges().pipe(
      map(actions => {
        var items = actions.map(p => {
          var data = p.payload.doc.data() as BookingSchedule;
          console.log('getMyBookingSchedules()', data);
          return { ...data, docId: p.payload.doc.id } as BookingSchedule;
        });
        return items;
      })
    );
  }

  getBookingSchedulesByGroupDocId(groupDocId: string) {
    return this.firestore.collection('bookingSchedules', q => q.where('groupDocId', '==', groupDocId)).snapshotChanges().pipe(
      map(actions => {
        var items = actions.map(p => {
          var data = p.payload.doc.data() as BookingSchedule;
          console.log('getBookingSchedulesByGroupDocId()', data);
          return { ...data, docId: p.payload.doc.id } as BookingSchedule;
        });
        return items;
      })
    );
  }

  // getMyActiveBookingSchedules(userDocId: string) {
  //   return this.firestore.collection('bookingSchedules', q => q.where('createdBy', '==', userDocId).where('expireOn', '>=', Timestamp.now()).orderBy('createdOn', 'desc')).snapshotChanges().pipe(
  //     map(actions => {
  //       var items = actions.map(p => {
  //         var data = p.payload.doc.data() as BookingSchedule;
  //         return { ...data, docId: p.payload.doc.id } as BookingSchedule;
  //       });
  //       return items;
  //     })
  //   );
  // }


  createBookingSchedule(users: UserSelection[], expireDate: Timestamp, loggedInUser: Account, group: Group, fee: number) {
    var batch = this.firestore.firestore.batch();

    //1. deduct user's credit
    var ref = this.firestore.collection('credits').doc().ref;

    var credit = {
      amount: -fee,
      userDocId: loggedInUser.docId,
      userDisplayName: loggedInUser.name,
      createdBy: loggedInUser.docId,
      createdByDisplayName: loggedInUser.name,
      created: Timestamp.now(),
      note: 'auto booking',
    } as Credit;
    batch.set(ref, credit);

    //2. add to group transaction
    var ref = this.firestore.collection('groupTransactions').doc().ref;
    var trans = {
      amount: fee,
      paymentMethod: GlobalConstants.paymentCredit,
      groupDocId: group.docId,
      referenceId: loggedInUser.docId, //nullable
      notes: 'auto booking',
      createdBy: loggedInUser.docId,
      createdByDisplayName: loggedInUser.name,
      created: Timestamp.now(),
    } as GroupTransaction;
    console.log('createBookingSchedule service groupTransaction: ', trans);
    batch.set(ref, trans);

    //3. add to booking-schedule table.
    users.forEach(u => {
      var ref = this.firestore.collection('bookingSchedules').doc().ref;
      var schedule = {
        userDocId: u.docId,
        userDisplayName: u.name,
        groupDocId: group.docId,
        groupName: group.groupName,
        expireOn: expireDate,
        isPaused: false,
        createdOn: Timestamp.now(),
        createdBy: loggedInUser.docId,
        createdByDisplayName: loggedInUser.name,
      } as BookingSchedule;
      batch.set(ref, schedule);
    });

    return batch.commit();
  }


}
