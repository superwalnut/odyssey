import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;

export class Booking {
    docId:string;
    sessionDate: Timestamp;
    weekDay:string; // TUE | FRI | SAT - make it easier for query
    userId:string;
    userDisplayName:string;
    isVIP:boolean;
    notes:string; //Only admin can enter notes
    paymentMethod:string; //Credit | Cash | Bank Transfer
    paidByUserId:string; //payment deduct from this user
    paidByUserDisplayName:string;
    amount:number;
    termId:string; //for easy reporting

    isPaid:boolean; //this usually apply to cash only
    isOnWaiting:boolean; //waiting list
    isLocked:boolean // once locked, even admin can't make edit, only God can make changes to it
    createdOn:Timestamp;
}


