import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { BehaviorSubject, Observable } from "rxjs";
import { FirestoreBaseService } from "./firestore-base.service";
import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;
import { map, concatMap, finalize } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { GroupTransaction } from "../models/group-transaction";
import { User } from "../models/user";
import { Credit } from "../models/credit";
import { EventLogger } from "../models/event-logger";
import { GlobalConstants } from '../common/global-constants';
import { Group } from '../models/group';
import { Booking } from '../models/booking';
import { LocalBookingUser } from '../models/custom-models';
import { Account } from '../models/account';
import { MatListSubheaderCssMatStyler } from '@angular/material/list';


@Injectable({
  providedIn: 'root'
})
export class GroupTransactionService extends FirestoreBaseService<GroupTransaction>{

  constructor(private firestore: AngularFirestore) {
    super(firestore.collection('groupTransactions'));

  }

  public createGroupTransaction(groupTransaction: GroupTransaction) {
    return this.create(groupTransaction);
  }

  //get all for reporting purpose
  public getAll() {
    return this.firestore.collection('groupTransactions').snapshotChanges().pipe(
      map(actions => {
        return actions.map(x => {
          var trans = x.payload.doc.data() as GroupTransaction;
          return { ...trans, docId: x.payload.doc.id } as GroupTransaction;
        });
      }));
  }

  //get transaction by group Id
  public getByGroupDocId(groupDocId: string) {
    return this.firestore.collection('groupTransactions', q => q.where('groupDocId', '==', groupDocId).orderBy('created', 'desc')).snapshotChanges().pipe(
      map(actions => {
        return actions.map(x => {
          var trans = x.payload.doc.data() as GroupTransaction;
          return { ...trans, docId: x.payload.doc.id } as GroupTransaction;
        });
      }));
  }

  //get transaction by booking Id
  public getByBookingDocId(bookingDocId: string) {
    return this.firestore.collection('groupTransactions', q => q.where('bookingDocId', '==', bookingDocId).orderBy('created', 'desc')).snapshotChanges().pipe(
      map(actions => {
        return actions.map(x => {
          var trans = x.payload.doc.data() as GroupTransaction;
          return { ...trans, docId: x.payload.doc.id } as GroupTransaction;
        });
      }));
  }

  public getByBookingDocIdAndPaymentMethod(bookingDocId: string, paymentMethod:string) {
    return this.firestore.collection('groupTransactions', q => q.where('bookingDocId', '==', bookingDocId).where('paymentMethod','==', paymentMethod).orderBy('created', 'desc')).snapshotChanges().pipe(
      map(actions => {
        return actions.map(x => {
          var trans = x.payload.doc.data() as GroupTransaction;
          return { ...trans, docId: x.payload.doc.id } as GroupTransaction;
        });
      }));
  }

  public allocateDividend(groupDocId:string, groupName:string, groupBalance:number, netProfit:number, dividendNotes:string, profitHoldingAccount:User, committees:User[], operatorUserId:string, operatorUserDisplayName:string) {
    var batch = this.firestore.firestore.batch();

    //deduct from gorup net profit.
    var ref = this.firestore.collection('groupTransactions').doc().ref;

    var groupTrans = {
      groupDocId: groupDocId,
      amount: -groupBalance, 
      notes: 'Distribute to committees ' + dividendNotes,
      paymentMethod: 'Dividend',
      created: Timestamp.now(),
      createdBy: operatorUserId,
      createdByDisplayName: operatorUserDisplayName
    } as GroupTransaction;
    batch.set(ref, groupTrans);

    var refProfitHolding = this.firestore.collection('credits').doc().ref;
    var profitHolding = {
      amount: netProfit,
      category: GlobalConstants.creditCategoryProfitHolding,
      userDocId: profitHoldingAccount.docId,
      userDisplayName: profitHoldingAccount.name,
      note: 'Net profit from ' + groupName,
      createdBy: operatorUserId,
      createdByDisplayName: operatorUserDisplayName,
      created: Timestamp.now(),
    } as Credit;
    batch.set(refProfitHolding, profitHolding);
    console.log('profit holding', profitHolding)

    //insert credit to each committee
    var unitDividend = (groupBalance - netProfit) / committees.length;
    committees.forEach(c=>{
      var ref = this.firestore.collection('credits').doc().ref;
      var credit = {
        amount: unitDividend,
        category: GlobalConstants.creditCategoryDividend,
        userDocId: c.parentUserDocId,
        userDisplayName: c.parentUserDisplayName,
        //Ie. ‘Saturday distribution #shuttle’ instead of ‘Luc Dividend from Saturday Badminton Social’
        //note: c.name + ' Dividend from ' + groupName,
        note: groupName + ' distribution ' + dividendNotes,
        createdBy: operatorUserId,
        createdByDisplayName: operatorUserDisplayName,
        created: Timestamp.now(),
      } as Credit;
      batch.set(ref, credit);
      console.log('divident committee', credit)      
    });

    var ref = this.firestore.collection('eventLogs').doc().ref;
    var log = {
      eventCategory: GlobalConstants.eventDividend,
      notes: groupName + ' ' + unitDividend + ', ' + committees.length + ' committees ' + dividendNotes,
      createdOn: Timestamp.now(),
      createdBy: operatorUserId,
      createdByDisplayName: operatorUserDisplayName,
    } as EventLogger;
    batch.set(ref, log);
    return batch.commit();
    //return null;
  }

  public getBalance(groupDocId: string) {
    return this.firestore.collection('groupTransactions', q => q.where('groupDocId', '==', groupDocId)).snapshotChanges().pipe(
      map(actions => {
        const amounts = actions.map(x => (x.payload.doc.data() as GroupTransaction).amount);
        const total = amounts.reduce((a, b) => a + b, 0);
        return total;
      })
    );
  }

  public bookingReconciliation(group:Group, booking: Booking, lbus:LocalBookingUser[], operator:Account, incomeBreakdownNote:string) {
    var batch = this.firestore.firestore.batch();
    var total = 0;
    lbus.forEach(lbu =>{
      //deduct from user credits
      var ref = this.firestore.collection('credits').doc().ref;
      if (lbu.isPaid) {
        total += lbu.amount;
      }
      //var userAmount = -lbu.amount; //cash/bank user add back, to make their balance 0;
      // if (lbu.paymentMethod == GlobalConstants.paymentCredit) {
      //   userAmount = -lbu.amount; //credit user keep substract
      // } else {
      //   //cash user, we check isPaid or not
      //   if (!lbu.isPaid) {
      //     userAmount = 0; //if not paid, add back zero, so user stay negative!
      //   }
      // }
      var credit = {
        amount: -lbu.amount,
        category:GlobalConstants.creditCategoryBadminton,
        userDocId: lbu.parentUserId,
        userDisplayName: lbu.name,
        note: group.groupName+': '+ lbu.name + ' ' + lbu.note ?? '',
        createdBy: operator.docId,
        referenceId: lbu.docId, //only the negative, need to set referenceID
        createdByDisplayName: operator.name,
        created: Timestamp.now(),
      } as Credit;
      if (lbu.paymentMethod == GlobalConstants.paymentCash) { credit.note += ": Cash reveivable"}
      batch.set(ref, credit);

      if (lbu.paymentMethod == GlobalConstants.paymentCash) { //for cash user, we need to credit back to make balance 0
        var userAmount = lbu.amount;
        if (!lbu.isPaid) userAmount = 0; //if unpaid, credit back 0, so user stay negative;

        var cashRef = this.firestore.collection('credits').doc().ref;
        var credit = {
          amount: userAmount,
          category:GlobalConstants.creditCategoryBadminton,
          userDocId: lbu.parentUserId,
          userDisplayName: lbu.name,
          note: group.groupName+': '+ lbu.name + ' ' + lbu.note ?? '' +': Cash on hand',
          createdBy: operator.docId,
          createdByDisplayName: operator.name,
          created: Timestamp.now(),
        } as Credit;
        batch.set(cashRef, credit);
      }
    });

    //add total to groupTransactions
    var ref = this.firestore.collection('groupTransactions').doc().ref;
    var trans = {
      amount: total,
      paymentMethod: GlobalConstants.paymentBookingIncome,
      groupDocId: group.docId,
      referenceId: booking.docId, //nullable
      notes: group.groupName + ' ' + incomeBreakdownNote,
      createdBy: operator.docId,
      createdByDisplayName: operator.name,
      created: Timestamp.now(),
    } as GroupTransaction;
    console.log('bookingReconciliation', trans);
    batch.set(ref, trans);

    // mark this booking as reconciled
    var ref = this.firestore.collection('bookings').doc(booking.docId).ref;
    booking.reconciled = true;
    booking.isReconciliationInProgress = false;
    booking.reconcilationBy = operator.name;
    booking.isLocked = true;
    batch.update(ref, booking);

    return batch.commit();
  }



  //TODO: get transaction by date range
  public getByDateRange(groupDocId: string, startDate: Timestamp, endDate: Timestamp) {
    return this.firestore.collection('groupTransactions', q => q.where('groupDocId', '==', groupDocId).where('created', '>=', startDate).where("created", "<", endDate)).snapshotChanges().pipe(
      map(actions => {
        return actions.map(x => (x.payload.doc.data() as GroupTransaction));
      })
    );
  }

  public getByGroupId(groupDocId:string) {
    return this.firestore.collection('groupTransactions', q => q.where('groupDocId', '==', groupDocId)).snapshotChanges().pipe(
      map(actions => {
        return actions.map(x => (x.payload.doc.data() as GroupTransaction));
      })
    );
  }

}
