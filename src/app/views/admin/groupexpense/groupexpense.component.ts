import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, } from "@angular/core";
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Account } from "../../../models/account";
import { GlobalConstants } from '../../../common/global-constants';

import { Group } from "../../../models/group";
import { AccountService } from "../../../services/account.service";
import { GroupService } from "../../../services/group.service";
import { GroupExpenseService } from "../../../services/group-expense.service";

import { User } from "../../../models/user";
import { GroupExpense } from "../../../models/group-expense";


@Component({
  selector: 'app-groupexpense',
  templateUrl: './groupexpense.component.html',
  styleUrls: ['./groupexpense.component.scss']
})
export class GroupexpenseComponent implements OnInit {
  form: FormGroup;
  submitted: boolean = false;
  loggedInUser: Account;
  groupDocId: string;
  isEditMode: boolean;
  expenseTypes: string[] = GlobalConstants.groupExpenseTypes;

  groups: Group[] = [];
  displayedColumns: string[] = [
    "startDate",
    "endDate",
    "expenseType",
    "amount",
    "notes",
    "Action",
  ];
  dataSource = new MatTableDataSource<GroupExpense>();
  @ViewChild(MatSort) sort: MatSort;


  constructor(private fb: FormBuilder, private groupExpenseService: GroupExpenseService, private groupService: GroupService, private accountService: AccountService, private snackBar: MatSnackBar, private activatedRoute: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {

    this.groupDocId = this.activatedRoute.snapshot.params.id;

    this.loggedInUser = this.accountService.getLoginAccount();


    console.log("edit mode: ", this.isEditMode);
    console.log("group id: ", this.groupDocId);

    if (this.groupDocId) {
      this.isEditMode = true;
    }

    this.form = this.fb.group({
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      expenseType: ["", Validators.required],
      amount: ["", Validators.required],
      notes: ["", Validators.required],
    });

    this.getExpenseByGroupDocId(this.groupDocId);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }


  onSubmit() {
    this.submitted = true;
    if (!this.groupDocId) {
      alert("illegal not to have group ID");
      return false;
    }

    var expense = {
      groupDocId: this.groupDocId,
      startDate: this.form.value.startDate,
      endDate: this.form.value.endDate,
      expenseType: this.form.value.expenseType,
      amount: this.form.value.amount,
      notes: this.form.value.notes,
    } as GroupExpense;

    console.log(expense);

    this.groupExpenseService.createGroupExpense(expense, this.loggedInUser.docId).then((x) => {
      this.snackBar.open(`Expense has been created.`, null, {
        duration: 5000,
        verticalPosition: "top"
      })

    });


    if (this.groupDocId) {
      console.log("expense has doc id");
      expense.docId = this.groupDocId;
      expense.updatedBy = this.loggedInUser.docId;

      //this.groupService.updateGroup(this.groupDocId, expense);
    } else {
      console.log("expense has no doc id");
      //expense.createdBy = this.loggedInUser.docId;
      this.groupExpenseService.createGroupExpense(expense, this.loggedInUser.docId).then((x) => {
        this.snackBar.open(`Expense has been created.`, null, {
          duration: 5000,
          verticalPosition: "top"
        })

      });
    }
    this.router.navigate(["/admin/groups"]);
  }

  getExpenseByGroupDocId(groupDocId: string) {
    this.groupExpenseService.getByGroupDocId(groupDocId).subscribe(x => {
      this.dataSource.data = x;
    });
  }

  getByDocId(docId: string) {
    // if (this.groupDocId) {
    //   this.groupService.getGroup(this.groupDocId).subscribe((x) => {
    //     this.form.patchValue({
    //       startDate: x.startDate.toDate(),
    //       endDate: x.endDate.toDate(),
    //       expenseType: x.,
    //     });

    //   });
    // }
  }


  get f() {
    return this.form.controls;
  }


}
