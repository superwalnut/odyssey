import firebase from 'firebase/app';
import { BookingPerson } from './booking-person';
import Timestamp = firebase.firestore.Timestamp;

export class Booking {
    docId: string;
    groupDocId: string;
    eventStartDateTime: Timestamp; //if it's TUE session, the date should equal to Tue's date, this value should copy from Group.eventStartDay and eventStartTime
    bookingStartDay: string; //Registration open date. copy from Group.bookingStartDay
    weekDay: string; // TUE | FRI | SAT - make it easier for query, copy from Group.eventStartDay
    //people: BookingPerson[];
    isLocked: boolean // once locked, even admin can't make edit, only God can make changes to it
    seatsOverwrite: number; //initial value is copied from Groupo.seats, but allow admin to overwrite on booking level
    levelRestrictionOverwrite: number; //use level points to filter user skills
    isReconciliationInProgress :boolean; //booking only can be autited by one person, to avoid data conflict.
    reconcilationBy: string;
    reconciled: boolean; // booking is reconciled and hence closed - cannot be undone!
    
}

