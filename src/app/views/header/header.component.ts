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
    const account = this.accountService.getLoginAccount();
    this.isLoggedIn = account && account.docId ? true : false;
    console.log("isLoggedIn: " + this.isLoggedIn);
  }
}
