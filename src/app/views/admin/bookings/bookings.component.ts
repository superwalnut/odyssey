import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Group } from "../../../models/group";
import { GroupService } from "../../../services/group.service";
import { AccountService } from "../../../services/account.service";
import { BookingsService } from "../../../services/bookings.service";


@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent implements OnInit {
  myGroups = [];
  myDocId: string;
  selectedGroupDocId: string;

  constructor(public dialog: MatDialog, private groupService: GroupService, private bookingService: BookingsService, private accountService: AccountService) { }

  ngOnInit(): void {
    this.myDocId = this.accountService.getLoginAccount().docId;
    this.getMyGroups();
  }

  toggleLock(name: string) {
    if (confirm("Comfirm to lock/unlock " + name)) {
      console.log("Implement delete functionality here");
    }
  }

  onGroupChange() {
    console.log(this.selectedGroupDocId);
    this.getBookingsByGroupDocId(this.selectedGroupDocId);
  }
  getMyGroups() {
    this.groupService.getGroupsByUserDocId(this.myDocId).subscribe(x => {

      x.forEach(g => {
        this.myGroups.push({ 'docId': g.docId, 'groupName': g.groupName });
      })

      console.log(this.myGroups)
    });
  }

  getBookingsByGroupDocId(groupDocId: string) {

    this.bookingService.getByGroupDocId(groupDocId).subscribe(bookings => {
      bookings.forEach(b => console.log(b));


    });
  }

}

