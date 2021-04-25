import firebase from 'firebase/app';
import { UserBalance } from './user-balance';
import Timestamp = firebase.firestore.Timestamp;

export class UserBalanceStatement {
    userBalances:UserBalance[];
    lastUpdated:Timestamp;
    docId:string;
}