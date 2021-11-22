import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base-component';


@Component({
  selector: 'app-competition',
  templateUrl: './competition.component.html',
  styleUrls:  ['./competition.component.scss']
})
export class CompetitionComponent extends BaseComponent implements OnInit {

  constructor() { super() }

  ngOnInit(): void {
  }

}
