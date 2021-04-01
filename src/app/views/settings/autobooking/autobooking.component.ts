import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { Group } from "../../../models/group";
import { GroupService } from "../../../services/group.service";
import { AccountService } from "../../../services/account.service";
import { Account } from "../../../models/account";

import { BaseComponent } from '../../base-component';
import { Credit } from "../../../models/credit";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CreditService } from "../../../services/credit.service";
import { GlobalConstants } from '../../../common/global-constants';

import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;

@Component({
  selector: "app-autobooking",
  templateUrl: "./autobooking.component.html",
  styleUrls: ["./autobooking.component.scss"],
})
export class AutobookingComponent extends BaseComponent implements OnInit {
  groups: Group[];
  loggedInAccount: Account;

  durations = GlobalConstants.autoBookingRates;

  autoForm: FormGroup;

  constructor(private fb: FormBuilder, private groupService: GroupService, private accountService: AccountService) { super() }

  ngOnInit(): void {
    this.getGroups();
    this.loggedInAccount = this.accountService.getLoginAccount();


    this.autoForm = this.fb.group({
      duration: ['', Validators.required],
      sessions: ['', Validators.required]
    });
  }

  getGroups() {

    this.groupService.getGroups().subscribe(gs => {
      this.groups = gs;
    })
  }

  onSubmit() {
    console.log(this.autoForm.value.duration);
    console.log(this.autoForm.value.sessions);

    if (confirm("Confirm to setup auto booking - " + this.autoForm.value.duration.desc)) {

    }



  }
  get f() {
    return this.autoForm.controls;
  }

}



export interface Duration {
  name: string,
  value: number,
  price: number,
}

