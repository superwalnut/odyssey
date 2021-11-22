import {LiveAnnouncer} from '@angular/cdk/a11y';
import { AfterViewInit, Component,ViewChild, OnInit } from '@angular/core';
import { BaseComponent } from '../base-component';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

export interface ScheduleElement {
  group: string,
  left: string,
  right: string,
  court: number,
  time: string,
  umpire: string,
}

const ELEMENT_DATA: ScheduleElement[] = [
  {
    "group": "A",
    "left": "Zane, John Lim",
    "right": "Nick, Angus",
    "court": 1,
    "time": "20:20",
    "umpire": "Andrew, Simon S"
  },
  {
    "group": "A",
    "left": "Alex, Michael",
    "right": "Frank Z, Herbert",
    "court": 2,
    "time": "20:20",
    "umpire": "Thomas, Iris T"
  },
  {
    "group": "A",
    "left": "Luc, Leon",
    "right": "Gary, He Pin",
    "court": 3,
    "time": "20:20",
    "umpire": "Xiao, Poh"
  },
  {
    "group": "A",
    "left": "Frank Z, Herbert",
    "right": "Luc, Leon",
    "court": 1,
    "time": "20:40",
    "umpire": "Du lin, Christ Zhang"
  },
  {
    "group": "A",
    "left": "Gary, He Pin",
    "right": "Zane, John Lim",
    "court": 2,
    "time": "20:40",
    "umpire": "Josh, Lenise"
  },
  {
    "group": "A",
    "left": "Alex, Michael ",
    "right": "Nick, Angus",
    "court": 3,
    "time": "20:40",
    "umpire": "Paven, Faraz"
  },
  {
    "group": "A",
    "left": "Gary, He Pin",
    "right": "Frank Z, Herbert",
    "court": 1,
    "time": "21:00",
    "umpire": "Josh, Lenise"
  },
  {
    "group": "A",
    "left": "Luc, Leon",
    "right": "Nick, Angus",
    "court": 2,
    "time": "21:00",
    "umpire": "Xiao, Poh"
  },
  {
    "group": "A",
    "left": "Zane, John Lim",
    "right": "Alex, Michael",
    "court": 3,
    "time": "21:00",
    "umpire": "Andrew, Simon S"
  },
  {
    "group": "A",
    "left": "Alex, Michael",
    "right": "Luc, Leon",
    "court": 1,
    "time": "21:20",
    "umpire": "Thomas, Iris T"
  },
  {
    "group": "A",
    "left": "Nick, Angus",
    "right": "Gary, He Pin",
    "court": 2,
    "time": "21:20",
    "umpire": "Paven, Faraz"
  },
  {
    "group": "A",
    "left": "Frank Z, Herbert",
    "right": "Zane, John Lim",
    "court": 3,
    "time": "21:20",
    "umpire": "Du lin, Christ Zhang"
  },
  {
    "group": "A",
    "left": "Gary, He Pin",
    "right": "Alex, Michael",
    "court": 1,
    "time": "21:40",
    "umpire": "Josh, Lenise"
  },
  {
    "group": "A",
    "left": "Zane, John Lim",
    "right": "Luc, Leon",
    "court": 2,
    "time": "21:40",
    "umpire": "Andrew, Simon S"
  },
  {
    "group": "A",
    "left": "Frank Z, Herbert",
    "right": "Nick, Angus",
    "court": 3,
    "time": "21:40",
    "umpire": "Du lin, Christ Zhang"
  },
  {
    "group": "B",
    "left": "Henry Su, Prakash",
    "right": "78KG Alex, David Dong",
    "court": 4,
    "time": "20:20",
    "umpire": "Elaine, Charissa"
  },
  {
    "group": "B",
    "left": "Tom, Robin",
    "right": "Steven Liu, Manny",
    "court": 5,
    "time": "20:20",
    "umpire": "Shirley, Ting"
  },
  {
    "group": "B",
    "left": "Benson, Patrick",
    "right": "Valerie, Winson",
    "court": 6,
    "time": "20:20",
    "umpire": "Maggie, Ada"
  },
  {
    "group": "B",
    "left": "Steven Liu, Manny",
    "right": "Benson, Patrick",
    "court": 4,
    "time": "20:40",
    "umpire": "Andy Wu, Xiao Bo"
  },
  {
    "group": "B",
    "left": "Valerie, Winson",
    "right": "Henry Su, Prakash",
    "court": 5,
    "time": "20:40",
    "umpire": "Peter W, Jensen"
  },
  {
    "group": "B",
    "left": "78KG Alex, David Dong",
    "right": "Tom, Robin",
    "court": 6,
    "time": "20:40",
    "umpire": "Mannie, Bei Lin"
  },
  {
    "group": "B",
    "left": "Valerie, Winson",
    "right": "Steven Liu, Manny",
    "court": 4,
    "time": "21:00",
    "umpire": "Peter W, Jensen"
  },
  {
    "group": "B",
    "left": "Benson, Patrick",
    "right": "78KG Alex, David Dong",
    "court": 5,
    "time": "21:00",
    "umpire": "Maggie, Ada"
  },
  {
    "group": "B",
    "left": "Henry Su, Prakash",
    "right": "Tom, Robin",
    "court": 6,
    "time": "21:00",
    "umpire": "Elaine, Charissa"
  },
  {
    "group": "B",
    "left": "Tom, Robin",
    "right": "Benson, Patrick",
    "court": 4,
    "time": "21:20",
    "umpire": "Shirley, Ting"
  },
  {
    "group": "B",
    "left": "78KG Alex, David Dong",
    "right": "Valerie, Winson",
    "court": 5,
    "time": "21:20",
    "umpire": "Mannie, Bei Lin"
  },
  {
    "group": "B",
    "left": "Steven Liu, Manny",
    "right": "Henry Su, Prakash",
    "court": 6,
    "time": "21:20",
    "umpire": "Andy Wu, Xiao Bo"
  },
  {
    "group": "B",
    "left": "Valerie, Winson",
    "right": "Tom, Robin",
    "court": 4,
    "time": "21:40",
    "umpire": "Peter W, Jensen"
  },
  {
    "group": "B",
    "left": "Henry Su, Prakash",
    "right": "Benson, Patrick",
    "court": 5,
    "time": "21:40",
    "umpire": "Elaine, Charissa"
  },
  {
    "group": "B",
    "left": "Steven Liu, Manny",
    "right": "78KG Alex, David Dong",
    "court": 6,
    "time": "21:40",
    "umpire": "Andy Wu, Xiao Bo"
  },
  {
    "group": "C",
    "left": "Andrew, Simon S",
    "right": "Paven, Faraz",
    "court": 1,
    "time": "20:30",
    "umpire": "Zane, John Lim"
  },
  {
    "group": "C",
    "left": "Thomas, Iris T",
    "right": "Du lin, Christ Zhang",
    "court": 2,
    "time": "20:30",
    "umpire": "Alex, Michael"
  },
  {
    "group": "C",
    "left": "Xiao, Poh",
    "right": "Josh, Lenise",
    "court": 3,
    "time": "20:30",
    "umpire": "Luc, Leon"
  },
  {
    "group": "C",
    "left": "Du lin, Christ Zhang",
    "right": "Xiao, Poh",
    "court": 1,
    "time": "20:50",
    "umpire": "Frank Z, Herbert"
  },
  {
    "group": "C",
    "left": "Josh, Lenise",
    "right": "Andrew, Simon S",
    "court": 2,
    "time": "20:50",
    "umpire": "Gary, He Pin"
  },
  {
    "group": "C",
    "left": "Paven, Faraz",
    "right": "Thomas, Iris T",
    "court": 3,
    "time": "20:50",
    "umpire": "Nick, Angus"
  },
  {
    "group": "C",
    "left": "Josh, Lenise",
    "right": "Du lin, Christ Zhang",
    "court": 1,
    "time": "21:10",
    "umpire": "Gary, He Pin"
  },
  {
    "group": "C",
    "left": "Xiao, Poh",
    "right": "Paven, Faraz",
    "court": 2,
    "time": "21:10",
    "umpire": "Luc, Leon"
  },
  {
    "group": "C",
    "left": "Andrew, Simon S",
    "right": "Thomas, Iris T",
    "court": 3,
    "time": "21:10",
    "umpire": "Zane, John Lim"
  },
  {
    "group": "C",
    "left": "Thomas, Iris T",
    "right": "Xiao, Poh",
    "court": 1,
    "time": "21:30",
    "umpire": "Alex, Michael"
  },
  {
    "group": "C",
    "left": "Paven, Faraz",
    "right": "Josh, Lenise",
    "court": 2,
    "time": "21:30",
    "umpire": "Nick, Angus"
  },
  {
    "group": "C",
    "left": "Du lin, Christ Zhang",
    "right": "Andrew, Simon S",
    "court": 3,
    "time": "21:30",
    "umpire": "Frank Z, Herbert"
  },
  {
    "group": "C",
    "left": "Josh, Lenise",
    "right": "Thomas, Iris T",
    "court": 1,
    "time": "21:50",
    "umpire": "Gary, He Pin"
  },
  {
    "group": "C",
    "left": "Andrew, Simon S",
    "right": "Xiao, Poh",
    "court": 2,
    "time": "21:50",
    "umpire": "Zane, John Lim"
  },
  {
    "group": "C",
    "left": "Du lin, Christ Zhang",
    "right": "Paven, Faraz",
    "court": 3,
    "time": "21:50",
    "umpire": "Frank Z, Herbert"
  },
  {
    "group": "D",
    "left": "Elaine, Charissa",
    "right": "Mannie, Bei Lin",
    "court": 4,
    "time": "20:30",
    "umpire": "Henry Su, Prakash"
  },
  {
    "group": "D",
    "left": "Shirley, Ting",
    "right": "Andy Wu, Xiao Bo",
    "court": 5,
    "time": "20:30",
    "umpire": "Tom, Robin"
  },
  {
    "group": "D",
    "left": "Maggie, Ada",
    "right": "Peter W, Jensen",
    "court": 6,
    "time": "20:30",
    "umpire": "Benson, Patrick"
  },
  {
    "group": "D",
    "left": "Andy Wu, Xiao Bo",
    "right": "Maggie, Ada",
    "court": 4,
    "time": "20:50",
    "umpire": "Steven Liu, Manny"
  },
  {
    "group": "D",
    "left": "Peter W, Jensen",
    "right": "Elaine, Charissa",
    "court": 5,
    "time": "20:50",
    "umpire": "Valerie, Winson"
  },
  {
    "group": "D",
    "left": "Mannie, Bei Lin",
    "right": "Shirley, Ting",
    "court": 6,
    "time": "20:50",
    "umpire": "78KG Alex, David Dong"
  },
  {
    "group": "D",
    "left": "Peter W, Jensen",
    "right": "Andy Wu, Xiao Bo",
    "court": 4,
    "time": "21:10",
    "umpire": "Valerie, Winson"
  },
  {
    "group": "D",
    "left": "Maggie, Ada",
    "right": "Mannie, Bei Lin",
    "court": 5,
    "time": "21:10",
    "umpire": "Benson, Patrick"
  },
  {
    "group": "D",
    "left": "Elaine, Charissa",
    "right": "Shirley, Ting",
    "court": 6,
    "time": "21:10",
    "umpire": "Henry Su, Prakash"
  },
  {
    "group": "D",
    "left": "Shirley, Ting",
    "right": "Maggie, Ada",
    "court": 4,
    "time": "21:30",
    "umpire": "Tom, Robin"
  },
  {
    "group": "D",
    "left": "Mannie, Bei Lin",
    "right": "Peter W, Jensen",
    "court": 5,
    "time": "21:30",
    "umpire": "78KG Alex, David Dong"
  },
  {
    "group": "D",
    "left": "Andy Wu, Xiao Bo",
    "right": "Elaine, Charissa",
    "court": 6,
    "time": "21:30",
    "umpire": "Steven Liu, Manny"
  },
  {
    "group": "D",
    "left": "Peter W, Jensen",
    "right": "Shirley, Ting",
    "court": 4,
    "time": "21:50",
    "umpire": "Valerie, Winson"
  },
  {
    "group": "D",
    "left": "Elaine, Charissa",
    "right": "Maggie, Ada",
    "court": 5,
    "time": "21:50",
    "umpire": "Henry Su, Prakash"
  },
  {
    "group": "D",
    "left": "Andy Wu, Xiao Bo",
    "right": "Mannie, Bei Lin",
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
