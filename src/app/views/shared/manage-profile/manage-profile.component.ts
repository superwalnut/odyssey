import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../models/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { BaseComponent } from '../../base-component';
import { combineLatest ,Observable, Subject} from 'rxjs';
import { take,takeUntil } from 'rxjs/operators';
import { StorageService } from '../../../services/storage.service';
import { GlobalConstants } from '../../../common/global-constants';
import { asLiteral } from '@angular/compiler/src/render3/view/util';

@Component({
  selector: 'app-manage-profile',
  templateUrl: './manage-profile.component.html',
  styleUrls: ['./manage-profile.component.scss']
})
export class ManageProfileComponent extends BaseComponent implements OnInit {
  @Input() userDocId:string;
  @Input() isAdmin:boolean;
  destroy$: Subject<null> = new Subject();
  @ViewChild("fileInput", {static: false}) fileInput: ElementRef;

  profileForm: FormGroup;
  submitted = false;
  user: User = new User();
  isMainAccount:boolean;
  files = [];  
  imageFile;
  isGod:boolean;

  
  constructor(private fb: FormBuilder, private accountService: AccountService, private storageService:StorageService, private snackBar: MatSnackBar, private router: Router) { super(); }

  ngOnInit() {
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(/^[^*|\":<>[\]{}`\\()';@&$]+$/)]],
      mobile: ['', Validators.required],
      gender:[''],
      agegroup:[''],
      isMember:[''],
      isCreditUser:[''],
      disabled:[''],
    });
    this.isGod = this.accountService.isGod();

    this.accountService.getUserByDocId(this.userDocId).subscribe(x => {
      this.user = x;
      console.log('getuserbydocid', x);
      this.isMainAccount = x.docId != null && x.parentUserDocId == null;

      this.profileForm.patchValue(
        {
          email: this.user.email,
          name: this.user.name,
          mobile: this.user.mobile,
          gender: this.user.gender,
          agegroup: this.user.isChild? "Child" : "Adult",
          isMember: this.user.isMember,
          isCreditUser: this.user.isCreditUser,
          disabled:this.user.disabled,
        }
      );
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.profileForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.profileForm.invalid) {
      console.log('form invalid');
      return;
    }

    console.log('profile', this.profileForm);

    var user = {
      name: this.profileForm.value.name,
      email: this.profileForm.value.email,
      mobile: this.profileForm.value.mobile,
      gender: this.profileForm.value.gender??'',
      isChild: this.profileForm.value.agegroup == 'Child'?true:false,
      
    } as User;

    if(this.isAdmin){
      user.isMember = this.profileForm.value.isMember ;
      //isMember: this.profileForm.value.isMember,
      user.isCreditUser = this.profileForm.value.isCreditUser;
      user.disabled = this.profileForm.value.disabled;
    }

    user.name = user.name.trim();
    console.log(user);
    //return false;


    const emailCheck$ = this.accountService.isEmailExist(user.email);
    const nameCheck$ = this.accountService.isNameExist(user.name);
    const mobileCheck$ = this.accountService.isMobileExist(user.mobile);

    combineLatest([emailCheck$, nameCheck$, mobileCheck$]).pipe(take(1)).subscribe(results => {
      const foundEmail = results[0].filter(x=>x.docId != this.userDocId);
      const foundName = results[1].filter(x=>x.docId != this.userDocId);
      const foundMobile = results[2].filter(x=>x.docId != this.userDocId);

      var err = '';
      if(foundEmail.length>0){
        err = 'this email is already existed.';
        this.profileForm.controls.email.setErrors({'incorrect': true});
      }

      if(foundName.length>0){
        err = 'this name is existed.';
        this.profileForm.controls.name.setErrors({'incorrect': true});
      }

      if(foundMobile.length > 0){
        err = 'this mobile is existed.';
        this.profileForm.controls.mobile.setErrors({'incorrect': true});
      }

      if(err){
        this.snackBar.open(err, null, {
          duration: 5000,
          verticalPosition: 'top'
        });
      } else {
        // update user
        this.accountService.updateUser(this.user.docId, user).then(x => {

          // if user updated its name, update family's parent display name
          if(user.name) {
            this.accountService.getFamilyUsers(this.userDocId).pipe(take(1)).subscribe(x=>{
              if(x && x.length>0) {
                x.forEach(u=>{
                  const family = { parentUserDisplayName: user.name } as User;
                  this.accountService.updateUser(u.docId, family);
                });
              }
            });
          }
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
    });
  }


  //Image Avatar upload
  onUploadClick() {  
    const fileInput = this.fileInput.nativeElement;
    fileInput .onchange = () => {  
        this.imageFile = { data: fileInput.files[0], inProgress: false, progress: 0};
        this.upload();  
    };  
    fileInput.click();  
  }

  private upload() {  
    this.fileInput.nativeElement.value = '';  

    if (!this.validateFile(this.imageFile.data)) {
      alert("Image illegal")
      return false;
    }

    this.storageService.uploadFileAndGetMetadata("avatar", this.imageFile.data, this.user.docId).downloadUrl$.pipe(takeUntil(this.destroy$)).subscribe(result=>{
      console.log(result)

      this.user.avatarUrl = result;
      this.accountService.updateUser(this.user.docId, this.user);
    })
  }

  validateFile(file:File) {
    var size = file.size;
    var fileType = file.type;
    console.log('size in KB xxx', size/1024)

    if (size/1024 > GlobalConstants.imageMaxSizeInKb) {
      alert("Image size must be under " + GlobalConstants.imageMaxSizeInKb + " KB " + size/1024);
      return false;
    }

    var allowedType = GlobalConstants.imageFileTypes.includes(fileType);
    if (!allowedType) {
      alert("Image type must be JPEG, GIF or PNG ");
      return false;
    }
    return true;
  }


}
