import { Injectable } from '@angular/core';
//import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { GroupService } from './group.service';
import { BookingsService } from './bookings.service';
import { BookingPersonService } from './booking-person.service';

import { AccountService } from './account.service';
import { Group } from '../models/group';
import { Booking } from '../models/booking';
import { BookingPerson } from '../models/booking-person';
import { User } from '../models/user';
import { GlobalConstants } from '../common/global-constants';
import { HelperService } from '../common/helper.service';
import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;
import { concatMap, map, mergeMap, switchMap, take } from 'rxjs/operators';
import { combineLatest, forkJoin, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

//This service will be replaced by Firebase cloud schedulers in the future
export class TriggersService {
  constructor(private groupService: GroupService, private bookingService: BookingsService, private bookingPersonService:BookingPersonService, private accountService: AccountService, private helperService: HelperService) {}

  prepopulateBookings() {
    //1. getting all active groups
    // var group = {
    //   docId:'Dmpgn7MWD5BhR40xTEPG',
    //   bookingStartDay: 'Monday',
    //   committees:['Sao2W8mYPHsEPQ2Nx6mg'],
    //   eventStartDay:'Tuesday',
    //   eventStartTime:'20:00',
    //   groupDesc:'tues group',
    //   groupName: 'tues group',
    //   isClosed:false,
    //   isRecursive:true
    // } as Group;
    
    // this.bookingWorker(group);

    this.groupService.getGroupByStatus(false).subscribe(groups => {
      groups.forEach(g => {
        console.log("active groups: ", g);
        this.bookingWorker(g);
      })
    });
  }

  bookingWorker(group: Group) {
    console.log("bookingworkser:", group);
    var committees = group.committees;
    console.log('committee users: ', committees);

    var peoples: BookingPerson[] = [];

    let getCommittees = this.accountService.getUsersByUserDocIds(committees);
    let getLastBooking = this.bookingService.getLastBookingByGroupDocId(group.docId).pipe(take(1));

    combineLatest([getCommittees, getLastBooking])
    .subscribe(result=>{
      console.log;

      console.log('forkjoin 1: ', result[0]);
      console.log('forkJoin 2: ', result[1]);
      var nextEventStartDateTime = this.getEventStartDateTime(group, result[1]);

      var booking = {
        groupDocId: group.docId,
        //people: peoples,
        isLocked: false,
        eventStartDateTime: nextEventStartDateTime,
        bookingStartDay: group.bookingStartDay,
        weekDay: group.eventStartDay,
      } as Booking;
      console.log('new booking; ', booking);  
      this.bookingService.createBooking(booking).then(bookingDocId =>{ 
        console.log('newly generated booking docID: ', bookingDocId);
        
        peoples = this.mapCommitteesToBookingPerson(result[0], group.docId, bookingDocId);
        console.log('booking persons ready for insert: ', peoples);

        //this.bookingPersonService.createBookingPersonBatch(peoples);

      });
    })
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

  mapCommitteesToBookingPerson(users: User[], groupDocId:string, bookingDocId:string) {
    var bookingpersons: BookingPerson[] = [];
    
    console.log("users original input: ", users);
    console.log("users length: ", users.length);

    users.forEach(u => {
      console.log("u =>: ", u);

      var bookingPerson = {
        groupDocId:groupDocId,
        bookingDocId:bookingDocId,
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

  public getBookingAndPersons(groupId:string) {
    return this.bookingService.getLastBookingByGroupDocId(groupId).pipe(
      mergeMap(booking => {
          var persons = this.bookingPersonService.getByBookingDocId(booking.docId);
          return combineLatest([of(booking),persons]);
        }),
        map(([booking, persons]) => {
            console.log('this booking', booking);
            console.log('persons in this booking', persons);
        }));
  }


}
