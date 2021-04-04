import { Component, OnInit } from '@angular/core';
import { Group } from '../../../../models/group';
import { GroupService } from "../../../../services/group.service";
import { AccountService } from "../../../../services/account.service";
import { GroupTransactionService } from "../../../../services/group-transaction.service";
import { BaseComponent } from '../../../base-component';
import { GroupsComponent } from '../../../groups/groups.component';
import { Account } from '../../../../models/account';
import { GroupTransaction } from '../../../../models/group-transaction';
import { GroupExpense } from '../../../../models/group-expense';
import { GroupExpenseService } from '../../../../services/group-expense.service';



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
  expenses: GroupExpense[];
  groupExpenseBalance: number;
  groupBalance: number;
  selectedMode = "income";

  constructor(private groupService: GroupService, private groupTransactionService: GroupTransactionService,
    private accountService: AccountService, private groupExpenseService: GroupExpenseService) { super() }

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

    console.log(this.selectedMode);
    if (this.selectedMode == "income") {
      this.getIncomeReport();
    }
    else {
      this.getExpenseReport();
    }
  }


  getIncomeReport() {
    this.groupTransactionService.getByGroupDocId(this.selectedGroup.docId).subscribe(gts => {
      this.transactions = gts;
      console.log(gts)
    })

    this.groupTransactionService.getBalance(this.selectedGroup.docId).subscribe(balance => {
      this.groupBalance = balance;
      console.log(balance)
    })

  }

  getExpenseReport() {
    this.groupExpenseService.getByGroupDocId(this.selectedGroup.docId).subscribe(gts => {
      this.expenses = gts;
      console.log(gts)
    })

    this.groupExpenseService.getBalance(this.selectedGroup.docId).subscribe(balance => {
      this.groupExpenseBalance = -balance;
      console.log(balance)
    })
  }


}
