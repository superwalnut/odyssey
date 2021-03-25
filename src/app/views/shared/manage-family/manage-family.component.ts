import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-manage-family',
  templateUrl: './manage-family.component.html',
  styleUrls: ['./manage-family.component.scss']
})
export class ManageFamilyComponent implements OnInit {
  @Input() userDocId:string;

  form: FormGroup;
  user:User;
  submitted = false;
  loadedFamilies:User[];

  constructor(private fb: FormBuilder, private accountService:AccountService, private snackBar:MatSnackBar, private router: Router) { 
    
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      families : this.fb.array([this.buildFamilyGroup('','', '','')]),
    });

    console.log('userid',this.userDocId);

    this.accountService.getUserByDocId(this.userDocId).subscribe(x=>{
      this.user = x;
      console.log('user', this.user);
    });
    
    this.accountService.getFamilyUsers(this.userDocId).subscribe(x=>{
      this.families.clear();
      if (x && x.length>0) {
        this.loadedFamilies = x;
        console.log('x', x)
        x.forEach(o => {
          console.log('push', o);
          this.families.push(this.buildFamilyGroup(o.docId, o.name, o.gender, o.isChild?'Child':'Adult'));
        });
      }
    });
  }

  buildFamilyGroup(userDocId:string, name:string, gender:string, agegroup:string): FormGroup {
    return this.fb.group({
            userDocId: userDocId,
            name: name,
            gender: gender,
            agegroup: agegroup,
    });
  }

  deleteFamily(index) {
    this.families.removeAt(index);
  }

  get families(): FormArray {
    return this.form.get('families') as FormArray;
  }

  addFamily() {
    this.families.push(this.buildFamilyGroup('','','',''));
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      console.log('form invalid');
      return;
    }

    console.log(this.families.value);

    var familUserIds : string[] = this.families.value.map(x=>{
      return x.userDocId as string;
    });

    if(this.families.value) {
      this.families.value.forEach((x, i) => {
        const userDocId = x.userDocId;
        const name = x.name;
        const gender = x.gender;
        const isChild = x.agegroup == 'Child'?true:false;
        
        if(userDocId) {
          // updating family user
          const user = {
            name : name,
            gender: gender,
            isChild: isChild,
          } as User;
          this.accountService.updateUser(userDocId, user).then(x=>{
            if(i == this.families.value.length - 1){
              this.snackBar.open(`Your family is updated.`, null , {
                duration: 5000,
                verticalPosition: 'top'
              });
            }
          });
        } else {
          // create new family user
          const user = {
            name : name,
            parentUserDocId : this.userDocId,
          } as User;
          this.accountService.createUser(user).then(x=>{
            if(i == this.families.value.length - 1){
              this.snackBar.open(`Your family is updated.`, null , {
                duration: 5000,
                verticalPosition: 'top'
              });
            }
          });
        }
      });
    }

    // delete families 
    if(this.loadedFamilies){
      this.loadedFamilies.forEach(x=>{
        if(!familUserIds.includes(x.docId)){
          //remove family off user
          const user = { parentUserDocId : '' } as User;
          this.accountService.updateUser(x.docId, user);
        }
      });
    }
  }
}
