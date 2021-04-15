import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-creditstatement',
  templateUrl: './creditstatement.component.html',
  styleUrls: ['./creditstatement.component.scss']
})
export class CreditstatementComponent implements OnInit {
  userDocId:string;
  isCreditUser:boolean;

  constructor(private accountService:AccountService) { }

  ngOnInit(): void {
    this.accountService.getLoginUser().subscribe(x=>{
      this.userDocId = x.docId;
      this.isCreditUser = x.isCreditUser;
    });
  }

}
