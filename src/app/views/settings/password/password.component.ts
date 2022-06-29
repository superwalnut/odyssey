import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../models/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { Account } from '../../../models/account';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {
  account: Account;

  constructor(private fb: FormBuilder, private accountService: AccountService, private snackBar: MatSnackBar, private router: Router) {

  }

  ngOnInit() {
    this.account = this.accountService.getLoginAccount();

    console.log('account', this.account);
  }
}
