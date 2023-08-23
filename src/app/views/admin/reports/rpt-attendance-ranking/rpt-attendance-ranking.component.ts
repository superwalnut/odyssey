import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BookingPersonService } from '../../../../services/booking-person.service';
import { BookingPerson } from '../../../../models/booking-person';

import { BaseComponent } from '../../../base-component';


@Component({
  selector: 'app-rpt-attendance-ranking',
  templateUrl: './rpt-attendance-ranking.component.html',
  styleUrls: ['./rpt-attendance-ranking.component.scss']
})
export class RptAttendanceRankingComponent extends BaseComponent implements OnInit, AfterViewInit {

  groupByUser:any;
  groupKeys:string[];

  constructor(private bpService: BookingPersonService) { super() }
  
  ngAfterViewInit(): void {
    
  }

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.bpService.getAllBookingPersons().subscribe(result=>{
      this.groupByUser = result.reduce((group, attend) => {
        const { userDisplayName } = attend;
        var count = group[userDisplayName] ?? 0;
        group[userDisplayName] = 1 + count
        return group;
      }, {});

      this.groupKeys = Object.keys(this.groupByUser);
      console.log(this.groupKeys);
      console.log(this.groupByUser);
    })
  }
}
