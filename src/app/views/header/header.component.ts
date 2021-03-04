import { Component, OnInit } from "@angular/core";
import { AccountService } from "../../services/account.service";

@Component({
  selector: "app-public-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean;
  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.isLoggedIn =
      this.accountService.getLoginAccount() != null ? true : false;
    console.log("isLoggedIn: " + this.isLoggedIn);
  }
}
