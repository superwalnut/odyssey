import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { helpers } from 'chart.js';
import { take } from 'rxjs/operators';
import { HelperService } from '../../common/helper.service';
import { AccountService } from '../../services/account.service';
import { MailgunService } from '../../services/mailgun.service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetpasswordComponent implements OnInit {
  resetForm: FormGroup;
  submitted = false;

  constructor(private mailgunService:MailgunService, private fb:FormBuilder, private accountService:AccountService, private helpService:HelperService) { }

  ngOnInit(): void {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.resetForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.resetForm.invalid) {
      console.log("form invalid");
      return;
    }

    this.accountService.isEmailExist(this.resetForm.value.email).pipe(take(1)).subscribe(x=>{
      if(x && x.length >0){
        console.log('email', this.resetForm.value.email);
        var hashkey = this.helpService.encryptData(this.resetForm.value.email);
        console.log('hashkey', hashkey);
        const encoded = encodeURIComponent(hashkey);
        console.log('encoded', encoded);
        this.mailgunService.sendForgotPassword(this.resetForm.value.email, encoded);
      }
    });
  }


}
