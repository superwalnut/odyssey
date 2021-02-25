import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit{ 
  showRegisterMsg:boolean;
  loginForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute, private accountService:AccountService, private router: Router) {
    // redirect to home if already logged in
    if (this.accountService.accountValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
        this.showRegisterMsg = params.returnUrl != '' && params.returnUrl == 'register';
      }
    );

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      console.log('form invalid');
      return;
    }

    console.log('login', this.loginForm);

    this.accountService.login(this.loginForm.value.email, this.loginForm.value.password);
  }

}
