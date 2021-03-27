import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Group } from "../../models/group";
import { GroupService } from "../../services/group.service";
import { BookingPerson } from "../../models/booking-person";
import { Account } from "../../models/account";
import { CreditService } from "../../services/credit.service";
import { BookingPersonService } from "../../services/booking-person.service";

import { BookingsService } from "../../services/bookings.service";
import { ActivatedRoute } from "@angular/router";
import { GlobalConstants } from '../../common/global-constants';
import { AccountService } from '../../services/account.service';
import { MatDialog,MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HelperService } from "../../common/helper.service";

import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;
import { DOCUMENT } from '@angular/common';
import { BaseComponent } from '../base-component';
import { Booking } from '../../models/booking';
import { LocalBookingUser } from '../../models/custom-models';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent extends BaseComponent implements OnInit {
  panelOpenState = false;
  group:Group;
  booking:Booking;
  bookingDocId:string;
  groupDocId:string;
  bookingPerons:BookingPerson[];
  totalAmount: number;
  hasCredit: boolean;
  isCommittee:boolean;
  allLocalBookingUsers: LocalBookingUser[]=[];
  familyBookingUsers:LocalBookingUser[]=[];
  friendBookingUsers:LocalBookingUser[]=[];
  isLoading:boolean;
  loggedInAccount;
  seatsLeft:number;
  isSeatsLeft:boolean;
  

  constructor(private groupService:GroupService, private dialogRef:MatDialog, 
    private bookingService:BookingsService, private bookingPersonService:BookingPersonService, private creditService:CreditService, 
    private accountService:AccountService, private activatedRoute:ActivatedRoute, public dialog:MatDialog) { super()}

  ngOnInit(): void {

    this.bookingDocId = this.activatedRoute.snapshot.params.id;
    this.groupDocId = this.activatedRoute.snapshot.params.groupId;

    console.log('url params: ', this.bookingDocId, this.groupDocId)
    this.loggedInAccount = this.accountService.getLoginAccount();
    
    this.creditService.getBalance(this.loggedInAccount.docId).subscribe(result=>{
      console.log('my credit balance: ' + result);
      if (result)
        this.hasCredit = result.balance > 0;
    })
    this.getGroupDetail(this.groupDocId);
    this.getCurrentBooking(this.bookingDocId);
    this.getCurrentBookingPersons(this.bookingDocId);
    this.getFriendsList(this.loggedInAccount);
    this.getFamilyMembers(this.loggedInAccount);    
  }

  getGroupDetail(groupDocId:string) {
    this.groupService.getGroup(groupDocId).subscribe(g=>{
      this.group = g;
      
      this.isCommitteeCheck(this.loggedInAccount.docId);

      console.log('getGroupDetails()', this.group);
    });
  }

  getCurrentBookingPersons(bookingDocId:string) {
    this.bookingPersonService.getCustomByBookingDocId(bookingDocId, this.loggedInAccount.docId).subscribe(bs=>{
      this.allLocalBookingUsers = bs;
      console.log("getByBookingPersonsByBookingDocId(): ", this.allLocalBookingUsers);
      this.seatsAvailable();
    })
  }

  seatsAvailable()
  {
    let seatsLimit = this.group.seats;
    let seatsBooked = this.allLocalBookingUsers.length;
    let seatsLeft = seatsLimit - seatsBooked;
    this.isSeatsLeft = seatsLeft > 0;
    console.log('seats left: ', seatsLeft);
    return seatsLeft;
  }

  getCurrentBooking(bookingDocId:string) {
    this.bookingService.get(bookingDocId).subscribe(booking=>{
      this.booking=booking;
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
    let f1 = { userDocId: acc.docId, name: "Friend 1(" + acc.name + ")", amount:GlobalConstants.rateCash, isFamily:false } as LocalBookingUser;
    let f2 = { userDocId: acc.docId, name: "Friend 2(" + acc.name + ")", amount:GlobalConstants.rateCash, isFamily:false } as LocalBookingUser;
    this.friendBookingUsers.push(f1);
    this.friendBookingUsers.push(f2);
  }

  prepareBookingModal() {

    this.familyBookingUsers.forEach(b=>{
      let match = this.allLocalBookingUsers.find(bookingUser=> bookingUser.userDocId == b.userDocId && bookingUser.name == b.name);
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
    const dialogRef = this.dialog.open(BookingDialog, {
      width: '650px',
      data: { 
        loggedInUser: this.loggedInAccount,
        bookingDocId: this.bookingDocId,
        group: this.group, 
        allLocalBookingUsers: this.allLocalBookingUsers,
        familyBookingUsers: this.familyBookingUsers,
        friendBookingUsers: this.friendBookingUsers,
        hasCredit: this.hasCredit,
        isCommittee: this.isCommittee,
        isSeatsLeft: this.isSeatsLeft,
        }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      
    });

  }

  withdrawClicked(lbu:LocalBookingUser) {
    const dialogRef = this.dialog.open(WithdrawDialog, {
      width: '650px',
      data: { 
        loggedInUser: this.loggedInAccount,
        booking: this.booking,
        group: this.group, 
        inputBookingPerson: lbu,
        allLocalBookingUsers: this.allLocalBookingUsers,
        familyBookingUsers: this.familyBookingUsers,
        friendBookingUsers: this.friendBookingUsers,
        hasCredit: this.hasCredit,
        isCommittee: this.isCommittee,
        isSeatsLeft: this.isSeatsLeft,
        }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The withdraw dialog was closed');
      
    });
  }

  deleteBooking(user) {
    if(confirm("Are you sure to withdraw? " + user.name)) {
      console.log('deleting...', user);
      this.bookingPersonService.delete(user.docId);
      
    }    
  }

  //cil-dollar, cil-credit-card
  getPaymentClass(paymentMethod:string) {
    if (paymentMethod == GlobalConstants.paymentCredit) { return "cil-credit-card"; }
    else if (paymentMethod == GlobalConstants.paymentCash) { return "cil-dollar"; }
  }
  
  isCommitteeCheck(userDocId:string) {
    let isCommittee = this.group.committees.find(x=>x === userDocId);
    this.isCommittee = isCommittee != null;
    console.log("is committee: ", this.isCommittee);
    return isCommittee;
  }

}


@Component({
  selector: 'booking-dialog',
  templateUrl: 'booking.html',
})
export class BookingDialog {
  constructor(
    public dialogRef: MatDialogRef<BookingDialog>,
    @Inject(MAT_DIALOG_DATA) public data: BookingDialogData, private bookingPersonService:BookingPersonService, private accountService:AccountService) {}

    hasError:boolean;
    errorMessage:string;
    testData: BookingDialogData;
    totalAmount:number;
    isLoading:boolean;
    allBookings:BookingPerson[];


  ngOnInit() {
    this.bookingPersonService.getByBookingDocId(this.data.bookingDocId).subscribe(allBookings=>{
      this.allBookings = allBookings; //get a live connection to all booking persons.
    })

  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirmClick(): void {

    if (this.allBookings.length >= this.data.group.seats) {
      this.hasError = true;
      this.errorMessage = "This session is full";
      return;
    }
    //1. merge family and friends into one list

    this.isLoading = true;
    var result = this.preDbProcess();
    console.log("xxxxx: ", result.toAdd);
    console.log("delete ssss ", result.toDelete);

    //2. calculate price for added recored;
    let i = 0;
    result.toAdd.forEach(u=>{
      if (u.isFamily) { //Family
        if (i == 0) {
          u.amount = this.data.hasCredit ? GlobalConstants.rateCredit : GlobalConstants.rateCash;
        }
        else {
          u.amount = this.data.hasCredit ? GlobalConstants.rateFamily : GlobalConstants.rateCash;
        }
  
        if (this.isCommitteeCheck(u.userDocId)) {
          u.amount = 0; //if committee reset it to 0;
        }
        i++;

      } else { //Friends
        u.amount = GlobalConstants.rateCash;
      }
    });

    var finalBookingPersonsToAdd = this.mapToBookingPersons(result.toAdd);
    var finalBookingPersonsToDelete = this.mapToBookingPersons(result.toDelete);
    console.log('finalBookingPersonsToAdd: ', finalBookingPersonsToAdd);
    console.log('finalBookingPersonsToDelete: ', finalBookingPersonsToDelete);


    if (finalBookingPersonsToAdd.length >0) {

      this.bookingPersonService.createBookingPersonBatch(finalBookingPersonsToAdd)
        .then(()=>this.dialogRef.close())
        .catch((err) => {
          this.hasError = true;
          //errorMessage = err.toString();
          console.log(err);
        });
    }
      
    if (finalBookingPersonsToDelete.length > 0) {
      //this.bookingPersonService.deleteBatch(finalBookingPersonsToDelete).then(()=>this.document.location.reload());
      this.bookingPersonService.deleteBatch(finalBookingPersonsToDelete)
        .then(()=>this.dialogRef.close())
        .catch((err) => {
          this.hasError = true;
          //errorMessage = err.toString();
          console.log(err);
        });
    }

    if (finalBookingPersonsToAdd.length == 0 && finalBookingPersonsToDelete.length == 0)
      this.dialogRef.close();
  }

  preDbProcess() {
    //loop through all myselection
    var allMyBooking:LocalBookingUser[]=this.data.familyBookingUsers;
    allMyBooking = allMyBooking.concat(this.data.friendBookingUsers);

    console.log('allmybooking ', allMyBooking)
    let toAdd: LocalBookingUser[]=[];
    let toDelete: LocalBookingUser[]=[];

    allMyBooking.forEach(user=> {
      if (user.selected)
      {
        //check if this user already in the booking?
        var find = this.data.allLocalBookingUsers.find(x=>x.userDocId == user.userDocId && x.name == user.name);
        console.log("check if this user already in the booking?", find);
        if (find === undefined) {
          toAdd.push(user);
        }
      }

      else{
        //only delete if this user already in the booking
        var find = this.data.allLocalBookingUsers.find(x=>x.userDocId == user.userDocId && x.name == user.name);
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
  mapToBookingPersons(localBookingUsers:LocalBookingUser[]) {
    let bookingPersons:BookingPerson[]=[];
    localBookingUsers.forEach(u=>{
      var bp = { 
        bookingDocId: this.data.bookingDocId,
        groupDocId: this.data.group.docId,
        bookingDesc: this.data.group.groupName,
        userId: u.userDocId,
        userDisplayName:u.name,
        amount: u.amount,
        parentUserId: this.data.loggedInUser.docId,
        parentUserDisplayName: this.data.loggedInUser.name,
        paymentMethod: this.data.hasCredit ? GlobalConstants.paymentCredit : GlobalConstants.paymentCash,
        isPaid:true,
        createdOn: Timestamp.now(),
      } as BookingPerson;
      if (u.docId) bp.docId = u.docId;
      bookingPersons.push(bp);

    });
    return bookingPersons;
  }

  onSelectionChange() {
    console.log("toggle changed");
    this.calculateTotal();
  }
  calculateTotal(){
    let selectedfamilyBookingUsers = this.data.familyBookingUsers.filter(x=>x.selected === true);
    let selectedFriendBookingUsers = this.data.friendBookingUsers.filter(x=>x.selected === true);
    console.log('calculateTotal: ', this.data.familyBookingUsers);
    let i = 0; let amount = 0;
    selectedfamilyBookingUsers.forEach(u=>{
      
      if (i == 0) {
        u.amount = GlobalConstants.rateCredit;
      }
      else {
        u.amount = GlobalConstants.rateFamily;
      }

      if(!this.data.hasCredit) u.amount=GlobalConstants.rateCash;

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
    let found = this.data.group.committees.find(x=>x === userDocId);
    return found != null;
  }

}

export interface BookingDialogData {
  loggedInUser:Account,
  bookingDocId:string;
  group: Group;
  allLocalBookingUsers: LocalBookingUser[];
  familyBookingUsers: LocalBookingUser[];
  friendBookingUsers: LocalBookingUser[];
  hasCredit: boolean;
  isCommittee: boolean;
  isSeatsLeft: boolean;
}




@Component({
  selector: 'withdraw-dialog',
  templateUrl: 'withdraw.html',
})
export class WithdrawDialog {
  constructor(
    public dialogRef: MatDialogRef<WithdrawDialog>,
    @Inject(MAT_DIALOG_DATA) public data: WithdrawDialogData, private bookingPersonService:BookingPersonService, private helperService:HelperService, private accountService:AccountService) {}

    hasError:boolean;
    errorMessage:string;
    timeLeft:number;
    isWithdrawAllowed:boolean;
    bookingWithdrawHours: number = GlobalConstants.bookingWithdrawHours;
    totalAmount:number;
    isLoading:boolean;
    allBookings:BookingPerson[];


  ngOnInit() {
    let eventStartDateTime = this.data.booking.eventStartDateTime;
    let diff = this.helperService.findTimeDifference(eventStartDateTime);
    if (diff > GlobalConstants.bookingWithdrawHours*3600) {
      console.log('withdraw is allowed');
      this.isWithdrawAllowed = true;
    }
    else {
      console.log('withdraw isnot allowed, mark it for available');
      this.isWithdrawAllowed = false;

    }
    console.log('time diff: ', diff)
    
  }
  onNoClick(): void {
    this.dialogRef.close();
  }


}

export interface WithdrawDialogData {
  loggedInUser:Account,
  booking:Booking;
  group: Group;
  inputBookingPerson: LocalBookingUser;
  allLocalBookingUsers: LocalBookingUser[];
  familyBookingUsers: LocalBookingUser[];
  friendBookingUsers: LocalBookingUser[];
  hasCredit: boolean;
  isCommittee: boolean;
  isSeatsLeft: boolean;
}

