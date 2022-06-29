import firebase from "firebase/app";
import Timestamp = firebase.firestore.Timestamp;
import { User } from './user';


export class Ladder {
    docId: string;
    user: User;
    season: string;
    wins: number;
    lossses: number;
    createdOn: Timestamp
    updatedOn: Timestamp;
}
