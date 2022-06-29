import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;

export class UserBalance {
    userDocId:string;
    userName:string;
    balance:number;
}