import { Component, AfterViewInit, OnInit,Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';

import { MatTableDataSource } from "@angular/material/table";
import { BookingScheduleService } from '../../../../services/booking-schedule.service';
import { BookingSchedule } from '../../../../models/booking-schedule';
import { EventLoggerService } from '../../../../services/event-logger.service';
import { EventLogger } from '../../../../models/event-logger';

@Component({
  selector: 'app-rpt-autobook',
  templateUrl: './rpt-autobook.component.html',
  styleUrls: ['./rpt-autobook.component.scss']
})
export class RptAutobookComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = [
    "groupName",
    "user",
    "isPaused",
    "createdOn",
    "expireOn",
    "Action"
  ];
  dataSource = new MatTableDataSource<BookingSchedule>();
  @ViewChild(MatSort) sort: MatSort;


  constructor(private bookingScheduleService:BookingScheduleService, public dialog: MatDialog) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.bookingScheduleService.getAllBookingSchedules().subscribe(x=>{
      this.dataSource = new MatTableDataSource(x);
      this.dataSource.sort = this.sort;
    })
  }

  editSchedule(schedule:BookingSchedule) {
    console.log(schedule);
    const dialogRef = this.dialog.open(ScheduleDialog, {
      width: '650px',
      data: {
        //loggedInUser: Account,
        schedule: schedule,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Edit Schedule dialog was closed');

    });
  }

}


@Component({
  selector: 'edit-schedule',
  templateUrl: 'editschedule.html',
})
export class ScheduleDialog {
  constructor(
    public dialogRef: MatDialogRef<ScheduleDialog>, private eventLogService: EventLoggerService, private bookingScheuleService:BookingScheduleService,
    @Inject(MAT_DIALOG_DATA) public data: ScheduleDialogData, ) { }

  hasError: boolean;
  currentStatus: string;

  isLoading = false;

  ngOnInit() { 
    this.currentStatus = this.data.schedule.isPaused ? 'Paused => Active' : 'Active => Pause';
   }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onCreateClick() {
    this.data.schedule.isPaused = !this.data.schedule.isPaused;
    this.bookingScheuleService.updateIsPaused(this.data.schedule.docId, this.data.schedule)
      .then(() => this.dialogRef.close())
      .catch((err) => {
        this.hasError = true;
        alert(err);
        console.log(err);
      });
  }
}


export interface ScheduleDialogData {
  loggedInUser: Account,
  schedule:BookingSchedule,
}

