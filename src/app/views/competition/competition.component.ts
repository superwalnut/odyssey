import {LiveAnnouncer} from '@angular/cdk/a11y';
import { AfterViewInit, Component,ViewChild, OnInit } from '@angular/core';
import { BaseComponent } from '../base-component';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

export interface ScheduleElement {
  group: string,
  left: string,
  right: string,
  handicap: number,
  court: number,
  time: string,
  umpire: string,
}

const ELEMENT_DATA: ScheduleElement[] = [
  {
    "group": "A",
    "left": "Zane, John Lim",
    "handicap": null,
    "right": "Nick, Angus",
    "court": 1,
    "time": "20:20",
    "umpire": "Andrew, Simon S"
  },
  {
    "group": "A",
    "left": "Alex, Michael",
    "handicap": null,
    "right": "Frank Z, Herbert",
    "court": 2,
    "time": "20:20",
    "umpire": "Thomas, Iris T"
  },
  {
    "group": "A",
    "left": "Luc, Leon",
    "handicap": null,
    "right": "Gary, He Pin",
    "court": 3,
    "time": "20:20",
    "umpire": "Xiao, Poh"
  },
  {
    "group": "B",
    "left": "Henry Su, Prakash",
    "handicap": null,
    "right": "78KG Alex, David Dong",
    "court": 4,
    "time": "20:20",
    "umpire": "Elaine, Charissa"
  },
  {
    "group": "B",
    "left": "Tom, Robin",
    "handicap": null,
    "right": "Steven Liu, Manny",
    "court": 5,
    "time": "20:20",
    "umpire": "Shirley, Ting"
  },
  {
    "group": "B",
    "left": "Benson, Patrick",
    "handicap": null,
    "right": "Valerie, Winson",
    "court": 6,
    "time": "20:20",
    "umpire": "Maggie, Ada"
  },
  {
    "group": "C",
    "left": "Andrew, Simon S",
    "handicap": null,
    "right": "Paven, Faraz",
    "court": 1,
    "time": "20:30",
    "umpire": "Zane, John Lim"
  },
  {
    "group": "C",
    "left": "Thomas, Iris",
    "handicap": null,
    "right": "Du lin, Christ Zhang",
    "court": 2,
    "time": "20:30",
    "umpire": "Alex, Michael"
  },
  {
    "group": "C",
    "left": "Josh, Lenise",
    "handicap": 5,
    "right": "Xiao, Poh",
    "court": 3,
    "time": "20:30",
    "umpire": "Luc, Leon"
  },
  {
    "group": "D",
    "left": "Elaine, Charissa",
    "handicap": null,
    "right": "Mannie, Bei Lin",
    "court": 4,
    "time": "20:30",
    "umpire": "Henry Su, Prakash"
  },
  {
    "group": "D",
    "left": "Shirley, Ting",
    "handicap": 5,
    "right": "Andy Wu, Xiao Bo",
    "court": 5,
    "time": "20:30",
    "umpire": "Tom, Robin"
  },
  {
    "group": "D",
    "left": "Maggie, Ada",
    "handicap": null,
    "right": "Peter W, Jensen",
    "court": 6,
    "time": "20:30",
    "umpire": "Benson, Patrick"
  },
  {
    "group": "A",
    "left": "Frank Z, Herbert",
    "handicap": null,
    "right": "Luc, Leon",
    "court": 1,
    "time": "20:40",
    "umpire": "Du lin, Christ Zhang"
  },
  {
    "group": "A",
    "left": "Gary, He Pin",
    "handicap": null,
    "right": "Zane, John Lim",
    "court": 2,
    "time": "20:40",
    "umpire": "Josh, Lenise"
  },
  {
    "group": "A",
    "left": "Alex, Michael ",
    "handicap": null,
    "right": "Nick, Angus",
    "court": 3,
    "time": "20:40",
    "umpire": "Paven, Faraz"
  },
  {
    "group": "B",
    "left": "Steven Liu, Manny",
    "handicap": null,
    "right": "Benson, Patrick",
    "court": 4,
    "time": "20:40",
    "umpire": "Andy Wu, Xiao Bo"
  },
  {
    "group": "B",
    "left": "Valerie, Winson",
    "handicap": null,
    "right": "Henry Su, Prakash",
    "court": 5,
    "time": "20:40",
    "umpire": "Peter W, Jensen"
  },
  {
    "group": "B",
    "left": "78KG Alex, David Dong",
    "handicap": null,
    "right": "Tom, Robin",
    "court": 6,
    "time": "20:40",
    "umpire": "Mannie, Bei Lin"
  },
  {
    "group": "C",
    "left": "Du lin, Christ Zhang",
    "handicap": null,
    "right": "Xiao, Poh",
    "court": 1,
    "time": "20:50",
    "umpire": "Frank Z, Herbert"
  },
  {
    "group": "C",
    "left": "Josh, Lenise",
    "handicap": 5,
    "right": "Andrew, Simon S",
    "court": 2,
    "time": "20:50",
    "umpire": "Gary, He Pin"
  },
  {
    "group": "C",
    "left": "Thomas, Iris",
    "handicap": 5,
    "right": "Paven, Faraz",
    "court": 3,
    "time": "20:50",
    "umpire": "Nick, Angus"
  },
  {
    "group": "D",
    "left": "Maggie, Ada",
    "handicap": 5,
    "right": "Andy Wu, Xiao Bo",
    "court": 4,
    "time": "20:50",
    "umpire": "Steven Liu, Manny"
  },
  {
    "group": "D",
    "left": "Elaine, Charissa",
    "handicap": null,
    "right": "Peter W, Jensen",
    "court": 5,
    "time": "20:50",
    "umpire": "Valerie, Winson"
  },
  {
    "group": "D",
    "left": "Mannie, Bei Lin",
    "handicap": null,
    "right": "Shirley, Ting",
    "court": 6,
    "time": "20:50",
    "umpire": "78KG Alex, David Dong"
  },
  {
    "group": "A",
    "left": "Gary, He Pin",
    "handicap": null,
    "right": "Frank Z, Herbert",
    "court": 1,
    "time": "21:00",
    "umpire": "Josh, Lenise"
  },
  {
    "group": "A",
    "left": "Luc, Leon",
    "handicap": null,
    "right": "Nick, Angus",
    "court": 2,
    "time": "21:00",
    "umpire": "Xiao, Poh"
  },
  {
    "group": "A",
    "left": "Zane, John Lim",
    "handicap": null,
    "right": "Alex, Michael",
    "court": 3,
    "time": "21:00",
    "umpire": "Andrew, Simon S"
  },
  {
    "group": "B",
    "left": "Valerie, Winson",
    "handicap": null,
    "right": "Steven Liu, Manny",
    "court": 4,
    "time": "21:00",
    "umpire": "Peter W, Jensen"
  },
  {
    "group": "B",
    "left": "Benson, Patrick",
    "handicap": null,
    "right": "78KG Alex, David Dong",
    "court": 5,
    "time": "21:00",
    "umpire": "Maggie, Ada"
  },
  {
    "group": "B",
    "left": "Henry Su, Prakash",
    "handicap": null,
    "right": "Tom, Robin",
    "court": 6,
    "time": "21:00",
    "umpire": "Elaine, Charissa"
  },
  {
    "group": "C",
    "left": "Josh, Lenise",
    "handicap": null,
    "right": "Du lin, Christ Zhang",
    "court": 1,
    "time": "21:10",
    "umpire": "Gary, He Pin"
  },
  {
    "group": "C",
    "left": "Xiao, Poh",
    "handicap": null,
    "right": "Paven, Faraz",
    "court": 2,
    "time": "21:10",
    "umpire": "Luc, Leon"
  },
  {
    "group": "C",
    "left": "Thomas, Iris",
    "handicap": 5,
    "right": "Andrew, Simon",
    "court": 3,
    "time": "21:10",
    "umpire": "Zane, John Lim"
  },
  {
    "group": "D",
    "left": "Peter W, Jensen",
    "handicap": 5,
    "right": "Andy Wu, Xiao Bo",
    "court": 4,
    "time": "21:10",
    "umpire": "Valerie, Winson"
  },
  {
    "group": "D",
    "left": "Maggie, Ada",
    "handicap": null,
    "right": "Mannie, Bei Lin",
    "court": 5,
    "time": "21:10",
    "umpire": "Benson, Patrick"
  },
  {
    "group": "D",
    "left": "Elaine, Charissa",
    "handicap": null,
    "right": "Shirley, Ting",
    "court": 6,
    "time": "21:10",
    "umpire": "Henry Su, Prakash"
  },
  {
    "group": "A",
    "left": "Alex, Michael",
    "handicap": null,
    "right": "Luc, Leon",
    "court": 1,
    "time": "21:20",
    "umpire": "Thomas, Iris T"
  },
  {
    "group": "A",
    "left": "Nick, Angus",
    "handicap": null,
    "right": "Gary, He Pin",
    "court": 2,
    "time": "21:20",
    "umpire": "Paven, Faraz"
  },
  {
    "group": "A",
    "left": "Frank Z, Herbert",
    "handicap": null,
    "right": "Zane, John Lim",
    "court": 3,
    "time": "21:20",
    "umpire": "Du lin, Christ Zhang"
  },
  {
    "group": "B",
    "left": "Tom, Robin",
    "handicap": null,
    "right": "Benson, Patrick",
    "court": 4,
    "time": "21:20",
    "umpire": "Shirley, Ting"
  },
  {
    "group": "B",
    "left": "78KG Alex, David Dong",
    "handicap": null,
    "right": "Valerie, Winson",
    "court": 5,
    "time": "21:20",
    "umpire": "Mannie, Bei Lin"
  },
  {
    "group": "B",
    "left": "Steven Liu, Manny",
    "handicap": null,
    "right": "Henry Su, Prakash",
    "court": 6,
    "time": "21:20",
    "umpire": "Andy Wu, Xiao Bo"
  },
  {
    "group": "C",
    "left": "Thomas, Iris",
    "handicap": 5,
    "right": "Xiao, Poh",
    "court": 1,
    "time": "21:30",
    "umpire": "Alex, Michael"
  },
  {
    "group": "C",
    "left": "Josh, Lenise",
    "handicap": 5,
    "right": "Paven, Faraz ",
    "court": 2,
    "time": "21:30",
    "umpire": "Nick, Angus"
  },
  {
    "group": "C",
    "left": "Du lin, Christ Zhang",
    "handicap": null,
    "right": "Andrew, Simon S",
    "court": 3,
    "time": "21:30",
    "umpire": "Frank Z, Herbert"
  },
  {
    "group": "D",
    "left": "Shirley, Ting",
    "handicap": null,
    "right": "Maggie, Ada",
    "court": 4,
    "time": "21:30",
    "umpire": "Tom, Robin"
  },
  {
    "group": "D",
    "left": "Mannie, Bei Lin",
    "handicap": null,
    "right": "Peter W, Jensen",
    "court": 5,
    "time": "21:30",
    "umpire": "78KG Alex, David Dong"
  },
  {
    "group": "D",
    "left": "Elaine, Charissa",
    "handicap": 5,
    "right": "Andy Wu, Xiao Bo",
    "court": 6,
    "time": "21:30",
    "umpire": "Steven Liu, Manny"
  },
  {
    "group": "A",
    "left": "Gary, He Pin",
    "handicap": null,
    "right": "Alex, Michael",
    "court": 1,
    "time": "21:40",
    "umpire": "Josh, Lenise"
  },
  {
    "group": "A",
    "left": "Zane, John Lim",
    "handicap": null,
    "right": "Luc, Leon",
    "court": 2,
    "time": "21:40",
    "umpire": "Andrew, Simon S"
  },
  {
    "group": "A",
    "left": "Frank Z, Herbert",
    "handicap": null,
    "right": "Nick, Angus",
    "court": 3,
    "time": "21:40",
    "umpire": "Du lin, Christ Zhang"
  },
  {
    "group": "B",
    "left": "Valerie, Winson",
    "handicap": null,
    "right": "Tom, Robin",
    "court": 4,
    "time": "21:40",
    "umpire": "Peter W, Jensen"
  },
  {
    "group": "B",
    "left": "Henry Su, Prakash",
    "handicap": null,
    "right": "Benson, Patrick",
    "court": 5,
    "time": "21:40",
    "umpire": "Elaine, Charissa"
  },
  {
    "group": "B",
    "left": "Steven Liu, Manny",
    "handicap": null,
    "right": "78KG Alex, David Dong",
    "court": 6,
    "time": "21:40",
    "umpire": "Andy Wu, Xiao Bo"
  },
  {
    "group": "C",
    "left": "Thomas, Iris",
    "handicap": null,
    "right": "Josh, Lenise",
    "court": 1,
    "time": "21:50",
    "umpire": "Gary, He Pin"
  },
  {
    "group": "C",
    "left": "Andrew, Simon S",
    "handicap": null,
    "right": "Xiao, Poh",
    "court": 2,
    "time": "21:50",
    "umpire": "Zane, John Lim"
  },
  {
    "group": "C",
    "left": "Du lin, Christ Zhang",
    "handicap": null,
    "right": "Paven, Faraz",
    "court": 3,
    "time": "21:50",
    "umpire": "Frank Z, Herbert"
  },
  {
    "group": "D",
    "left": "Shirley, Ting",
    "handicap": null,
    "right": "Peter W, Jensen",
    "court": 4,
    "time": "21:50",
    "umpire": "Valerie, Winson"
  },
  {
    "group": "D",
    "left": "Elaine, Charissa",
    "handicap": null,
    "right": "Maggie, Ada",
    "court": 5,
    "time": "21:50",
    "umpire": "Henry Su, Prakash"
  },
  {
    "group": "D",
    "left": "Mannie, Bei Lin",
    "handicap": 5,
    "right": "Andy Wu, Xiao Bo",
    "court": 6,
    "time": "21:50",
    "umpire": "Steven Liu, Manny"
  }
 ]

@Component({
  selector: 'app-competition',
  templateUrl: './competition.component.html',
  styleUrls:  ['./competition.component.scss']
})
export class CompetitionComponent extends BaseComponent implements OnInit {
  
  displayedColumns: string[] = ['group', 'left', 'right', 'court', 'time', 'umpire'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  constructor(private _liveAnnouncer: LiveAnnouncer) { super() }

  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  ngOnInit(): void {
  }


  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }


}
