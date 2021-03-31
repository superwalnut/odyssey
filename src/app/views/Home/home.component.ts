import { Component, OnInit } from "@angular/core";
import { BookingPersonService } from "../../services/booking-person.service";
import { BaseComponent } from '../base-component';
import { AccountService } from '../../services/account.service';
import { Account } from '../../models/account';
import { BookingPerson } from "../../models/booking-person";
import { HelperService } from '../../common/helper.service';


@Component({
  selector: "app",

  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent extends BaseComponent implements OnInit {
  show: boolean = true;
  loggedInAccount: Account;
  myCurrentWeekBookings: BookingPerson[];


  constructor(private bookingPersonService: BookingPersonService, private accountService: AccountService, private helperService: HelperService) { super() }

  ngOnInit(): void {
    this.loggedInAccount = this.accountService.getLoginAccount();
    this.getMyCurrentWeekBookings();

  }

  getMyCurrentWeekBookings() {
    var dateRange = this.helperService.findDateRangeOfCurrentWeek(new Date());

    this.bookingPersonService.getCurrentWeekByUserDocId(this.loggedInAccount.docId).subscribe(result => {
      this.myCurrentWeekBookings = result.filter(x => x != null);
      console.log(this.myCurrentWeekBookings)

    })
  }
}
