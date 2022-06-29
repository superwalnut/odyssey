import firebase from "firebase/app";
import Timestamp = firebase.firestore.Timestamp;

export class WaitingList {
  docId: string;
  bookingDocId: string;
  eventStartDay: string;
  userDocId: string;
  avatarUrl: string;
  userDisplayName: string;
  createdOn: Timestamp;
}
