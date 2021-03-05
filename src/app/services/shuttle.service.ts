import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { FirestoreBaseService } from './firestore-base.service';
import { map, concatMap, finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Shuttle } from '../models/shuttle';

@Injectable({
  providedIn: 'root'
})
export class ShuttleService extends FirestoreBaseService<Shuttle>{

  constructor(private firestore: AngularFirestore) { 
    super(firestore.collection('shuttles'));
  }

  createShuttlePurchase(shuttle:Shuttle) {
    return this.create(shuttle);
  }

  getList(){
    return super.getAll();
  }

  // getList() : Observable<Shuttle>{
  //   return this.firestore.collection('shuttles').snapshotChanges().pipe(
  //     map(actions => {
  //         if(actions && actions.length > 0){
  //           var acc = actions[0].payload.doc.data() as Shuttle;
  //           return {
  //             ...acc,
  //             docId: actions[0].payload.doc.id
  //           };
  //         } else {
  //           return null;
  //         }
  //       }));
  // }


}
