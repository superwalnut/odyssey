import { Component, AfterViewInit, OnInit,ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';

import { MatTableDataSource } from "@angular/material/table";
import { BookingScheduleService } from '../../../../services/booking-schedule.service';
import { BookingSchedule } from '../../../../models/booking-schedule';


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
    "expireOn"
  ];
  dataSource = new MatTableDataSource<BookingSchedule>();
  @ViewChild(MatSort) sort: MatSort;


  constructor(private bookingScheduleService:BookingScheduleService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.bookingScheduleService.getAllBookingSchedules().subscribe(x=>{
      this.dataSource = new MatTableDataSource(x);
      this.dataSource.sort = this.sort;
    })
  }
}
