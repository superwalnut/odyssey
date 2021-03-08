import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;

export class BookingPerson {
    userId: string;
    userDisplayName: string;
    isVIP: boolean; //isVIP became obselete, since we can know from the Group Committees
    notes: string; //Only admin can enter notes
    paymentMethod: string; //Credit | Cash | Bank Transfer

    parentUserId: string; //payment deduct from this user if payment method is CREDIT

    amount: number;

    isPaid: boolean; //this usually apply to cash only

    createdOn: Timestamp;
}