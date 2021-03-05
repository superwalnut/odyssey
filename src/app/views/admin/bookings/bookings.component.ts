import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {

  }
  toggleLock(name: string) {
    if(confirm("Comfirm to lock/unlock "+name)) {
      console.log("Implement delete functionality here");
    }
  }

}

