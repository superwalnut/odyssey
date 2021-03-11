import { Injectable } from '@angular/core';
import { GroupService } from './group.service';
import { BookingsService } from './bookings.service';
//import { GroupsComponent } from '../views/groups/groups.component';

@Injectable({
  providedIn: 'root'
})

//This service will be replaced by Firebase cloud schedulers in the future
export class TriggersService {

  constructor(private groupService: GroupService, private bookingService: BookingsService) { }


  prepopulateBookings() {
    //1. getting all active groups
    var activeGroups = this.groupService.getGroupByStatus(false).subscribe(x => console.log(x));


    //2. prepopulate bookings

  }
}
