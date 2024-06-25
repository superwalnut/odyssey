import { BookingPerson } from "./booking-person";

export class MyBooking {
    bookingTitle: string;
    bookingDesc: string;
    displayText: string;
    bookingDocId: string;
    groupDocId: string;
    bookingPersons: BookingPerson[];
    eventDate:Date;
  }
  