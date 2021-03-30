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

import { CreditService } from "../../../services/credit.service";
import { BaseComponent } from '../../base-component';
import { Booking } from '../../../models/booking';
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
  total: number = 0;
  totalCredit: number = 0;
  totalCash: number = 0;
  //type ahead
  myControl = new FormControl();
  allUsers: string[] = [];
  allUsersObject: User[];
  filteredUsers: Observable<string[]>;
  //selectedUser: User;
  selectedPaymentMethod: string;

  paymentMethods: string[] = [GlobalConstants.paymentCredit, GlobalConstants.paymentCash, GlobalConstants.paymentBank];

  constructor(private fb: FormBuilder, private dialogRef: MatDialog, public dialog: MatDialog, private groupTransactionService: GroupTransactionService, private bookingService: BookingsService, private bookingPersonService: BookingPersonService, private accountService: AccountService, private creditService: CreditService, private activatedRoute: ActivatedRoute) { super() }

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

    });

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
      isPaid: this.selectedPaymentMethod == GlobalConstants.paymentCredit,
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
      this.calculateTotal();
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
    if (paymentMethod == GlobalConstants.paymentCredit) { return "cil-credit-card"; }
    else if (paymentMethod == GlobalConstants.paymentCash) { return "cil-dollar"; }
  }

  toggleLockStatus() {
    this.booking.isLocked = !this.booking.isLocked;
    this.bookingService.updateBooking(this.bookingDocId, this.booking);
  }

  onSubmit() {

    //insert into GroupTransaction table

    var credit = {
      amount: this.adjustForm.value.adjustAmount,
      note: this.adjustForm.value.note,



    } as Credit;
    // this.creditService.createCredit(credit)
    //   .catch((err) => {
    //     //errorMessage = err.toString();
    //     alert(err);
    //     console.log(err);
    //   });


    // var group = {

    //   eventStartDay: this.groupForm.value.eventStartDay,
    //   eventStartTime: this.groupForm.value.eventStartTime,
    //   bookingStartDay: this.groupForm.value.bookingStartDay,
    //   groupName: this.groupForm.value.groupName,
    //   groupDesc: this.groupForm.value.groupDesc,
    //   seats: this.groupForm.value.seats,
    //   committees: this.getCommitteeUserDocIds(),
    //   isClosed: false,
    // } as Group;

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
    @Inject(MAT_DIALOG_DATA) public data: NoteDialogData, private bookingPersonService: BookingPersonService, private accountService: AccountService) { }

  hasError: boolean;
  errorMessage: string;

  note: string;

  ngOnInit() {

    console.log(this.data.localBookingUser)

  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  saveClick() {
    console.log(this.note);
    if (!this.note) {
      this.dialogRef.close()
      return false;
    }


    var bp = {
      docId: this.data.localBookingUser.docId,
      notes: this.note,
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




