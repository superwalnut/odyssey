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
  isChild: boolean;
  note: string;
  avatarUrl: string;
  isPaid: boolean;
  isLoading: boolean;
  createdOn: Timestamp;
}

export class UserSelection {
  docId: string;
  name: string;
  avatarUrl: string;
  selected: boolean;
  parentUserDocId: string;
  parentUserDisplayName: string;
}


export class UserImport {
  email: string;
    name: string;
    password: string;
    mobile: string;
    parentUserDocId: string;
    parentUserDisplayName: string;
    family:string[];
    gender: string;
    isChild: boolean;
    isMember: boolean;
    created: Timestamp;
    grade: string;
    gradePoints: number; //to further classify user skill levels by points 1-10 （decimal allowed)
    isCreditUser: boolean;
    creditBalance:number;
    requireChangePassword:boolean;


}