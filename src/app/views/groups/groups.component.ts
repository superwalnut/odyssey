import { Component, OnInit } from '@angular/core';
import { Group } from "../../models/group";
import { GroupService } from "../../services/group.service";
import { BookingsService } from "../../services/bookings.service";
import { HelperService } from "../../common/helper.service";

import { BaseComponent } from '../base-component';
import { concatMap, shareReplay, switchMap, take } from 'rxjs/operators';
import { textSpanIntersectsWithTextSpan } from 'typescript';
import { combineLatest } from 'rxjs';
import { Booking } from '../../models/booking';
import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;

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


  constructor(private groupService: GroupService, private bookingService: BookingsService, private helperService: HelperService) { super() }

  ngOnInit(): void {
    let dateRange = this.helperService.findDateRangeOfCurrentWeek(new Date());
    this.weekStart = this.helperService.convertToTimestamp(dateRange.firstday);
    this.weekEnd = this.helperService.convertToTimestamp(dateRange.lastday);



    this.getGroupsAndCurrentBookings();
    console.log('bookings.....', this.bookings);

  }

  getGroupName(groupDocId: string) {
    var g = this.groups.find(x => x.docId == groupDocId);
    this.seatsLimit = g.seats;
    return g.groupName;
  }

  getGroupDesc(groupDocId: string) {
    var g = this.groups.find(x => x.docId == groupDocId);
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
    })



  }
}



export class GroupBooking {
  groupDocId: string;
  currentBookingDocId: string;
  groupName: string;
  groupDesc: string;

}

