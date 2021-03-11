import { Injectable } from '@angular/core';
import { GroupService } from './group.service';
import { BookingsService } from './bookings.service';
import { AccountService } from './account.service';
import { Group } from '../models/group';
import { Booking } from '../models/booking';
import { BookingPerson } from '../models/booking-person';
import { User } from '../models/user';
import { GlobalConstants } from '../common/global-constants';
import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;

//import { GroupsComponent } from '../views/groups/groups.component';

@Injectable({
  providedIn: 'root'
})

//This service will be replaced by Firebase cloud schedulers in the future
export class TriggersService {

  constructor(private groupService: GroupService, private bookingService: BookingsService, private accountService: AccountService) { }


  prepopulateBookings() {
    //1. getting all active groups
    var activeGroups = this.groupService.getGroupByStatus(false).subscribe(groups => {
      groups.forEach(g => {
        console.log(g);
        this.bookingWorker(g);
      })


    });


    //2. prepopulate bookings

  }

  bookingWorker(group: Group) {
    console.log("bookingworkser:", group);
    var committees = group.committees;
    var users = this.accountService.getUsersByDocIds(committees);
    console.log('committee users: ', users);

    group.eventStartDay;
    group.eventStartTime;
    Timestamp.fromMillis(Date.parse(''));

    var booking = {
      groupDocId: group.docId,
      people: this.mapUserToBookingPerson(users),
      isLocked: false,
      eventStartDateTime: null,
      bookingStartDay: group.bookingStartDay,
      weekDay: group.eventStartDay,
    } as Booking;

  }

  mapUserToBookingPerson(users: User[]) {
    var bookingpersons: BookingPerson[] = [];

    users.forEach(u => {
      var bookingPerson = {
        userId: u.docId,
        userDisplayName: u.name,
        paymentMethod: GlobalConstants.paymentCredit,
        amount: 0,
        isPaid: true,
        createdOn: Timestamp.now(),
      } as BookingPerson;
      bookingpersons.push(bookingPerson);
    });

    return bookingpersons;
  }
}
