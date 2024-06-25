import { Component, OnInit } from "@angular/core";
import { BookingPersonService } from "../../services/booking-person.service";
import { BaseComponent } from "../base-component";
import { AccountService } from "../../services/account.service";
import { Account } from "../../models/account";
import { BookingPerson } from "../../models/booking-person";
import { HelperService } from "../../common/helper.service";
import { GroupService } from "../../services/group.service";
import { Group } from "../../models/group";
import { Booking } from "../../models/booking";

import firebase from "firebase/app";
import Timestamp = firebase.firestore.Timestamp;
import { environment } from "../../../environments/environment";
import { cibLinuxFoundation } from "@coreui/icons";
import { BookingsService } from "../../services/bookings.service";
import { combineLatest } from "rxjs";
import { GlobalConstants } from "../../common/global-constants";
import { MyBooking } from "../../models/my-booking";

@Component({
  selector: "app",

  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent extends BaseComponent implements OnInit {

  hbcCoinRate:number = 17;
  hbcCashRate:number = 20;

  show: boolean = true;
  loggedInAccount: Account;
  isLoggedIn: boolean;
  myCurrentWeekBookings: BookingPerson[];
  weekStart: Timestamp;
  hasBooking: boolean;
  quotes: string;
  isChineseQuote: boolean;
  myBookings: MyBooking[] = [];
  domain: string = environment.domain;
  //enableAnnouncement = GlobalConstants.enableHeroAnouncement;
  showQuotesAndButton = GlobalConstants.showHeroQuotesAndButton;
  constructor(
    private bookingService: BookingsService,
    private bookingPersonService: BookingPersonService,
    private accountService: AccountService,
    private groupService: GroupService,
    private helperService: HelperService
  ) {
    super();
  }

  ngOnInit(): void {
    //this.getAllGroups();
    this.loggedInAccount = this.accountService.getLoginAccount();
    this.isLoggedIn = this.loggedInAccount.docId != null;

    let dateRange = this.helperService.findDateRangeOfCurrentWeek(new Date());
    this.weekStart = this.helperService.convertToTimestamp(dateRange.firstday);
  }

  getClassBasedOnLanguage(lang: string) {
    this.isChineseQuote = false;
    if (lang.match(/[\u3400-\u9FBF]/)) {
      this.isChineseQuote = true;
    }
  }
}