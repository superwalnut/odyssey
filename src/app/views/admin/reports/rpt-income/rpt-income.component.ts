import { Component, OnInit } from '@angular/core';
import { Group } from '../../../../models/group';
import { GroupService } from "../../../../services/group.service";
import { AccountService } from "../../../../services/account.service";
import { GroupTransactionService } from "../../../../services/group-transaction.service";
import { BaseComponent } from '../../../base-component';
import { GroupsComponent } from '../../../groups/groups.component';
import { Account } from '../../../../models/account';
import { GroupTransaction } from '../../../../models/group-transaction';



@Component({
  selector: 'app-rpt-income',
  templateUrl: './rpt-income.component.html',
  styleUrls: ['./rpt-income.component.scss']
})
export class RptIncomeComponent extends BaseComponent implements OnInit {

  groups: Group[];
  selectedGroup: Group;
  loggedInAccount: Account;
  transactions: GroupTransaction[];
  groupExpenseBalance: number;
  groupBalance: number;
  //selectedMode = "income";

  constructor(private groupService: GroupService, private groupTransactionService: GroupTransactionService,
    private accountService: AccountService) { super() }

  ngOnInit(): void {
    this.loggedInAccount = this.accountService.getLoginAccount();
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

    this.getGroupTransactionReport();
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



}
