import { Component, Inject, OnInit } from '@angular/core';
import { Group } from '../../../../models/group';
import { GroupService } from "../../../../services/group.service";
import { AccountService } from "../../../../services/account.service";
import { GroupTransactionService } from "../../../../services/group-transaction.service";
import { BaseComponent } from '../../../base-component';
import { GroupsComponent } from '../../../groups/groups.component';
import { Account } from '../../../../models/account';
import { GroupTransaction } from '../../../../models/group-transaction';
import { User } from '../../../../models/user';
import { GlobalConstants } from '../../../../common/global-constants';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventLoggerService } from '../../../../services/event-logger.service';
import { EventLogger } from '../../../../models/event-logger';
import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;

@Component({
  selector: 'app-rpt-income',
  templateUrl: './rpt-income.component.html',
  styleUrls: ['./rpt-income.component.scss']
})
export class RptIncomeComponent extends BaseComponent implements OnInit {

  isGod:boolean;
  groups: Group[];
  selectedGroup: Group;
  loggedInAccount: Account;
  transactions: GroupTransaction[];
  groupBalance: number;
  committeeUsers: User[];
  //selectedMode = "income";

  constructor(private groupService: GroupService, private groupTransactionService: GroupTransactionService,
    private accountService: AccountService, public dialog: MatDialog) { super() }

  ngOnInit(): void {
    this.loggedInAccount = this.accountService.getLoginAccount();
    this.isGod = this.accountService.isGod();

    this.getGroups();
  }

  getGroups() {
    this.groupService.getGroups().subscribe(gs => {
      this.groups = gs;
    })
  }

  viewClicked() {
    console.log(this.selectedGroup)

    let isCommittee = this.selectedGroup.committees.find(x => x == this.loggedInAccount.docId);
    if (!isCommittee) { alert("you are not a committee of this group"); return false; }

    this.getCommittees();
    this.getGroupTransactionReport();
  }


  getCommittees() {
    this.accountService.getUsersByUserDocIds(this.selectedGroup.committees).subscribe(result=>{
      this.committeeUsers = result;
    })
  }
  getGroupTransactionReport() {
    this.groupTransactionService.getByGroupDocId(this.selectedGroup.docId).subscribe(gts => {
      this.transactions = gts;
      console.log(gts)
    })

    this.groupTransactionService.getBalance(this.selectedGroup.docId).subscribe(balance => {
      this.groupBalance = balance;
      console.log(balance)
    })

  }

  dividendClicked(){
    const dialogRef = this.dialog.open(DividendDialog, {
      width: '650px',
      data: {
        loggedInUser: this.loggedInAccount,
        groupBalance: this.groupBalance,
        group: this.selectedGroup,
        committees: this.committeeUsers,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dividend dialog was closed');

    });
  }
}


@Component({
  selector: 'dividend-dialog',
  templateUrl: 'dividend.html',
})
export class DividendDialog {
  constructor(
    public dialogRef: MatDialogRef<DividendDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DividendDialogData, private eventLogService:EventLoggerService, private accountService: AccountService) { }

  hasError: boolean;
  errorMessage: string;
  isLoading: boolean;
  unitDividend:number;


  ngOnInit() {
    this.unitDividend = this.data.groupBalance / this.data.committees.length;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmClicked() {
    // substract total balance from groupTransaction table.
    // add credit to each committee
    this.isLoading = true;
  }
}

export interface DividendDialogData {
  loggedInUser: Account,
  groupBalance: number;
  group: Group;
  committees:User[];
  
}
