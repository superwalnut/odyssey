
import firebase from "firebase/app";
import Timestamp = firebase.firestore.Timestamp;

//keep insert , no delete, no update
export class GroupTransaction {
    docId: string;
    groupDocId: string;
    bookingDocId: string;
    notes: string; //description of this transaction
    creditAmount: number;
    cashAmount: number;
    bankTransferAmount: number;
    adjustAmount: number;
    adjustNotes: string;
    created: Timestamp;
    createdBy: string;
    updated: Timestamp;
    updatedBy: string;

}

