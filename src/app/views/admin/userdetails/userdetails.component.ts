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

  familyForm: FormGroup;
  familySubmitted = false;

  constructor(private activatedRoute: ActivatedRoute, private accountService: AccountService, private creditService: CreditService, private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      mobile: ['', Validators.required],
    });

    this.passwordForm = this.fb.group({
      password: ['', Validators.required]
    });

    this.familyForm = new FormGroup({
      families: new FormArray([]),
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

        this.profileForm = this.fb.group({
          email: [this.user.email, [Validators.required, Validators.email]],
          name: [this.user.name, Validators.required],
          mobile: [this.user.mobile, Validators.required],
        });

        this.accountService.getFamilyUsers(this.userDocId).subscribe(x=>{
          if(x)
          if (x && x.length>0) {
            const items = new FormArray([]);
            x.forEach(x => {
              items.push(new FormControl(x));
            });
            this.familyForm = new FormGroup({
              families: items,
            });
          }
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

  onPasswordSubmit() {
    this.passwordSubmitted = true;

    // stop here if form is invalid
    if (this.passwordForm.invalid) {
      console.log('form invalid');
      return;
    }

    var user = {
      password: this.passwordForm.value.password,
    } as User;

    this.accountService.updateUser(this.userDocId, user).then(x => {
      this.snackBar.open(`Your account password have been updated.`, null, {
        duration: 5000,
        verticalPosition: 'top'
      });
    });
  }

  deleteFamily(index) {
    this.families.removeAt(index);
  }

  get families(): FormArray {
    return this.familyForm.get('families') as FormArray;
  }

  addFamily() {
    this.families.push(new FormControl());
  }

  onFamilySubmit() {
    this.familySubmitted = true;

    // stop here if form is invalid
    if (this.familyForm.invalid) {
      console.log('form invalid');
      return;
    }

    this.families.value;

    

    this.accountService.updateUser(this.userDocId, this.user).then(x => {
      this.snackBar.open(`Your account settings have been updated.`, null, {
        duration: 35000,
        verticalPosition: 'top'
      });
    });
  }
}
