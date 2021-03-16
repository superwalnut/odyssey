import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, startWith, take } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormControl, Validators, ValidationErrors } from "@angular/forms";
import { Group } from "../../models/group";
import { GroupService } from "../../services/group.service";
import { Booking } from "../../models/booking";
import { BookingPerson } from "../../models/booking-person";
import { Account } from "../../models/account";

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
  //familyMembers:User[]=[];
  familyBookingUsers:FamilyBookingUser[]=[];
  friendBookingUser:FriendBookingUser[]=[];

  allUsers: string[] = [];
  allUsersObject: User[];
  myControl = new FormControl(undefined, [Validators.required, this.requireMatch.bind(this)]);
  filteredUsers: Observable<string[]>;
  selectedUsers: User[] = [];

  constructor(private groupService:GroupService, private dialogRef:MatDialog, private bookingService:BookingsService, private accountService:AccountService, private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {

    var groupDocId = this.activatedRoute.snapshot.params.id;
    var acc = this.accountService.getLoginAccount();
    this.getGroupDetail(groupDocId);
    this.getCurrentBooking(groupDocId);
    this.getFamilyMembers(acc);

    // var loggedInUser = this.accountService.getLoginAccount();
    // this.accountService.getUserByDocId(loggedInUser.docId).subscribe(x => {
    //   this.selectedUsers.push(x);//current user default to be the committee;
    // });

    this.filteredUsers = this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    this.accountService.getAllUsers().subscribe((x) => {
      this.allUsersObject = x;
      x.forEach(u => { if (u) { this.allUsers.push(u.name); }})
    });
  }


  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allUsers.filter(option => option.toLowerCase().includes(filterValue));
  }
  
  private requireMatch(control: FormControl): ValidationErrors | null {
    const selection: any = control.value;
    if (selection == null) return { requireMatch:false};
    console.log("selections: ", selection);
    if (this.allUsers && this.allUsers.indexOf(selection) < 0) {
      return { requireMatch: true };
    }
    return null;
  } 


  getGroupDetail(groupDocId:string) {
    this.groupService.getGroup(groupDocId).subscribe(g=>{
      this.group = g;
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


  addFriend(selectedUserControl) {
    if (selectedUserControl.value == null) {
      return false;
    }
    var test = this.allUsersObject.filter(x => {
      return x.name === selectedUserControl.value
    });
    this.selectedUsers.push(test[0]);
  }

  removeFriend(item) {
    this.selectedUsers = this.selectedUsers.filter(x => x != item);
  }

  onConfirmClick() {
    this.dialogRef.closeAll();
    console.log("Family bookings: ", this.familyBookingUsers);
    console.log("Friends booking: ", this.selectedUsers);
  }
}



export class FamilyBookingUser {
  userDocId: string;
  name: string;
  selected: boolean;
}

export class FriendBookingUser {
  userDocId: string;
  name: string;
  useMyCredit: boolean;


}