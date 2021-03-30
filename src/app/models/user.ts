import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;

export class User {
    docId: string;
    email: string;
    name: string;
    password: string;
    mobile: string;
    parentUserDocId: string;
    parentUserDisplayName: string;
    role: string[];
    gender: string;
    isChild: boolean;
    isMember: boolean;
    created: Timestamp;
    updated: Timestamp;
    status: string;
}
