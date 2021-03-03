import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";

@Component({
  selector: "app-sitesettings",
  templateUrl: "./sitesettings.component.html",
  styleUrls: ["./sitesettings.component.scss"],
})
export class SitesettingsComponent implements OnInit {
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  constructor() {}

  ngOnInit(): void {}
}
