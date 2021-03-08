import firebase from "firebase/app";
import { User } from "./user";
import Timestamp = firebase.firestore.Timestamp;

export class Group {
  docId: string;
  groupName: string;
  groupDesc: string;
  termCost: number; //cost during the term. ie court hire fees
  committees: string[]; // VIPs for this group, userDocId
  isClosed: boolean;
  startDate: Timestamp;
  endDate: Timestamp;

  created: Timestamp;
  createdBy: string;
  updated: Timestamp;
  updatedBy: string;
}
