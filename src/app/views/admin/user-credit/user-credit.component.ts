import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";
import { Credit } from "../../../models/credit";
import { User } from "../../../models/user";
import { AccountService } from "../../../services/account.service";
import { CreditService } from "../../../services/credit.service";
import { Account } from "../../../models/account";

@Component({
  selector: "app-user-credit",
  templateUrl: "./user-credit.component.html",
  styleUrls: ["./user-credit.component.scss"],
})
export class UserCreditComponent implements OnInit {
  userDocId: string;
  user: User;
  balance: number = 0;

  form: FormGroup;
  submitted = false;

  loggedInUser: Account;

  constructor(
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private creditService: CreditService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      amount: [null, [Validators.required]],
      note: ["", Validators.required],
    });

    this.loggedInUser = this.accountService.getLoginAccount();

    this.userDocId = this.activatedRoute.snapshot.params.id;
    if (this.userDocId) {
      this.accountService.getUserByDocId(this.userDocId).subscribe((x) => {
        console.log(x);
        this.user = x;
      });

      this.creditService.getBalance(this.userDocId).subscribe((x) => {
        if (x) {
          this.balance = x;
        }
      });
    }
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      console.log("form invalid");
      return;
    }

    console.log("register", this.form);

    var credit = {
      amount: this.form.value.amount,
      note: this.form.value.note,
      userDocId: this.userDocId,
      userDisplayName: this.user.name,
    } as Credit;

    this.creditService
      .createCredit(credit, this.balance, this.loggedInUser.docId, this.loggedInUser.name)
      .then((x) => {
        this.snackBar.open(`Your account settings have been updated.`, null, {
          duration: 5000,
          verticalPosition: "top",
        });
      });
  }
}
