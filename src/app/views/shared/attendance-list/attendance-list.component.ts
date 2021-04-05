import { Component, Input, OnInit } from '@angular/core';
import { BookingPerson } from "../../../models/booking-person";
import { BookingPersonService } from "../../../services/booking-person.service";

@Component({
  selector: 'app-attendance-list',
  templateUrl: './attendance-list.component.html',
  styleUrls: ['./attendance-list.component.scss']
})
export class AttendanceListComponent implements OnInit {
  @Input() userDocId: string;

  myBookingHistory:BookingPerson[]=[];
  loggedInAccount;

  constructor(private bookingPersonService:BookingPersonService) { }

  ngOnInit(): void {
    this.getMyBookingHistory();

  }

  getMyBookingHistory()
  {
    this.bookingPersonService.getByUserDocId(this.userDocId).subscribe(bookings=> {
      this.myBookingHistory = bookings;
      console.log(bookings)

    });

  }

}
