import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";

import { Group } from "../../../models/group";
import { GlobalConstants } from '../../../common/global-constants';

import { GroupService } from "../../../services/group.service";
import { AccountService } from "../../../services/account.service";
import { BookingsService } from "../../../services/bookings.service";
import { BookingPersonService } from "../../../services/booking-person.service";
import { BookingScheduleService } from "../../../services/booking-schedule.service";

import { Booking } from '../../../models/booking';
import { BookingPerson } from '../../../models/booking-person';
import { User } from '../../../models/user';
import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;
import { HelperService } from '../../../common/helper.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent implements OnInit {
  isGod: Boolean;
  myGroups = [];
  myDocId: string;
  group: Group;
  groupDocId: string;
  bookings: Booking[];
  //selectedGroupDocId: string;
  displayedColumns: string[] = [
    "date",
    "isLocked",
    "Action",
  ];
  dataSource = new MatTableDataSource<Booking>();
  futureBookingDates: Date[];
  selectedFutureDate: Date;
  committees: User[];
  committeesDump: string;
  committeeBookingPersons: BookingPerson[];
  autoBookingUsers: User[];

  constructor(public dialog: MatDialog, private groupService: GroupService, private bookingService: BookingsService,
    private accountService: AccountService, private activatedRoute: ActivatedRoute, private bookingPersonService: BookingPersonService,
    private bookingScheduleService: BookingScheduleService, private helpService: HelperService) { }

  ngOnInit(): void {
    this.myDocId = this.accountService.getLoginAccount().docId;
    //this.getMyGroups();

    this.groupDocId = this.activatedRoute.snapshot.params.id;
    if (this.groupDocId) {
      this.getGroupDetails(this.groupDocId);
      this.getBookingsByGroupDocId(this.groupDocId);
      this.getAutoBookingUsers(this.groupDocId);
    }
    this.isGod = this.accountService.isGod();
  }

  createBookingClicked() {
    console.log(this.selectedFutureDate);
    let ts = this.helpService.convertToTimestamp(this.selectedFutureDate);

    let found = this.bookings.find(b => this.helpService.compareDates(b.eventStartDateTime, ts));
    if (found) {
      alert('Booking with same date already existed! Create booking Aborted.');
      return false;
    }
    console.log('compare dates: ', found)
    if (!this.selectedFutureDate) return false;
    if (confirm("Are you sure to start a new booking - 接龙? " + this.selectedFutureDate)) {
      this.createEmptyBooking();
    }
  }

  createEmptyBooking() {
    var startDateTime = this.helpService.combinDateTypeAndTime(this.selectedFutureDate, this.group.eventStartTime);
    var startDateTimeTimeStamp = this.helpService.convertToTimestamp(startDateTime);
    var booking = {
      groupDocId: this.group.docId,
      eventStartDateTime: startDateTimeTimeStamp,
      bookingStartDay: this.group.bookingStartDay,
      weekDay: this.group.eventStartDay,
      isLocked: true, //new booking default to locked, need God manually open it. for extra layer of control
      seatsOverwrite: this.group.seats, //initial value copied from group, and admin can change it on booking level
    } as Booking;

    console.log(booking)
    this.bookingService.createBooking(booking).then(bookingDocId => {
      console.log(bookingDocId);
      var autoBookingPersons = this.mapUsersToBookingPerson(this.autoBookingUsers, this.group.docId, bookingDocId);
      console.log('booking persons ready for insert: ', autoBookingPersons);
      if (autoBookingPersons.length > 0) {
        this.bookingPersonService.createBookingPersonBatch(autoBookingPersons, booking);
      }

    });
  }

  getAutoBookingUsers(groupDocId: string) {
    this.bookingScheduleService.getBookingSchedulesByGroupDocIdInUserIdArray(groupDocId).subscribe(userIds => {
      console.log('addAutoBookingUsers', userIds);
      if (userIds.length > 0) {
        this.accountService.getUsersByUserDocIds(userIds).subscribe(result => {
          this.autoBookingUsers = result;
          console.log('auto booking users: ', result);
        })
      }

    })
  }

  getGroupDetails(groupDocId: string) {
    this.groupService.getGroup(groupDocId).subscribe(g => {
      this.group = g;
      this.futureBookingDates = this.helpService.findWeekdays(g.eventStartDay, 10);

      this.committees = g.committees;
      // this.accountService.getUsersByUserDocIds(g.committees).subscribe(result => {
      //   this.committees = result;
      // });
    })
  }

  // getMyGroups() {
  //   this.myGroups = [];

  //   this.groupService.getGroupsByUserDocId(this.myDocId).subscribe(x => {
  //     console.log('my groups', x);
  //     this.myGroups = x;
  //   });
  // }

  getBookingsByGroupDocId(groupDocId: string) {
    this.bookingService.getByGroupDocId(groupDocId).subscribe(bookings => {
      this.dataSource.data = bookings;
      this.bookings = bookings;
    });
  }

  mapUsersToBookingPerson(users: User[], groupDocId: string, bookingDocId: string) {
    var bookingpersons: BookingPerson[] = [];
    if (!users || users.length == 0) { return bookingpersons; }

    console.log("users original input: ", users);
    console.log("users length: ", users.length);


    users.forEach(u => {
      console.log("u =>: ", u);

      let rate = this.getUserRate(u.docId, this.committees);

      var bookingPerson = {
        groupDocId: groupDocId,
        bookingDocId: bookingDocId,
        bookingDesc: this.group.groupDesc,
        userId: u.docId,
        userDisplayName: u.name,
        parentUserId: u.parentUserDocId ? u.parentUserDocId : u.docId,
        parentUserDisplayName: u.parentUserDisplayName ? u.parentUserDisplayName : u.name,
        paymentMethod: GlobalConstants.paymentCredit,
        amount: rate,
        isPaid: true,
        createdOn: Timestamp.now(),
      } as BookingPerson;
      console.log("booking person: ", bookingPerson);

      bookingpersons.push(bookingPerson);
    });

    console.log("booking persons: ", bookingpersons);
    return bookingpersons;
  }

  getUserRate(userDocId:string, committees:User[]) {
    let found = committees.find(x=>x.docId == userDocId);
    if (found) {
      return 0; //committess is free
    } else {
      return GlobalConstants.rateCredit; // only credit user can setup auto booking.
    }

  }

}

