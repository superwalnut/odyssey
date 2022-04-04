import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take, takeUntil } from 'rxjs/operators';
import { Credit } from '../../../../models/credit';
import { Group } from '../../../../models/group';
import { AccountService } from '../../../../services/account.service';
import { BookingPersonService } from '../../../../services/booking-person.service';
import { BookingScheduleService } from '../../../../services/booking-schedule.service';
import { CreditService } from '../../../../services/credit.service';
import { GroupTransactionService } from '../../../../services/group-transaction.service';
import { GroupService } from '../../../../services/group.service';
import { BaseComponent } from '../../../base-component';

@Component({
  selector: 'app-rpt-csv',
  templateUrl: './rpt-csv.component.html',
  styleUrls: ['./rpt-csv.component.scss']
})
export class RptCsvComponent extends BaseComponent implements OnInit {

  isGod: boolean;
  groups:Group[];
  selectedGroupIdForGroupTransaction:string;
  selectedGroupIdForBookingPerson:string;
  pipe = new DatePipe('en-AU');

  constructor(
    private creditService:CreditService, 
    private userService:AccountService, 
    private bookignScheduleService:BookingScheduleService, 
    private accountService: AccountService,
    private snackBar:MatSnackBar, 
    private groupTransactionService:GroupTransactionService,
    private groupService:GroupService,
    private bookingPersonService:BookingPersonService) { 
    super();
  }

  ngOnInit(): void {
    this.isGod = this.accountService.isGod();
 
    // this.groupService.getGroups().pipe(takeUntil(this.ngUnsubscribe)).subscribe(g=>{
    //   this.groups = g;
    // });
  }

  downloadUserCredits() {
    this.creditService.getAllCredits().pipe(take(1)).subscribe(x=>{
      const data = x.map(c=>{
        const date = c.created?.toDate();
        var formatDate = '';
        if(date){
          formatDate = this.pipe.transform(date, 'short');
        }
        
        return {
          'amount': c.amount,
          'date': formatDate,
          'note': c.note,
          'userName': c.userDisplayName,
          'userId': c.userDocId,
          'category': c.category,
        };
      });
      this.snackBar.open(`you have successfully download the credit transactions.`, null, {
        duration: 5000,
        verticalPosition: 'top'
      });
      super.downloadFile(data, 'user-credit-transactions');
    });
  }

  downloadGroupTransactions() {
    //var groupName = this.groups.find(x=>x.docId == this.selectedGroupIdForGroupTransaction).groupName;

    this.groupTransactionService.getAll().subscribe(x=>{
      const report = x.map(g=>{
        return {
          docId: g.docId,
          groupDocId: g.groupDocId,
          referenceId: g.referenceId,
          notes: g.notes,
          amount: g.amount,
          paymentMethod: g.paymentMethod,
          startDate: g.startDate?this.pipe.transform(g.startDate.toDate(), 'short'):'',
          endDate: g.endDate?this.pipe.transform(g.endDate.toDate(), 'short'):'',
          created : this.pipe.transform(g.created.toDate(), 'short'),
          createdBy: g.createdBy,
          createdByName: g.createdByDisplayName,
          updated: g.updated?this.pipe.transform(g.updated.toDate(), 'short'):'',
          updatedBy: g.updatedBy,
          updatedByName: g.updatedByDisplayName,
        };
      });
      super.downloadFile(report, `groupTransactions`);
    });
  }

  downloadBookingPersons() {
      //var groupName = this.groups.find(x=>x.docId == this.selectedGroupIdForBookingPerson).groupName;

      this.bookingPersonService.getAllBookingPersonsNoLimit().pipe(takeUntil(this.ngUnsubscribe)).subscribe(x=>{
        const report = x.map(g=>{
          return {
            docId: g.docId,
            bookingDocId: g.bookingDocId,
            groupDocId: g.groupDocId,
            bookingDesc: g.bookingDesc,
            userId: g.userId,
            username: g.userDisplayName,
            notes: g.notes,
            paymentMethod: g.paymentMethod,
            parentUserId: g.parentUserId,
            parentUsername: g.parentUserDisplayName,
            isForSale: g.isForSale,
            amount: g.amount,
            avatarUrl: g.avatarUrl,
            isPaid: g.isPaid,
            createdDate : this.pipe.transform(g.createdOn.toDate(), 'short'),
            updatedDate: g.updatedOn?this.pipe.transform(g.updatedOn.toDate(), 'short'):'',
          };
        });
        
        super.downloadFile(report, `allBookingPersons`);
        console.log("🚀 ~ file: rpt-csv.component.ts ~ line 134 ~ RptCsvComponent ~ this.bookingPersonService.getByGroupId ~ report", report)
      });
  }

  selectGroupForGroupTransaction(val:string) {
    this.selectedGroupIdForGroupTransaction = val;
  }

  selectedGroupForBookingPerson(val:string) {
    this.selectedGroupIdForBookingPerson = val;
  }


}
