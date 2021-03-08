import firebase from "firebase/app";
import Timestamp = firebase.firestore.Timestamp;

//Keep a record of all expenses for this group, ie. court hire, shuttle purchase
export class GroupExpense {
    docId: string;
    groupDocId: string;
    expenseType: string;
    amount: number;
    notes: string; //description of this expense
    startDate: Timestamp;
    endDate: Timestamp;
    created: Timestamp;
    createdBy: string;
    updated: Timestamp;
    updatedBy: string;
}


// export class BookingIncome {
//     docId:string;
//     groupId:string;
//     creditAmount:number;
//     cashAmount:number;
//     bankTransferAmount:number;
//     notes:string;

// }