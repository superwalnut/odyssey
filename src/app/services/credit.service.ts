import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { map } from 'rxjs/operators';
import { Credit } from '../models/credit';
import { FirestoreBaseService } from './firestore-base.service';
import Timestamp = firebase.firestore.Timestamp;

@Injectable({
  providedIn: 'root'
})
export class CreditService extends FirestoreBaseService<Credit>{

  constructor(private firestore: AngularFirestore) {
    super(firestore.collection('credits'));
   }

   public createCredit(credit:Credit) {
    this.create(credit);
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

}
