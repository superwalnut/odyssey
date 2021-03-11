import firebase from "firebase/app";
import { User } from "./user";
import Timestamp = firebase.firestore.Timestamp;

export class Group {
  docId: string;
  groupName: string;
  groupDesc: string;
  committees: string[]; // VIPs for this group, userDocId, //every time group is closed we need to distrbute  group profit to group committees as dividend
  isClosed: boolean; //every time group is closed we need to distrbute  group profit to group committees as dividend
  startDate: Timestamp; //default to Date.Now()
  endDate: Timestamp; //default to 3 years.

  isRecursive: boolean; // is the booking recursive
  eventStartDay: string;//ie. Tuesday, bookings are not allowed to withdraw 3 hours before 8PM.
  eventStartTime: Timestamp; //ie. 8:00PM
  bookingStartDay: string; //for simplicity, start time always start at 6AM. booking will be opening on this week day and time
  //booking will be closed on eventStartDatetime.
  created: Timestamp;
  createdBy: string;
  updated: Timestamp;
  updatedBy: string;
}
