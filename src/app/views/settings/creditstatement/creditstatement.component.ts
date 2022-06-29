import { Component, OnInit } from '@angular/core';
import { createNoSubstitutionTemplateLiteral } from 'typescript';
import { AccountService } from '../../../services/account.service';
import { User } from '../../../models/user';
import { GlobalConstants } from '../../../common/global-constants';
import { EventLoggerService } from '../../../services/event-logger.service';
import { EventLogger } from '../../../models/event-logger';

@Component({
  selector: 'app-creditstatement',
  templateUrl: './creditstatement.component.html',
  styleUrls: ['./creditstatement.component.scss']
})
export class CreditstatementComponent implements OnInit {
  userDocId:string;
  isCreditUser:boolean;

  constructor(private accountService:AccountService, private eventLogService:EventLoggerService) { }

  ngOnInit(): void {
    this.accountService.getLoginUser().subscribe(x=>{
      console.log(x);
      this.userDocId = x.docId;
      this.isCreditUser = x.isCreditUser;
      //this.logToEvent(x);
    });
  }


  logToEvent(user:User) {
    var log = {
      eventCategory: GlobalConstants.eventWebActivity,
      notes: 'Viewing statement',
    } as EventLogger
    this.eventLogService.createLog(log, user.docId, user.name);

  }

}
