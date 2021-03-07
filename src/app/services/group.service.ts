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

  createGroup(group: Group, createdBy: string) {
    group.created = this.getTodayTimestamp();
    group.createdBy = createdBy;

    return this.create(group);
  }

  getGroups() {
    return super.getAll();
  }
}
