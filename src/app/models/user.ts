import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;

//TODO: isVIP,
export class User {
    docId: string;
    email: string;
    name: string;
    password: string;
    mobile: string;
    parentUserDocId: string;
    role: string[];
    isMember: boolean;
    created: Timestamp;
    updated: Timestamp;
    status: string;
}
