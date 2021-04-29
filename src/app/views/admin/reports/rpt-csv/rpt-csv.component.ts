import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { Credit } from '../../../../models/credit';
import { AccountService } from '../../../../services/account.service';
import { BookingScheduleService } from '../../../../services/booking-schedule.service';
import { CreditService } from '../../../../services/credit.service';
import { BaseComponent } from '../../../base-component';

@Component({
  selector: 'app-rpt-csv',
  templateUrl: './rpt-csv.component.html',
  styleUrls: ['./rpt-csv.component.scss']
})
export class RptCsvComponent extends BaseComponent implements OnInit {
  userCredits:Credit[] = [];

  constructor(private creditService:CreditService, private userService:AccountService, private bookignScheduleService:BookingScheduleService) { 
    super();
  }

  ngOnInit(): void {
  }

  downloadUserCredits() {
    this.creditService.getAllCredits().pipe(take(1)).subscribe(x=>{
      const data = x.map(c=>{
        return {
          'amount': c.amount,
          'date': c.created?.toDate()??'',
          'note': c.note,
          'userName': c.userDisplayName,
          'userId': c.userDocId,
          'category': c.category,
        };
      });
      console.log('downloadcredits', data);
      super.downloadFile(data, 'user-credit-transactions');
    });
  }
}
