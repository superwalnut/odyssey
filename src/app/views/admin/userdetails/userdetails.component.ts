import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../models/user';
import { AccountService } from '../../../services/account.service';
import { CreditService } from '../../../services/credit.service';

@Component({
  selector: 'app-userdetails',
  templateUrl: './userdetails.component.html',
  styleUrls: ['./userdetails.component.scss']
})
export class UserdetailsComponent implements OnInit {
  userDocId: string;
  user: User;
  balance: number = 0;

  profileForm: FormGroup;
  profileSubmitted = false;

  passwordForm: FormGroup;
  passwordSubmitted = false;

  constructor(private activatedRoute: ActivatedRoute, private accountService: AccountService, private creditService: CreditService, private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      mobile: ['', Validators.required],
    });

    this.passwordForm = this.fb.group({
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.userDocId = this.activatedRoute.snapshot.params.id;
    if (this.userDocId) {
      this.accountService.getUserByDocId(this.userDocId).subscribe(x => {
        console.log(x);
        this.user = x;
      });

      this.creditService.getBalance(this.userDocId).subscribe(x => {
        if (x) {
          this.balance = x;
        }
      });

      this.accountService.getUserByDocId(this.userDocId).subscribe(x => {
        this.user = x;
        console.log(this.user);
        this.profileForm = this.fb.group({
          email: [this.user.email, [Validators.required, Validators.email]],
          name: [this.user.name, Validators.required],
          mobile: [this.user.mobile, Validators.required],
        });
      });
    }
  }

  // convenience getter for easy access to form fields
  get pf() { return this.profileForm.controls; }

  get pwf() { return this.passwordForm.controls; }

  onProfileSubmit() {
    this.profileSubmitted = true;

    // stop here if form is invalid
    if (this.profileForm.invalid) {
      console.log('form invalid');
      return;
    }

    var user = {
      name: this.profileForm.value.name,
      email: this.profileForm.value.email,
      mobile: this.profileForm.value.mobile,
    } as User;

    this.accountService.updateUser(this.userDocId, user).then(x => {
      this.snackBar.open(`Your account settings have been updated.`, null, {
        duration: 5000,
        verticalPosition: 'top'
      });
    });
  }
}
