
import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;

export class Term {
    docId: string;
    startDate: Timestamp;
    endDate: Timestamp;
    termName: string; //give term a readable name. ie. 2021A, 2021B
    cost: number;
    vip: number;
  }

  