import { Component, OnInit } from '@angular/core';
import { TriggersService } from "../../../services/triggers.service";
import { HelperService } from "../../../common/helper.service";

@Component({
  selector: 'app-triggers',
  templateUrl: './triggers.component.html',
  styleUrls: ['./triggers.component.scss']
})
export class TriggersComponent implements OnInit {

  constructor(private triggerService: TriggersService, private helperService: HelperService) { }

  ngOnInit(): void {
    this.onCombineDatesClick();
  }

  onPrepopulateBookingClick() {
    this.triggerService.prepopulateBookings();
  }



  //Test cases
  onCombineDatesClick() {

    const lastMonday = new Date('2021-03-08');
    console.log('last monday: ', lastMonday)
    const daysfromToday = this.helperService.addDays(5);


    this.helperService.addDays(5, daysfromToday);
    this.helperService.combinDateAndTime('2021-01-01', '20:00');
    this.helperService.findNextDayOfTheWeek('friday', true, lastMonday);

    var d1 = new Date('2021-02-26T00:00:00'); 
    var d2 = new Date('2021-03-31T00:00:00'); 
    var d3 = new Date('2022-01-01T00:00:00'); 

    this.helperService.findDateRangeOfCurrentWeek(d3);

    this.helperService.findWeekdays('tue', 10);

  }

}
