import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { combineLatest, forkJoin, of } from 'rxjs';

import { Credit } from '../models/credit';
import { User } from '../models/user';
import { AccountService } from './account.service';
import { EventLoggerService } from './event-logger.service';
import { EventLogger } from "../models/event-logger";
import { GlobalConstants } from '../common/global-constants';

import { FirestoreBaseService } from './firestore-base.service';
import Timestamp = firebase.firestore.Timestamp;
import { UserBalance } from '../models/user-balance';
import { formatCurrency } from '@angular/common';
import { Account } from '../models/account';

@Injectable({
  providedIn: 'root'
})
export class CreditService extends FirestoreBaseService<Credit>{

  constructor(private firestore: AngularFirestore, private eventLoggerService: EventLoggerService, private accountService: AccountService) {
    super(firestore.collection('credits'));
  }

  public createCredit(credit: Credit) {
    console.log('create credit: ', credit);
    if (!credit.userDocId) return Promise.reject('no user is provided');

    var batch = this.firestore.firestore.batch();
    var ref = this.firestore.collection('credits').doc().ref;
    credit.created = Timestamp.now();
    batch.set(ref, credit);

    var ref = this.firestore.collection('eventLogs').doc().ref;
    var log = {
      eventCategory: GlobalConstants.eventTopupCredit,
      notes: credit.category + ':' + credit.userDisplayName + ' ' + credit.amount,
      createdOn: Timestamp.now(),
      createdBy: credit.createdBy,
      createdByDisplayName: credit.createdByDisplayName,
    } as EventLogger;
    batch.set(ref, log);

    return batch.commit();
  }

  public userCreditTransfer(from: Credit, to:Credit) {
    console.log('transfer from: ', from);
    console.log('transfer to: ', to);
    if (!from.userDocId || !to.userDocId) return Promise.reject('no user is provided');
    var batch = this.firestore.firestore.batch();

    var refFrom = this.firestore.collection('credits').doc().ref;
    from.created = Timestamp.now();
    from.amount = -from.amount;
    from.note = "Transfer to " + to.userDisplayName + ": " + from.note;
    batch.set(refFrom, from);

    var refTo = this.firestore.collection('credits').doc().ref;
    to.created = Timestamp.now();
    to.amount = to.amount;
    to.note = "Transfer from " + from.userDisplayName + ": " + to.note;

    batch.set(refTo, to);

    var ref = this.firestore.collection('eventLogs').doc().ref;
    var log = {
      eventCategory: GlobalConstants.eventCreditTransfer,
      notes: from.userDisplayName + ' to ' + to.userDisplayName + ':' + to.amount,
      createdOn: Timestamp.now(),
      createdBy: from.userDocId,
      createdByDisplayName: from.userDisplayName,
    } as EventLogger;
    batch.set(ref, log);

    return batch.commit();
  }
  //  public createCredit(credit:Credit, previousBalance:number, createdBy:string, createdByDisplayName:string) {
  //   if(credit.userDocId){
  //     credit.created = this.getTodayTimestamp();
  //     credit.balance = previousBalance + credit.amount;
  //     credit.userDisplayName = credit.userDisplayName;
  //     credit.createdBy = createdBy;
  //     credit.createdByDisplayName = createdByDisplayName;
  //     return this.create(credit);
  //   }

  //   return Promise.reject('no user is provided');
  //  }

  public creditTransferBatch(fromAccount: User, recipients:Credit[], operator:Account) {
    console.log('transfer from: ', fromAccount);
    console.log('transfer to: ', recipients);
    if (!fromAccount.docId) return Promise.reject('from account is invalid');
    if (!recipients || recipients.length == 0) return Promise.reject('no recipients');

    var batch = this.firestore.firestore.batch();

    var from = {
      userDocId: fromAccount.docId,
      userDisplayName: fromAccount.name,
      created: Timestamp.now(),
      createdBy: operator.docId,
      createdByDisplayName: operator.name,
    } as Credit;

    recipients.forEach(recipient=>{

      from.amount = -recipient.amount;
      from.category = recipient.category;
      from.note = recipient.note + ' ' + recipient.userDisplayName;
      var refFrom = this.firestore.collection('credits').doc().ref;
      batch.set(refFrom, from);

      var refTo = this.firestore.collection('credits').doc().ref;
      recipient.created = Timestamp.now();  
      recipient.createdBy = operator.docId;
      recipient.createdByDisplayName = operator.name;
      batch.set(refTo, recipient);

      var refLog = this.firestore.collection('eventLogs').doc().ref;
      var log = {
        eventCategory: GlobalConstants.eventCreditTransfer,
        notes: from.userDisplayName + ' to ' + recipient.userDisplayName + ': $' + recipient.amount,
        createdOn: Timestamp.now(),
        createdBy: operator.docId,
        createdByDisplayName: operator.name,
      } as EventLogger;
      batch.set(refLog, log);
    });
    return batch.commit();
  }

  public getBalance(userDocId: string): Observable<number> {
    return this.firestore.collection('credits', q => q.where('userDocId', '==', userDocId)).snapshotChanges().pipe(
      map(actions => {
        const amounts = actions.map(x => (x.payload.doc.data() as Credit).amount);
        const total = amounts.reduce((a, b) => a + b, 0);

        console.log('balance',total);
        return total;
      })
    );
  }

  public getUserBalance(userDocId: string, userName:string): Observable<UserBalance> {
    return this.firestore.collection('credits', q => q.where('userDocId', '==', userDocId)).snapshotChanges().pipe(
      map(actions => {
        const amounts = actions.map(x => (x.payload.doc.data() as Credit).amount);
        const total = amounts.reduce((a, b) => a + b, 0);
        
        return { 
          userDocId: userDocId,
          userName: userName,
          balance: total,
        } as UserBalance;
      })
    );
  }

  // public getUserAndBalance(userDocId: string) {
  //   return this.firestore.collection('users', q => q.where(firebase.firestore.FieldPath.documentId(), '==', userDocId).limit(1)).snapshotChanges().pipe(
  //     mergeMap(result => {
  //       var user = result.pay.doc.data() as Credit;

  //       var balance = this.getBalance(userDocId);
  //       return combineLatest([of(user), balance]);
  //     }),
  //     // map(([user, balance]) => {
  //     //   console.log('this user', user);
  //     //   console.log('balance', balance);
  //     // })
  //   );

  //}

  public getByUser(userDocId: string) {
    console.log(userDocId);
    return this.firestore.collection('credits', q => q.where('userDocId', '==', userDocId).orderBy('created', 'desc')).snapshotChanges().pipe(
      map(actions => {
        if (actions) {
          return actions.map(x => {
            var credit = x.payload.doc.data() as Credit;
            return {
              ...credit,
              docId: x.payload.doc.id
            } as Credit;
          });
        } else {
          return null;
        }
      }));
  }

  public getAllCredits() {
    return this.firestore.collection('credits', q => q.orderBy('created', 'desc')).snapshotChanges().pipe(
      map(actions => {
          return actions.map(x => {
            var credit = x.payload.doc.data() as Credit;
            return {
              ...credit,
              docId: x.payload.doc.id
            } as Credit;
          });
      }));
  }
}
