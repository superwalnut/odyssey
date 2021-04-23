import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { User } from '../../../models/user';
import { EventLoggerService } from '../../../services/event-logger.service';
import { EventLogger } from '../../../models/event-logger';



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
    const dialogRef = this.dialog.open(FamilyDialog, {
      width: '650px',
      data: {
        isNew: true,
        parentUser: this.user,
        memberUser: { parentUserDocId: this.user.docId, parentUserDisplayName: this.user.name } as User,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Family dialog was closed');
    });
  }

  updateFamilyMember(member:User){
    const dialogRef = this.dialog.open(FamilyDialog, {
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
      //this.families.clear();
      this.loadedFamilies = x;
      // if (x && x.length > 0) {
        
      //   console.log('x', x)
      //   x.forEach(o => {
      //     console.log('push', o);
      //     this.families.push(this.buildFamilyGroup(o.docId, o.name, o.gender, o.isChild ? 'Child' : 'Adult'));
      //   });
      // }
    });
  }

  // buildFamilyGroup(userDocId: string, name: string, gender: string, agegroup: string): FormGroup {
  //   return this.fb.group({
  //     userDocId: userDocId,
  //     name: name,
  //     gender: gender,
  //     agegroup: agegroup,
  //   });
  // }

  // deleteFamily(index) {
  //   if (confirm("Confirm to delete a family member?")) {
  //     this.families.removeAt(index);
  //   }
  // }

  // get families(): FormArray {
  //   return this.form.get('families') as FormArray;
  // }

  // addFamily() {
  //   this.families.push(this.buildFamilyGroup('', '', '', ''));
  // }

  // onSubmit() {
  //   this.submitted = true;

  //   // stop here if form is invalid
  //   if (this.form.invalid) {
  //     console.log('form invalid');
  //     return;
  //   }

  //   console.log(this.families.value);

  //   var familUserIds: string[] = this.families.value.map(x => {
  //     return x.userDocId as string;
  //   });

  //   if (this.families.value) {
  //     this.families.value.forEach((x, i) => {
  //       const userDocId = x.userDocId;
  //       const name = x.name;
  //       const gender = x.gender;
  //       const isChild = x.agegroup == 'Child' ? true : false;

  //       if (userDocId) {
  //         // updating family user
  //         const user = {
  //           name: name,
  //           gender: gender,
  //           isChild: isChild,
  //         } as User;
  //         this.accountService.updateUser(userDocId, user).then(x => {
  //           if (i == this.families.value.length - 1) {
  //             this.snackBar.open(`Your family is updated.`, null, {
  //               duration: 5000,
  //               verticalPosition: 'top'
  //             });
  //           }
  //         });
  //       } else {
  //         // create new family user
  //         const user = {
  //           name: name,
  //           parentUserDocId: this.userDocId,
  //           parentUserDisplayName: this.user.name,
  //         } as User;
  //         this.accountService.createUser(user).then(x => {
  //           if (i == this.families.value.length - 1) {
  //             this.snackBar.open(`Your family is updated.`, null, {
  //               duration: 5000,
  //               verticalPosition: 'top'
  //             });
  //           }
  //         });
  //       }
  //     });
  //   }

  //   // delete families 
  //   if (this.loadedFamilies) {
  //     this.loadedFamilies.forEach(x => {
  //       if (!familUserIds.includes(x.docId)) {
  //         //remove family off user
  //         const user = { parentUserDocId: '' } as User;
  //         this.accountService.updateUser(x.docId, user);
  //       }
  //     });
  //   }
  // }
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

  // confirmClicked() {
  //   console.log('member user: ', this.user)
  //   this.isLoading = true;

  //   if (this.data.isNew) {
  //     console.log('member user: ', this.user)
  //     this.accountService.createUser(this.user)
  //       .then(() => {
  //         this.isLoading = false;
  //         this.dialogRef.close();
  //       })
  //       .catch((err) => { this.isLoading = false; alert(err) })
  //   }
  //   else{
  //     this.accountService.updateUser(this.user.docId, this.user)
  //     .then(() => {
  //       this.isLoading = false;
  //       this.dialogRef.close();
  //     })
  //     .catch((err) => { this.isLoading = false; alert(err) })
  //   }
  // }

}


export interface FamilyDialogData {
  parentUser: User,
  memberUser: User,
  isNew: boolean;
 
}

