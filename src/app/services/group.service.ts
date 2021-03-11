import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { BehaviorSubject, Observable } from "rxjs";
import { FirestoreBaseService } from "./firestore-base.service";
import { map, concatMap, finalize } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { Group } from "../models/group";

@Injectable({
  providedIn: "root",
})
export class GroupService extends FirestoreBaseService<Group> {
  constructor(private firestore: AngularFirestore) {
    super(firestore.collection("groups"));
  }

  public createGroup(group: Group, createdBy: string) {

    var endDate = new Date("December 31, 2031 12:20:00");
    group.endDate = this.convertToTimestamp(endDate);
    group.created = this.getTodayTimestamp();
    group.createdBy = createdBy;

    group.isRecursive = true;//default to recursive
    return this.create(group);
  }

  public getGroups() {
    return super.getAll();
  }

  public getGroupByStatus(isClosed: boolean) {
    return this.firestore.collection('groups', q => q.where('isClosed', '==', isClosed)).snapshotChanges().pipe(
      map(actions => {
        return actions.map(x => {
          var group = x.payload.doc.data() as Group;
          return {
            ...group,
            docId: x.payload.doc.id
          } as Group;
        });
      }));
  }
  //Get all groups that this user belongs to
  public getGroupsByUserDocId(userDocId: string) {

    return this.firestore.collection('groups', q => q.where('committees', 'array-contains', userDocId)).snapshotChanges().pipe(
      map(actions => {
        return actions.map(x => {
          var group = x.payload.doc.data() as Group;
          return {
            ...group,
            docId: x.payload.doc.id
          } as Group;
        });
      }));
  }

  public getGroup(groupDocId: string) {
    return super.getByDocId(groupDocId);
  }

  public updateGroup(docId: string, group: Group) {
    group.updated = this.getTodayTimestamp();
    return this.update(docId, group);
  }
}
