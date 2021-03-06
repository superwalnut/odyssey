import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { MatSnackBar } from '@angular/material/snack-bar';
import { Shuttle } from "../../../models/shuttle";
import { Term } from "../../../models/term";
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import { ShuttleService} from "../../../services/shuttle.service";
import { TermService} from "../../../services/term.service";


@Component({
  selector: "app-sitesettings",
  templateUrl: "./sitesettings.component.html",
  styleUrls: ["./sitesettings.component.scss"],
})
export class SitesettingsComponent implements OnInit, AfterViewInit {
  shuttleForm: FormGroup;
  shuttleSubmitted = false;
  termForm: FormGroup;
  termSubmitted = false;
  
  terms:Term[] = [];
  shuttles : Shuttle[] = [];

  termDisplayedColumns: string[] = ['startDate', 'endDate', 'termName', 'cost', 'vip'];
  termDataSource = new MatTableDataSource<Term>();
  shuttleDisplayedColumns: string[] = ['purchaseDate', 'cost', 'quantity', 'notes'];
  shuttleDataSource = new MatTableDataSource<Shuttle>();



  // @ViewChild(MatSort) sortShuttle: MatSort;
  // @ViewChild(MatSort) sortTerm: MatSort;

  @ViewChild('sortShuttle') sortShuttle: MatSort;
@ViewChild('sortTerm') sortTerm: MatSort;


  constructor(private fb: FormBuilder, private shuttleService:ShuttleService,private termService:TermService,private snackBar:MatSnackBar,) {}

  ngAfterViewInit() {
    this.shuttleDataSource.sort = this.sortShuttle;
    this.termDataSource.sort = this.sortTerm;
  }

  ngOnInit(): void {

    this.termForm = this.fb.group({
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      termName: ["", Validators.required],
      cost: ["", Validators.required],
      vip: ["", Validators.required],
    });


    this.shuttleForm = this.fb.group({
      purchaseDate: ["", Validators.required],
      cost: ["", Validators.required],
      quantity: ["", Validators.required],
      notes: ["", Validators.required],
    });


    this.getAllTerms();

    this.getShuttlePurchaseList();

  }

  getShuttlePurchaseList()
  {
    this.shuttleService.getList().subscribe(x=> {
      this.shuttles = x;
      console.log(x);
      this.shuttleDataSource.data = this.shuttles;
    });

  }
  getAllTerms()
  {
    this.termService.getTerms().subscribe(x=>{
      this.termDataSource.data = x;

    });
  }

  onTermSubmit() {
    this.termSubmitted = true;
    var term = {
      startDate: this.termForm.value.startDate,
      endDate: this.termForm.value.endDate,
      termName: this.termForm.value.termName,
      cost: this.termForm.value.cost,
      vip: this.termForm.value.vip,
    } as Term;
    console.log(term);
    this.termService.createTerm(term).then(x=>{
      this.snackBar.open(`Term has been created.`, null , {
        duration: 5000,
        verticalPosition: 'top'
      });
    });

  }

  onShuttleSubmit() {
    this.shuttleSubmitted = true;

    var shuttle = {
      purchaseDate: this.shuttleForm.value.purchaseDate,
      cost: this.shuttleForm.value.cost,
      quantity: this.shuttleForm.value.quantity,
      notes: this.shuttleForm.value.notes,
    } as Shuttle;
    console.log(shuttle);
    this.shuttleService.createShuttlePurchase(shuttle).then(x=>{
      this.snackBar.open(`Shuttle purchase has been created.`, null , {
        duration: 5000,
        verticalPosition: 'top'
      });
    });

  }

  get tf() {
    return this.termForm.controls;
  }

  get sf() {
    return this.shuttleForm.controls;
  }
}

