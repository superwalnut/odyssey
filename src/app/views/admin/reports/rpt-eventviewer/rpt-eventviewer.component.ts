import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../base-component';
import { EventLoggerService } from "../../../../services/event-logger.service";
import { EventLogger } from "../../../../models/event-logger";

@Component({
  selector: 'app-rpt-eventviewer',
  templateUrl: './rpt-eventviewer.component.html',
  styleUrls: ['./rpt-eventviewer.component.scss']
})
export class RptEventviewerComponent extends BaseComponent implements OnInit {

  logs:EventLogger[];
  constructor(private eventLogService:EventLoggerService) { super() }

  ngOnInit(): void {
    this.getEventLogs();
  }

  getEventLogs() {
    this.eventLogService.getAllEventLogs().subscribe(result=>{
      this.logs = result;

    })

  }

}
