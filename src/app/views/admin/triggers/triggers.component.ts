import { Component, OnInit } from '@angular/core';
import { TriggersService } from "../../../services/triggers.service";

@Component({
  selector: 'app-triggers',
  templateUrl: './triggers.component.html',
  styleUrls: ['./triggers.component.scss']
})
export class TriggersComponent implements OnInit {

  constructor(private triggerService: TriggersService) { }

  ngOnInit(): void {
  }

  onPrepopulateBookingClick() {
    this.triggerService.prepopulateBookings();
  }

}
