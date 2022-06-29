import { Component, OnInit } from "@angular/core";
import { HelperService } from "../../common/helper.service";
import { AccountService } from "../../services/account.service";
import { Account } from "../../models/account";
import { BaseComponent } from "../base-component";
import { concatMap, shareReplay, switchMap, take } from "rxjs/operators";
import { textSpanIntersectsWithTextSpan } from "typescript";
import firebase from "firebase/app";
import Timestamp = firebase.firestore.Timestamp;
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-ladder",
  templateUrl: "./ladder.component.html",
  styleUrls: ["./ladder.component.scss"],
})
export class LadderComponent extends BaseComponent implements OnInit {
  loggedInAccount: Account;
  isLoggedIn: boolean;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private helperService: HelperService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loggedInAccount = this.accountService.getLoginAccount();
    this.isLoggedIn =
      this.loggedInAccount && this.loggedInAccount.docId ? true : false;
  }
}
