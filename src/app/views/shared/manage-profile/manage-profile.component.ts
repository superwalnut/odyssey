import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../models/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { BaseComponent } from '../../base-component';
import { combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';
@Component({
  selector: 'app-manage-profile',
  templateUrl: './manage-profile.component.html',
  styleUrls: ['./manage-profile.component.scss']
})
export class ManageProfileComponent extends BaseComponent implements OnInit {
  @Input() userDocId:string;
  @Input() isAdmin:boolean;

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
      gender:[''],
      agegroup:[''],
      isMember:['']
    });

    console.log('userId', this.userDocId);

    this.accountService.getUserByDocId(this.userDocId).subscribe(x => {
      this.user = x;
      this.profileForm.patchValue(
        {
          email: this.user.email,
          name: this.user.name,
          mobile: this.user.mobile,
          gender: this.user.gender,
          agegroup: this.user.isChild? "Child" : "Adult",
          isMember: this.user.isMember
        }
      );
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
      gender: this.profileForm.value.gender,
      isChild: this.profileForm.value.agegroup == 'Child'?true:false,
    } as User;

    if(this.isAdmin){
      user.isMember = this.profileForm.value.isMember;
    }

    const emailCheck$ = this.accountService.isEmailExist(user.email);
    const nameCheck$ = this.accountService.isNameExist(user.name);
    const mobileCheck$ = this.accountService.isMobileExist(user.mobile);

    combineLatest([emailCheck$, nameCheck$, mobileCheck$]).pipe(take(1)).subscribe(results => {
      const foundEmail = results[0].filter(x=>x.docId != this.userDocId);
      const foundName = results[1].filter(x=>x.docId != this.userDocId);
      const foundMobile = results[2].filter(x=>x.docId != this.userDocId);

      var err = '';
      if(foundEmail.length>0){
        err = 'this email is already existed.';
        this.profileForm.controls.email.setErrors({'incorrect': true});
      }

      if(foundName.length>0){
        err = 'this name is existed.';
        this.profileForm.controls.name.setErrors({'incorrect': true});
      }

      if(foundMobile.length > 0){
        err = 'this mobile is existed.';
        this.profileForm.controls.mobile.setErrors({'incorrect': true});
      }

      if(err){
        this.snackBar.open(err, null, {
          duration: 5000,
          verticalPosition: 'top'
        });
      } else {
        // update user
        this.accountService.updateUser(this.user.docId, user).then(x => {

          // if user updated its name, update family's parent display name
          if(user.name) {
            this.accountService.getFamilyUsers(this.userDocId).pipe(take(1)).subscribe(x=>{
              if(x && x.length>0) {
                x.forEach(u=>{
                  const family = { parentUserDisplayName: user.name } as User;
                  this.accountService.updateUser(u.docId, family);
                });
              }
            });
          }

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
}
