import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;

export class BookingSchedule {
    docId: string;
    userDocId: string;
    userDisplayName: string;
    groupDocId: string;
    expireOn: Timestamp;
    isPaused: boolean;
    notes: string;
    createdOn: Timestamp;
    createdBy: string;
    updatedOn: Timestamp;
    updatedBy: string;
}
