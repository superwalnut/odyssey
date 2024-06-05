import { Component, OnInit } from "@angular/core";
import { Credit } from "../../models/credit";
import { User } from "../../models/user";
import { Account } from "../../models/account";

import { CreditService } from "../../services/credit.service";
import { AccountService } from "../../services/account.service";
import { BookingPersonService } from "../../services/booking-person.service";
import { GlobalConstants } from "../../common/global-constants";
import { environment } from "../../../environments/environment";

@Component({
  templateUrl: "dashboard.component.html",
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

  constructor(
    private accountService: AccountService,
    private creditService: CreditService,
    private bookingPersonService: BookingPersonService
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
  }

  ngOnInit(): void {
    this.getUserDetails();
    this.getCreditBalance();
    this.getAttendanceCount();
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
