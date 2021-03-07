import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, } from "@angular/core";
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Account } from "../../../models/account";
import { Group } from "../../../models/group";
import { AccountService } from "../../../services/account.service";
import { GroupService } from "../../../services/group.service";
import { User } from "../../../models/user";

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

  myControl = new FormControl();
  allUsers: string[] = [];
  filteredUsers: Observable<string[]>;

  constructor(private fb: FormBuilder, private groupService: GroupService, private accountService: AccountService, private snackBar: MatSnackBar, private activatedRoute: ActivatedRoute, private router: Router) {

  }

  ngOnInit(): void {
    this.loggedInUser = this.accountService.getLoginAccount();
    if (this.groupDocId) {
      this.isEditMode = true;
    }

    this.filteredUsers = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );


    this.accountService.getAllUsers().subscribe((x) => {
      x.forEach(u => {
        if (u) {
          this.allUsers.push(u.wechatId);
        }
      })
    });

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

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allUsers.filter(option => option.toLowerCase().includes(filterValue));
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
