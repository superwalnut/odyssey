import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../../../models/user';
import { UserFamily } from '../../../viewmodels/user-family';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['name', 'balance', 'families' ,'docId'];
  dataSource: MatTableDataSource<UserFamily>;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private service: AccountService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.service.getAllUsers().subscribe((x) => {
      const userFamilies = x.filter(u=>u.parentUserDocId == null).map(m=> {
        return {
          name: m.name,
          docId : m.docId, 
          user : m, 
          families : x.filter(y=>y.parentUserDocId == m.docId).map(z=>z.name)
        } as UserFamily;
      });

      this.dataSource = new MatTableDataSource(userFamilies);
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
