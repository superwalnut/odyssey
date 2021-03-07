import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Account } from "../../../models/account";
import { Group } from "../../../models/group";

import { MatSort } from "@angular/material/sort";
// import { MatTableDataSource } from "@angular/material/table";

import { AccountService } from "../../../services/account.service";
import { GroupService } from "../../../services/group.service";

@Component({
  selector: "app-groupdetails",
  templateUrl: "./groupdetails.component.html",
  styleUrls: ["./groupdetails.component.scss"],
})
export class GroupdetailsComponent implements OnInit {
  groupForm: FormGroup;
  submitted: boolean = false;
  loggedInUser: Account;
  groupDocId: string;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.accountService.getLoginAccount();
    if (this.groupDocId) {
      this.isEditMode = true;
    }

    this.groupForm = this.fb.group({
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      termCost: ["", Validators.required],
      groupName: ["", Validators.required],
      groupDesc: ["", Validators.required],
      isClosed: [""],
    });
    this.groupDocId = this.activatedRoute.snapshot.params.id;

    this.getByDocId(this.groupDocId);
  }

  getByDocId(docId: string) {
    if (this.groupDocId) {
      console.log(this.groupDocId);
      var group = this.groupService.getGroup(this.groupDocId).subscribe((x) => {
        console.log(x);
        this.groupForm.patchValue({
          startDate: x.startDate.toDate(),
          endDate: x.endDate.toDate(),
          termCost: x.termCost,
          groupName: x.groupName,
          groupDesc: x.groupDesc,
          isClosed: x.isClosed,
        });
      });
    }
  }

  onSubmit() {
    this.submitted = true;

    var group = {
      startDate: this.groupForm.value.startDate,
      endDate: this.groupForm.value.endDate,
      termCost: this.groupForm.value.termCost,
      groupName: this.groupForm.value.groupName,
      groupDesc: this.groupForm.value.groupDesc,
      isClosed: false,
    } as Group;
    console.log(group);

    if (this.groupDocId) {
      group.docId = this.groupDocId;
      group.isClosed = this.groupForm.value.isClosed;
      group.updatedBy = this.loggedInUser.docId;

      this.groupService.updateGroup(this.groupDocId, group);
    } else {
      group.createdBy = this.loggedInUser.docId;
      this.groupService
        .createGroup(group, this.loggedInUser.docId)
        .then((x) => {
          this.snackBar.open(`Group has been created.`, null, {
            duration: 5000,
            verticalPosition: "top",
          });
        });
    }
    this.router.navigate(["/admin/groups"]);
  }

  get f() {
    return this.groupForm.controls;
  }
}
