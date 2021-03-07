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
    group.created = this.getTodayTimestamp();
    group.createdBy = createdBy;

    return this.create(group);
  }

  public getGroups() {
    return super.getAll();
  }

  // public getBalance(userDocId:string) {
  //   return this.firestore.collection('credits', q=>q.where('userDocId', '==', userDocId)).snapshotChanges().pipe(map(actions=>{
  //     var sum = 0;
  //     actions.forEach(x=> {
  //       if(x){
  //         const credit = x.payload.doc.data() as Credit;
  //         sum += credit.amount;
  //       }
  //     });
  //     return sum;
  //   }));
  // }

  public getGroup(groupDocId: string) {
    console.log("groupservice: ", groupDocId);
    return super.getByDocId(groupDocId);
  }

  public updateGroup(docId: string, group: Group) {
    group.updated = this.getTodayTimestamp();
    return this.update(docId, group);
  }
}
