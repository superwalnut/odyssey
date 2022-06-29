import { Component, OnInit } from '@angular/core';
import { BookingPersonService } from '../../../../services/booking-person.service';
import { BookingPerson } from '../../../../models/booking-person';

import { BaseComponent } from '../../../base-component';


@Component({
  selector: 'app-rpt-attendance',
  templateUrl: './rpt-attendance.component.html',
  styleUrls: ['./rpt-attendance.component.scss']
})
export class RptAttendanceComponent extends BaseComponent implements OnInit {

  bps: BookingPerson[];

  constructor(private bpService: BookingPersonService) { super() }

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.bpService.getAllBookingPersons().subscribe(result=>{
      this.bps = result;
    })

  }

}
