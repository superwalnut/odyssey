import { Component, OnInit } from "@angular/core";
import { BookingPersonService } from "../../services/booking-person.service";
import { BaseComponent } from '../base-component';
import { AccountService } from '../../services/account.service';
import { Account } from '../../models/account';
import { BookingPerson } from "../../models/booking-person";
import { HelperService } from '../../common/helper.service';
import { GroupService } from '../../services/group.service';
import { Group } from "../../models/group";
import { Booking } from "../../models/booking";

import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;
import { environment } from "../../../environments/environment";
import { cibLinuxFoundation } from "@coreui/icons";
import { BookingsService } from '../../services/bookings.service';
import { combineLatest } from "rxjs";


@Component({
  selector: "app",

  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent extends BaseComponent implements OnInit {
  show: boolean = true;
  loggedInAccount: Account;
  isLoggedIn: boolean;
  myCurrentWeekBookings: BookingPerson[];
  weekStart: Timestamp;
  hasBooking:boolean;

  myBookings:MyBooking[]=[];

  domain:string=environment.domain;

  constructor(private bookingService:BookingsService, private bookingPersonService: BookingPersonService, private accountService: AccountService, private groupService: GroupService, private helperService: HelperService) { super() }

  ngOnInit(): void {
    //this.getAllGroups();
    this.loggedInAccount = this.accountService.getLoginAccount();
    this.isLoggedIn = this.loggedInAccount.docId != null;

    let dateRange = this.helperService.findDateRangeOfCurrentWeek(new Date());
    this.weekStart = this.helperService.convertToTimestamp(dateRange.firstday);

    if (this.isLoggedIn) {
      this.getMyCurrentWeekBookings();
    }

  }

  // getAllGroups() {
  //   this.groupService.getGroups().subscribe(gs => {
  //     this.groups = gs;
  //     console.log('groups ', gs)
  //   })
  // }


  // getGroupsAndCurrentBookings() {
  //   let getGroups = this.groupService.getGroups();
  //   let getCurrentWeekBookings = this.bookingService.getCurrentWeekBooking();
  //   combineLatest([getGroups, getCurrentWeekBookings]).subscribe(result => {
  //     console.log('forkjoin 1: ', result[0]);
  //     console.log('forkJoin 2: ', result[1]);
  //     this.groups = result[0];
  //     this.bookings = result[1];
  //   })
  // }

  getMyCurrentWeekBookings() {

    let getCurrentWeekBookings = this.bookingService.getCurrentWeekBooking();
    let getMyCurrentWeekBookings = this.bookingPersonService.getCurrentWeekByUserDocId(this.loggedInAccount.docId);
    combineLatest([getCurrentWeekBookings, getMyCurrentWeekBookings]).subscribe(result=>{
      console.log('forkjoin 1: ', result[0]);
      console.log('forkJoin 2: ', result[1]);
      this.renderMyBookings(result[0], result[1])
    });

    // this.bookingPersonService.getCurrentWeekByUserDocId(this.loggedInAccount.docId).subscribe(result => {
    //   console.log(result)
    //   this.myCurrentWeekBookings = result.filter(x => x != null);
    //   this.getMyBookings();
    //   this.hasBooking = result.length > 0;
    //   console.log("xxxxx",this.myCurrentWeekBookings.length)

    // })
  }

  renderMyBookings(bookings:Booking[], myBookings:BookingPerson[]) {

    this.myBookings=[];
    console.log('all bookings', bookings);
    console.log('my bookings', myBookings);

    var b1 = { weekDay:'TUESDAY', displayText:'TUE 8-11PM'} as MyBooking;
    var b2 = { weekDay:'FRIDAY', displayText:'FRI 8-11PM'} as MyBooking;
    var b3 = { weekDay:'SATURDAY', displayText:'SAT 5-8PM'} as MyBooking;
    this.myBookings.push(b1)
    this.myBookings.push(b2)
    this.myBookings.push(b3)

    this.myBookings.forEach(b=>{
      let foundBooking = bookings.find(x=> b.weekDay.toLowerCase().includes(x.weekDay.toLowerCase()));
      console.log('foundBooking', foundBooking);

      if (foundBooking) {
        b.bookingDocId = foundBooking.docId;
        b.groupDocId =  foundBooking.groupDocId;
  
        let found = myBookings.filter(x=> x!=null && x.bookingDocId == b.bookingDocId);
        if (found.length>0) {
          b.bookingPersons = found;
        }
      }
      
    })

    console.log(this.myBookings)

  }
}


export class MyBooking {
  weekDay:string;
  displayText:string;
  bookingDocId:string;
  groupDocId:string;
  bookingPersons:BookingPerson[];

}