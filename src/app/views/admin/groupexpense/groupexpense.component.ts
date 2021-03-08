import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, } from "@angular/core";
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Account } from "../../../models/account";
import { GlobalConstants } from '../../../common/global-constants';

import { Group } from "../../../models/group";
import { AccountService } from "../../../services/account.service";
import { GroupService } from "../../../services/group.service";
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



  constructor(private fb: FormBuilder, private groupService: GroupService, private accountService: AccountService, private snackBar: MatSnackBar, private activatedRoute: ActivatedRoute, private router: Router) {
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

    //this.getByDocId(this.groupDocId);
  }



  onSubmit() {
    this.submitted = true;

    var expense = {
      startDate: this.form.value.startDate,
      endDate: this.form.value.endDate,
      expenseType: this.form.value.expenseType,
      amount: this.form.value.amount,
      notes: this.form.value.notes,
    } as GroupExpense;

    if (this.groupDocId) {
      expense.docId = this.groupDocId;
      expense.updatedBy = this.loggedInUser.docId;

      //this.groupService.updateGroup(this.groupDocId, expense);
    } else {
      expense.createdBy = this.loggedInUser.docId;
      // this.groupService
      //   .createGroup(group, this.loggedInUser.docId)
      //   .then((x) => {
      //     this.snackBar.open(`Group has been created.`, null, {
      //       duration: 5000,
      //       verticalPosition: "top",
      //     });
      //   });
    }
    this.router.navigate(["/admin/groups"]);
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
