import { Injectable } from '@angular/core';
import { map, concatMap, finalize, timestamp, switchMap } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";
import { FirestoreBaseService } from "./firestore-base.service";
import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;
import { EventLogger } from '../models/event-logger';
import { Account } from '../models/account';

@Injectable({
  providedIn: 'root'
})
export class EventLoggerService extends FirestoreBaseService<EventLogger>{

  constructor(private firestore: AngularFirestore) { 
    super(firestore.collection('eventLogs'));
  }

  createLog(eventLog:EventLogger, userDocId:string, userDisplayName:string) {
    eventLog.createdOn = Timestamp.now();
    eventLog.createdBy = userDocId;
    eventLog.createdByDisplayName = userDisplayName;
    return this.create(eventLog);
  }

  getAllEventLogs() {
    return this.firestore.collection('eventLogs', q => q.orderBy('createdOn', 'desc').limit(1600)).snapshotChanges().pipe(
      map(actions => {
        var items = actions.map(p => {
          var data = p.payload.doc.data() as EventLogger;
          console.log('getAllEventLogs()', data);
          return { ...data, docId: p.payload.doc.id } as EventLogger;
        });
        return items;
      })
    );
  }

}
