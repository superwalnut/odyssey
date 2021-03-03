import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";

@Component({
  selector: "app-autobooking",
  templateUrl: "./autobooking.component.html",
  styleUrls: ["./autobooking.component.scss"],
})
export class AutobookingComponent implements OnInit {
  checked = true;
  indeterminate = false;
  sessions: string[] = [
    "TUESDAY 8-11PM SESSION",
    "FRIDAY 8-11PM SESSION",
    "SATURDAY 5-8PM SESSION",
  ];

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  constructor() {}

  ngOnInit(): void {}
}
