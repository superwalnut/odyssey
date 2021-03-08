import firebase from "firebase/app";
import { User } from "./user";
import Timestamp = firebase.firestore.Timestamp;

export class Group {
  docId: string;
  groupName: string;
  groupDesc: string;
  committees: string[]; // VIPs for this group, userDocId
  isClosed: boolean;
  startDate: Timestamp;
  endDate: Timestamp;

  created: Timestamp;
  createdBy: string;
  updated: Timestamp;
  updatedBy: string;
}
