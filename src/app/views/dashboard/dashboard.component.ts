import { Component, OnInit } from "@angular/core";
import { AccountService } from "../../services/account.service";

@Component({
  templateUrl: "dashboard.component.html",
})
export class DashboardComponent implements OnInit {
  isGod: boolean;
  isAdmin: boolean;
  isUser: boolean;
  show: boolean = true;

  constructor(private accountService: AccountService) {
    this.isGod = this.accountService.isGod();
    this.isAdmin = this.accountService.isAdmin();
    this.isUser = !this.isGod && !this.isAdmin;
    console.log(this.isUser);
  }

  ngOnInit(): void {}
}
