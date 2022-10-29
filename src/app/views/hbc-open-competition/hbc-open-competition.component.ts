import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-hbc-open-competition',
  templateUrl: './hbc-open-competition.component.html',
  styleUrls: ['./hbc-open-competition.component.scss']
})
export class HbcOpenCompetitionComponent implements OnInit {
  competition:string = "intermediate";
  
  constructor(private activatedRoute: ActivatedRoute) { 
    this.competition = this.activatedRoute.snapshot.params.competition;
  }

  ngOnInit(): void {
  }

}
