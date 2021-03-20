import { Component, OnInit } from '@angular/core';
import { BookingPerson } from "../../../models/booking-person";
import { BookingPersonService } from "../../../services/booking-person.service";
import { AccountService } from "../../../services/account.service";

@Component({
  selector: 'app-attendancehistory',
  templateUrl: './attendancehistory.component.html',
  styleUrls: ['./attendancehistory.component.scss']
})
export class AttendancehistoryComponent implements OnInit {

  myBookingHistory:BookingPerson[]=[];
  loggedInAccount;

  constructor(private bookingPersonService:BookingPersonService, private accountService:AccountService) { }

  ngOnInit(): void {
    this.loggedInAccount = this.accountService.getLoginAccount();
    this.getMyBookingHistory();

  }

  getMyBookingHistory()
  {
    this.bookingPersonService.getByUserDocId(this.loggedInAccount.docId).subscribe(bookings=> {
      this.myBookingHistory = bookings;
      console.log(bookings)

    });

  }

}
