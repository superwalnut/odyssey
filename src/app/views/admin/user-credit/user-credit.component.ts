import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";
import { Credit } from "../../../models/credit";
import { User } from "../../../models/user";
import { AccountService } from "../../../services/account.service";
import { CreditService } from "../../../services/credit.service";
import { Account } from "../../../models/account";
import { MailgunService } from "../../../services/mailgun.service";
import { GlobalConstants } from "../../../common/global-constants";

@Component({
  selector: "app-user-credit",
  templateUrl: "./user-credit.component.html",
  styleUrls: ["./user-credit.component.scss"],
})
export class UserCreditComponent implements OnInit {
  userDocId: string;
  user: User;
  balance: number = 0;
  categories:string[]=[];
  form: FormGroup;
  submitted = false;
  loggedInUser: Account;
  credits: Credit[];
  isLoading:boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private creditService: CreditService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private mailService: MailgunService,
  ) { }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      amount: ['', [Validators.required]],
      category: ['', [Validators.required]],
      note: ["", Validators.required],
    });

    this.categories = [
      GlobalConstants.creditCategoryBadminton,
      GlobalConstants.creditCategoryDividend,
      GlobalConstants.creditCategoryTopup,
      GlobalConstants.creditCategoryRefund,
      GlobalConstants.creditCategoryReward,
      GlobalConstants.creditCategoryPromo,
      GlobalConstants.creditCategoryCashout,
      GlobalConstants.creditCategoryAdjustment,
      GlobalConstants.creditCategoryOther
    ];

    this.loggedInUser = this.accountService.getLoginAccount();

    this.userDocId = this.activatedRoute.snapshot.params.id;
    if (this.userDocId) {
      this.accountService.getUserByDocId(this.userDocId).subscribe((x) => {
        console.log(x);
        this.user = x;
      });

      this.getUserCreditHistory();
      this.creditService.getBalance(this.userDocId).subscribe((x) => {
        if (x) {
          this.balance = x;
        }
      });
    }
  }

  getUserCreditHistory() {
    this.creditService.getByUser(this.userDocId).subscribe(result => {
      this.credits = result;
      console.log(result)
    })
  }
  onSubmit() {
    this.submitted = true;
    this.isLoading = true;
    if (this.form.invalid) {  return;  }

    console.log("register", this.form);

    var credit = {
      amount: this.form.value.amount,
      category: this.form.value.category,
      note: this.form.value.note,
      userDocId: this.userDocId,
      userDisplayName: this.user.name,
      createdBy: this.loggedInUser.docId,
      createdByDisplayName: this.loggedInUser.name,
    } as Credit;

    this.creditService.createCredit(credit).then(x => {
      this.mailService.sendTopupSucceed(this.user.email, this.user.name, credit.amount);
      if (!this.user.isCreditUser && credit.amount >= 100) {
        this.user.isCreditUser = true;
        this.accountService.updateUser(this.userDocId, this.user);
      }
      this.isLoading = false;
    });
  }
}
