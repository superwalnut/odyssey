import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { Observable } from 'rxjs';
import { filter, map, mergeMap, startWith, take } from 'rxjs/operators'
import { GlobalConstants } from "../../../common/global-constants";
import { MailgunService } from "../../../services/mailgun.service";
import { Credit } from "../../../models/credit";
import { User } from "../../../models/user";
import { AccountService } from "../../../services/account.service";
import { CreditService } from "../../../services/credit.service";
import { Account } from "../../../models/account";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-batchpayment',
  templateUrl: './batchpayment.component.html',
  styleUrls: ['./batchpayment.component.scss']
})
export class BatchpaymentComponent implements OnInit {
  filteredUsers: Observable<string[]>;
  allUsers: string[] = [];
  allUsersObject: User[];
  form: FormGroup;
  loggedInUser: Account;
  isLoading:boolean;
  creditBatch: Credit[]=[];
  recipientControl = new FormControl();
  hasError:boolean;
  totalAmount: number = 0;

  categories = [
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

  constructor(private accountService: AccountService, private fb: FormBuilder,private snackBar: MatSnackBar, private mailService: MailgunService,private creditService: CreditService,) { }

  ngOnInit(): void {
    this.loggedInUser = this.accountService.getLoginAccount();
    this.filteredUsers = this.recipientControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

    this.accountService.getAllUsers().subscribe((x) => {
      this.allUsersObject = x;
      x.forEach(u => {
        if (u && u.parentUserDocId == null && u.isCreditUser) { this.allUsers.push(u.name); }
      })
    });

    this.form = this.fb.group({
      category: ['Reward', [Validators.required]],
      amount: ['', [Validators.required]],
      note: ["", Validators.required],
      sendEmail: [],
    });
  }

  onAddBatch(recipientControl) {
    if (this.form.invalid) {  return;  }
    var selectedUser = this.allUsersObject.find(x=>x.name.toLowerCase() == recipientControl.value.toLowerCase());

    if (selectedUser == null) { 
      this.hasError = true;
      return false;
    }
    console.log(selectedUser);

    var credit = {
      amount: this.form.value.amount,
      category: this.form.value.category,
      note: this.form.value.note,
      userDocId: selectedUser.docId,
      userDisplayName: selectedUser.name,
      createdBy: this.loggedInUser.docId,
      createdByDisplayName: this.loggedInUser.name,
    } as Credit;

    const isSendingEmail = this.form.value.sendEmail;
    this.creditBatch.push(credit);
    this.calcTotal();
  }

  
  remove(credit:Credit) {

    this.creditBatch.forEach((item,index)=>{
      if (item == credit) {
        console.log("found ")
        this.creditBatch.splice(index, 1);

      }
    });
    this.calcTotal();

  }

  calcTotal() {
    this.totalAmount = 0;
    this.creditBatch.forEach(item=>{
      this.totalAmount += item.amount;
    })
  }

  processBatch() {
    var fromAccount = this.allUsersObject.find(x=>x.name.toLowerCase() == "Credit Reserve".toLowerCase());
    if (fromAccount == null) {
      alert("from account cannot be found!");
      return false;
    }
    var sendEmail = this.form.value.sendEmail;

    console.log(fromAccount)
    console.log(this.creditBatch);

    this.isLoading = true;
    this.creditService.creditTransferBatch(fromAccount, this.creditBatch, this.loggedInUser)
    .then(() => {
      if (sendEmail) {
        this.sendBatchEmails();
      }
      this.snackBar.open(`Batch credit transfer successful.`, null, {
        duration: 5000,
        verticalPosition: "top",
      });
      this.isLoading = false;
    })
    .catch((err) => { alert(err); this.isLoading = false; })
  }

  sendBatchEmails(){
    this.creditBatch.forEach(item=>{
      var found = this.allUsersObject.find(x=>x.docId == item.userDocId);
      if (found) {
        this.mailService.sendTopupSucceed(found.email, item.userDisplayName, item.amount);
        console.log(found);
      }
    });
    
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    console.log(filterValue);
    return this.allUsers.filter(option => option.toLowerCase().includes(filterValue));
  }

  get f() {
    return this.form.controls;
  }

}
