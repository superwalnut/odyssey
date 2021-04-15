import { Component, Input, OnInit } from '@angular/core';
import { Credit } from '../../../models/credit';
import { CreditService } from '../../../services/credit.service';

@Component({
  selector: 'app-usercredit-list',
  templateUrl: './usercredit-list.component.html',
  styleUrls: ['./usercredit-list.component.scss']
})
export class UserCreditListComponent implements OnInit {
  @Input() userDocId: string;
  @Input() isCreditUser: boolean;

  credits: Credit[];
  balance: number;
  hasCredit: boolean;

  constructor(private creditService: CreditService) { }

  ngOnInit(): void {

    this.creditService.getBalance(this.userDocId).subscribe(x => {
      this.balance = x;
      this.hasCredit = x > 0;
    });

    this.creditService.getByUser(this.userDocId).subscribe(x => {
      console.log('credits', x);
      this.credits = x;
    });
  }

}
