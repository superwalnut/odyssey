import { Component, OnInit } from "@angular/core";
import { BookingPersonService } from "../../services/booking-person.service";
import { BaseComponent } from '../base-component';
import { AccountService } from '../../services/account.service';
import { Account } from '../../models/account';
import { BookingPerson } from "../../models/booking-person";
import { HelperService } from '../../common/helper.service';
import { GroupService } from '../../services/group.service';
import { Group } from "../../models/group";
import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;
import { environment } from "../../../environments/environment";
import { cibLinuxFoundation } from "@coreui/icons";


@Component({
  selector: "app",

  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent extends BaseComponent implements OnInit {
  show: boolean = true;
  loggedInAccount: Account;
  groups: Group[];
  isLoggedIn: boolean;
  myCurrentWeekBookings: BookingPerson[];
  weekStart: Timestamp;
  hasBooking:boolean;

  myBookings:MyBooking[]=[];

  domain:string=environment.domain;

  constructor(private bookingPersonService: BookingPersonService, private accountService: AccountService, private groupService: GroupService, private helperService: HelperService) { super() }

  ngOnInit(): void {
    this.getAllGroups();
    this.loggedInAccount = this.accountService.getLoginAccount();
    this.isLoggedIn = this.loggedInAccount.docId != null;

    let dateRange = this.helperService.findDateRangeOfCurrentWeek(new Date());
    this.weekStart = this.helperService.convertToTimestamp(dateRange.firstday);

    if (this.isLoggedIn) {
      this.getMyCurrentWeekBookings();
    }

  }

  getAllGroups() {
    this.groupService.getGroups().subscribe(gs => {
      this.groups = gs;
      console.log('groups ', gs)
    })
  }

  getMyCurrentWeekBookings() {
    console.log("getMyCurrentWeekBookings");
    this.bookingPersonService.getCurrentWeekByUserDocId(this.loggedInAccount.docId).subscribe(result => {
      console.log(result)
      this.myCurrentWeekBookings = result.filter(x => x != null);
      this.getMyBookings();
      this.hasBooking = result.length > 0;
      console.log("xxxxx",this.myCurrentWeekBookings.length)

    })
  }

  getMyBookings() {
    var b1 = { weekDay:'TUESDAY', displayText:'TUE 8-11PM'} as MyBooking;
    var b2 = { weekDay:'FRIDAY', displayText:'FRI 8-11PM'} as MyBooking;
    var b3 = { weekDay:'SATURDAY', displayText:'SAT 5-8PM'} as MyBooking;
    this.myBookings.push(b1)
    this.myBookings.push(b2)
    this.myBookings.push(b3)

    this.myBookings.forEach(b=>{
      let found = this.myCurrentWeekBookings?.filter(x=>x.bookingDesc.toLowerCase().includes(b.weekDay.toLowerCase()));
      if (found.length>0) {
        b.bookingPersons = found;
        b.bookingDocId = found[0].bookingDocId;
        b.groupDocId = found[0].groupDocId;
      }
    })

  }
}

export class MyBooking {
  weekDay:string;
  displayText:string;
  bookingDocId:string;
  groupDocId:string;
  bookingPersons:BookingPerson[];

}