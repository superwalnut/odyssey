import { Component, OnInit } from '@angular/core';
import { AccountService } from "../../../../services/account.service";
import { BaseComponent } from '../../../base-component';
import { Account } from '../../../../models/account';
import { BookingPerson } from '../../../../models/booking-person';
import { BookingPersonService } from '../../../../services/booking-person.service';


@Component({
  selector: 'app-rpt-unpaid',
  templateUrl: './rpt-unpaid.component.html',
  styleUrls: ['./rpt-unpaid.component.scss']
})
export class RptUnpaidComponent extends BaseComponent implements OnInit {
  loggedInAccount: Account;
  unpaidUsers: BookingPerson[];

  constructor(private accountService: AccountService, private bpService: BookingPersonService) { super() }

  ngOnInit(): void {
    this.loggedInAccount = this.accountService.getLoginAccount();

    this.getUnpaidUser();
  }

  getUnpaidUser() {
    this.bpService.getAllUnpaid().subscribe(bps => {
      this.unpaidUsers = bps;
    })
  }

}
