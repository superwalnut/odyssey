import { Component, OnInit } from "@angular/core";
import { Credit } from "../../models/credit";
import { User } from "../../models/user";
import { Account } from "../../models/account";

import { CreditService } from "../../services/credit.service";
import { AccountService } from "../../services/account.service";
import { BookingPersonService } from "../../services/booking-person.service";


@Component({
  templateUrl: "dashboard.component.html",
})
export class DashboardComponent implements OnInit {
  isGod: boolean;
  isAdmin: boolean;
  isUser: boolean;
  user: User;
  show: boolean = true;
  loggedInUser:Account;
  myCreditBalance:number;
  myAttendanceCount:number;
  creditImageSrc:string;
  avatarUrl:string;
  isBalanceMasked: boolean = false;
  showDetail: boolean;
  
  constructor(private accountService: AccountService, private creditService:CreditService, private bookingPersonService:BookingPersonService) {
    this.isGod = this.accountService.isGod();
    this.isAdmin = this.accountService.isAdmin();
    this.isUser = !this.isGod && !this.isAdmin;
    var acc = this.accountService.getLoginAccount();

    this.getUserAvatar(acc);

    this.loggedInUser = this.accountService.getLoginAccount();
    //this.avatarUrl = "assets/img/avatars/avatardefault.jpg";
    console.log("isuser: ", this.isUser);
    console.log("isgod: ", this.isGod);
  }

  ngOnInit(): void {
    this.getUserDetails();
    this.getCreditBalance();
    this.getAttendanceCount();
  }

  getUserAvatar(acc:Account) {
    this.accountService.getUserByDocId(acc.docId).subscribe(user=>{
      if (user.avatarUrl) {
        this.avatarUrl = user.avatarUrl;
      }
      else {
        this.avatarUrl = "assets/img/avatars/avatardefault.jpg";
      }
    });
  }

  getCreditBalance() {
    this.creditService.getBalance(this.loggedInUser.docId).subscribe(balance=>{
      this.myCreditBalance = balance;
    })
  }

  getUserDetails() {
    this.accountService.getUserByDocId(this.loggedInUser.docId).subscribe(u=>{
      this.user = u;
      this.creditImageSrc = u.isCreditUser ? "./assets/img/banners/HBCoin.png" : "./assets/img/banners/HBCredit.jpg";
      console.log(this.user);
    })
  }

  getAttendanceCount(){
    this.bookingPersonService.getByUserDocId(this.loggedInUser.docId).subscribe(x=> {
      this.myAttendanceCount = x.length;
    })
  }
}
