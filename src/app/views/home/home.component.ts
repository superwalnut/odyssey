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
      this.myCurrentWeekBookings = result.filter(x => x != null);
      this.hasBooking = result.length > 0;
      console.log("xxxxx",this.myCurrentWeekBookings.length)

    })
  }
}
