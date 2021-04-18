import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { BaseComponent } from '../../../base-component';
import { AccountService } from "../../../../services/account.service";
import { Account } from '../../../../models/account';
import { BookingPersonService } from "../../../../services/booking-person.service";
import { BookingPerson } from '../../../../models/booking-person';


@Component({
  selector: 'app-rpt-bookingperson',
  templateUrl: './rpt-bookingperson.component.html',
  styleUrls: ['./rpt-bookingperson.component.scss']
})
export class RptBookingpersonComponent extends BaseComponent implements OnInit {

  groupDocId:string;
  isGod: boolean;
  loggedInAccount: Account;
  bps:BookingPerson[];


  constructor(private bookingPersonService:BookingPersonService, private accountService: AccountService, private activatedRoute: ActivatedRoute) { super() }

  ngOnInit(): void {
    this.groupDocId = this.activatedRoute.snapshot.params.id;
    this.loggedInAccount = this.accountService.getLoginAccount();
    this.isGod = this.accountService.isGod();
    this.getBookingPersons(this.groupDocId);
  }

  getBookingPersons(groupDocId:string) {

    this.bookingPersonService.getBookingPersonsByGroupDocId(groupDocId).subscribe(result=>{

      this.bps = result;

    })

  }

}
