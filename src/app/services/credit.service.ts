import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { map } from 'rxjs/operators';
import { Credit } from '../models/credit';
import { User } from '../models/user';
import { AccountService } from './account.service';
import { FirestoreBaseService } from './firestore-base.service';
import Timestamp = firebase.firestore.Timestamp;

@Injectable({
  providedIn: 'root'
})
export class CreditService extends FirestoreBaseService<Credit>{

  constructor(private firestore: AngularFirestore, private accountService: AccountService) {
    super(firestore.collection('credits'));
   }

   public createCredit(credit:Credit, previousBalance:number, createdBy:string) {
    if(credit.userDocId){
      credit.created = this.getTodayTimestamp();
      credit.balance = previousBalance + credit.amount;
      credit.createdBy = createdBy;
      return this.create(credit);
    }
    
    return Promise.reject('no user is provided');
   }

   public getBalance(userDocId:string) {
    return this.firestore.collection('credits', q=>q.where('userDocId', '==', userDocId)).snapshotChanges().pipe(map(actions=>{
      var sum = 0;
      actions.forEach(x=> {
        if(x){
          const credit = x.payload.doc.data() as Credit;
          sum += credit.amount;
        }
      });
      return sum;
    }));
  }

  public getByUser(userDocId:string) {
    return this.firestore.collection('credits', q=>q.where('userDocId', '==', userDocId).orderBy('created','desc')).snapshotChanges().pipe(
      map(actions => {
        return actions.map(x=>{
          var credit = x.payload.doc.data() as Credit;
          return {
            ...credit,
            docId: x.payload.doc.id
          } as Credit;
        });
      }));
  }
}
