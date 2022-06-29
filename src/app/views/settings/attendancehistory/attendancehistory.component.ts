import { Component, OnInit } from '@angular/core';
import { AccountService } from "../../../services/account.service";

@Component({
  selector: 'app-attendancehistory',
  templateUrl: './attendancehistory.component.html',
  styleUrls: ['./attendancehistory.component.scss']
})
export class AttendancehistoryComponent implements OnInit {
  userDocId:string;

  constructor(private accountService:AccountService) { }

  ngOnInit(): void {    
    let loggedInAccount = this.accountService.getLoginAccount();
    this.userDocId = loggedInAccount.docId;

  }
}
