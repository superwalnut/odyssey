import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;

export class Shuttle {
  docId: string;
  purchaseDate: Timestamp;
  cost: number;
  quantity: number;
  notes: string;
}
