import { Component, Input, OnInit } from '@angular/core';
import { Credit } from '../../../models/credit';
import { CreditService } from '../../../services/credit.service';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit {
  @Input() userDocId:string;
  credits:Credit[];
  
  constructor(private creditService:CreditService) { }

  ngOnInit(): void {
    this.creditService.getByUser(this.userDocId).subscribe(x=>{
      console.log('credits', x);
      this.credits = x;
    });
  }

}
