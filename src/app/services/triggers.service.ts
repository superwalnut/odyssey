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
import { combineLatest, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

//This service will be replaced by Firebase cloud schedulers in the future
export class TriggersService {
  constructor(private groupService: GroupService, private bookingService: BookingsService, private accountService: AccountService, private helperService: HelperService) {
  }

  prepopulateBookings() {
    //1. getting all active groups

    var group = {
      docId:'Dmpgn7MWD5BhR40xTEPG',
      bookingStartDay: 'Monday',
      committees:['Sao2W8mYPHsEPQ2Nx6mg'],
      eventStartDay:'Tuesday',
      eventStartTime:'20:00',
      groupDesc:'tues group',
      groupName: 'tues group',
      isClosed:false,
      isRecursive:true
    } as Group;
    
    var booking = this.bookingWorker(group);
    console.log('new bookingxxx; ', booking);
    // this.groupService.getGroupByStatus(false).subscribe(groups => {
    //   groups.forEach(g => {
    //     console.log("active groups: ", g);
    //     this.bookingWorker(g);

    //   })
    // });
  }

  bookingWorker(group: Group) {
    console.log("bookingworkser:", group);
    var committees = group.committees;
    console.log('committee users: ', committees);

    var peoples: BookingPerson[] = [];

    let getCommittees = this.accountService.getUsersByUserDocIds(committees);
    let getLastBooking = this.bookingService.getLastBookingByGroupDocId(group.docId);

    return combineLatest([getCommittees, getLastBooking])
    .subscribe(result=>{
      console.log;

      console.log('forkjoin 1: ', result[0]);
      console.log('forkJoin 2: ', result[1]);
      peoples = this.mapCommitteesToBookingPerson(result[0]);
      var nextEventStartDateTime = this.getEventStartDateTime(group, result[1]);

      var booking = {
        groupDocId: group.docId,
        people: peoples,
        isLocked: false,
        eventStartDateTime: nextEventStartDateTime,
        bookingStartDay: group.bookingStartDay,
        weekDay: group.eventStartDay,
      } as Booking;
      console.log('new booking; ', booking);
      return booking;
      //this.bookingService.createBooking(booking);
    })


    // this.accountService.getUsersByUserDocIds(committees).subscribe(us => {
    //   peoples = this.mapCommitteesToBookingPerson(us);
    //   var nextEventStartDateTime = this.getEventStartDateTime(group);

    //   var booking = {
    //     groupDocId: group.docId,
    //     people: peoples,
    //     isLocked: false,
    //     eventStartDateTime: nextEventStartDateTime,
    //     bookingStartDay: group.bookingStartDay,
    //     weekDay: group.eventStartDay,
    //   } as Booking;

    //   group.currentBooking = booking;
    //   console.log("Next booking ready: ", booking);
    //   this.bookingService.createBooking(booking);
    //   //booking.people = null;//don't need peoples in groups.booking
    //   //this.groupService.updateGroup(group.docId, group); //add this new booking to group as well
    // });
  }

  getEventStartDateTime(group:Group, booking: Booking) {
    let startDay = group.eventStartDay;
    let startTime = group.eventStartTime;
    var lastBooking = booking;

    let lastBookingEventStartDate:Date;
    if (lastBooking == null) {
      lastBookingEventStartDate = this.helperService.today();
    } else {
      lastBookingEventStartDate = this.helperService.convertToDate(lastBooking.eventStartDateTime);
    }
    //console.log("last event start date: ", this.helperService.combinDateTypeAndTime(lastBookingEventStartDate, startTime));

    let nextEventDate = this.helperService.findNextDayOfTheWeek(startDay, true, lastBookingEventStartDate);
    // var hh = this.helperService.extractHour(startTime);
    // var newhh = nextEventDate.setUTCHours(hh);
    let nextEventStartDateTime = this.helperService.combinDateTypeAndTime(nextEventDate, startTime);
    console.log("next event start date ", nextEventStartDateTime);
    return this.helperService.convertToTimestamp(nextEventStartDateTime);
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
