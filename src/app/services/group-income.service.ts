import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { BehaviorSubject, Observable } from "rxjs";
import { FirestoreBaseService } from "./firestore-base.service";
import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;
import { map, concatMap, finalize } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { GroupIncome } from "../models/group-income";

@Injectable({
  providedIn: 'root'
})
export class GroupIncomeService extends FirestoreBaseService<GroupIncome>{

  constructor(private firestore: AngularFirestore) {
    super(firestore.collection('groupincomes'));

  }

  public createGroupIncome(groupIncome: GroupIncome, createdBy: string) {
    groupIncome.created = this.getTodayTimestamp();
    groupIncome.createdBy = createdBy;
    groupIncome.updated = this.getTodayTimestamp();
    groupIncome.updatedBy = createdBy;

    return this.create(groupIncome);
  }

  //get income by group Id
  public getByGroupDocId(groupDocId: string) {
    return this.firestore.collection('groupincomes', q => q.where('groupDocId', '==', groupDocId).limit(1)).snapshotChanges().pipe(
      map(actions => {
        var data = actions[0].payload.doc.data() as GroupIncome;
        return { ...data, docId: actions[0].payload.doc.id } as GroupIncome;

      })
    );
  }

  //get income by booking Id
  public getByBookingDocId(bookingDocId: string) {
    return this.firestore.collection('groupincomes', q => q.where('bookingDocId', '==', bookingDocId).limit(1)).snapshotChanges().pipe(
      map(actions => {
        var data = actions[0].payload.doc.data() as GroupIncome;
        return { ...data, docId: actions[0].payload.doc.id } as GroupIncome;

      })
    );
  }

  //TODO: get income by date range
  public getByDateRange(groupDOcId: string, startDate: Timestamp, endDate: Timestamp) {

  }




}
