import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;

export class Credit {
    docId:string;
    userDocId:string;
    userDisplayName:string;
    amount:number;
    created:Timestamp;
    note:string;
    balance:number;
    createdBy:string;
    createdByDisplayName:string;
}
