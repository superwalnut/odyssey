import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-family',
  templateUrl: './family.component.html',
  styleUrls: ['./family.component.scss']
})
export class FamilyComponent implements OnInit {
  form: FormGroup;
  user:User;
  submitted = false;

  constructor(private fb: FormBuilder, private accountService:AccountService, private snackBar:MatSnackBar, private router: Router) { 
    
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      families : new FormArray([]),
    });

    this.accountService.getLoginUser().subscribe(x=>{
      this.user = x;

      // if(this.user.family){
      //   const items = new FormArray([]);
      //   this.user.family.forEach(x=>{
      //     items.push(new FormControl(x));
      //   });
      //   this.form = new FormGroup({
      //     families: items,
      //   });
      // }
    });

    console.log('user', this.user);
  }

  deleteFamily(index) {
    this.families.removeAt(index);
  }

  get families(): FormArray {
    return this.form.get('families') as FormArray;
  }

  addFamily() {
    this.families.push(new FormControl());
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      console.log('form invalid');
      return;
    }

    console.log(this.families.value);  // ['SF', 'NY']
    console.log(this.form.value);    // { cities: ['SF', 'NY'] }

    // if(this.user){
    //   this.user.family = this.families.value;

    //   console.log('save', this.user.family);

    //   this.accountService.updateUser(this.user.docId, this.user).then(x=>{
    //     this.snackBar.open(`Your account settings have been updated.`, null , {
    //       duration: 35000,
    //       verticalPosition: 'top'
    //     });
    //   });
    // } else {
    //   this.snackBar.open(`You must login first!`, null , {
    //     duration: 5000,
    //     verticalPosition: 'top'
    //   });
    // }

  }
}
