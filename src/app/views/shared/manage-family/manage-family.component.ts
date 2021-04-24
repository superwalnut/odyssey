import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { User } from '../../../models/user';
import { EventLoggerService } from '../../../services/event-logger.service';
import { EventLogger } from '../../../models/event-logger';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-manage-family',
  templateUrl: './manage-family.component.html',
  styleUrls: ['./manage-family.component.scss']
})
export class ManageFamilyComponent implements OnInit {
  @Input() userDocId: string;

  //form: FormGroup;
  user: User;
  //submitted = false;
  loadedFamilies: User[];
  isFamilyUser:boolean;

  constructor(private fb: FormBuilder, private dialogRef: MatDialog, public dialog: MatDialog, private accountService: AccountService, private snackBar: MatSnackBar, private router: Router) {}

  addFamilyClicked() {
    const dialogRef = this.dialog.open(FamilyNewDialog, {
      width: '650px',
      data: {
        parentUser: this.user,
        //memberUser: { parentUserDocId: this.user.docId, parentUserDisplayName: this.user.name } as User,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Family new dialog was closed');
    });
  }

  updateFamilyMember(member:User){
    const dialogRef = this.dialog.open(FamilyNewDialog, {
      width: '650px',
      data: {
        isNew: false,
        parentUser: this.user,
        memberUser: member,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Family update dialog was closed');
    });
  }

  removeFamilyMember(user:User) {
    console.log(user);
    if (confirm('Are you sure to delete this family member?')) {
      this.accountService.deleteUser(user.docId);
    }
  }

  ngOnInit(): void {
    this.accountService.getUserByDocId(this.userDocId).subscribe(x => {
      this.user = x;
      this.isFamilyUser = x.parentUserDocId != null;
      console.log('user', this.user);
    });

    this.accountService.getFamilyUsers(this.userDocId).subscribe(x => {
      this.loadedFamilies = x;
    });
  }
}

@Component({
  selector: 'family-dialog',
  templateUrl: 'family.html',
})
export class FamilyDialog {
  constructor(
    public dialogRef: MatDialogRef<FamilyDialog>,
    @Inject(MAT_DIALOG_DATA) public data: FamilyDialogData, private eventLogService: EventLoggerService, private accountService: AccountService) { }

  hasError: boolean;
  errorMessage: string;
  user: User;
  isLoading: boolean;


  ngOnInit() {
    this.user = {...this.data.memberUser};
    console.log('parent: ', this.data.parentUser);
    console.log('child: ', this.user)
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}

export interface FamilyDialogData {
  parentUser: User,
  memberUser: User,
  isNew: boolean;
}


@Component({
  selector: 'familynew-dialog',
  templateUrl: 'familynew.html',
})
export class FamilyNewDialog {
  constructor(
    public dialogRef: MatDialogRef<FamilyNewDialog>,private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: FamilyDialogData, private eventLogService: EventLoggerService, private accountService: AccountService) { }

    familyNewForm: FormGroup;
    hasError: boolean;
    errorMessage: string;
    isLoading: boolean;
    submitted = false;

  ngOnInit() {
    this.familyNewForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(20), Validators.pattern('^[a-zA-Z0-9_ ]+$')]],
      gender:['', Validators.required],
      agegroup:['', Validators.required]
    });

    if (this.data.memberUser) {
      this.familyNewForm.patchValue(
        {
          name: this.data.memberUser.name,
          gender: this.data.memberUser.gender,
          agegroup: this.data.memberUser.isChild? "Child" : "Adult",
        }
      );  
    }
    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.submitted) { return false; }

    this.submitted = true;
    var foundName = false;
    this.accountService.isNameExist(this.familyNewForm.value.name).pipe(take(1)).subscribe(results=>{
      if (!this.data.memberUser) {
        //if new user
        foundName = results.length > 0;
      } else {
        //update user
        foundName = results.filter(x=>x.docId != this.data.memberUser.docId).length > 0;
      }

      if (foundName) {
        this.familyNewForm.controls.name.setErrors({'incorrect': true});
        return false;
      }

      var user = {
        name: this.familyNewForm.value.name,
        gender: this.familyNewForm.value.gender,
        isChild: this.familyNewForm.value.agegroup,
        parentUserDocId: this.data.parentUser.docId,
        parentUserDisplayName: this.data.parentUser.name,
        disabled: false,
        requireChangePassword: false,
      } as User;

      if (!this.data.memberUser) {
        
        console.log('submit new', user)
        this.accountService.createUser(user).then(x=>{
          this.dialogRef.close();
        })

      } else {
        console.log('submit updating')
        this.accountService.updateUser(this.data.memberUser.docId, user).then(x => {
          this.dialogRef.close();
        });
      }
  });
}



  get f() { return this.familyNewForm.controls; }
}

// export interface FamilyNewDialogData {
//   parentUser: User, 
// }

