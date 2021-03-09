import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Group } from "../../../models/group";
import { GroupService } from "../../../services/group.service";
import { AccountService } from "../../../services/account.service";
import { group } from '@angular/animations';


@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent implements OnInit {
  myGroups = [];
  myDocId: string;

  constructor(public dialog: MatDialog, private groupService: GroupService, private accountService: AccountService) { }

  ngOnInit(): void {
    this.myDocId = this.accountService.getLoginAccount().docId;
    this.getMyGroups();
  }

  toggleLock(name: string) {
    if (confirm("Comfirm to lock/unlock " + name)) {
      console.log("Implement delete functionality here");
    }
  }

  getMyGroups() {
    this.groupService.getGroupsByUserDocId(this.myDocId).subscribe(x => {

      x.forEach(g => {
        this.myGroups.push({ 'docId': g.docId, 'groupName': g.groupName });
      })

      console.log(this.myGroups)
    });


    // this.slides.push({
    //   image: `https://picsum.photos/seed/${seed}/900/500`
    // });


  }

}

