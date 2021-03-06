import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../models/user';
import { AccountService } from '../../../services/account.service';
import { CreditService } from '../../../services/credit.service';

@Component({
  selector: 'app-usercredit',
  templateUrl: './usercredit.component.html',
  styleUrls: ['./usercredit.component.scss']
})
export class UsercreditComponent implements OnInit {
  userDocId:string;
  user:User;
  balance:number = 0;

  constructor(private activatedRoute: ActivatedRoute, private accountService:AccountService, private creditService:CreditService) { }

  ngOnInit(): void {
    // this.userDocId = this.activatedRoute.snapshot.params.id;
    // this.accountService.getUserByDocId(this.userDocId).subscribe(x=>{
    //   this.user = x;
    // });

    // this.creditService.getBalance(this.userDocId).subscribe(x=>{
    //   this.balance = x;
    // });
  }

}
