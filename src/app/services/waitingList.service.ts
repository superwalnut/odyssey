import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { FirestoreBaseService } from "./firestore-base.service";
import { map } from "rxjs/operators";
import { WaitingList } from "../models/waiiting-list";
//import { BookingPerson } from "../models/booking-person";

// import firebase from "firebase/app";
// import Timestamp = firebase.firestore.Timestamp;
import { HelperService } from "../common/helper.service";

@Injectable({
  providedIn: "root",
})
export class WaitingListService extends FirestoreBaseService<WaitingList> {
  constructor(
    private firestore: AngularFirestore,
    private helpService: HelperService
  ) {
    super(firestore.collection("waitingLists"));
  }

  public createWaitingList(waitingList: WaitingList) {
    return super.create(waitingList);
  }

  public deleteWaitingList(waitingListDocId: string) {
    return super.delete(waitingListDocId);
  }

//   public get(userDocId: string, bookingDocId: string) {
//     return this.firestore
//       .collection("waitingLists", (q) =>
//         q.where("bookingDocId", "==", bookingDocId && "userDocId", "==", userDocId).orderBy("createdOn", "desc")
//       )
//       .snapshotChanges()
//       .pipe(
//         map((actions) => {
//           var items = actions.map((p) => {
//             var data = p.payload.doc.data() as WaitingList;
//             console.log("getByBookingDocId()", data);
//             return { ...data, docId: p.payload.doc.id } as WaitingList;
//           });
//           return items;
//         })
//       );
//   }

  public getByBookingDocId(bookingDocId: string) {
    return this.firestore
      .collection("waitingLists", (q) =>
        q.where("bookingDocId", "==", bookingDocId).orderBy("createdOn", "desc")
      )
      .snapshotChanges()
      .pipe(
        map((actions) => {
          var items = actions.map((p) => {
            var data = p.payload.doc.data() as WaitingList;
            console.log("getByBookingDocId()", data);
            return { ...data, docId: p.payload.doc.id } as WaitingList;
          });
          return items;
        })
      );
  }
}
