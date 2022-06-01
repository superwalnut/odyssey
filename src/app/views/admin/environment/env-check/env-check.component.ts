import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-env-check',
  templateUrl: './env-check.component.html',
  styleUrls: ['./env-check.component.scss']
})
export class EnvCheckComponent implements OnInit {
  domain:string = environment.domain;
  mailUrl:string = environment.mail_url;
  env:string = environment.production == "true"?"Production":"UAT";
  firebase:any = environment.firebase;
  constructor() { }

  ngOnInit(): void {
  }

}
