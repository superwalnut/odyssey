import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { FirestoreBaseService } from "./firestore-base.service";
import { map, concatMap, finalize, timestamp, switchMap } from "rxjs/operators";
import { BookingPerson } from "../models/booking-person";
import { BookingSchedule } from "../models/booking-schedule";
import { GroupTransaction } from "../models/group-transaction";
import { Booking } from "../models/booking";
import { Account } from "../models/account";
import { Credit } from "../models/credit";

import { CreditService } from "./credit.service";
import { HelperService } from "../common/helper.service";
import { User } from "../models/user";

import firebase from "firebase/app";
import Timestamp = firebase.firestore.Timestamp;
import { Group } from "../models/group";
import { GlobalConstants } from "../common/global-constants";

@Injectable({
  providedIn: "root",
})
export class BookingScheduleService extends FirestoreBaseService<BookingSchedule> {
  constructor(
    private firestore: AngularFirestore,
    private creditService: CreditService,
    private helperService: HelperService
  ) {
    super(firestore.collection("bookingSchedules"));
  }

  updateIsPaused(docId: string, bookingSchedule: BookingSchedule) {
    return super.update(docId, bookingSchedule);
  }

  deleteSchedule(docId: string) {
    return this.delete(docId);
  }

  getMyBookingSchedules(userDocId: string) {
    return this.firestore
      .collection("bookingSchedules", (q) =>
        q.where("createdBy", "==", userDocId).orderBy("createdOn", "desc")
      )
      .snapshotChanges()
      .pipe(
        map((actions) => {
          var items = actions.map((p) => {
            var data = p.payload.doc.data() as BookingSchedule;
            console.log("getMyBookingSchedules()", data);
            return { ...data, docId: p.payload.doc.id } as BookingSchedule;
          });
          return items;
        })
      );
  }

  getActiveBookingSchedules(groupDocId: string) {
    return this.firestore
      .collection("bookingSchedules", (q) =>
        q
          .where("groupDocId", "==", groupDocId)
          .where("isPaused", "==", false)
          .where("expireOn", ">=", Timestamp.now())
      )
      .snapshotChanges()
      .pipe(
        map((actions) => {
          var items = actions.map((p) => {
            var data = p.payload.doc.data() as BookingSchedule;
            return { ...data, docId: p.payload.doc.id } as BookingSchedule;
          });
          return items;
        })
      );
  }

  getAllBookingSchedules() {
    return this.firestore
      .collection("bookingSchedules", (q) => q.orderBy("createdOn", "desc"))
      .snapshotChanges()
      .pipe(
        map((actions) => {
          var items = actions.map((p) => {
            var data = p.payload.doc.data() as BookingSchedule;
            return { ...data, docId: p.payload.doc.id } as BookingSchedule;
          });
          return items;
        })
      );
  }

  getBookingSchedulesByGroupDocId(groupDocId: string) {
    return this.firestore
      .collection("bookingSchedules", (q) =>
        q.where("groupDocId", "==", groupDocId)
      )
      .snapshotChanges()
      .pipe(
        map((actions) => {
          var items = actions.map((p) => {
            var data = p.payload.doc.data() as BookingSchedule;
            console.log("getBookingSchedulesByGroupDocId()", data);
            return { ...data, docId: p.payload.doc.id } as BookingSchedule;
          });
          return items;
        })
      );
  }

  //return array of UserDocIds. ie ['xxxxx','yyyyy']
  // getBookingSchedulesByGroupDocIdInUserIdArray(groupDocId: string) {
  //   return this.firestore.collection('bookingSchedules', q => q.where('groupDocId', '==', groupDocId).where('isPaused', '==', false)).snapshotChanges().pipe(
  //     map(actions => {
  //       var items = actions.map(p => {
  //         var data = p.payload.doc.data() as BookingSchedule
  //         return { ...data, docId: p.payload.doc.id} as BookingSchedule;
  //       });
  //       return items;
  //     })
  //   );
  // }

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

  extendBookingSchedule(
    bookingScheduleDocId: string,
    group: Group,
    expireDate: Timestamp,
    loggedInUser: Account,
    fee: number,
    hbcUser: User
  ) {
    var batch = this.firestore.firestore.batch();

    //2. add to group transaction
    // var refTransaction = this.firestore.collection('groupTransactions').doc().ref;
    // var trans = {
    //   amount: fee,
    //   paymentMethod: GlobalConstants.paymentCredit,
    //   groupDocId: group.docId,
    //   referenceId: loggedInUser.docId, //nullable
    //   notes: 'auto booking extend',
    //   createdBy: loggedInUser.docId,
    //   createdByDisplayName: loggedInUser.name,
    //   created: Timestamp.now(),
    // } as GroupTransaction;
    // console.log('createBookingSchedule service groupTransaction: ', trans);
    // batch.set(refTransaction, trans);

    //income to HBC User account instead of Group transaction 20 May 2022
    var hbcRef = this.firestore.collection("credits").doc().ref;
    var hbcCredit = {
      amount: fee,
      category: GlobalConstants.paymentCredit,
      userDocId: hbcUser.docId,
      userDisplayName: hbcUser.name,
      createdBy: loggedInUser.docId,
      createdByDisplayName: loggedInUser.name,
      referenceId: loggedInUser.docId,
      created: Timestamp.now(),
      note: "auto booking extend: " + loggedInUser.name,
    } as Credit;
    batch.set(hbcRef, hbcCredit);

    //1. deduct user's credit
    var ref = this.firestore.collection("credits").doc().ref;

    var credit = {
      amount: -fee,
      category: GlobalConstants.creditCategoryBadminton,
      userDocId: loggedInUser.docId,
      userDisplayName: loggedInUser.name,
      createdBy: loggedInUser.docId,
      createdByDisplayName: loggedInUser.name,
      referenceId: hbcRef.id,
      created: Timestamp.now(),
      note: "auto booking extend",
    } as Credit;
    batch.set(ref, credit);

    //3. add to booking-schedule table.
    var ref = this.firestore
      .collection("bookingSchedules")
      .doc(bookingScheduleDocId).ref;
    var schedule = {
      expireOn: expireDate,
      updatedOn: Timestamp.now(),
      updatedBy: loggedInUser.name,
      // userDocId: u.docId,
      // userDisplayName: u.name,
      // parentDocId: u.parentUserDocId,
      // parentDisplayName: u.parentUserDisplayName,
    } as BookingSchedule;
    console.log("booking schedule model: ", schedule);
    batch.update(ref, schedule);

    return batch.commit();
  }

  createBookingSchedule(
    users: User[],
    expireDate: Timestamp,
    loggedInUser: Account,
    group: Group,
    fee: number,
    hbcUser: User
  ) {
    var batch = this.firestore.firestore.batch();

    //2. add to group transaction
    // var refTransaction = this.firestore.collection('groupTransactions').doc().ref;
    // var trans = {
    //   amount: fee,
    //   paymentMethod: GlobalConstants.paymentCredit,
    //   groupDocId: group.docId,
    //   referenceId: loggedInUser.docId, //nullable
    //   notes: 'auto booking',
    //   createdBy: loggedInUser.docId,
    //   createdByDisplayName: loggedInUser.name,
    //   created: Timestamp.now(),
    // } as GroupTransaction;
    // console.log('createBookingSchedule service groupTransaction: ', trans);
    // batch.set(refTransaction, trans);

    //income to HBC User account instead of Group transaction 20 May 2022
    var hbcRef = this.firestore.collection("credits").doc().ref;

    console.log("hbcUser", hbcUser);

    var hbcCredit = {
      amount: fee,
      category: GlobalConstants.paymentCredit,
      userDocId: hbcUser.docId,
      userDisplayName: hbcUser.name,
      createdBy: loggedInUser.docId,
      createdByDisplayName: loggedInUser.name,
      referenceId: loggedInUser.docId,
      created: Timestamp.now(),
      note: "auto booking extend:" + loggedInUser.name,
    } as Credit;
    batch.set(hbcRef, hbcCredit);
    console.log("hbcredit", hbcCredit);

    //1. deduct user's credit
    var ref = this.firestore.collection("credits").doc().ref;

    var credit = {
      amount: -fee,
      category: GlobalConstants.creditCategoryBadminton,
      userDocId: loggedInUser.docId,
      userDisplayName: loggedInUser.name,
      createdBy: loggedInUser.docId,
      createdByDisplayName: loggedInUser.name,
      referenceId: hbcRef.id,
      created: Timestamp.now(),
      note: "auto booking",
    } as Credit;
    batch.set(ref, credit);

    //3. add to booking-schedule table.
    users.forEach((u) => {
      var ref = this.firestore.collection("bookingSchedules").doc().ref;
      var schedule = {
        groupDocId: group.docId,
        groupName: group.groupName,
        user: u,
        // userDocId: u.docId,
        // userDisplayName: u.name,
        // parentDocId: u.parentUserDocId,
        // parentDisplayName: u.parentUserDisplayName,
        expireOn: expireDate,
        isPaused: false,
        createdOn: Timestamp.now(),
        createdBy: loggedInUser.docId,
        createdByDisplayName: loggedInUser.name,
      } as BookingSchedule;
      console.log("booking schedule model: ", schedule);
      batch.set(ref, schedule);
    });

    return batch.commit();
    //return Promise.reject();
  }
}
