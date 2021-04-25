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
}
