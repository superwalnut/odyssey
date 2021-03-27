import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;

export class BookingPerson {
    docId:string;
    bookingDocId:string;
    groupDocId:string;
    bookingDesc:string; //desc, so we don't need extra query for description
    userId: string;
    userDisplayName: string;
    notes: string; //Only admin can enter notes
    paymentMethod: string; //Credit | Cash | Bank Transfer
    parentUserId: string; //payment deduct from this user if payment method is CREDIT
    parentUserDisplayName:string;
    isForSale:boolean; //user can mark the spot for sale once passed withdraw window.
    amount: number;
    isPaid: boolean; //this usually apply to cash only
    createdOn: Timestamp;
    updatedOn: Timestamp;
}