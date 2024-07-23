import { Component, OnInit } from '@angular/core';
import { BookingsService } from '../../services/bookings.service';
import { GroupService } from '../../services/group.service';
import { combineLatest } from 'rxjs';
import { Group } from '../../models/group';
import { Booking } from '../../models/booking';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-booking-redirect',
  templateUrl: './booking-redirect.component.html',
  styleUrls: ['./booking-redirect.component.scss']
})
export class BookingRedirectComponent implements OnInit {

  groups: Group[];
  bookings: Booking[];
  day:string;

  constructor(
    private groupService: GroupService, 
    private bookingService: BookingsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {

  }

  ngOnInit(): void {
    this.day = this.activatedRoute.snapshot.params.day;
    this.getGroupsAndCurrentBookings();
  }

  getGroupsAndCurrentBookings() {
    this.bookingService.getCurrentWeekBooking().subscribe(bookings=>{
      console.log('bookings: ', bookings);
      const booking = bookings.find(booking => booking.weekDay.toLowerCase() == this.day.toLowerCase());
      
      console.log('selected booking: ', booking);
  
      if(booking){
        const id = booking.docId;
        const groupId = booking.groupDocId;

        const url = '/booking/'+id+'/'+groupId;
        console.log('url: ', url);

        this.router.navigate([url]);
      }
      else{
        this.router.navigate(['/groups']);
      }
    });
  }

}
