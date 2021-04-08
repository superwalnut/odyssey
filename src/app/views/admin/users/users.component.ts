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

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewInit {
  loggedInAccount: Account;

  displayedColumns: string[] = ['name', 'balance', 'families', 'docId'];
  dataSource: MatTableDataSource<UserFamily>;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private accountService: AccountService, private dialogRef: MatDialog, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loggedInAccount = this.accountService.getLoginAccount();

  }

  ngAfterViewInit(): void {
    this.accountService.getAllUsers().subscribe((x) => {
      const userFamilies = x.filter(u => u.parentUserDocId == null).map(m => {
        return {
          name: m.name,
          docId: m.docId,
          user: m,
          families: x.filter(y => y.parentUserDocId == m.docId).map(z => z.name)
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
