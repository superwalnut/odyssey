
import firebase from "firebase/app";
import Timestamp = firebase.firestore.Timestamp;

export class GroupIncome {
    docId: string;
    groupDocId: string;
    bookingDocId: string;
    notes: string; //description of this income
    creditAmount: number;
    cashAmount: number;
    bankTransferAmount: number;
    adjustAmount: number;
    adjustNotes: string;
    amount: number; //  (credit+cash+bank)-adjust which is the Actual Income! ie. if we run social for Susan, this Actual Amount should equal to ZERO!
    created: Timestamp;
    createdBy: string;
    updated: Timestamp;
    updatedBy: string;

}

