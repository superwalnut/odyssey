import firebase from 'firebase/app';
import { BookingPerson } from './booking-person';
import Timestamp = firebase.firestore.Timestamp;

export class Booking {
    docId: string;
    groupDocId: string;
    date: Timestamp; //if it's TUE session, the date should equal to Tue's date
    weekDay: string; // TUE | FRI | SAT - make it easier for query
    people: BookingPerson[];
    isLocked: boolean // once locked, even admin can't make edit, only God can make changes to it
}

