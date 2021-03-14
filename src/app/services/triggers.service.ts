import { Injectable } from '@angular/core';
//import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
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
  constructor(private groupService: GroupService, private bookingService: BookingsService, private accountService: AccountService, private helperService: HelperService) {
  }

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
    console.log('committee users: ', committees);

    var peoples: BookingPerson[] = [];
    this.accountService.getUsersByUserDocIds(committees).subscribe(us => {
      peoples = this.mapCommitteesToBookingPerson(us);
      console.log('committee users: ', us);


    });
    console.log('committee users: ', peoples);

    var users: User[];
    this.accountService.getUsersByUserDocIds(committees).pipe(take(1)).subscribe(x => {
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
      //this.bookingService.createBooking(booking);

    });
  }

  getEventStartDateTime(group: Group) {
    let startDay = group.eventStartDay;
    let startTime = group.eventStartTime;
    var lastBooking = group.currentBooking;
    console.log('lastBooking: ', lastBooking);

    let lastBookingEventStartDate;//lastBooking.eventStartDateTime);
    if (lastBooking == null) {
      lastBookingEventStartDate = this.helperService.today();
    } else {
      lastBookingEventStartDate = this.helperService.convertToDate(lastBooking.eventStartDateTime);
    }
    console.log("last event start date: ", lastBookingEventStartDate);

    let nextEventDate = this.helperService.findNextDayOfTheWeek(startDay, true, lastBookingEventStartDate);
    var hh = this.helperService.extractHour(startTime);
    var newhh = nextEventDate.setUTCHours(hh);
    console.log("next event start date ", new Date(newhh).toUTCString());



    //console.log("next event start date: ", new Date(nextEventDate.setHours(startTime)));
    return this.helperService.convertToTimestamp(nextEventDate);
  }

  mapCommitteesToBookingPerson(users: User[]) {
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

  // getLastBooking(groupDocId: string) {
  //   this.bookingService.getLastBookingByGroupDocId(groupDocId).subscribe(booking => {
  //     console.log('getLastBooking() ', booking);
  //     this.lastBookingSubject.next(booking);
  //   });
  // }
}
