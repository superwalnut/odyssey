
import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;

export class Term {
    docId: string;
    startDate: Timestamp;
    endDate: Timestamp;
    cost: number;
    vip: number;
  }

  