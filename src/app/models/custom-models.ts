// export class CustomModels {
// }

import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;


export class LocalBookingUser {
    docId:string;
    userDocId: string;
    name: string;
    amount: number;
    paymentMethod: string;
    selected: boolean;
    isMyBooking: boolean;
    isFamily: boolean;
    isForSale: boolean;
    createdOn: Timestamp;
  }

  