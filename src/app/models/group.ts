import firebase from "firebase/app";
import { User } from "./user";
import Timestamp = firebase.firestore.Timestamp;

export class Group {
  docId: string;
  groupName: string;
  groupDesc: string;
  termCost: number; //cost during the term. ie court hire fees
  founders: User[]; // VIPs for this group
  isClosed: boolean;
  startDate: Timestamp;
  endDate: Timestamp;

  created: Timestamp;
  createdBy: string;
  updated: Timestamp;
  updatedBy: string;
}
