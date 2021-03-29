import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../models/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-manage-password',
  templateUrl: './manage-password.component.html',
  styleUrls: ['./manage-password.component.scss']
})
export class ManagePasswordComponent implements OnInit {
  @Input() userDocId:string;
  @Input() isAdmin:boolean;

  passwordForm: FormGroup;
  submitted = false;
  user:User;

  constructor(private fb: FormBuilder, private accountService:AccountService, private snackBar:MatSnackBar, private router: Router) { 
    
  }

  ngOnInit() {
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    },{
      validator: this.MustMatch('password', 'confirmPassword')
    });

    this.accountService.getLoginUser().subscribe(x=>{
      this.user = x;
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.passwordForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.passwordForm.invalid) {
      console.log('form invalid');
      return;
    }

    console.log('profile', this.passwordForm);

    var user = { 
      password: this.passwordForm.value.password,
    } as User;

    if(this.user){
      this.accountService.updateUser(this.user.docId, user).then(x=>{
        this.snackBar.open(`Your password have been updated.`, null , {
          duration: 5000,
          verticalPosition: 'top'
        });
      });
    } else {
      this.snackBar.open(`You must login first!`, null , {
        duration: 5000,
        verticalPosition: 'top'
      });
    }
  }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
  }
}
