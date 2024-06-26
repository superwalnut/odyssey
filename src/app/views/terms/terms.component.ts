import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from '../../common/global-constants';
import { environment } from '../../../environments/environment';
import { Account } from '../../models/account';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {
  loggedInUser: Account;

  autoBookngMiniumCreditRequired = GlobalConstants.autoBookingMiniumCreditRequired
  cashPayment = environment.payments.cashPay;
  memberTopup50 = environment.payments.memberTopup50;
  memberTopup100 = environment.payments.memberTopup100;
  memberTopup170 = environment.payments.memberTopup170;
  memberTopup300 = environment.payments.memberTopup300;

  constructor(
    private accountService: AccountService,
  ) { 
    this.loggedInUser = this.accountService.getLoginAccount();

    this.cashPayment = `${environment.payments.cashPay}?prefilled_email=${this.loggedInUser.email}`;
    this.memberTopup50 = `${environment.payments.memberTopup50}?prefilled_email=${this.loggedInUser.email}`;
    this.memberTopup100 = `${environment.payments.memberTopup100}?prefilled_email=${this.loggedInUser.email}`;;
    this.memberTopup170 = `${environment.payments.memberTopup170}?prefilled_email=${this.loggedInUser.email}`;;
    this.memberTopup300 = `${environment.payments.memberTopup300}?prefilled_email=${this.loggedInUser.email}`;;
 }

  ngOnInit(): void {
  }

}
