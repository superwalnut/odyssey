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
    grade: string;
    gradePoints: number; //to further classify user skill levels by points 1-10 （decimal allowed)
    isCreditUser: boolean;
    disabled: boolean;

    requireChangePassword:boolean;
}

/*

O - 10 ERIC
A - 8 ZAKA
B - 6 MATT
C - 5 LUC
D - 4 GARY
E - 2 Du
F - 0 JACK


*/