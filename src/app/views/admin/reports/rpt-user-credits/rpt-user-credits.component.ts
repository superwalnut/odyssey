import { Component, AfterViewInit, OnInit,Inject, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';

import { MatTableDataSource } from "@angular/material/table";
import { map, take, takeUntil } from 'rxjs/operators';
import { BookingSchedule } from '../../../../models/booking-schedule';
import { AccountService } from '../../../../services/account.service';
import { CreditService } from '../../../../services/credit.service';
import { UserBalance } from '../../../../models/user-balance';
import { BaseComponent } from '../../../base-component';
import { User } from '../../../../models/user';
import { CreditBalanceService } from '../../../../services/credit-balance.service';
import { MailgunService } from '../../../../services/mailgun.service';

import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;
import { combineLatest, Observable } from 'rxjs';
import { Credit } from '../../../../models/credit';

@Component({
  selector: 'app-rpt-user-credits',
  templateUrl: './rpt-user-credits.component.html',
  styleUrls: ['./rpt-user-credits.component.scss']
})
export class RptUserCreditsComponent extends BaseComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    "userName",
    //"userDocId",
    "balance",
    "Action"
  ];
  dataSource = new MatTableDataSource<UserBalance>();
  @ViewChild(MatSort) sort: MatSort;
  users:User[];
  userBalances:UserBalance[];
  lastUpdated:Timestamp;
  sentUserList:string[]=[];

  constructor(private accountService:AccountService, private creditService:CreditService, private creditBalanceService:CreditBalanceService, private mailGunService:MailgunService) { 
    super();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.accountService.getAllUsers().pipe(takeUntil(this.ngUnsubscribe)).subscribe(x=>{
      this.users = x.filter(o=>o.parentUserDocId == undefined || o.parentUserDocId == null || o.parentUserDocId == '');
      this.users = this.users.filter(o=> o.isCreditUser);

      this.creditBalanceService.getLatestStatement().pipe(takeUntil(this.ngUnsubscribe)).subscribe(b=>{
        if(b){
          this.dataSource = new MatTableDataSource(b.userBalances);
          this.dataSource.sort = this.sort;
          this.lastUpdated = b.lastUpdated;
          this.userBalances = b.userBalances;
        }
      });
    })
  }

  
  onCreateClick() {
    console.log('generate report');
    var subscriptionArray:Observable<UserBalance>[] = [];

    this.users.forEach((user,i)=>{
      const sub = this.creditService.getUserBalance(user.docId, user.name);
      subscriptionArray[i] = sub;
    });

    combineLatest(subscriptionArray).pipe(take(1)).subscribe(balances => {
      console.log('balances', balances);
      this.creditBalanceService.createCredit(balances).then(x=>{
        console.log('generated statement');
      });
    });
  }

  onEmailNotifiy() {
    const lowUsers = this.userBalances.filter(x=>x.balance <= 20);
    console.log(lowUsers);

    lowUsers.forEach(lu=> {
      var found = this.users.find(u=> u.docId == lu.userDocId);
      if (found) {
        this.mailGunService.sendCreditReminder(found.email, lu.userName, lu.balance)
        .then(() => {
          this.sentUserList.push(lu.userName);
        })
        .catch((err) => { alert(err) })
      }
    })
  }
  
  downloadFile() {
    const data = this.userBalances; 
    super.downloadFile(data, 'user-credit-report');
  }

}
