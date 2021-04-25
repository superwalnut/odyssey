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
      super.downloadFile(data, 'user-credit-transactions');
    });
  }

  downloadAllUsers() {
    this.userService.getAllUsers().pipe(take(1)).subscribe(x=>{
      const data = x.map(c=>{
        return {
          'userId': c.docId,
          'name': c.name,
          'email': c.email,
          'mobile': c.mobile,
          'gender': c.gender,
          'isMember': c.isMember,
          'disabled': c.disabled,
          'isCreditUser':c.isCreditUser,
          'created': c.created.toDate(),
          'updated': c.updated.toDate(),
          'grade': c.grade,
          'gradePoints': c.gradePoints,
          'isChild': c.isChild,
          'parentUserDocId': c.parentUserDocId,
          'parentUserName': c.parentUserDisplayName,
        };
      });
      super.downloadFile(data, 'user-lists');
    });
  }

  downloadAllBookingSchedule() {
    this.bookignScheduleService.getAllBookingSchedules().pipe(take(1)).subscribe(x=>{
      const data = x.map(c=>{
        return {
          'userId': c.user.docId,
          'userName': c.user.name,
          'createdOn': c.createdOn.toDate(),
          'expireOn' : c.expireOn.toDate(),
          'groupDocId': c.groupDocId,
          'groupName': c.groupName,
          'isPaused': c.isPaused,
        };
      });
      super.downloadFile(data, 'booking-schedules');
    });
  }

}
