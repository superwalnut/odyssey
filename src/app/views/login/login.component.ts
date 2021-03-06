import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { HelperService } from "../../common/helper.service";
import { AccountService } from "../../services/account.service";
import { EventLoggerService } from "../../services/event-logger.service";
import { EventLogger } from "../../models/event-logger";
import { GlobalConstants } from "../../common/global-constants";



@Component({
  selector: "app-dashboard",
  templateUrl: "login.component.html",
  styleUrls: ["./login.component.scss"],

})
export class LoginComponent implements OnInit {
  showRegisterMsg: boolean;
  loginForm: FormGroup;
  submitted = false;
  loginSuccess:Boolean;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private router: Router,
    private snackBar: MatSnackBar,
    private helpService:HelperService,
    private eventLogService:EventLoggerService
  ) {
    // redirect to home if already logged in
    if (this.accountService.accountValue) {
      this.router.navigate(["/"]);
    }
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.showRegisterMsg =
        params.returnUrl != "" && params.returnUrl == "register";
    });

    this.loginForm = this.fb.group({
      phone: ["", [Validators.required]],
      password: [null, [Validators.required, Validators.minLength(6)]],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;


    // stop here if form is invalid
    if (this.loginForm.invalid) {
      console.log("form invalid");
      return;
    }

    console.log("login", this.loginForm);

    this.accountService.authenticate(this.loginForm.value.phone,this.loginForm.value.password).subscribe(x=>{
      if (x) {
        this.accountService.saveLocal(x);
        this.loginSuccess = true;

        if(x.requireChangePassword){
          var hashkey = this.helpService.encryptData(x.email);
          const encoded = encodeURIComponent(hashkey);
          this.router.navigate([`/createpassword`, encoded]);
        }
        else {
          // get return url from query parameters or default to home page
          var returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/dashboard';
                  
          if (returnUrl == '/login' || returnUrl == '/register')
            returnUrl = '/dashboard';
          this.router.navigateByUrl(returnUrl);
        }

        var log = {
          eventCategory: GlobalConstants.eventWebActivity,
          notes: x.name + ' login success',
        } as EventLogger

        if (x.name != 'Luc')
          this.eventLogService.createLog(log, x.docId, x.name);


      } else {
        this.loginSuccess = false;
        this.snackBar.open(`Failed to login, your username/password is incorrect.`, null, {
          duration: 5000,
          verticalPosition: 'top'
        });
      }
    });

    
  }
}
