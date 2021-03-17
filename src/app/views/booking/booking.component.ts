import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, startWith, take } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormControl, Validators, ValidationErrors } from "@angular/forms";
import { Group } from "../../models/group";
import { GroupService } from "../../services/group.service";
import { Booking } from "../../models/booking";
import { BookingPerson } from "../../models/booking-person";
import { Account } from "../../models/account";
import { CreditService } from "../../services/credit.service";

import { BookingsService } from "../../services/bookings.service";
import { ActivatedRoute } from "@angular/router";
import { GlobalConstants } from '../../common/global-constants';
import { AccountService } from '../../services/account.service';
import { User } from '../../models/user';
//import {MatDialog} from '@angular/material';
import { MatDialog,MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  panelOpenState = false;
  group:Group;
  bookingPerons:BookingPerson[];
  totalAmount: number;
  hasCredit: boolean;
  isCommittee:boolean;
  //familyMembers:User[]=[];
  familyBookingUsers:FamilyBookingUser[]=[];
  friendBookingUsers:FriendBookingUser[]=[];
  loggedInAccount;

  constructor(private groupService:GroupService, private dialogRef:MatDialog, private bookingService:BookingsService, private creditService:CreditService, private accountService:AccountService, private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {

    var groupDocId = this.activatedRoute.snapshot.params.id;
    this.loggedInAccount = this.accountService.getLoginAccount();
    

    this.creditService.getBalance(this.loggedInAccount.docId).subscribe(result=>{
      console.log('my credit balance: ' + result);
      this.hasCredit = result > 0;
    })
    this.getGroupDetail(groupDocId);

    this.getCurrentBooking(groupDocId);
    this.getFamilyMembers(this.loggedInAccount);    
    this.getFriendsList(this.loggedInAccount);
  }

  getGroupDetail(groupDocId:string) {
    this.groupService.getGroup(groupDocId).subscribe(g=>{
      this.group = g;
      this.isCommitteeCheck(this.loggedInAccount.docId);

      console.log(this.group);
    });
  }

  //cil-dollar, cil-credit-card
  getPaymentClass(paymentMethod:string) {
    if (paymentMethod == GlobalConstants.paymentCredit) {
      return "cil-credit-card";
    }
    else if (paymentMethod == GlobalConstants.paymentCash) {
      return "cil-dollar";
    }
  }

  getCurrentBooking(groupDocId:string) {
    this.bookingService.getThisWeeksBooking(groupDocId).subscribe(b=>{
      console.log("getcurrentbooking(): ", b);
      this.bookingPerons=b.people;
    });
  }

  getFamilyMembers(acc:Account) {
    this.accountService.getFamilyUsers(acc.docId).subscribe(users=>{
      console.log('family: ', users);
      var my = { userDocId: acc.docId, name: acc.name, selected:true } as FamilyBookingUser;
      this.familyBookingUsers.push(my);
      if (users) {
        users.forEach(u=>{
          var fu = { userDocId: u.docId, name: u.name, selected:false} as FamilyBookingUser;
          this.familyBookingUsers.push(fu);
        });
      }
      console.log('family booking users: ', this.familyBookingUsers);
    })
  }

  getFriendsList(acc:Account) {
    let f1 = { userDocId: acc.docId, name: "Friend 1(" +acc.name+")" } as FriendBookingUser;
    let f2 = { userDocId: acc.docId, name: "Friend 2("+acc.name+")" } as FriendBookingUser;
    this.friendBookingUsers.push(f1);
    this.friendBookingUsers.push(f2);
  }

  onSelectionChange() {
    console.log("toggle changed");
    this.calculateTotal();

  }

  onConfirmClick() {
    //this.dialogRef.closeAll();
    let selectedfamilyBookingUsers = this.familyBookingUsers.filter(x=>x.selected === true);
    let selectedFriendBookingUsers = this.friendBookingUsers.filter(x=>x.selected === true);


    console.log("Family bookings: ", selectedfamilyBookingUsers);
    console.log("Friends booking: ", selectedFriendBookingUsers);
    //TODO: now we have final booking users, convert them to BookingPerson and save to db!

    let i = 0;
    selectedfamilyBookingUsers.forEach(u=>{
      
      if (i == 0) {
        u.amount = GlobalConstants.rateCredit;
      }
      else {
        u.amount = GlobalConstants.rateFamily;
      }

      if (this.isCommitteeCheck(u.userDocId)) {
        u.amount = 0; //if committee reset it to 0;
      }
      i++;
    });
  
  }

  calculateTotal(){
    let selectedfamilyBookingUsers = this.familyBookingUsers.filter(x=>x.selected === true);
    let selectedFriendBookingUsers = this.friendBookingUsers.filter(x=>x.selected === true);
    let i = 0; let amount = 0;
    selectedfamilyBookingUsers.forEach(u=>{
      
      if (i == 0) {
        u.amount = GlobalConstants.rateCredit;
      }
      else {
        u.amount = GlobalConstants.rateFamily;
      }

      if(!this.hasCredit) u.amount=GlobalConstants.rateCash;

      if (this.isCommitteeCheck(u.userDocId)) {
        u.amount = 0; //if committee reset it to 0;
      }
      amount+=u.amount;
      i++;
    });

    amount += selectedFriendBookingUsers.length* GlobalConstants.rateCash;
    console.log(amount);
    this.totalAmount = amount;

  }

  isCommitteeCheck(userDocId:string) {
    let isCommittee = this.group.committees.find(x=>x === userDocId);
this.isCommittee = isCommittee != null;
    console.log("is committee: ", this.isCommittee);
    return isCommittee;
  }

  mapToBookingPerson(){
    let newBookingPersons: BookingPerson[] = [];    
  }
}

export class FamilyBookingUser {
  userDocId: string;
  name: string;
  amount: number;
  selected: boolean;
}

export class FriendBookingUser {
  userDocId: string;
  name: string;
  amount: number;
  selected: boolean;

}