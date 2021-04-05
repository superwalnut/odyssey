import firebase from "firebase/app";
import Timestamp = firebase.firestore.Timestamp;


export class EventLogger {
    docId: string;
    eventCategory: string;
    notes: string;


    createdOn: Timestamp;
    createdBy: string;
    createdByDisplayName: string;

}
