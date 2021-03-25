import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';
import { MailgunService } from '../../services/mailgun.service';
import { HelperService } from '../../common/helper.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'register.component.html'
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private accountService: AccountService, private snackBar: MatSnackBar, private router: Router, private mailService:MailgunService, private helpService:HelperService) {

  }

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', Validators.required],
      mobile: ['', Validators.required],
    },{
      validator: this.MustMatch('password', 'confirmPassword')
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      console.log('form invalid');
      return;
    }

    console.log('register', this.registerForm);

    var user = {
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      mobile: this.registerForm.value.mobile,
      isChild:false,
    } as User;

    const emailCheck$ = this.accountService.isEmailExist(user.email);
    const nameCheck$ = this.accountService.isNameExist(user.name);
    const mobileCheck$ = this.accountService.isMobileExist(user.mobile);

    combineLatest([emailCheck$, nameCheck$, mobileCheck$]).pipe(take(1)).subscribe(results => {
      const foundEmail = results[0];
      const foundName = results[1];
      const foundMobile = results[2];

      var err = '';
      if(foundEmail.length>0){
        err = 'this email is already existed.';
        this.registerForm.controls.email.setErrors({'incorrect': true});
      }

      if(foundName.length>0){
        err = 'this name is existed.';
        this.registerForm.controls.name.setErrors({'incorrect': true});
      }

      if(foundMobile.length > 0){
        err = 'this mobile is existed.';
        this.registerForm.controls.mobile.setErrors({'incorrect': true});
      }

      if(err){
        this.snackBar.open(err, null, {
          duration: 5000,
          verticalPosition: 'top'
        });
      } else {
        // create user
        this.accountService.createUser(user).then(x => {
          var hashkey = this.helpService.encryptData(user.email);
          this.mailService.sendRegistration(user.email, user.name, hashkey);
          this.snackBar.open(`you have successfully registered.`, null, {
            duration: 5000,
            verticalPosition: 'top'
          });
          this.router.navigate(['/login'], { queryParams: { returnUrl: '/register' } });
        }).catch(x=>{
          this.snackBar.open(x, null, {
            duration: 5000,
            verticalPosition: 'top'
          });
        });
      }
    });
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
