import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;

export class Credit {
    docId:string;
    userDocId:string;
    userDisplayName:string;
    amount:number;
    created:Timestamp;
    note:string;
    createdBy:string;
    createdByDisplayName:string;
    category:string;
}
