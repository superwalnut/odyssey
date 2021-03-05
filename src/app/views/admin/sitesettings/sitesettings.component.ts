import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { MatSnackBar } from '@angular/material/snack-bar';
import { Shuttle } from "../../../models/shuttle";
import { ShuttleService} from "../../../services/shuttle.service";
//import { Shuttle } from "@models/shuttle";

@Component({
  selector: "app-sitesettings",
  templateUrl: "./sitesettings.component.html",
  styleUrls: ["./sitesettings.component.scss"],
})
export class SitesettingsComponent implements OnInit {
  shuttleForm: FormGroup;
  shuttleSubmitted = false;
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  constructor(private fb: FormBuilder, private shuttleService:ShuttleService,private snackBar:MatSnackBar,) {}

  ngOnInit(): void {
    this.shuttleForm = this.fb.group({
      purchaseDate: ["", Validators.required],
      cost: ["", Validators.required],
      quantity: ["", Validators.required],
      notes: ["", Validators.required],
    });

    this.shuttleService.getSList();
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
  get sf() {
    return this.shuttleForm.controls;
  }
}

// docId: string;
// purchaseDate: Date;
// cost: number;
// quantity: number;
// notes: string;
