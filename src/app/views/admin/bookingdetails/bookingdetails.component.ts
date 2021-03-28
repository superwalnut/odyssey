import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { BookingPersonService } from "../../../services/booking-person.service";
import { BookingsService } from "../../../services/bookings.service";
import { Account } from "../../../models/account";

import { CreditService } from "../../../services/credit.service";
import { BaseComponent } from '../../base-component';
import { Booking } from '../../../models/booking';
import { AccountService } from '../../../services/account.service';
import { LocalBookingUser } from '../../../models/custom-models';
import { GlobalConstants } from '../../../common/global-constants';

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
  

  constructor(private bookingService:BookingsService, private bookingPersonService:BookingPersonService, private accountService:AccountService, private creditService:CreditService, private activatedRoute:ActivatedRoute) { super() }

  ngOnInit(): void {
    this.bookingDocId = this.activatedRoute.snapshot.params.id;
    this.loggedInAccount = this.accountService.getLoginAccount();

    this.getBookingDetail();
    this.getBookingPersons()

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
