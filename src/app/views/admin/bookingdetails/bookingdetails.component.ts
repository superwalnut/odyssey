import { Component, OnInit, Inject, Testability } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { Observable } from 'rxjs';
import { filter, map, mergeMap, startWith, take } from 'rxjs/operators';
import { BookingPersonService } from "../../../services/booking-person.service";
import { BookingsService } from "../../../services/bookings.service";
import { Account } from "../../../models/account";
import { User } from "../../../models/user";
import { BookingPerson } from "../../../models/booking-person";
import { Credit } from "../../../models/credit";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CreditService } from "../../../services/credit.service";
import { BaseComponent } from '../../base-component';
import { Booking } from '../../../models/booking';
import { GroupTransaction } from '../../../models/group-transaction';
import { AccountService } from '../../../services/account.service';
import { GroupTransactionService } from "../../../services/group-transaction.service";
import { GroupService } from "../../../services/group.service";
import { Group } from '../../../models/group';
import { EventLoggerService } from "../../../services/event-logger.service";
import { EventLogger } from '../../../models/event-logger';
import { LocalBookingUser } from '../../../models/custom-models';
import { GlobalConstants } from '../../../common/global-constants';
import { MatSelectChange} from "@angular/material/select";
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import { combineLatest, forkJoin, of } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;

@Component({
  selector: 'app-bookingdetails',
  templateUrl: './bookingdetails.component.html',
  styleUrls: ['./bookingdetails.component.scss']
})
export class BookingdetailsComponent extends BaseComponent implements OnInit {
  adjustForm: FormGroup;
  loggedInAccount: Account;
  bookingDocId: string;
  groupDocId: string;
  booking: Booking;
  allLocalBookingUsers: LocalBookingUser[];
  hasCredit: boolean;
  defaultPayment = GlobalConstants.paymentCredit;
  // total = 0;
  // totalCredit = 0;
  // totalCash = 0;
  // totalBank = 0;
  // totalAdjust = 0;
  group: Group;
  //type ahead
  myControl = new FormControl();
  allUsers: string[] = [];
  allUsersObject: User[];
  filteredUsers: Observable<string[]>;
  //selectedUser: User;
  selectedPaymentMethod: string;
  groupTransactions: GroupTransaction[];
  groupTransactionsAdjusted: GroupTransaction[];
  userPaymentMethod:string;
  //paymentMethods: string[] = [GlobalConstants.paymentCredit, GlobalConstants.paymentCash, GlobalConstants.paymentBank];

  isGod:boolean;
  //new for booking
  bookingTotal = 0;
  bookingTotalCredit = 0;
  bookingTotalCash = 0;
  bookingTotalBank = 0;
  bookingTotalAdjusted = 0;
  reconciliationInProgress:boolean;
  isLoading:boolean;
  isFriend:boolean;
  isParentCreditUser:boolean;

  constructor(private fb: FormBuilder, private dialogRef: MatDialog, private snackBar: MatSnackBar, public dialog: MatDialog, private groupService: GroupService, private groupTransactionService: GroupTransactionService, private bookingService: BookingsService, private bookingPersonService: BookingPersonService, private accountService: AccountService, private creditService: CreditService, private activatedRoute: ActivatedRoute,private eventLogService: EventLoggerService) { super() }

  ngOnInit(): void {
    this.bookingDocId = this.activatedRoute.snapshot.params.id;
    this.groupDocId = this.activatedRoute.snapshot.params.groupId;
    this.isGod = this.accountService.isGod();
    this.loggedInAccount = this.accountService.getLoginAccount();
    this.getBookingDetail();
    this.getGroupDetail();
    this.getBookingPersonAndGroupAdjustment();

    this.filteredUsers = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

    this.accountService.getAllUsers().subscribe((x) => {
      this.allUsersObject = x;
      x.forEach(u => {
        if (u) { this.allUsers.push(u.name); }
      })
    });

    this.adjustForm = this.fb.group({
      adjustAmount: ["", Validators.required],
      adjustDesc: ["", Validators.required],
    });
  }

  getBookingPersonAndGroupAdjustment(){
    let bps = this.bookingPersonService.getCustomByBookingDocId(this.bookingDocId, this.loggedInAccount.docId);
    let groupAdjusted = this.groupTransactionService.getByBookingDocIdAndPaymentMethod(this.bookingDocId, GlobalConstants.paymentAdjust);
    combineLatest([bps, groupAdjusted]).subscribe(result => {
      console.log('bps: ', result[0]);
      console.log('groupAdjusted: ', result[1]);
      this.allLocalBookingUsers = result[0];
      this.groupTransactionsAdjusted = result[1];
      this.getBookingTotal(result[0]);
    })
  }

  getGroupDetail() {
    this.groupService.getGroup(this.groupDocId).subscribe(g => {
      this.group = g;
    })
  }

  getBookingTotal(lbus:LocalBookingUser[]){
    this.bookingTotal = 0;
    this.bookingTotalCredit = 0;
    this.bookingTotalCash = 0;
    this.bookingTotalBank = 0;
    this.bookingTotalAdjusted = 0;

    lbus.forEach(lbu=> {
      if (lbu.isPaid) {
        this.bookingTotal += lbu.amount;
      }
      if (lbu.paymentMethod == GlobalConstants.paymentCredit) {
        this.bookingTotalCredit += lbu.amount;
      } else if (lbu.paymentMethod == GlobalConstants.paymentCash && lbu.isPaid) {
        this.bookingTotalCash += lbu.amount;
      } else if (lbu.paymentMethod == GlobalConstants.paymentBank && lbu.isPaid) {
        this.bookingTotalBank += lbu.amount;
      } 
    });

    if (this.groupTransactionsAdjusted.length > 0) {
      this.bookingTotalAdjusted = this.groupTransactionsAdjusted.map(trans => trans.amount).reduce((a,b) => a+b);
      this.bookingTotal += this.bookingTotalAdjusted;
    }
    
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    console.log(filterValue);
    return this.allUsers.filter(option => option.toLowerCase().includes(filterValue));
  }
  selectedValue(event: MatSelectChange) {
    this.selectedPaymentMethod = event.value;
    console.log(this.selectedPaymentMethod);
  }

  userListSelected(event: MatAutocompleteSelectedEvent) {
    let found = this.allUsersObject.find(x=>x.name == event.option.value);
    if (found.parentUserDocId) {
      found = this.allUsersObject.find(x=>x.docId == found.parentUserDocId);
    }
    if (found) {
      this.userPaymentMethod = found.isCreditUser ? 'HBCoin' : 'Cash';
      this.isParentCreditUser = found.isCreditUser;
    }
  }

  createBooking(selectedUserControl) {

    console.log("is friend", this.isFriend);

    //console.log(this.selectedPaymentMethod);
    //if (this.selectedPaymentMethod == null) { return false; }
    if (selectedUserControl.value == null) { return false; }
    var user = this.allUsersObject.filter(x => { return x.name === selectedUserControl.value });
    console.log(user);

    
    let bp = {
      bookingDocId: this.bookingDocId,
      groupDocId: this.booking.groupDocId,
      bookingDesc: this.booking.weekDay,
      userId: user[0].docId,
      userDisplayName: user[0].name,
      //paymentMethod: this.selectedPaymentMethod, //Credit | Cash | Bank Transfer`
      paymentMethod: this.isParentCreditUser ? GlobalConstants.paymentCredit : GlobalConstants.paymentCash,
      parentUserId: user[0].parentUserDocId ? user[0].parentUserDocId : user[0].docId,
      parentUserDisplayName: user[0].parentUserDisplayName ? user[0].parentUserDisplayName : user[0].name,
      isForSale: false,
      amount: this.getPaymentAmount(user[0].docId, this.isParentCreditUser, this.isFriend),
      //isPaid: this.selectedPaymentMethod == GlobalConstants.paymentCredit ? true : false,
      //isPaid: user[0].isCreditUser, // bug here family member won't have isCreditUserValue;
      isPaid: this.isParentCreditUser,
      notes: this.isFriend ? "Friend" : "",
      createdOn: Timestamp.now(),
    } as BookingPerson;

    console.log(bp);
    this.bookingPersonService.createBookingPerson(bp, this.booking);

  }

  withdrawBooking(lbu: LocalBookingUser) {

    if (lbu.isPaid && lbu.paymentMethod == GlobalConstants.paymentCash){
      alert('Cash user who has already paid, cannot be deleted!');
      return false;
    }

    if (confirm("Are you sure to withdraw? " + lbu.name)) {
      var bp = {
        docId: lbu.docId,
        bookingDocId: this.bookingDocId,
        groupDocId: this.booking.groupDocId,
        userId: lbu.userDocId,
        userDisplayName: lbu.name,
        amount: lbu.amount,
        paymentMethod: lbu.paymentMethod,
        parentUserId: lbu.parentUserId ? lbu.parentUserId : lbu.userDocId,
        parentUserDisplayName: lbu.parentUserDisplayName ? lbu.parentUserDisplayName : lbu.name,
      } as BookingPerson;
      this.bookingPersonService.withdraw(bp.docId, bp, this.booking)
        .catch((err) => {
          //errorMessage = err.toString();
          alert(err);
          console.log(err);
        });
    }
  }

  getPaymentAmount(userDocId: string, isCreditUser:boolean, isFriend:boolean): number {
    let committees = this.group.committees;
    let found = committees.find(c => c.docId == userDocId);
    console.log('committees found: ', found);

    if (found) { 
      return isFriend ? GlobalConstants.rateCash : 0; 
    } // committee is free of charge

    if (isCreditUser) {
      return isFriend ? GlobalConstants.rateCash : GlobalConstants.rateCredit;
    }
    return GlobalConstants.rateCash;
  }

  getBookingDetail() {
    this.bookingService.get(this.bookingDocId).subscribe(result => {
      this.booking = result;
    })
  }

  //cil-dollar, cil-credit-card
  getPaymentClass(paymentMethod: string) {
    // if (paymentMethod == GlobalConstants.paymentCredit) { return "cil-credit-card"; }
    // else if (paymentMethod == GlobalConstants.paymentCash) { return "cil-dollar"; }
    if (paymentMethod == GlobalConstants.paymentCredit || paymentMethod == "Credit") { return GlobalConstants.hbCoinIcon; }
    else if (paymentMethod == GlobalConstants.paymentCash) { return GlobalConstants.cashIcon; }
    else if (paymentMethod == GlobalConstants.paymentBank) { return GlobalConstants.bankIcon; }

  }

  toggleLockStatus() {
    if (this.booking.reconciled) { return false; }
    this.booking.isLocked = !this.booking.isLocked;
    this.bookingService.updateBooking(this.bookingDocId, this.booking);
  }

  toggleVisibility() {
    this.booking.isOffline = !this.booking.isOffline;
    this.bookingService.updateBooking(this.bookingDocId, this.booking);
  }


  changeSeatClicked() {
    if (this.booking.reconciled) { return false; }

    const dialogRef = this.dialog.open(SeatDialog, {
      width: '650px',
      data: {
        loggedInUser: this.loggedInAccount,
        booking: this.booking,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Seat change dialog was closed');

    });
  }

  changeLvlPointsClicked() {
    if (this.booking.reconciled) { return false; }
    const dialogRef = this.dialog.open(LvlPointsDialog, {
      width: '650px',
      data: {
        loggedInUser: this.loggedInAccount,
        booking: this.booking,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Level points change dialog was closed');

    });
  }

  onSubmit() {
    var groupTransaction = {
      amount: this.adjustForm.value.adjustAmount,
      notes: this.adjustForm.value.adjustDesc,
      paymentMethod: GlobalConstants.paymentAdjust,
      groupDocId: this.booking.groupDocId,
      bookingDocId: this.bookingDocId,
      createdBy: this.loggedInAccount.docId,
      createdByDisplayName: this.loggedInAccount.name,
      created: Timestamp.now(),
    } as GroupTransaction;
    console.log('grouptransaction adjustment: ', groupTransaction);
    this.groupTransactionService.createGroupTransaction(groupTransaction)
      .then(() => {
        this.snackBar.open(`Adjustment has been created.`, null, {
          duration: 5000,
          verticalPosition: "top",
        });
      })
      .catch((err) => { alert(err) })
  }

  get f() {
    return this.adjustForm.controls;
  }


  addNoteClicked(bp: LocalBookingUser) {

    if (this.booking.reconciled) {return false; }
    
    const dialogRef = this.dialog.open(NoteDialog, {
      width: '650px',
      data: {
        loggedInUser: this.loggedInAccount,
        localBookingUser: bp,
        booking: this.booking,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
  }

  startReconciliationClicked() {
    this.reconciliationInProgress = true;
    this.bookingService.toggleReconciliationInProgress(this.booking, this.loggedInAccount, true)

  }

  cancelReconciliationClicked() {
    this.reconciliationInProgress = false;
    this.bookingService.toggleReconciliationInProgress(this.booking, this.loggedInAccount, false)

  }

  reconciled() {
    if (confirm('This action cannot be undone and I confirm this booking is reconciled and to be closed forever!')) {
      this.isLoading = true;

      var incomeBreakdownNote = `Credit:${this.bookingTotalCredit} Cash:${this.bookingTotalCash} Bank:${this.bookingTotalBank}`;

      console.log('allLocalBookingUsers', this.allLocalBookingUsers);
      console.log(incomeBreakdownNote);
      this.groupTransactionService.bookingReconciliation(this.group, this.booking, this.allLocalBookingUsers, this.loggedInAccount, incomeBreakdownNote)
      .then(() => {
        let log = {
          eventCategory: GlobalConstants.eventBookingReconciliated,
          notes: this.group.groupName,
        } as EventLogger;
        this.eventLogService.createLog(log, this.loggedInAccount.docId, this.loggedInAccount.name);
        this.isLoading = false;
      })
      .catch((err) => {
        this.isLoading = false;
        alert(err);
        console.log(err);
      });
    }
  }
}


@Component({
  selector: 'note-dialog',
  templateUrl: 'note.html',
})
export class NoteDialog {
  constructor(
    public dialogRef: MatDialogRef<NoteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: NoteDialogData, private bookingPersonService: BookingPersonService, private groupTransactionService: GroupTransactionService, private accountService: AccountService) { }

  hasError: boolean;
  errorMessage: string;

  paid: boolean = this.data.localBookingUser.isPaid;
  //note: string;

  ngOnInit() {

    console.log(this.data.localBookingUser)

  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  savePayStatusClick() {
    console.log(this.data.localBookingUser.isPaid, this.paid);
    if (this.data.localBookingUser.isPaid == this.paid) {
      //no changes made, close the popup;
      this.dialogRef.close();
      return false;
    }

    var bp = {
      docId: this.data.localBookingUser.docId,
      isPaid: this.paid,
    } as BookingPerson;

    var bpFull = {
      docId: this.data.localBookingUser.docId,
      bookingDocId: this.data.booking.docId,
      groupDocId: this.data.booking.groupDocId,
      userId: this.data.localBookingUser.userDocId,
      userDisplayName: this.data.localBookingUser.name,
      paymentMethod: this.data.localBookingUser.paymentMethod,
      parentUserId: this.data.localBookingUser.parentUserId,
      parentUserDisplayName: this.data.localBookingUser.parentUserDisplayName,
      amount: this.data.localBookingUser.amount,
      isPaid: this.paid,
      updatedOn: Timestamp.now()
    } as BookingPerson;


    this.bookingPersonService.updatePaymentStatus(bp, bpFull, this.data.loggedInUser.docId, this.data.loggedInUser.name, this.data.booking)
      .then(() => {
        this.dialogRef.close();
      })
      .catch((err) => { alert(err) })
  }

  saveNotesClick() {
    console.log(this.data.localBookingUser.note, this.paid);
    if (!this.data.localBookingUser.note) {
      this.dialogRef.close()
      return false;
    }
    var bp = {
      docId: this.data.localBookingUser.docId,
      notes: this.data.localBookingUser.note,
      //isPaid: this.paid,
    } as BookingPerson;

    this.bookingPersonService.updateBookingPerson(bp)
      .then(() => this.dialogRef.close())
      .catch((err) => { alert(err) })

    //this.dialogRef.close();

    // console.log('refund: ', this.mapToBookingPerson(this.data.inputBookingPerson))
    // this.bookingPersonService.withdraw(this.data.inputBookingPerson.docId, this.mapToBookingPerson(this.data.inputBookingPerson))
    //   .then(() => this.dialogRef.close())
    //   .catch((err) => {
    //     this.hasError = true;
    //     //errorMessage = err.toString();
    //     console.log(err);
    //   });

  }
}


@Component({
  selector: 'seat-dialog',
  templateUrl: 'seats.html',
})
export class SeatDialog {
  constructor(
    public dialogRef: MatDialogRef<SeatDialog>,
    @Inject(MAT_DIALOG_DATA) public data: NoteDialogData, private bookingService:BookingsService) { }

  hasError: boolean;
  errorMessage: string;
  seatsNumber: number;

  //note: string;

  ngOnInit() {

    console.log(this.data.localBookingUser)

  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirmClick() {
    console.log(this.seatsNumber)

    var booking = {
      docId: this.data.booking.docId,
      seatsOverwrite: this.seatsNumber,
    } as Booking;
    this.bookingService.updateBooking(this.data.booking.docId, booking)
    .then(() => this.dialogRef.close())
    .catch((err) => { alert(err) })
  }
}



@Component({
  selector: 'lvlpoint-dialog',
  templateUrl: 'lvlpoints.html',
})
export class LvlPointsDialog {
  constructor(
    public dialogRef: MatDialogRef<LvlPointsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: NoteDialogData, private bookingService:BookingsService) { }

  hasError: boolean;
  errorMessage: string;
  levelPoints: number;

  //note: string;

  ngOnInit() {
    console.log(this.data.localBookingUser)
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirmClick() {
    console.log(this.levelPoints)
    var booking = {
      docId: this.data.booking.docId,
      levelRestrictionOverwrite: this.levelPoints,
    } as Booking;
    this.bookingService.updateBooking(this.data.booking.docId, booking)
    .then(() => this.dialogRef.close())
    .catch((err) => { alert(err) })
  }
}

export interface NoteDialogData {
  loggedInUser: Account,
  localBookingUser: LocalBookingUser;
  booking: Booking;

}




