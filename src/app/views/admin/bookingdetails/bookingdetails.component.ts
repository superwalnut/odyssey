import { Component, OnInit, Testability } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { Observable } from 'rxjs';
import { filter, map, mergeMap, startWith, take } from 'rxjs/operators';
import { BookingPersonService } from "../../../services/booking-person.service";
import { BookingsService } from "../../../services/bookings.service";
import { Account } from "../../../models/account";
import { User } from "../../../models/user";

import { CreditService } from "../../../services/credit.service";
import { BaseComponent } from '../../base-component';
import { Booking } from '../../../models/booking';
import { AccountService } from '../../../services/account.service';
import { LocalBookingUser } from '../../../models/custom-models';
import { GlobalConstants } from '../../../common/global-constants';
import { MatSelectChange } from "@angular/material/select";

@Component({
  selector: 'app-bookingdetails',
  templateUrl: './bookingdetails.component.html',
  styleUrls: ['./bookingdetails.component.scss']
})
export class BookingdetailsComponent extends BaseComponent implements OnInit {

  loggedInAccount:Account;
  bookingDocId:string;
  booking:Booking;
  allLocalBookingUsers: LocalBookingUser[];
  hasCredit:boolean;
  //total
  total:number=0;
  totalCredit:number=0;
  totalCash:number=0;
  //type ahead
  bookingForm: FormGroup;
  myControl = new FormControl();
  allUsers: string[] = [];
  allUsersObject: User[];
  filteredUsers: Observable<string[]>;
  //selectedUser: User;
selectedPaymentMethod:string;

  paymentMethods: string[] = [ GlobalConstants.paymentCredit, GlobalConstants.paymentCash ];
  
  constructor(private bookingService:BookingsService, private bookingPersonService:BookingPersonService, private accountService:AccountService, private creditService:CreditService, private activatedRoute:ActivatedRoute) { super() }

  ngOnInit(): void {
    this.bookingDocId = this.activatedRoute.snapshot.params.id;
    this.loggedInAccount = this.accountService.getLoginAccount();
    this.getBookingDetail();
    this.getBookingPersons()

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

    if (selectedUserControl.value == null) { return false; }
    var user = this.allUsersObject.filter(x => { return x.name === selectedUserControl.value });
    //this.selectedUser = user[0];
    console.log(user);


    // this.creditService.getBalance(user[0].docId).subscribe(result=>{
    //   console.log('my credit balance: ' + result);
    //   if (result)
    //     this.hasCredit = result.balance > 0;
    // })


  }



  getBookingDetail(){
    this.bookingService.get(this.bookingDocId).subscribe(result=>{
      this.booking = result;
    })
  }

  getBookingPersons() {
    this.bookingPersonService.getCustomByBookingDocId(this.bookingDocId, this.loggedInAccount.docId).subscribe(result=>{
      this.allLocalBookingUsers = result;
      console.log("getByBookingPersonsByBookingDocId(): ", this.allLocalBookingUsers);
      this.calculateTotal();
    })
  }

  calculateTotal() {
    this.allLocalBookingUsers.forEach(b=>{
      this.total+=b.amount;
      console.log(this.total);
      if (b.paymentMethod == GlobalConstants.paymentCredit) { this.totalCredit += b.amount}
      if (b.paymentMethod == GlobalConstants.paymentCash) { this.totalCash += b.amount}
    })
  }
  //cil-dollar, cil-credit-card
  getPaymentClass(paymentMethod:string) {
    if (paymentMethod == GlobalConstants.paymentCredit) { return "cil-credit-card"; }
    else if (paymentMethod == GlobalConstants.paymentCash) { return "cil-dollar"; }
  }

  toggleLockStatus() {
    this.booking.isLocked = !this.booking.isLocked;
    this.bookingService.updateBooking(this.bookingDocId, this.booking);
  }



}
