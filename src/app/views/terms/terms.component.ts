import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from '../../common/global-constants';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {

  autoBookngMiniumCreditRequired = GlobalConstants.autoBookingMiniumCreditRequired


  constructor() { }

  ngOnInit(): void {
  }

}
