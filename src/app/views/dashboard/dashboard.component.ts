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
  show: boolean = true;
  loggedInUser:Account;
  myCreditBalance:number;
  myAttendanceCount:number;

  constructor(private accountService: AccountService, private creditService:CreditService, private bookingPersonService:BookingPersonService) {
    this.isGod = this.accountService.isGod();
    this.isAdmin = this.accountService.isAdmin();
    this.isUser = !this.isGod && !this.isAdmin;
    this.loggedInUser = this.accountService.getLoginAccount();

    console.log("isuser: ", this.isUser);
    console.log("isgod: ", this.isGod);
  }

  ngOnInit(): void {
    this.getCreditBalance();
    this.getAttendanceCount();
  }

  getCreditBalance() {
    this.creditService.getBalance(this.loggedInUser.docId).subscribe(balance=>{
      this.myCreditBalance = balance;
    })
  }

  getAttendanceCount(){
    this.bookingPersonService.getByUserDocId(this.loggedInUser.docId).subscribe(x=> {
      this.myAttendanceCount = x.length;
    })
  }
}
