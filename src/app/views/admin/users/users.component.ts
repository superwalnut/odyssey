import { AfterViewInit, Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../../../models/user';
import { UserFamily } from '../../../viewmodels/user-family';
import { AccountService } from '../../../services/account.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;
import { BookingSchedule } from "../../../models/booking-schedule";
import { EventLoggerService } from '../../../services/event-logger.service';
import { EventLogger } from '../../../models/event-logger';
import { Account } from "../../../models/account";
import { BaseComponent } from '../../base-component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent extends BaseComponent implements OnInit, AfterViewInit {
  loggedInAccount: Account;
  totalUserCount: number;
  isGod: boolean;

  displayedColumns: string[] = ['name', 'iscredituser', 'families', 'created', 'docId'];
  dataSource: MatTableDataSource<UserFamily>;
  @ViewChild(MatSort) sort: MatSort;
  users: User[];

  constructor(private accountService: AccountService, private dialogRef: MatDialog, public dialog: MatDialog) {
    super();
  }

  ngOnInit(): void {
    this.loggedInAccount = this.accountService.getLoginAccount();
    this.isGod = this.accountService.isGod();

  }

  ngAfterViewInit(): void {
    this.accountService.getAllUsers().subscribe((x) => {
      this.users = x;
      this.totalUserCount = x.length;
      const userFamilies = x.filter(u => u.parentUserDocId == null).map(m => {
        return {
          name: m.name,
          iscredituser: m.isCreditUser,
          docId: m.docId,
          user: m,
          families: x.filter(y => y.parentUserDocId == m.docId).map(z => z.name),
          created: m.created,
          //grade: m.grade + m.gradePoints,
          requireChangePassword: m.requireChangePassword,
        } as UserFamily;
      });

      this.dataSource = new MatTableDataSource(userFamilies);
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onNewUserClicked() {
    const dialogRef = this.dialog.open(NewUserDialog, {
      width: '650px',
      data: {
        loggedInUser: this.loggedInAccount,

      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  downloadAllUsers() {
    const data = this.users.map(c => {
      return {
        'userId': c.docId,
        'name': c.name,
        'email': c.email,
        'mobile': c.mobile,
        'gender': c.gender,
        'isMember': c.isMember,
        'disabled': c.disabled,
        'isCreditUser': c.isCreditUser,
        'created': c.created.toDate(),
        'updated': c.updated.toDate(),
        'grade': c.grade,
        'gradePoints': c.gradePoints,
        'isChild': c.isChild,
        'parentUserDocId': c.parentUserDocId,
        'parentUserName': c.parentUserDisplayName,
      };
    });
    console.log('downloadusers', data);
    super.downloadFile(data, 'user-lists');
  }

}


@Component({
  selector: 'new-user',
  templateUrl: 'newuser.html',
})
export class NewUserDialog {
  constructor(
    public dialogRef: MatDialogRef<NewUserDialog>, private eventLogService: EventLoggerService,
    @Inject(MAT_DIALOG_DATA) public data: NewUserDialogData, private accountService: AccountService) { }

  hasError: boolean;

  isLoading = false;
  isCommittee: boolean;
  hasActiveAutoBooking = false;

  ngOnInit() {


  }



  onNoClick(): void {
    this.dialogRef.close();
  }

  onCreateClick() {

  }
}


export interface NewUserDialogData {
  loggedInUser: Account,
}
