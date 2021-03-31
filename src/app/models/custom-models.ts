// export class CustomModels {
// }

import firebase from 'firebase/app';
import { ShorthandPropertyAssignment } from 'typescript';
import Timestamp = firebase.firestore.Timestamp;


export class LocalBookingUser {
  docId: string;
  userDocId: string;
  parentUserId: string;
  parentUserDisplayName: string;
  name: string;
  amount: number;
  paymentMethod: string;
  selected: boolean;
  isMyBooking: boolean;
  isFamily: boolean;
  isForSale: boolean;
  note: string;
  isPaid: boolean;
  createdOn: Timestamp;
}

