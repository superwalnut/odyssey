import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Group } from "../../models/group";
import { GroupService } from "../../services/group.service";
import { BookingPerson } from "../../models/booking-person";
import { Account } from "../../models/account";
import { CreditService } from "../../services/credit.service";
import { BookingPersonService } from "../../services/booking-person.service";
import { MailgunService } from "../../services/mailgun.service";

import { BookingsService } from "../../services/bookings.service";
import { ActivatedRoute } from "@angular/router";
import { GlobalConstants } from '../../common/global-constants';
import { AccountService } from '../../services/account.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HelperService } from "../../common/helper.service";

import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;
import { DOCUMENT } from '@angular/common';
import { BaseComponent } from '../base-component';
import { Booking } from '../../models/booking';
import { LocalBookingUser } from '../../models/custom-models';
import { map, mergeMap } from 'rxjs/operators';
import { features } from 'node:process';
import { EventLoggerService } from '../../services/event-logger.service';
import { EventLogger } from '../../models/event-logger';
import { User } from '../../models/user';
import { combineLatest } from 'rxjs';


@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent extends BaseComponent implements OnInit {
  panelOpenState = false;
  group: Group;
  booking: Booking;
  bookingDocId: string;
  user: User;
  groupDocId: string;
  bookingPerons: BookingPerson[];
  totalAmount: number;
  creditBalance: number;
  isCreditUser: boolean;
  isCommittee: boolean;
  allLocalBookingUsers: LocalBookingUser[] = [];
  familyBookingUsers: LocalBookingUser[] = [];
  friendBookingUsers: LocalBookingUser[] = [];
  isLoading: boolean;
  loggedInAccount;
  seatsLeft: number;
  seatsBooked: number;
  isSeatsLeft: boolean;


  constructor(private groupService: GroupService, private dialogRef: MatDialog, private eventLogService: EventLoggerService,
    private bookingService: BookingsService, private bookingPersonService: BookingPersonService, private creditService: CreditService,
    private accountService: AccountService, private activatedRoute: ActivatedRoute, public dialog: MatDialog) { super() }

  ngOnInit(): void {
    this.bookingDocId = this.activatedRoute.snapshot.params.id;
    this.groupDocId = this.activatedRoute.snapshot.params.groupId;
    console.log('url params: ', this.bookingDocId, this.groupDocId)
    this.loggedInAccount = this.accountService.getLoginAccount();

    let getUser = this.accountService.getUserByDocId(this.loggedInAccount.docId);
    let getBalance = this.creditService.getBalance(this.loggedInAccount.docId);
    combineLatest([getUser, getBalance]).subscribe(result => {
      console.log('forkjoin 1: ', result[0]);
      console.log('forkJoin 2: ', result[1]);
      this.user = result[0];
      this.isCreditUser = result[0].isCreditUser;
      this.creditBalance = result[1];
    })

    this.getGroupDetail(this.groupDocId);
    this.getCurrentBooking(this.bookingDocId);
    this.getCurrentBookingPersons(this.bookingDocId);
    this.getFriendsList(this.loggedInAccount);
    this.getFamilyMembers(this.loggedInAccount);
  }

  getGroupDetail(groupDocId: string) {
    this.groupService.getGroup(groupDocId).subscribe(g => {
      this.group = g;

      this.isCommitteeCheck(this.loggedInAccount.docId);
      console.log('getGroupDetails()', this.group);
    });
  }

  getCurrentBookingPersons(bookingDocId: string) {
    this.bookingPersonService.getCustomByBookingDocId(bookingDocId, this.loggedInAccount.docId).subscribe(bs => {
      this.allLocalBookingUsers = bs;
      console.log("getByBookingPersonsByBookingDocId(): ", this.allLocalBookingUsers);
      this.seatsAvailable();
    })
  }

  seatsAvailable() {
    let seatsLimit = this.group.seats;
    this.seatsBooked = this.allLocalBookingUsers.length;
    this.seatsLeft = seatsLimit - this.seatsBooked;
    this.isSeatsLeft = this.seatsLeft > 0;
    console.log('seats left: ', this.seatsLeft);
    return this.seatsLeft;
  }

  getCurrentBooking(bookingDocId: string) {
    this.bookingService.get(bookingDocId).subscribe(booking => {
      this.booking = booking;
    });
  }

  getFamilyMembers(acc: Account) {
    this.accountService.getFamilyUsers(acc.docId).subscribe(users => {
      console.log('family: ', users);
      var my = { userDocId: acc.docId, name: acc.name, isFamily: true } as LocalBookingUser;
      this.familyBookingUsers.push(my);
      if (users) {
        users.forEach(u => {
          var fu = { userDocId: u.docId, name: u.name, isFamily: true } as LocalBookingUser;
          this.familyBookingUsers.push(fu);
        });
      }
      console.log('family booking users: ', this.familyBookingUsers);
      this.prepareBookingModal();
    })
  }

  getFriendsList(acc: Account) {
    let f1 = { userDocId: acc.docId, name: "Friend 1(" + acc.name + ")", amount: GlobalConstants.rateCash, isFamily: false } as LocalBookingUser;
    let f2 = { userDocId: acc.docId, name: "Friend 2(" + acc.name + ")", amount: GlobalConstants.rateCash, isFamily: false } as LocalBookingUser;
    this.friendBookingUsers.push(f1);
    this.friendBookingUsers.push(f2);
  }

  prepareBookingModal() {

    this.familyBookingUsers.forEach(b => {
      b.selected = false;
      let match = this.allLocalBookingUsers.find(bookingUser => bookingUser.userDocId == b.userDocId && bookingUser.name == b.name);
      console.log("found xxxxxx: ", match);
      if (match) {
        b.selected = true;
        b.docId = match.docId;
      }
    });

    this.friendBookingUsers.forEach(b => {
      b.selected = false;
      let match = this.allLocalBookingUsers.find(item => item.name == b.name);
      if (match) {
        b.selected = true;
        b.docId = match.docId;
      }
    })
  }

  bookClicked() {
    const dialogRef = this.dialog.open(BookingDialog, {
      width: '650px',
      data: {
        loggedInUser: this.loggedInAccount,
        bookingDocId: this.bookingDocId,
        group: this.group,
        allLocalBookingUsers: this.allLocalBookingUsers,
        familyBookingUsers: this.familyBookingUsers,
        friendBookingUsers: this.friendBookingUsers,
        isCreditUser: this.isCreditUser,
        creditBalance: this.creditBalance,
        isCommittee: this.isCommittee,
        isSeatsLeft: this.isSeatsLeft,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
  }

  forSaleClicked(seller: LocalBookingUser) {
    let found = this.allLocalBookingUsers.find(x => x.userDocId == this.loggedInAccount.docId && !x.isForSale);
    console.log('has found: ', found);
    if (found) {
      alert('You have already booked');
      return false;
    }

    var fee: Number;
    if (this.isCommittee) fee = 0;
    else {
      fee = this.isCreditUser ? GlobalConstants.rateCredit : GlobalConstants.rateCash;
    }

    var buyer = {
      bookingDocId: this.bookingDocId,
      groupDocId: this.group.docId,
      bookingDesc: this.group.groupName,
      userId: this.loggedInAccount.docId,
      userDisplayName: this.loggedInAccount.name,
      amount: fee,
      parentUserId: this.loggedInAccount.docId,
      parentUserDisplayName: this.loggedInAccount.name,
      paymentMethod: this.isCreditUser ? GlobalConstants.paymentCredit : GlobalConstants.paymentCash,
      isPaid: true,
      createdOn: Timestamp.now(),
    } as BookingPerson;
    console.log('has found readed end!!!: ');

    this.bookingPersonService.buySeat(seller, buyer);
  }

  withdrawClicked(lbu: LocalBookingUser) {
    const dialogRef = this.dialog.open(WithdrawDialog, {
      width: '650px',
      data: {
        loggedInUser: this.loggedInAccount,
        booking: this.booking,
        group: this.group,
        inputBookingPerson: lbu,
        allLocalBookingUsers: this.allLocalBookingUsers,
        familyBookingUsers: this.familyBookingUsers,
        friendBookingUsers: this.friendBookingUsers,
        isCreditUser: this.isCreditUser,
        isCommittee: this.isCommittee,
        isSeatsLeft: this.isSeatsLeft,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The withdraw dialog was closed');

    });
  }

  //cil-dollar, cil-credit-card
  getPaymentClass(paymentMethod: string) {
    if (paymentMethod == GlobalConstants.paymentCredit) { return "cil-credit-card"; }
    else if (paymentMethod == GlobalConstants.paymentCash) { return "cil-dollar"; }
  }

  isCommitteeCheck(userDocId: string) {
    let isCommittee = this.group.committees.find(x => x.docId === userDocId);
    this.isCommittee = isCommittee != null;
    console.log("is committee: ", this.isCommittee);
    return isCommittee;
  }

}


@Component({
  selector: 'booking-dialog',
  templateUrl: 'booking.html',
})
export class BookingDialog {
  constructor(
    public dialogRef: MatDialogRef<BookingDialog>,
    @Inject(MAT_DIALOG_DATA) public data: BookingDialogData, private mailgunService:MailgunService, private bookingPersonService: BookingPersonService, private accountService: AccountService) { }

  hasError: boolean;
  errorMessage: string;
  testData: BookingDialogData;
  totalAmount: number;
  isLoading: boolean;
  allBookings: BookingPerson[];
  // isCreditUser: boolean;
  // creditBalance: number;
  hasCredit: boolean;
  lowCredit: boolean;

  ngOnInit() {

    this.hasCredit = this.data.creditBalance > 0;
    this.lowCredit = this.data.creditBalance <= 40;

    
    this.bookingPersonService.getByBookingDocId(this.data.bookingDocId).subscribe(allBookings => {
      this.allBookings = allBookings; //get a live connection to all booking persons.
    })

    if (this.lowCredit) { this.lowbalanceEmailNotification();}

  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  lowbalanceEmailNotification() {

    console.log(this.data.loggedInUser.email);
    this.mailgunService.sendCreditReminder(this.data.loggedInUser.email, this.data.loggedInUser.name, this.data.creditBalance);
  }
  onConfirmClick(): void {

    if (this.allBookings.length >= this.data.group.seats) {
      this.hasError = true;
      this.errorMessage = "This session is full";
      return;
    }
    //1. merge family and friends into one list

    this.isLoading = true;
    var result = this.preDbProcess();
    console.log("xxxxx: ", result.toAdd);
    console.log("delete ssss ", result.toDelete);

    //2. calculate price for added recored;
    result.toAdd.forEach(u => {
      if (u.isFamily) { //Family
        u.amount = this.data.isCreditUser ? GlobalConstants.rateCredit : GlobalConstants.rateCash;
        if (this.isCommitteeCheck(u.userDocId)) {
          u.amount = 0; //if committee reset it to 0;
        }
      } else { //Friends
        u.amount = GlobalConstants.rateCash;
      }
    });

    var finalBookingPersonsToAdd = this.mapToBookingPersons(result.toAdd);
    var finalBookingPersonsToDelete = this.mapToBookingPersons(result.toDelete);
    console.log('finalBookingPersonsToAdd: ', finalBookingPersonsToAdd);
    console.log('finalBookingPersonsToDelete: ', finalBookingPersonsToDelete);


    if (finalBookingPersonsToAdd.length > 0) {
      this.bookingPersonService.createBookingPersonBatch(finalBookingPersonsToAdd)
        .then(() => this.dialogRef.close())
        .catch((err) => {
          this.hasError = true;
          //errorMessage = err.toString();
          console.log(err);
        });
    }

    if (finalBookingPersonsToDelete.length > 0) {
      this.bookingPersonService.deleteBatch(finalBookingPersonsToDelete)
        .then(() => this.dialogRef.close())
        .catch((err) => {
          this.hasError = true;
          this.errorMessage = err.Error;
          console.log(err);
        });
    }

    if (finalBookingPersonsToAdd.length == 0 && finalBookingPersonsToDelete.length == 0)
      this.dialogRef.close();
  }

  preDbProcess() {
    //loop through all myselection
    var allMyBooking: LocalBookingUser[] = this.data.familyBookingUsers;
    allMyBooking = allMyBooking.concat(this.data.friendBookingUsers);

    console.log('allmybooking ', allMyBooking)
    let toAdd: LocalBookingUser[] = [];
    let toDelete: LocalBookingUser[] = [];

    allMyBooking.forEach(user => {
      if (user.selected) {
        //check if this user already in the booking?
        var find = this.data.allLocalBookingUsers.find(x => x.userDocId == user.userDocId && x.name == user.name);
        console.log("check if this user already in the booking?", find);
        if (find === undefined) {
          toAdd.push(user);
        }
      }

      else {
        //only delete if this user already in the booking
        var find = this.data.allLocalBookingUsers.find(x => x.userDocId == user.userDocId && x.name == user.name);
        if (find) {
          user.amount = find.amount;
          user.docId = find.docId;
          toDelete.push(user);
        }
      }

    });

    console.log('toadd ', toAdd);
    console.log('todelete ', toDelete);
    return { toAdd, toDelete };
    //this.bookingPersonService.createBookingPersonBatch(toAdd);
  }
  mapToBookingPersons(localBookingUsers: LocalBookingUser[]) {
    let bookingPersons: BookingPerson[] = [];
    localBookingUsers.forEach(u => {
      var bp = {
        bookingDocId: this.data.bookingDocId,
        groupDocId: this.data.group.docId,
        bookingDesc: this.data.group.groupName,
        userId: u.userDocId,
        userDisplayName: u.name,
        amount: u.amount,
        parentUserId: this.data.loggedInUser.docId,
        parentUserDisplayName: this.data.loggedInUser.name,
        paymentMethod: this.data.isCreditUser ? GlobalConstants.paymentCredit : GlobalConstants.paymentCash,
        isPaid: true,
        createdOn: Timestamp.now(),
      } as BookingPerson;
      if (u.docId) bp.docId = u.docId;
      bookingPersons.push(bp);

    });
    return bookingPersons;
  }

  onSelectionChange() {
    console.log("toggle changed");
    this.calculateTotal();
  }
  calculateTotal() {
    let selectedfamilyBookingUsers = this.data.familyBookingUsers.filter(x => x.selected === true);
    let selectedFriendBookingUsers = this.data.friendBookingUsers.filter(x => x.selected === true);
    console.log('calculateTotal: ', this.data.familyBookingUsers);
    let i = 0; let amount = 0;
    selectedfamilyBookingUsers.forEach(u => {

      if (i == 0) {
        u.amount = GlobalConstants.rateCredit;
      }
      else {
        u.amount = GlobalConstants.rateFamily;
      }

      if (!this.data.isCreditUser) u.amount = GlobalConstants.rateCash;

      if (this.isCommitteeCheck(u.userDocId)) {
        u.amount = 0; //if committee reset it to 0;
      }
      amount += u.amount;
      i++;
    });

    amount += selectedFriendBookingUsers.length * GlobalConstants.rateCash;
    console.log(amount);
    this.totalAmount = amount;

  }

  isCommitteeCheck(userDocId: string) {
    let found = this.data.group.committees.find(x => x.docId === userDocId);
    return found != null;
  }

}

export interface BookingDialogData {
  loggedInUser: Account,
  bookingDocId: string;
  group: Group;
  allLocalBookingUsers: LocalBookingUser[];
  familyBookingUsers: LocalBookingUser[];
  friendBookingUsers: LocalBookingUser[];
  isCreditUser: boolean;
  creditBalance: number;
  isCommittee: boolean;
  isSeatsLeft: boolean;
}

@Component({
  selector: 'withdraw-dialog',
  templateUrl: 'withdraw.html',
})
export class WithdrawDialog {
  constructor(
    public dialogRef: MatDialogRef<WithdrawDialog>,
    @Inject(MAT_DIALOG_DATA) public data: WithdrawDialogData, private eventLogService: EventLoggerService, private bookingPersonService: BookingPersonService, private helperService: HelperService, private accountService: AccountService) { }

  hasError: boolean;
  errorMessage: string;
  timeLeft: number;
  isWithdrawAllowed: boolean;
  bookingWithdrawHours: number = GlobalConstants.bookingWithdrawHours;
  totalAmount: number;
  isLoading: boolean;
  allBookings: BookingPerson[];


  ngOnInit() {
    let eventStartDateTime = this.data.booking.eventStartDateTime;
    let diff = this.helperService.findTimeDifference(eventStartDateTime);
    if (diff > GlobalConstants.bookingWithdrawHours * 3600) {
      console.log('withdraw is allowed');
      this.isWithdrawAllowed = true;
    }
    else {
      console.log('withdraw isnot allowed, mark it for available');
      this.isWithdrawAllowed = false;

    }
    console.log('time diff: ', diff)

  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  withdrawClicked() {
    console.log('refund: ', this.mapToBookingPerson(this.data.inputBookingPerson))
    this.bookingPersonService.withdraw(this.data.inputBookingPerson.docId, this.mapToBookingPerson(this.data.inputBookingPerson))
      .then(() => {
        let log = {
          eventCategory: GlobalConstants.eventbookingWithdraw,
          notes: this.data.inputBookingPerson.name
        } as EventLogger;
        this.eventLogService.createLog(log, this.data.inputBookingPerson.userDocId, this.data.inputBookingPerson.parentUserDisplayName);
        this.dialogRef.close()
      })
      .catch((err) => {
        this.hasError = true;
        //errorMessage = err.toString();
        console.log(err);
      });

  }

  markForSaleClicked() {
    this.bookingPersonService.markForSale(this.data.inputBookingPerson.docId, this.mapToBookingPerson(this.data.inputBookingPerson))
      .then(() => {
        let log = {
          eventCategory: GlobalConstants.eventBookingForSale,
          notes: this.data.inputBookingPerson.name
        } as EventLogger;
        this.eventLogService.createLog(log, this.data.inputBookingPerson.userDocId, this.data.inputBookingPerson.parentUserDisplayName);
        this.dialogRef.close()
      })
      .catch((err) => {
        this.hasError = true;
        //errorMessage = err.toString();
        console.log(err);
      });
  }



  mapToBookingPerson(lbu: LocalBookingUser): BookingPerson {

    var bp = {
      docId: lbu.docId,
      bookingDocId: this.data.booking.docId,
      groupDocId: this.data.group.docId,
      bookingDesc: this.data.group.groupName,
      userId: lbu.userDocId,
      userDisplayName: lbu.name,
      amount: lbu.amount,
      parentUserId: this.data.loggedInUser.docId,
      parentUserDisplayName: this.data.loggedInUser.name,
      paymentMethod: lbu.paymentMethod,
      // paymentMethod: this.data.hasCredit ? GlobalConstants.paymentCredit : GlobalConstants.paymentCash,
      // isPaid:true,
    } as BookingPerson;
    return bp;
  }


}

export interface WithdrawDialogData {
  loggedInUser: Account,
  booking: Booking;
  group: Group;
  inputBookingPerson: LocalBookingUser;
  allLocalBookingUsers: LocalBookingUser[];
  familyBookingUsers: LocalBookingUser[];
  friendBookingUsers: LocalBookingUser[];
  hasCredit: boolean;
  isCommittee: boolean;
  isSeatsLeft: boolean;
}

