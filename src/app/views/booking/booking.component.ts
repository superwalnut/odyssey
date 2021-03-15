import { Component, OnInit } from '@angular/core';
import { Group } from "../../models/group";
import { GroupService } from "../../services/group.service";
import { Booking } from "../../models/booking";
import { BookingPerson } from "../../models/booking-person";

import { BookingsService } from "../../services/bookings.service";
import { ActivatedRoute } from "@angular/router";
import { GlobalConstants } from '../../common/global-constants';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {

  panelOpenState = false;
  group:Group;
  bookingPerons:BookingPerson[];


  constructor(private groupService:GroupService, private bookingService:BookingsService,private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {

    var groupDocId = this.activatedRoute.snapshot.params.id;
    this.getGroupDetail(groupDocId);
    this.getCurrentBooking(groupDocId);
  }

  getGroupDetail(groupDocId:string) {
    this.groupService.getGroup(groupDocId).subscribe(g=>{
      this.group = g;
      console.log(this.group);

    });

  }

  //cil-dollar, cil-credit-card
  getPaymentClass(paymentMethod:string) {
    if (paymentMethod == GlobalConstants.paymentCredit) {
      return "cil-credit-card";
    }
    else if (paymentMethod == GlobalConstants.paymentCash) {
      return "cil-dollar";
    }
  }

  getCurrentBooking(groupDocId:string) {
    this.bookingService.getThisWeeksBooking(groupDocId).subscribe(b=>{
      console.log("getcurrentbooking(): ", b);
      this.bookingPerons=b.people;

    });

  }

}
