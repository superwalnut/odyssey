import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";

@Component({
  selector: "app-autobooking",
  templateUrl: "./autobooking.component.html",
  styleUrls: ["./autobooking.component.scss"],
})
export class AutobookingComponent implements OnInit {
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  constructor() {}

  ngOnInit(): void {}
}
