import { Injectable } from '@angular/core';
import { GroupService } from './group.service';
import { BookingsService } from './bookings.service';
import { AccountService } from './account.service';
import { Group } from '../models/group';
import { Booking } from '../models/booking';
import { BookingPerson } from '../models/booking-person';
import { User } from '../models/user';
import { GlobalConstants } from '../common/global-constants';
import { HelperService } from '../common/helper.service';

import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;
import { take } from 'rxjs/operators';

//import { GroupsComponent } from '../views/groups/groups.component';

@Injectable({
  providedIn: 'root'
})

//This service will be replaced by Firebase cloud schedulers in the future
export class TriggersService {

  constructor(private groupService: GroupService, private bookingService: BookingsService, private accountService: AccountService, private helperService: HelperService) { }


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
    var peoples: BookingPerson[] = [];
    this.accountService.getUsersByUserDocIds(committees).subscribe(us => {
      peoples = this.mapUserToBookingPerson(us);
      console.log('committee users: ', peoples);


    });
    console.log('committee users: ', peoples);

    var users:User[];
    this.accountService.getUsersByDocIds(committees).pipe(take(1)).subscribe(x=>{
      users = x;

    var nextEventStartDateTime = this.getEventStartDateTime(group);

    var booking = {
      groupDocId: group.docId,
      people: peoples,
      isLocked: false,
      eventStartDateTime: nextEventStartDateTime,
      bookingStartDay: group.bookingStartDay,
      weekDay: group.eventStartDay,
    } as Booking;

    console.log("Next booking ready: ", booking);

  }

  getEventStartDateTime(group: Group) {
    let startDay = group.eventStartDay;
    let startTime = group.eventStartTime;
    let lastBooking = this.getLastBooking(group.docId)
    let lastBookingDate;
    if (lastBooking == null) {
      lastBookingDate = this.helperService.today();
    } else {
      lastBookingDate = lastBooking.eventStartDateTime;
    }

    let nextEventDate = this.helperService.findNextDayOfTheWeek(startDay, true, lastBookingDate);
    console.log("next event start date: ", nextEventDate);
    return this.helperService.convertToTimestamp(nextEventDate);
  }

  mapUserToBookingPerson(users: User[]) {
    var bookingpersons: BookingPerson[] = [];
    users
    console.log("users original input: ", users);
    console.log("users length: ", users.length);

    users.forEach(u => {
      console.log("u =>: ", u);

      var bookingPerson = {
        userId: u.docId,
        userDisplayName: u.name,
        paymentMethod: GlobalConstants.paymentCredit,
        amount: 0,
        isPaid: true,
        createdOn: Timestamp.now(),
      } as BookingPerson;
      console.log("booking person: ", bookingPerson);

      bookingpersons.push(bookingPerson);
    });

    console.log("booking persons: ", bookingpersons);
    return bookingpersons;
  }

  getLastBooking(groupDocId: string) {
    var b: Booking;
    this.bookingService.getLastBookingByGroupDocId(groupDocId).subscribe(booking => {
      console.log(booking);
      b = booking;
    });
    return b;

  }
}
