import { Component, OnInit } from "@angular/core";
import { Credit } from "../../models/credit";
import { User } from "../../models/user";
import { Account } from "../../models/account";

import { CreditService } from "../../services/credit.service";
import { AccountService } from "../../services/account.service";

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

  constructor(private accountService: AccountService, private creditService:CreditService) {
    this.isGod = this.accountService.isGod();
    this.isAdmin = this.accountService.isAdmin();
    this.isUser = !this.isGod && !this.isAdmin;
    this.loggedInUser = this.accountService.getLoginAccount();

    console.log("isuser: ", this.isUser);
    console.log("isgod: ", this.isGod);
  }

  ngOnInit(): void {
    this.getCreditBalance();
  }

  getCreditBalance() {
    this.creditService.getBalance(this.loggedInUser.docId).subscribe(balance=>{
      this.myCreditBalance = balance;
    })
  }
}
