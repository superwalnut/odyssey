import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { HelperService } from '../../common/helper.service';
import { User } from '../../models/user';
import { AccountService } from '../../services/account.service';
import { MailgunService } from '../../services/mailgun.service';

@Component({
  selector: 'app-create-new-password',
  templateUrl: './create-new-password.component.html',
  styleUrls: ['./create-new-password.component.scss']
})
export class CreateNewPasswordComponent implements OnInit {
  resetForm: FormGroup;
  submitted = false;
  user:User;

  constructor(private mailgunService:MailgunService, private fb:FormBuilder, private accountService:AccountService, private helpService:HelperService, private activatedRoute: ActivatedRoute, private snackBar: MatSnackBar) {
    var haskey = this.activatedRoute.snapshot.params.hashkey;
    var email = this.helpService.decryptData(haskey);
    this.accountService.getUserByEmail(email).pipe(take(1)).subscribe(x=>{
      this.user = x;
    });
   }

  ngOnInit(): void {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
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

    var updated = { password: this.resetForm.value.password } as User;

    // update user
    this.accountService.updateUser(this.user.docId, updated).then(x => {
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

}
