import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";

@Component({
  selector: "app",

  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"], 
})
export class HomeComponent implements OnInit {
  show:boolean = true;

  constructor() {}

  ngOnInit(): void {}
}
