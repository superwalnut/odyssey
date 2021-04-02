import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { Group } from "../../../models/group";
import { GroupService } from "../../../services/group.service";
import { AccountService } from "../../../services/account.service";
import { Account } from "../../../models/account";

import { BaseComponent } from '../../base-component';
import { Credit } from "../../../models/credit";
import { User } from "../../../models/user";
import { UserSelection } from "../../../models/custom-models";
import { HelperService } from '../../../common/helper.service';

import { MatSnackBar } from "@angular/material/snack-bar";
import { CreditService } from "../../../services/credit.service";
import { GlobalConstants } from '../../../common/global-constants';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from "@angular/material/select";

import { GroupTransactionService } from "../../../services/group-transaction.service";

import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;

@Component({
  selector: "app-autobooking",
  templateUrl: "./autobooking.component.html",
  styleUrls: ["./autobooking.component.scss"],
})
export class AutobookingComponent extends BaseComponent implements OnInit {
  groups: Group[];
  selectedGroup: Group;
  loggedInAccount: Account;
  familyMembers: User[];


  //autoForm: FormGroup;

  constructor(private fb: FormBuilder, private dialogRef: MatDialog, public dialog: MatDialog, private helperService: HelperService, private groupService: GroupService, private accountService: AccountService) { super() }

  ngOnInit(): void {
    this.loggedInAccount = this.accountService.getLoginAccount();

    this.getGroups();
    this.getFamily();

    // this.autoForm = this.fb.group({
    //   duration: ['', Validators.required],
    //   sessions: ['', Validators.required]
    // });
  }

  getGroups() {
    this.groupService.getGroups().subscribe(gs => {
      this.groups = gs;
    })
  }

  getFamily() {
    this.accountService.getFamilyUsers(this.loggedInAccount.docId).subscribe(result => {
      this.familyMembers = result;
    })
  }

  onSelectClicked() {

    if (!this.selectedGroup) return false;

    const dialogRef = this.dialog.open(BookingSchedulerDialog, {
      width: '650px',
      data: {
        loggedInUser: this.loggedInAccount,
        group: this.selectedGroup,
        family: this.familyMembers,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  // onSubmit() {
  //   console.log(this.autoForm.value.duration);
  //   console.log(this.autoForm.value.sessions);

  //   if (confirm("Confirm to setup auto booking - " + this.autoForm.value.duration.desc)) {

  //   }
  // }


  //get f() { return this.autoForm.controls; }

}



@Component({
  selector: 'booking-scheduler',
  templateUrl: 'scheduler.html',
})
export class BookingSchedulerDialog {
  constructor(
    public dialogRef: MatDialogRef<BookingSchedulerDialog>,
    @Inject(MAT_DIALOG_DATA) public data: BookingSchedulerDialogData, private helperService: HelperService, private groupTransactionService: GroupTransactionService, private accountService: AccountService) { }

  hasError: boolean;
  errorMessage: string;
  selectedDuration: Duration;
  durations = GlobalConstants.autoBookingRates;

  userSelectList: UserSelection[] = [];

  dayRange = { start: Timestamp.now(), end: Timestamp.now() };

  ngOnInit() {

    this.buildUserSelectionList();

    // var mySelf = {
    //   docId: this.data.loggedInUser.docId,
    //   name: this.data.loggedInUser.name,
    // } as User;

    // this.data.family.push(mySelf);


  }

  buildUserSelectionList() {
    this.userSelectList.push({ docId: this.data.loggedInUser.docId, name: this.data.loggedInUser.name, selected: false } as UserSelection);
    this.data.family.forEach(f => {
      let u = { docId: f.docId, name: f.name, selected: false } as UserSelection;
      this.userSelectList.push(u);
    })
  }

  durationChanged(event) {
    console.log(event);
    let endDate = this.helperService.addDays(event.value);
    let today = this.helperService.convertToTimestamp(new Date());
    this.dayRange.start = today;
    this.dayRange.end = this.helperService.convertToTimestamp(endDate);



  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  onCreateClick() {
    //this.dialogRef.close();
    console.log(this.selectedDuration);
    console.log(this.userSelectList);
    let selectedUsers = this.userSelectList.filter(x => x.selected);
    console.log(selectedUsers);


  }


}


export interface BookingSchedulerDialogData {
  loggedInUser: Account,
  group: Group,
  family: User[],

}




export interface Duration {
  name: string,
  value: number,
  price: number,
  desc: string,
}

