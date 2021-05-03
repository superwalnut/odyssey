import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { Observable } from 'rxjs';
import { filter, map, mergeMap, startWith, take } from 'rxjs/operators';

import { BaseComponent } from '../../base-component';
import { AccountService } from '../../../services/account.service';
import { CreditService } from '../../../services/credit.service';

import { Account } from '../../../models/account';
import { User } from '../../../models/user';
import { Credit } from '../../../models/credit';
import { GlobalConstants } from '../../../common/global-constants';


@Component({
  selector: 'app-cointransfer',
  templateUrl: './cointransfer.component.html',
  styleUrls: ['./cointransfer.component.scss']
})
export class CointransferComponent extends BaseComponent implements OnInit {
  loggedInAccount: Account;
  recipientValid: boolean = true;
  myControl = new FormControl();
  filteredUsers: Observable<string[]>;
  allUsers: string[] = [];
  allUsersObject: User[];
  form: FormGroup;
  isLoading:boolean;
  confirmClicked:boolean;
  fromCredit:Credit;
  toCredit:Credit;
  transferClicked:boolean;
  transferSuccess:boolean;
  balance:number;


  constructor(private fb: FormBuilder, private accountService:AccountService, private creditService:CreditService) { super() }

  ngOnInit(): void {
    this.loggedInAccount = this.accountService.getLoginAccount();
    this.getMyCreditBalance();

    this.filteredUsers = this.myControl.valueChanges
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
      //recipient: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01), Validators.max(100)]],
      notes: ["", Validators.required],
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

  getMyCreditBalance() {
    this.creditService.getUserBalance(this.loggedInAccount.docId, this.loggedInAccount.name).subscribe(result=>{
      this.balance = result.balance;

    });
  }

  confirm(mycontrol) {

    if (mycontrol.value == null) {
      this.recipientValid = false;
      return false;
    }

    var selectedUser = this.allUsersObject.find(x=>x.name.toLowerCase() == mycontrol.value.toLowerCase());

    if (selectedUser == null) { 
      this.recipientValid = false;
      return false;
    }

    if (this.form.value.amount <= 0) {
      alert("Amount must be greater than 0 and less than 100");
      return false;
    }

    if (this.form.value.amount >= this.balance) {
      alert("You don't have enough HBCoins for this transfer.");
      return false;
    }



    if (selectedUser.parentUserDocId) {
      //error, this account is not a main account
      alert("This is a family member account, you must select a main account to transfer");
      return false;
    }

    if (!selectedUser.isCreditUser) {
      alert("This is an HBCoin user, transfer is only supported between HBCoin users");
      return false;
    }

    this.confirmClicked = true;



    console.log(selectedUser)
    this.toCredit = {
      userDisplayName: selectedUser.name,
      userDocId: selectedUser.docId,
      category: GlobalConstants.creditCategoryUserTransfer,
      amount: this.form.value.amount,
      note: this.form.value.notes,
    } as Credit;

    this.fromCredit = {
      userDisplayName: this.loggedInAccount.name,
      userDocId: this.loggedInAccount.docId,
      category: GlobalConstants.creditCategoryUserTransfer,
      amount: this.form.value.amount,
      note: this.form.value.notes,
    } as Credit;
  }

  transferCancel() {
    this.confirmClicked = false;
  }

  transfer() {
    console.log(this.fromCredit);
    console.log(this.toCredit);

    if (!this.transferValidation()) {
      alert("asfd");
      return false;
    }
    this.isLoading = true;
    this.transferClicked = true;

    this.creditService.userCreditTransfer(this.fromCredit, this.toCredit)
    .then(() => {
      this.transferSuccess = true;
      this.isLoading = false;
    })
    .catch((err) => { 
      this.transferSuccess = false;
      alert(err) ;
      
      this.isLoading = false;
    })


  }

  transferValidation() {
    var isValid = true;

    if (this.fromCredit === undefined || this.toCredit === undefined) {
      isValid = false;
      return false;
    }

    if (!this.fromCredit.userDocId || !this.fromCredit.amount || !this.fromCredit.note) {
      isValid = false;
      return false;
    }

    if (!this.toCredit.userDocId || !this.toCredit.amount || !this.toCredit.note) {
      isValid = false;
      return false;
    }

    if (this.fromCredit.amount <= 0) {
      isValid = false;
      return false;
    }

    return isValid;
  }


}
