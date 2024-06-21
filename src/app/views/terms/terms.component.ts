import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from '../../common/global-constants';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {

  autoBookngMiniumCreditRequired = GlobalConstants.autoBookingMiniumCreditRequired
  cashPay = environment.payments.cashPay;
  memberTopup50 = environment.payments.memberTopup50;
  memberTopup100 = environment.payments.memberTopup100;
  memberTopup170 = environment.payments.memberTopup170;
  memberTopup300 = environment.payments.memberTopup300;

  constructor() { }

  ngOnInit(): void {
  }

}
