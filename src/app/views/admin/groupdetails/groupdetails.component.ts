import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, } from "@angular/core";
import { Observable } from 'rxjs';
import { map, startWith, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Account } from "../../../models/account";
import { Group } from "../../../models/group";
import { AccountService } from "../../../services/account.service";
import { GroupService } from "../../../services/group.service";
import { User } from "../../../models/user";
import { Timestamp } from "rxjs/internal/operators/timestamp";
import { GlobalConstants } from "../../../common/global-constants";

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

  committeeRequired: boolean = false;
  myControl = new FormControl();
  allUsers: string[] = [];
  allUsersObject: User[];
  filteredUsers: Observable<string[]>;
  selectedUsers: User[] = [];
  weekdays = GlobalConstants.weekdays;

  constructor(private fb: FormBuilder, private groupService: GroupService, private accountService: AccountService, private snackBar: MatSnackBar, private activatedRoute: ActivatedRoute, private router: Router) {

  }

  ngOnInit(): void {
    this.groupDocId = this.activatedRoute.snapshot.params.id;

    this.loggedInUser = this.accountService.getLoginAccount();
    this.accountService.getUserByDocId(this.loggedInUser.docId).subscribe(x => {
      this.selectedUsers.push(x);//current user default to be the committee;
    });

    console.log("edit mode: ", this.isEditMode);
    console.log("group id: ", this.groupDocId);

    if (this.groupDocId) {
      this.isEditMode = true;


    }

    this.filteredUsers = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );


    this.accountService.getAllUsers().subscribe((x) => {
      this.allUsersObject = x;
      x.forEach(u => {
        if (u) {

          this.allUsers.push(u.name);
        }
      })
    });

    this.groupForm = this.fb.group({
      // startDate: ["", Validators.required],
      // endDate: ["", Validators.required],
      eventStartDay: ["", Validators.required],
      bookingStartDay: ["", Validators.required],
      groupName: ["", Validators.required],
      groupDesc: ["", Validators.required],
      eventStartTime: ["", Validators.required],
    });

    this.getByDocId(this.groupDocId);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allUsers.filter(option => option.toLowerCase().includes(filterValue));
  }
  addCommittee(selectedUserControl) {
    if (selectedUserControl.value == null) {
      return false;
    }
    var test = this.allUsersObject.filter(x => {
      return x.name === selectedUserControl.value
    });
    this.selectedUsers.push(test[0]);


  }

  removeCommittee(item) {
    this.selectedUsers = this.selectedUsers.filter(x => x != item);
  }


  getByDocId(docId: string) {
    if (this.groupDocId) {
      this.groupService.getGroup(this.groupDocId).subscribe((x) => {
        console.log(x);
        this.groupForm.patchValue({
          //startDate: x.startDate.toDate(),
          //endDate: x.endDate.toDate(),
          eventStartDay: x.eventStartDay,
          eventStartTime: x.eventStartTime,
          bookingStartDay: x.bookingStartDay,
          groupName: x.groupName,
          groupDesc: x.groupDesc,
        });

        this.accountService.getUsersByDocIds(x.committees).pipe(take(1)).subscribe(x=>{
          this.selectedUsers = x
        });
      });
    }
  }

  onSubmit() {
    this.submitted = true;

    var committeeUserDocIds = this.getCommitteeUserDocIds();
    if (committeeUserDocIds.length == 0) {
      this.committeeRequired = true;
      return false;

    }

    var group = {
      eventStartDay: this.groupForm.value.eventStartDay,
      eventStartTime: this.groupForm.value.eventStartTime,
      bookingStartDay: this.groupForm.value.bookingStartDay,
      groupName: this.groupForm.value.groupName,
      groupDesc: this.groupForm.value.groupDesc,
      committees: this.getCommitteeUserDocIds(),
      isClosed: false,
    } as Group;

    if (this.groupDocId) {
      group.docId = this.groupDocId;
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

  getCommitteeUserDocIds() {
    let committeeUserDocIds: string[] = [];

    this.selectedUsers.forEach(x => {
      committeeUserDocIds.push(x.docId);
    });
    return committeeUserDocIds;
  }
}
