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
import { BookingPersonService } from "../../services/booking-person.service";

import { BookingsService } from "../../services/bookings.service";
import { ActivatedRoute } from "@angular/router";
import { GlobalConstants } from '../../common/global-constants';
import { AccountService } from '../../services/account.service';
import { User } from '../../models/user';
//import {MatDialog} from '@angular/material';
import { MatDialog,MatDialogRef } from '@angular/material/dialog';
import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;
import { match } from 'node:assert';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  panelOpenState = false;
  group:Group;
  bookingDocId:string;
  bookingPerons:BookingPerson[];
  totalAmount: number;
  hasCredit: boolean;
  isCommittee:boolean;
  //familyMembers:User[]=[];
  // familyBookingUsers:FamilyBookingUser[]=[];
  // friendBookingUsers:FriendBookingUser[]=[];

  allLocalBookingUsers: LocalBookingUser[]=[];
  familyBookingUsers:LocalBookingUser[]=[];
  friendBookingUsers:LocalBookingUser[]=[];
  
  loggedInAccount;

  constructor(private groupService:GroupService, private dialogRef:MatDialog, private bookingService:BookingsService, private bookingPersonService:BookingPersonService, private creditService:CreditService, private accountService:AccountService, private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {

    var groupDocId = this.activatedRoute.snapshot.params.id;
    this.loggedInAccount = this.accountService.getLoginAccount();
    

    this.creditService.getBalance(this.loggedInAccount.docId).subscribe(result=>{
      console.log('my credit balance: ' + result);
      this.hasCredit = result > 0;
    })
    this.getGroupDetail(groupDocId);

    this.getCurrentBooking(groupDocId);
    this.getFriendsList(this.loggedInAccount);
    this.getFamilyMembers(this.loggedInAccount);    
    
    //this.prepareBookingModal();
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
      this.bookingDocId = b.docId;
      console.log("getcurrentbooking(): ", b);
      this.bookingPersonService.getByBookingDocId(b.docId).subscribe(bps=>{

        bps.forEach(u=>{
          var user = {
            docId: u.docId,
            userDocId: u.userId,
            name: u.userDisplayName,
            amount: u.amount,
            paymentMethod: u.paymentMethod,
            isMyBooking: u.userId == this.loggedInAccount.docId || u.parentUserId == this.loggedInAccount.docId,
            isFamily: u.parentUserId == this.loggedInAccount.docId || u.userId == this.loggedInAccount.docId,
          } as LocalBookingUser;
          this.allLocalBookingUsers.push(user);
        });
        
        console.log("getByBookingPersonsByBookingDocId(): ", this.allLocalBookingUsers);

      })
    
    });
  }

  getFamilyMembers(acc:Account) {
    this.accountService.getFamilyUsers(acc.docId).subscribe(users=>{
      console.log('family: ', users);
      var my = { userDocId: acc.docId, name: acc.name, isFamily:true } as LocalBookingUser;
      this.familyBookingUsers.push(my);
      if (users) {
        users.forEach(u=>{
          var fu = { userDocId: u.docId, name: u.name, isFamily:true} as LocalBookingUser;
          this.familyBookingUsers.push(fu);
        });
      }
      console.log('family booking users: ', this.familyBookingUsers);
      this.prepareBookingModal();
    })
  }

  getFriendsList(acc:Account) {
    let f1 = { userDocId: acc.docId, name: "Friend 1(" + acc.name + ")", isFamily:false } as LocalBookingUser;
    let f2 = { userDocId: acc.docId, name: "Friend 2(" + acc.name + ")", isFamily:false } as LocalBookingUser;
    this.friendBookingUsers.push(f1);
    this.friendBookingUsers.push(f2);
  }

  prepareBookingModal() {
    this.familyBookingUsers.forEach(b=>{
      let match = this.allLocalBookingUsers.find(bookingUser=> bookingUser.userDocId == b.userDocId );
      console.log("found xxxxxx: ", match);
      if(match) {
        b.selected = true;
        b.docId = match.docId;
      }
    });

    this.friendBookingUsers.forEach(b=>{
      let match = this.allLocalBookingUsers.find(item=> item.name == b.name);
      if(match) {
        b.selected = true;
        b.docId = match.docId;
      }
    })

  }

  bookClicked() {
    this.prepareBookingModal();
  }

  onSelectionChange() {
    console.log("toggle changed");
    this.calculateTotal();
  }

  // onRemoveClick(p) {
  //   console.log('to remove: ', p);
  //   this.allLocalBookingUsers = this.allLocalBookingUsers.filter(item=> item !== p);
  //   //TODO: delete from BookingPerson table 

  //   //this.familyBookingUsers = this.familyBookingUsers.filter(item=> item.userDocId == p.userDocId);
  //   this.familyBookingUsers.forEach((element, index)=>{
  //     if (element.userDocId==p.userDocId) element.selected = false;
  //   })

  //   this.friendBookingUsers.forEach((element, index)=>{
  //     if (element.userDocId==p.userDocId && element.name==p.name) element.selected = false;
  //   })
  //   console.log('familybookinguser: ', this.familyBookingUsers);
  //   console.log('friendbookinguser: ', this.friendBookingUsers);
  // }

  onConfirmClick() {
    //let selectedfamilyBookingUsers = this.familyBookingUsers.filter(x=>x.selected === true);
    //let selectedFriendBookingUsers = this.friendBookingUsers.filter(x=>x.selected === true);

    //console.log("Family bookings: ", selectedfamilyBookingUsers);
    //console.log("Friends booking: ", selectedFriendBookingUsers);
    //TODO: now we have final booking users, convert them to BookingPerson and save to db!
    //let bookingPersons:BookingPerson[]=[];
    console.log("Family bookingsxxxxx: ", this.familyBookingUsers);


    //1. merge family and friends into one list
    var result = this.preDbProcess();
    console.log("xxxxx: ", result.toAdd);
    console.log("delete ssss ", result.toDelete);

    //2. calculate price for added recored;
    let i = 0;
    result.toAdd.forEach(u=>{
      if (u.isFamily) { //Family
        if (i == 0) {
          u.amount = this.hasCredit ? GlobalConstants.rateCredit : GlobalConstants.rateCash;
        }
        else {
          u.amount = this.hasCredit ? GlobalConstants.rateFamily : GlobalConstants.rateCash;
        }
  
        if (this.isCommitteeCheck(u.userDocId)) {
          u.amount = 0; //if committee reset it to 0;
        }
        i++;

      } else { //Friends
        u.amount = GlobalConstants.rateCash;
      }
    });

    //add person is wrong
    var finalBookingPersonsToAdd = this.mapToBookingPersons(result.toAdd);
    var finalBookingPersonsToDelete = this.mapToBookingPersons(result.toDelete);
    console.log('finalBookingPersonsToAdd: ', finalBookingPersonsToAdd);
    console.log('finalBookingPersonsToDelete: ', finalBookingPersonsToDelete);
  }

  mapToBookingPersons(localBookingUsers:LocalBookingUser[]) {
    let bookingPersons:BookingPerson[]=[];
    localBookingUsers.forEach(u=>{
      var bp = { 
        docId: u.docId,
        bookingDocId: this.bookingDocId,
        groupDocId: this.group.docId,
        userId: u.userDocId,
        userDisplayName:u.name,
        amount: u.amount,
        parentUserId: this.loggedInAccount.docId,
        paymentMethod: this.hasCredit ? GlobalConstants.paymentCredit : GlobalConstants.paymentCash,
        isPaid:true,
        createdOn: Timestamp.now(),

      } as BookingPerson;
      bookingPersons.push(bp);

    });
    return bookingPersons;
  }


  preDbProcess() {
    //loop through all myselection
    var allMyBooking:LocalBookingUser[]=this.familyBookingUsers;
    allMyBooking = allMyBooking.concat(this.friendBookingUsers);

    console.log('allmybooking ', allMyBooking)

    let toAdd: LocalBookingUser[]=[];
    let toDelete: LocalBookingUser[]=[];


    allMyBooking.forEach(user=> {
      if (user.selected)
      {
        //check if this user already in the booking?
        var find = this.allLocalBookingUsers.find(x=>x.userDocId == user.userDocId);
        console.log("check if this user already in the booking?", find);
        if (find === undefined) {
          toAdd.push(user);
        }

      }
      else{
        //only delete if this user already in the booking
        var find = this.allLocalBookingUsers.find(x=>x.userDocId == user.userDocId);
        if (find) {
          toDelete.push(user);
        }
      }
      
    });

    console.log('toadd ', toAdd);
    console.log('todelete ', toDelete);

    return { toAdd, toDelete};
    
    //this.bookingPersonService.createBookingPersonBatch(toAdd);
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

}

export class LocalBookingUser {
  docId:string;
  userDocId: string;
  name: string;
  amount: number;
  paymentMethod: string;
  selected: boolean;
  isMyBooking: boolean;
  isFamily: boolean;
}


// export class FamilyBookingUser {
//   userDocId: string;
//   name: string;
//   amount: number;
//   selected: boolean;
//   isMyBooking: boolean;
// }

// export class FriendBookingUser {
//   userDocId: string;
//   name: string;
//   amount: number;
//   selected: boolean;
//   isMyBooking: boolean;

// }