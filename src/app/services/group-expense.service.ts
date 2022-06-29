// import { Injectable } from '@angular/core';
// import { AngularFirestore } from "@angular/fire/firestore";
// import { BehaviorSubject, Observable } from "rxjs";
// import { FirestoreBaseService } from "./firestore-base.service";
// import { map, concatMap, finalize } from "rxjs/operators";
// import { ActivatedRoute, Router } from "@angular/router";
// import { GroupExpense } from "../models/group-expense";
// import firebase from 'firebase/app';
// import Timestamp = firebase.firestore.Timestamp;

// @Injectable({
//   providedIn: 'root'
// })


// export class GroupExpenseService extends FirestoreBaseService<GroupExpense>{
//   collectionName: string = "groupexpenses";

//   constructor(private firestore: AngularFirestore) {
//     super(firestore.collection('groupexpenses'));

//   }

//   public createGroupExpense(groupExpense: GroupExpense, createdBy: string) {
//     groupExpense.created = this.getTodayTimestamp();
//     groupExpense.createdBy = createdBy;
//     groupExpense.updated = this.getTodayTimestamp();
//     groupExpense.updatedBy = createdBy;

//     return this.create(groupExpense);
//   }

//   //get all for all groups
//   public getGroupExpenses() {
//     return super.getAll();
//   }

//   public getByGroupExpenseDocId(groupExpenseDocId: string) {
//     return super.getByDocId(groupExpenseDocId);
//   }

//   //group expenses for group Id
//   public getByGroupDocId(groupDocId: string) {
//     console.log("getByGroupDocId groupdocId: ", groupDocId);

//     return this.firestore.collection('groupexpenses', q => q.where('groupDocId', '==', groupDocId).orderBy('startDate', 'desc')).snapshotChanges().pipe(
//       map(actions => {
//         var items = actions.map(p => {
//           var data = p.payload.doc.data() as GroupExpense;
//           console.log("getByGroupDocId service data: ", data);

//           return { ...data, docId: p.payload.doc.id } as GroupExpense;
//         });
//         console.log("getByGroupDocId service: ", items);

//         return items;
//       })
//     );



//     // return this.firestore.collection('users', q => q.where("email", "==", email).limit(1)).snapshotChanges().pipe(
//     //   map(actions => {
//     //     if (actions && actions.length > 0) {
//     //       var acc = actions[0].payload.doc.data() as User;
//     //       return {
//     //         ...acc,
//     //         docId: actions[0].payload.doc.id
//     //       } as User;
//     //     } else {
//     //       return null;
//     //     }
//     //   }));

//   }


//   public getBalance(groupDocId: string) {
//     return this.firestore.collection('groupexpenses', q => q.where('groupDocId', '==', groupDocId)).snapshotChanges().pipe(
//       map(actions => {
//         const amounts = actions.map(x => (x.payload.doc.data() as GroupExpense).amount);
//         const total = amounts.reduce((a, b) => a + b, 0);
//         return total;
//       })
//     );
//   }



//   //TODO
//   public getByDateRange(groupDocId: string, startDate: Timestamp, endDate: Timestamp) {

//   }



// }
