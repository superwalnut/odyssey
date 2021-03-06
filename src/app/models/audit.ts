//a big general table storing all user's activity on this web app.
//ie. changed password, top up credit, booking for social, withdraw from social
import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;


export class Audit {
    docId: string;
    event: string;
    value: number; //if there's number's involved
    userId: string;
    userDisplayName: string;
    createdOn: Timestamp;

}
