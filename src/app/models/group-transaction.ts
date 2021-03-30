
import firebase from "firebase/app";
import Timestamp = firebase.firestore.Timestamp;

//keep insert , no delete, no update
export class GroupTransaction {
    docId: string;
    groupDocId: string;
    bookingDocId: string; //nullable
    referenceId: string; //nullable, can be userDocId
    notes: string; //description of this transaction
    amount:number;
    paymentMethod:string; //credit|cash|bank|adjusted

    created: Timestamp;
    createdBy: string;
    createdByDisplayName: string;
    updated: Timestamp;
    updatedBy: string;
    updatedByDisplayName: string;

}

