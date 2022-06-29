import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;
import { User } from './user';

export class BookingSchedule {
    docId: string;
    groupDocId: string;
    groupName: string;
    expireOn: Timestamp;
    isPaused: boolean;
    notes: string;
    //user object
    // userDocId: string;
    // userDisplayName: string;
    // parentDocId: string;
    // parentDisplayName: string;
    user: User;

    createdOn: Timestamp;
    createdBy: string;
    createdByDisplayName: string;
    updatedOn: Timestamp;
    updatedBy: string;
}
