import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";

import { Shuttle } from "../../../models/shuttle";
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

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.shuttleForm = this.fb.group({
      purchaseDate: ["", Validators.required],
      cost: ["", Validators.required],
      quantity: ["", Validators.required],
      notes: ["", Validators.required],
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
