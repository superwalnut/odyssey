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

import { LocalBookingUser } from '../../../models/custom-models';
import { GlobalConstants } from '../../../common/global-constants';
import { MatSelectChange } from "@angular/material/select";
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
  total = 0;
  totalCredit = 0;
  totalCash = 0;
  totalBank = 0;
  totalAdjust = 0;
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


  paymentMethods: string[] = [GlobalConstants.paymentCredit, GlobalConstants.paymentCash, GlobalConstants.paymentBank];

  constructor(private fb: FormBuilder, private dialogRef: MatDialog, private snackBar: MatSnackBar, public dialog: MatDialog, private groupService: GroupService, private groupTransactionService: GroupTransactionService, private bookingService: BookingsService, private bookingPersonService: BookingPersonService, private accountService: AccountService, private creditService: CreditService, private activatedRoute: ActivatedRoute) { super() }

  ngOnInit(): void {
    this.bookingDocId = this.activatedRoute.snapshot.params.id;
    this.groupDocId = this.activatedRoute.snapshot.params.groupId;
    this.loggedInAccount = this.accountService.getLoginAccount();
    this.getBookingDetail();
    this.getBookingPersons();
    this.getGroupTransaction();
    this.getGroupDetail();

    //this.selectedPaymentMethod = GlobalConstants.paymentCredit;
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

  getGroupTransaction() {
    this.groupTransactionService.getByBookingDocId(this.bookingDocId).subscribe(result => {
      console.log('grouptrans', result);
      this.groupTransactions = result;
      this.getGroupTransactionAdjusted();
    });
  }

  getGroupDetail() {
    this.groupService.getGroup(this.groupDocId).subscribe(g => {
      this.group = g;
    })
  }

  getGroupTransactionAdjusted() {
    this.total = 0;
    this.totalCredit = 0;
    this.totalCash = 0;
    this.totalBank = 0;

    //let paidTransaction = this.groupTransactions.filter(x=>x.)
    this.groupTransactions.forEach(tran => {
      this.total += tran.amount;
      if (tran.paymentMethod == GlobalConstants.paymentCredit) {
        this.totalCredit += tran.amount;
      } else if (tran.paymentMethod == GlobalConstants.paymentCash) {
        this.totalCash += tran.amount;
      } else if (tran.paymentMethod == GlobalConstants.paymentBank) {
        this.totalBank += tran.amount;
      } else if (tran.paymentMethod == GlobalConstants.paymentAdjust) {
        this.totalAdjust += tran.amount;
      }
    })
    this.groupTransactionsAdjusted = this.groupTransactions.filter(x => x.paymentMethod == GlobalConstants.paymentAdjust);

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allUsers.filter(option => option.toLowerCase().includes(filterValue));
  }
  selectedValue(event: MatSelectChange) {
    this.selectedPaymentMethod = event.value;
    console.log(this.selectedPaymentMethod);
  }
  createBooking(selectedUserControl) {
    console.log(this.selectedPaymentMethod);
    if (this.selectedPaymentMethod == null) { return false; }
    if (selectedUserControl.value == null) { return false; }
    var user = this.allUsersObject.filter(x => { return x.name === selectedUserControl.value });
    console.log(user);

    let bp = {
      bookingDocId: this.bookingDocId,
      groupDocId: this.booking.groupDocId,
      bookingDesc: this.booking.weekDay,
      userId: user[0].docId,
      userDisplayName: user[0].name,
      paymentMethod: this.selectedPaymentMethod, //Credit | Cash | Bank Transfer`
      parentUserId: user[0].parentUserDocId ? user[0].parentUserDocId : user[0].docId,
      parentUserDisplayName: user[0].parentUserDisplayName ? user[0].parentUserDisplayName : user[0].name,
      isForSale: false,
      amount: this.getPaymentAmount(user[0].docId, this.selectedPaymentMethod),
      isPaid: this.selectedPaymentMethod == GlobalConstants.paymentCredit ? true : false,
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

  getPaymentAmount(userDocId: string, paymentMethod: string): number {
    let committees = this.group.committees;

    let found = committees.find(c => c.docId == userDocId);
    if (found) { return 0; } // committee is free of charge

    if (paymentMethod == GlobalConstants.paymentCredit) {
      return GlobalConstants.rateCredit;
    }
    return GlobalConstants.rateCash;

  }

  getBookingDetail() {
    this.bookingService.get(this.bookingDocId).subscribe(result => {
      this.booking = result;
    })
  }

  getBookingPersons() {
    this.bookingPersonService.getCustomByBookingDocId(this.bookingDocId, this.loggedInAccount.docId).subscribe(result => {
      this.allLocalBookingUsers = result;
      console.log("getByBookingPersonsByBookingDocId(): ", this.allLocalBookingUsers);
      //this.calculateTotal();
    })
  }

  calculateTotal() {
    this.total = 0;
    this.allLocalBookingUsers.forEach(b => {
      this.total += b.amount;
      console.log(this.total);
      if (b.paymentMethod == GlobalConstants.paymentCredit) { this.totalCredit += b.amount }
      if (b.paymentMethod == GlobalConstants.paymentCash) { this.totalCash += b.amount }
    })
  }
  //cil-dollar, cil-credit-card
  getPaymentClass(paymentMethod: string) {
    // if (paymentMethod == GlobalConstants.paymentCredit) { return "cil-credit-card"; }
    // else if (paymentMethod == GlobalConstants.paymentCash) { return "cil-dollar"; }
    if (paymentMethod == GlobalConstants.paymentCredit) { return "credit_card"; }
    else if (paymentMethod == GlobalConstants.paymentCash) { return "attach_money"; }
    else if (paymentMethod == GlobalConstants.paymentBank) { return "atm"; }

  }

  toggleLockStatus() {
    this.booking.isLocked = !this.booking.isLocked;
    this.bookingService.updateBooking(this.bookingDocId, this.booking);
  }

  changeSeatClicked() {
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




