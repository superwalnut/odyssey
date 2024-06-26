import { Component, OnInit } from "@angular/core";
import { User } from "../../models/user";
import { Account } from "../../models/account";

import { CreditService } from "../../services/credit.service";
import { AccountService } from "../../services/account.service";
import { BookingPersonService } from "../../services/booking-person.service";
import { GlobalConstants } from "../../common/global-constants";
import { environment } from "../../../environments/environment";
import { MyBooking } from "../../models/my-booking";
import { GroupService } from "../../services/group.service";
import { BookingsService } from "../../services/bookings.service";
import { combineLatest } from 'rxjs';
import { Group } from "../../models/group";
import { Booking } from "../../models/booking";
import { Router } from "@angular/router";
import { HelperService } from "../../common/helper.service";
import { BookingPerson } from "../../models/booking-person";

@Component({
  selector: 'app-dashboard',
  templateUrl: "./dashboard.component.html",
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isGod: boolean;
  isAdmin: boolean;
  isUser: boolean;
  user: User;
  show: boolean = true;
  loggedInUser: Account;
  myCreditBalance: number;
  myAttendanceCount: number;
  creditImageSrc: string;
  avatarUrl: string;
  isBalanceMasked: boolean = false;
  showDetail: boolean;

  memberTopup50 = environment.payments.memberTopup50;
  memberTopup100 = environment.payments.memberTopup100;
  memberTopup170 = environment.payments.memberTopup170;
  memberTopup300 = environment.payments.memberTopup300;
  showTopup: boolean = false;
  myBookings:MyBooking[] = [];
  
  groups: Group[];
  bookings: Booking[];
  upcomingBooking: Booking;
  countdown:string;

  lastPlayedDays: number;

  constructor(
    private accountService: AccountService,
    private creditService: CreditService,
    private bookingPersonService: BookingPersonService,
    private groupService: GroupService, 
    private bookingService: BookingsService,
    private router: Router,
    private helper:HelperService
  ) {
    this.isGod = this.accountService.isGod();
    console.log("am i god? ", this.isGod);
    this.isAdmin = this.accountService.isAdmin();
    this.isUser = !this.isGod && !this.isAdmin;
    var acc = this.accountService.getLoginAccount();

    this.getUserAvatar(acc);

    this.loggedInUser = this.accountService.getLoginAccount();
    // this.avatarUrl = "assets/img/avatars/avatardefault-mario.jpg";
    this.avatarUrl = GlobalConstants.imageDefaultAvatar;
    console.log("isuser: ", this.isUser);
    console.log("isgod: ", this.isGod);

    this.memberTopup50 = `${environment.payments.memberTopup50}?prefilled_email=${this.loggedInUser.email}`;
    this.memberTopup100 = `${environment.payments.memberTopup100}?prefilled_email=${this.loggedInUser.email}`;;
    this.memberTopup170 = `${environment.payments.memberTopup170}?prefilled_email=${this.loggedInUser.email}`;;
    this.memberTopup300 = `${environment.payments.memberTopup300}?prefilled_email=${this.loggedInUser.email}`;;
  }

  ngOnInit(): void {
    this.getUserDetails();
    this.getCreditBalance();
    this.getAttendanceCount();
    this.getGroupsAndCurrentBookings();
    this.getUserLastBooking();
  }

  getUserLastBooking() {
    this.bookingPersonService.getUserLastBooking(this.loggedInUser.docId).subscribe((x) => {
      console.log('last booking: ', x);
      if(x){
        const lastPlayedDate = x.createdOn.toDate();
        this.lastPlayedDays = this.helper.calculateDiffFromToday(lastPlayedDate);
        console.log('last played days: ', this.lastPlayedDays);
      }
    });
  }

  getGroupsAndCurrentBookings() {
    let getGroups = this.groupService.getGroups();
    let getCurrentWeekBookings = this.bookingService.getCurrentWeekBooking();
    let getMyCurrentWeekBookings = this.bookingPersonService.getCurrentWeekByUserDocId(this.loggedInUser.docId);

    combineLatest([getGroups, getCurrentWeekBookings, getMyCurrentWeekBookings]).subscribe(result => {
      console.log('forkjoin 1: ', result[0]);
      console.log('forkJoin 2: ', result[1]);
      console.log('forkJoin 3: ', result[2])
      this.groups = result[0];
      this.bookings = result[1];

      if(result[2] != null && result[2].length > 0){
        const myBookingPersons = result[2];
        this.myBookings = myBookingPersons.map((x) => {
          const booking = this.bookings.find(b => b.docId == x.bookingDocId);
          const group = this.groups.find(g => g.docId == booking.groupDocId);
          var mb = new MyBooking();
          mb.bookingDocId = x.bookingDocId;
          mb.groupDocId = x.groupDocId;
          mb.displayText = x.bookingDesc;
          mb.bookingTitle = group?.groupName;
          mb.bookingDesc = group?.groupDesc;
          mb.eventDate = booking?.eventStartDateTime.toDate();
          return mb;
        });
      }

      if (this.bookings.length == 0) {
        console.log('bookings if offline');
      }

      this.upcomingBooking = this.bookings.find(x => x.eventStartDateTime.toDate() > new Date());

      this.update_countdown();
    });
  }

  getGroupName(groupDocId: string) {
    var g = this.groups.find(x => x.docId == groupDocId);
    return g.groupName;
  }

  getGroupDesc(groupDocId: string) {
    var g = this.groups.find(x => x.docId == groupDocId);
    return g.groupDesc;
  }

  sessionClicked(b: Booking) {
    this.router.navigateByUrl('/groups');
  }

  update_countdown(){
    setInterval(() => {
      this.countdown = this.time_countdown();
    }, 1000);
  }

  time_countdown(){
    const currentDate = new Date();
    const eventDate = this.helper.convertToDate(this.upcomingBooking.eventStartDateTime);
    const timeDifference = eventDate.getTime() - currentDate.getTime();
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    return formattedTime;
  }

  show_topup(){
    this.showTopup = !this.showTopup;
  }

  getUserAvatar(acc: Account) {
    this.accountService.getUserByDocId(acc.docId).subscribe((user) => {
      if (user.avatarUrl) {
        this.avatarUrl = user.avatarUrl;
      }
    });
  }

  getCreditBalance() {
    this.creditService
      .getBalance(this.loggedInUser.docId)
      .subscribe((balance) => {
        this.myCreditBalance = balance;
      });
  }

  getUserDetails() {
    this.accountService
      .getUserByDocId(this.loggedInUser.docId)
      .subscribe((u) => {
        this.user = u;
        console.log(this.user);
        this.creditImageSrc = u.isCreditUser
          ? "https://ik.imagekit.io/hbc666/hbc/banner/HBCoin_rbZzh3XHyd.png"
          : "https://ik.imagekit.io/hbc666/hbc/banner/HBCredit_qj2_LA3Pr.jpg";
      });
  }

  getAttendanceCount() {
    this.bookingPersonService
      .getByUserDocId(this.loggedInUser.docId)
      .subscribe((x) => {
        this.myAttendanceCount = x.length;
      });
  }
  clickDisable(e) {
    return false;
  }
}
