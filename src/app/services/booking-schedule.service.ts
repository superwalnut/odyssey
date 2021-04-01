import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { FirestoreBaseService } from "./firestore-base.service";
import { map, concatMap, finalize, timestamp } from "rxjs/operators";
import { BookingPerson } from "../models/booking-person";
import { BookingSchedule } from '../models/booking-schedule';
import { GroupTransaction } from "../models/group-transaction";
import { Booking } from '../models/booking';
import { CreditService } from './credit.service';
import { HelperService } from '../common/helper.service';

import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;

@Injectable({
  providedIn: 'root'
})
export class BookingScheduleService extends FirestoreBaseService<BookingSchedule>{

  constructor(private firestore: AngularFirestore, private creditService: CreditService, private helperService: HelperService) {
    super(firestore.collection('bookingSchedules'));
  }

}
