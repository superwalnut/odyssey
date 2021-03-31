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
  booking: Booking;
  allLocalBookingUsers: LocalBookingUser[];
  hasCredit: boolean;
  defaultPayment = GlobalConstants.paymentCredit;
  //total
  // total: number = 0;
  // totalCredit: number = 0;
  // totalCash: number = 0;

  total = 0;
  totalCredit = 0;
  totalCash = 0;
  totalBank = 0;
  totalAdjust = 0;

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

  constructor(private fb: FormBuilder, private dialogRef: MatDialog, private snackBar: MatSnackBar, public dialog: MatDialog, private groupTransactionService: GroupTransactionService, private bookingService: BookingsService, private bookingPersonService: BookingPersonService, private accountService: AccountService, private creditService: CreditService, private activatedRoute: ActivatedRoute) { super() }

  ngOnInit(): void {
    this.bookingDocId = this.activatedRoute.snapshot.params.id;
    this.loggedInAccount = this.accountService.getLoginAccount();
    this.getBookingDetail();
    this.getBookingPersons();
    this.getGroupTransaction();

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
      amount: this.selectedPaymentMethod == GlobalConstants.paymentCredit ? GlobalConstants.rateCredit : GlobalConstants.rateCash,
      isPaid: true,
      createdOn: Timestamp.now(),
    } as BookingPerson;

    console.log(bp);
    this.bookingPersonService.createBookingPerson(bp);

  }

  withdrawBooking(lbu: LocalBookingUser) {

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
      this.bookingPersonService.withdraw(bp.docId, bp)
        .catch((err) => {
          //errorMessage = err.toString();
          alert(err);
          console.log(err);
        });
    }
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


    this.bookingPersonService.updatePaymentStatus(bp, bpFull, this.data.loggedInUser.docId, this.data.loggedInUser.name)
      .then(() => {
        this.dialogRef.close();
      })
      .catch((err) => { alert(err) })

    // let paymentAmount = this.paid ? this.data.localBookingUser.amount : -this.data.localBookingUser.amount;
    // let paymentNotes = this.paid ? 'paid' : 'unpaid';


    // //add to group transaction table
    // var groupTransaction = {
    //   amount: paymentAmount,
    //   notes: paymentNotes,
    //   paymentMethod: GlobalConstants.paymentAdjust,
    //   referenceId: this.data.loggedInUser.docId,
    //   groupDocId: this.data.booking.groupDocId,
    //   bookingDocId: this.data.booking.docId,
    //   createdBy: this.data.loggedInUser.docId,
    //   createdByDisplayName: this.data.loggedInUser.name,
    //   created: Timestamp.now(),
    // } as GroupTransaction;
    // console.log('mark payment status: ', groupTransaction);
    // this.groupTransactionService.createGroupTransaction(groupTransaction)
    //   .then(() => {
    //     this.dialogRef.close();
    //   })
    //   .catch((err) => { alert(err) })
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


export interface NoteDialogData {
  loggedInUser: Account,
  localBookingUser: LocalBookingUser;
  booking: Booking;

}




