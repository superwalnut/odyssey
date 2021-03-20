import { Component, OnInit } from '@angular/core';
import { Group } from "../../models/group";
import { GroupService } from "../../services/group.service";
import { BookingsService } from "../../services/bookings.service";
import { BaseComponent } from '../base-component';
import { concatMap, shareReplay, switchMap, take } from 'rxjs/operators';
import { textSpanIntersectsWithTextSpan } from 'typescript';
import { combineLatest } from 'rxjs';
import { Booking } from '../../models/booking';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent extends BaseComponent implements OnInit {

  groups:Group[];
  bookings:Booking[];

  groupBookings:GroupBooking[]=[];
  //groupIds:string[]=["Dmpgn7MWD5BhR40xTEPG", "Q1tO8IGOJmavSMFYkZbi", "m1RjIA1IfoDuxq00XqRk"];


  constructor(private groupService:GroupService, private bookingService: BookingsService) { super() }

  ngOnInit(): void {
    this.getGroupsAndCurrentBookings();
    console.log('bookings.....', this.bookings);
  }

  getGroupName(groupDocId:string) {
    var g = this.groups.find(x=>x.docId == groupDocId);
    return g.groupName;
  }

  getGroupDesc(groupDocId:string) {
    var g = this.groups.find(x=>x.docId == groupDocId);
    return g.groupDesc;
  }
  getGroupsAndCurrentBookings() {
    let getGroups = this.groupService.getGroups();
    let getCurrentWeekBookings = this.bookingService.getCurrentWeekBooking();

    combineLatest([getGroups, getCurrentWeekBookings]).subscribe(result=> {
      console.log('forkjoin 1: ', result[0]);
      console.log('forkJoin 2: ', result[1]);
      this.groups = result[0];
      this.bookings = result[1];

      // result[0].forEach(g=>{
      //   let b = result[1].find(x=>x.groupDocId == g.docId);
      //   var gb = {
      //     groupDocId: g.docId,
      //     currentBookingDocId: b.docId,
      //     groupName: g.groupName,
      //     groupDesc: g.groupDesc,
      //   } as GroupBooking;
      //   this.groupBookings.push(gb);
      //})

      // this.bookings.forEach(x=>{
      //   console.log(x)
      //   var gb = {
      //         groupDocId: x.groupDocId,
      //         currentBookingDocId: x.docId,
      //         //groupName: g.groupName,
      //         //groupDesc: g.groupDesc,
      //       } as GroupBooking;
      //       this.groupBookings.push(gb);
      //     })

      })



    }
  }



export class GroupBooking {
  groupDocId:string;
  currentBookingDocId: string;
  groupName: string;
  groupDesc: string;
  
}

