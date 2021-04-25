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

import { BookingScheduleService } from "../../../services/booking-schedule.service";

import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;
import { BookingSchedule } from "../../../models/booking-schedule";
import { EventLoggerService } from '../../../services/event-logger.service';
import { EventLogger } from '../../../models/event-logger';
import { BookingsComponent } from "../../admin/bookings/bookings.component";

@Component({
  selector: "app-autobooking",
  templateUrl: "./autobooking.component.html",
  styleUrls: ["./autobooking.component.scss"],
})
export class AutobookingComponent extends BaseComponent implements OnInit {
  groups: Group[];
  user: User;
  selectedGroup: Group;
  loggedInAccount: Account;
  familyMembers: User[];
  mySchedules: BookingSchedule[];
  hasCredit: boolean;
  myCreditBalance: number;
  miniumCreditRequired = GlobalConstants.autoBookingMiniumCreditRequired
  isCreditUser:boolean;

  constructor(private fb: FormBuilder, private dialogRef: MatDialog, public dialog: MatDialog, private creditService: CreditService,
    private bookingScheduleService: BookingScheduleService, private helperService: HelperService, private groupService: GroupService, private accountService: AccountService) { super() }

  ngOnInit(): void {
    this.loggedInAccount = this.accountService.getLoginAccount();

    this.getUserDetails();
    this.getMyCreditBalance();
    this.getGroups();
    this.getFamily();
    this.getMySchedules();
  }

  getGroups() {
    this.groupService.getGroups().subscribe(gs => {
      this.groups = gs;
    })
  }

  getMyCreditBalance() {
    this.creditService.getBalance(this.loggedInAccount.docId).subscribe(result => {
      this.myCreditBalance = result;
      this.hasCredit = this.myCreditBalance >= GlobalConstants.autoBookingMiniumCreditRequired;
      console.log('credit balance: ', result);
      //this.hasCredit = true;
    })
  }

  getFamily() {
    this.accountService.getFamilyUsers(this.loggedInAccount.docId).subscribe(result => {
      this.familyMembers = result;
    })
  }

  getUserDetails() {
    this.accountService.getLoginUser().subscribe(u=>{
      this.user = u;
      this.isCreditUser = u.isCreditUser;
      console.log('user... ',u)
    });
  }

  getMySchedules() {
    this.bookingScheduleService.getMyBookingSchedules(this.loggedInAccount.docId).subscribe(schedules => {
      this.mySchedules = schedules;

    })
  }
  statusClicked(schedule: BookingSchedule) {
    let status = schedule.isPaused ? 'resume' : 'pause'
    if (confirm('Conform to ' + status + ' your auto booking?')) {
      schedule.isPaused = !schedule.isPaused;
      this.bookingScheduleService.updateIsPaused(schedule.docId, schedule);
    }
  }

  deleteClicked(schedule: BookingSchedule) {
    if (confirm('No refund is possible when deleting a schedule, are you sure to delete?')) {
      this.bookingScheduleService.deleteSchedule(schedule.docId);
    }
  }


  onSelectClicked() {

    if (!this.selectedGroup) return false;

    const dialogRef = this.dialog.open(BookingSchedulerDialog, {
      width: '650px',
      data: {
        loggedInUser: this.loggedInAccount,
        group: this.selectedGroup,
        family: this.familyMembers,
        mySchedules: this.mySchedules,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}

@Component({
  selector: 'booking-scheduler',
  templateUrl: 'scheduler.html',
})
export class BookingSchedulerDialog {
  constructor(
    public dialogRef: MatDialogRef<BookingSchedulerDialog>, private eventLogService: EventLoggerService,
    @Inject(MAT_DIALOG_DATA) public data: BookingSchedulerDialogData, private helperService: HelperService, private bookingScheduleService: BookingScheduleService, private accountService: AccountService) { }

  hasError: boolean;
  errorMessage: string;
  selectedDuration: Duration;
  //durations = GlobalConstants.autoBookingRates;
  isLoading = false;
  isCommittee: boolean;
  //hasActiveAutoBooking = false;
  userSelectList: UserSelection[] = [];
  isMaxAutoBookingLimitReached: boolean;

  myActiveSchedules: BookingSchedule[];
  numberWeeks: number = 12;
  selectedUser:User;
  totalCost: number;

  dayRange = { start: Timestamp.now(), end: Timestamp.now() };
  
  ngOnInit() {
    console.log(this.data.group.seatsAutoBooking);
    this.onWeekChange(this.numberWeeks);
    this.getAllActiveBookingSchedules();

    this.myActiveSchedules = this.checkActiveSchedules();
    this.buildUserSelectionList();
    // if (myActives && myActives.length > 0) {
    //   //this.hasActiveAutoBooking = true;
    // }
    // else {
    // }
    let committee = this.data.group.committees.find(x => x.docId == this.data.loggedInUser.docId);
    this.isCommittee = committee != null;
    if (this.isCommittee) { this.totalCost = 0 } // committee free 

  }

  getAllActiveBookingSchedules() {
    this.bookingScheduleService.getActiveBookingSchedules(this.data.group.docId).subscribe(schedules => {
      console.log('getAllActiveBookingSchedules', schedules);
      this.isMaxAutoBookingLimitReached = schedules.length >= this.data.group.seatsAutoBooking;
    })
  }

  buildUserSelectionList() {
    console.log('my active schedules ', this.myActiveSchedules);

    //console.log('has found: ', found);
    let found = this.myActiveSchedules.find(x=>x.user.docId == this.data.loggedInUser.docId);
    if (!found) {
      this.userSelectList.push({ docId: this.data.loggedInUser.docId, name: this.data.loggedInUser.name, selected: false, parentUserDocId: this.data.loggedInUser.docId, parentUserDisplayName: this.data.loggedInUser.name } as UserSelection);
    }

    this.data.family.forEach(f => {
      let found = this.myActiveSchedules.find(x=>x.user.docId == f.docId);
      if (!found) {
        let u = { docId: f.docId, name: f.name, selected: false, parentUserDocId: f.parentUserDocId, parentUserDisplayName: f.parentUserDisplayName, } as UserSelection;
        this.userSelectList.push(u);
      }
    })

    console.log('user list: ', this.userSelectList)
  }

  mapUserSelectionToUser(userSelectList: UserSelection[]) : User[]{
    let users = userSelectList.map(s=> ({
      docId: s.docId,
      name: s.name,
      parentUserDocId: s.parentUserDocId,
      parentUserDisplayName: s.parentUserDisplayName
    }) as User);
    console.log('mapUserSelectionToUser', users);
    return users;
  }

  checkActiveSchedules() {
    let myActives = this.data.mySchedules.filter(x => x.groupDocId == this.data.group.docId && x.expireOn > Timestamp.now());
    console.log(' check actives ', myActives.length);

    return myActives;
  }

  durationChanged(event) {
    //console.log(event);
    this.selectedDuration = event;

    let endDate = this.helperService.addDays(event.value);
    let today = this.helperService.convertToTimestamp(new Date());
    this.dayRange.start = today;
    this.dayRange.end = this.helperService.convertToTimestamp(endDate);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  onWeekChange(week:number){
    console.log(week);
    let unitPrice = GlobalConstants.autoBookingWeekUnitPrice;
    

    this.totalCost = week * unitPrice - GlobalConstants.autoBookingDiscount;
    console.log('unit price', unitPrice);

    console.log('actual cost', week*unitPrice);
    console.log('discount', GlobalConstants.autoBookingDiscount);

    if (this.isCommittee) { this.totalCost = 0 } // committee free 
    let endDate = this.helperService.addDays(week * 7);
    let today = this.helperService.convertToTimestamp(new Date());
    this.dayRange.start = today;
    this.dayRange.end = this.helperService.convertToTimestamp(endDate);
    console.log(this.dayRange);


  } 
  onCreateClick() {   
    console.log(this.numberWeeks);
    console.log(this.selectedUser);

    if (this.numberWeeks < 4 || this.numberWeeks > 26 || !this.selectedUser) {
      this.hasError = true;
      return false;
    }

    this.isLoading = true;
    let user = this.mapUserSelectionToUser(this.userSelectList.filter(x => x.docId == this.selectedUser.docId));
    console.log('selected user: ', user)


    // let price = this.selectedDuration.price;
    // if (this.isCommittee) { price = 0 } // committee free 
    //let users = this.mapUserSelectionToUser(this.userSelectList.filter(x => x.selected));
    if (this.isCommittee) { this.totalCost = 0 } // committee free 


    this.bookingScheduleService.createBookingSchedule(user, this.dayRange.end, this.data.loggedInUser, this.data.group, this.totalCost)
      .then(() => {
        let log = {
          eventCategory: GlobalConstants.eventAutoBooking,
          notes: this.totalCost + ' ' + this.data.loggedInUser.name
        } as EventLogger;
        this.eventLogService.createLog(log, this.data.loggedInUser.docId, this.data.loggedInUser.name);
        this.dialogRef.close();
      })
      .catch((err) => {
        this.isLoading = false;
        alert(err);
      })
  }
}

export interface BookingSchedulerDialogData {
  loggedInUser: Account,
  group: Group,
  family: User[],
  mySchedules: BookingSchedule[],
}

export interface Duration {
  name: string,
  value: number,
  price: number,
  desc: string,
}

