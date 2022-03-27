import { Component, OnInit } from '@angular/core';
import { Group } from "../../models/group";
import { GroupService } from "../../services/group.service";
import { BookingsService } from "../../services/bookings.service";
import { HelperService } from "../../common/helper.service";
import { BookingScheduleService } from "../../services/booking-schedule.service";
import { BookingSchedule } from "../../models/booking-schedule";
import { AccountService } from "../../services/account.service";
import { Account } from "../../models/account";
import { BaseComponent } from '../base-component';
import { concatMap, shareReplay, switchMap, take } from 'rxjs/operators';
import { textSpanIntersectsWithTextSpan } from 'typescript';
import { combineLatest } from 'rxjs';
import { Booking } from '../../models/booking';
import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent extends BaseComponent implements OnInit {

  groups: Group[];
  bookings: Booking[];
  seatsLimit: number;
  groupBookings: GroupBooking[] = [];
  weekStart: Timestamp;
  weekEnd: Timestamp;
  //mySchedules: BookingSchedule[];
  loggedInAccount: Account;
  isLoggedIn: boolean;


  constructor(private groupService: GroupService, private bookingService: BookingsService, private accountService: AccountService, private bookingScheduleService: BookingScheduleService, private router: Router, private helperService: HelperService) { super() }

  ngOnInit(): void {
    this.loggedInAccount = this.accountService.getLoginAccount();
    this.isLoggedIn = this.loggedInAccount && this.loggedInAccount.docId ? true : false;

    let dateRange = this.helperService.findDateRangeOfCurrentWeek(new Date());
    this.weekStart = this.helperService.convertToTimestamp(dateRange.firstday);
    this.weekEnd = this.helperService.convertToTimestamp(dateRange.lastday);
    this.getGroupsAndCurrentBookings();
    //this.getGroupName()
    // if (this.isLoggedIn) {
    //   this.getMySchedules();
    // }
    console.log('bookings.....', this.bookings[0]);
  }

  getGroupName(groupDocId: string) {
    var g = this.groups.find(x => x.docId == groupDocId);
    this.seatsLimit = g.seats;
    return g.groupName;
  }

  getGroupDesc(groupDocId: string) {
    var g = this.groups.find(x => x.docId == groupDocId);
    this.seatsLimit = g.seats;
    return g.groupDesc;
  }
  getGroupsAndCurrentBookings() {
    let getGroups = this.groupService.getGroups();
    let getCurrentWeekBookings = this.bookingService.getCurrentWeekBooking();
    combineLatest([getGroups, getCurrentWeekBookings]).subscribe(result => {
      console.log('forkjoin 1: ', result[0]);
      console.log('forkJoin 2: ', result[1]);
      this.groups = result[0];
      this.bookings = result[1];

      if (this.bookings.length == 0) {
        console.log('bookings if offline');
        this.router.navigateByUrl('offline');
      }
      
    })
  }

  getMySchedules() {
    this.bookingScheduleService.getMyBookingSchedules(this.loggedInAccount.docId).subscribe(schedules => {
      //this.mySchedules = schedules;
      
    })
  }

  getExpiryStatus(schedule: BookingSchedule) {
    var expireOn = schedule.expireOn;
    if (expireOn < Timestamp.now()) {
      return 'Expired';
    }

    //{{ s.isPaused ? 'Paused' : 'Active' }}
    if (schedule.isPaused) {
      return 'Paused';
    }
    return 'Active';
  }

}



export class GroupBooking {
  groupDocId: string;
  currentBookingDocId: string;
  groupName: string;
  groupDesc: string;

}

