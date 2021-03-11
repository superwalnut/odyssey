import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../models/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { BaseComponent } from '../../base-component';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-manage-profile',
  templateUrl: './manage-profile.component.html',
  styleUrls: ['./manage-profile.component.scss']
})
export class ManageProfileComponent extends BaseComponent implements OnInit {
  @Input() userDocId:string;

  profileForm: FormGroup;
  submitted = false;
  user: User = new User();

  constructor(private fb: FormBuilder, private accountService: AccountService, private snackBar: MatSnackBar, private router: Router) {
    super();
  }

  ngOnInit() {
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      mobile: ['', Validators.required],
    });

    console.log('userId', this.userDocId);

    this.accountService.getUserByDocId(this.userDocId).subscribe(x => {
      this.user = x;

      this.profileForm = this.fb.group({
        email: [this.user.email, [Validators.required, Validators.email]],
        name: [this.user.name, Validators.required],
        mobile: [this.user.mobile, Validators.required],
      });
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.profileForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.profileForm.invalid) {
      console.log('form invalid');
      return;
    }

    console.log('profile', this.profileForm);

    var user = {
      name: this.profileForm.value.name,
      email: this.profileForm.value.email,
      mobile: this.profileForm.value.mobile,
    } as User;

    this.accountService.isEmailExist(user.email).pipe(take(1)).subscribe((e) => {
      const foundIds = e.filter(x=>x.docId != this.userDocId);
      if(foundIds && foundIds.length > 0) {
        this.profileForm.controls.email.setErrors({'incorrect': true});
        this.snackBar.open(`this email is already existed.`, null, {
          duration: 5000,
          verticalPosition: 'top'
        });
      } else {
        this.accountService.isMobileExist(user.mobile).pipe(take(1)).subscribe(m=>{
          const foundIds = m.filter(x=>x.docId != this.userDocId);
          if(foundIds && foundIds.length > 0) {
            this.profileForm.controls.mobile.setErrors({'incorrect': true});
            this.snackBar.open(`this mobile is existed.`, null, {
              duration: 5000,
              verticalPosition: 'top'
            });
          } else {
            this.accountService.isNameExist(user.name).pipe(take(1)).subscribe(n=>{
              const foundIds = n.filter(x=>x.docId != this.userDocId);
              if(foundIds && foundIds.length > 0) {
                    this.profileForm.controls.name.setErrors({'incorrect': true});
                this.snackBar.open(`this name is existed.`, null, {
                  duration: 5000,
                  verticalPosition: 'top'
                });
              } else {
                console.log('updating user');
                this.accountService.updateUser(this.user.docId, user).then(x => {
                  this.snackBar.open(`you have successfully updated profile.`, null, {
                    duration: 5000,
                    verticalPosition: 'top'
                  });
                }).catch(x=>{
                  this.snackBar.open(x, null, {
                    duration: 5000,
                    verticalPosition: 'top'
                  });
                });
              }
            });
            
          }
        });
      }
    });
  }
}
