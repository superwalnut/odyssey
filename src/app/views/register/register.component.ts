import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'register.component.html'
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private accountService: AccountService, private snackBar: MatSnackBar, private router: Router) {

  }

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      name: ['', Validators.required],
      mobile: ['', Validators.required],
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
    } as User;

    this.accountService.isEmailExist(user.email).subscribe((e) => {
      if(e && e.length > 0) {
        this.registerForm.controls.email.setErrors({'incorrect': true});
        this.snackBar.open(`this email is already exist.`, null, {
          duration: 5000,
          verticalPosition: 'top'
        });
      } else {
        this.accountService.isMobileExist(user.mobile).subscribe(m=>{
          if(m && m.length > 0) {
            this.registerForm.controls.mobile.setErrors({'incorrect': true});
            this.snackBar.open(`this mobile is exist.`, null, {
              duration: 5000,
              verticalPosition: 'top'
            });
          } else {
            this.accountService.isNameExist(user.name).subscribe(n=>{
              if(n && n.length > 0){
                this.registerForm.controls.name.setErrors({'incorrect': true});
                this.snackBar.open(`this name is exist.`, null, {
                  duration: 5000,
                  verticalPosition: 'top'
                });
              } else {
                this.accountService.createUser(user).then(x => {
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
        });
      }
    });
  }
}
