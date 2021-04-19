import { Component, Inject, OnInit,ViewChild,AfterViewInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../../../models/user';
import { UserFamily } from '../../../viewmodels/user-family';
import { AccountService } from '../../../services/account.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: 'app-user-grade',
  templateUrl: './user-grade.component.html',
  styleUrls: ['./user-grade.component.scss']
})
export class UserGradeComponent implements OnInit,AfterViewInit {
  displayedColumns: string[] = ['name', 'gender', 'grade', 'gradePoints', 'docId' ];
  dataSource: MatTableDataSource<User>;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private accountService: AccountService, private dialogRef: MatDialog, public dialog: MatDialog) { }


  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this.accountService.getAllUsers().subscribe((x) => {
      console.log(x)
      this.dataSource = new MatTableDataSource(x);
      this.dataSource.sort = this.sort;
    });
  }

  editClicked(user:User){

    console.log(user)
    const dialogRef = this.dialog.open(GradeDialog, {
      width: '650px',
      data: {
        user: user,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Grade dialog was closed');

    });
  }
}

@Component({
  selector: 'grade-dialog',
  templateUrl: 'grade.html',
})
export class GradeDialog {
  gradeForm: FormGroup;
  gradeNames = ['F','E','D','C','B','A','O']


  constructor(private fb: FormBuilder, 
    public dialogRef: MatDialogRef<GradeDialog>,
    @Inject(MAT_DIALOG_DATA) public data: GradeDialogData, private accountService:AccountService) { }

  hasError: boolean;
  errorMessage: string;


  //note: string;

  ngOnInit() {
    this.gradeForm = this.fb.group({
      grade: ["", Validators.required],
      gradePoints: ["", Validators.required],
    });

    this.gradeForm.patchValue({
      grade: this.data.user.grade,
      gradePoints: this.data.user.gradePoints,
    })

  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    console.log(this.gradeForm.valid);
    console.log(this.gradeForm.value.grade);
    console.log(this.gradeForm.value.gradePoints);

    let user = { grade: this.gradeForm.value.grade, gradePoints: this.gradeForm.value.gradePoints } as User;
    this.accountService.updateUser(this.data.user.docId, user)
      .then(() => {
        this.dialogRef.close();
      })
      .catch((err) => { alert(err) })

    
  }



  get f() {
    return this.gradeForm.controls;
  }


}


export interface GradeDialogData {
  user: User,


}
