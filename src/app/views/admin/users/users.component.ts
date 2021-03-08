import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../../../models/user';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['wechatId', 'balance', 'created', 'docId'];
  dataSource : MatTableDataSource<User>;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private service: AccountService) {}

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.service.getAllUsers().subscribe((x) => {
      this.dataSource = new MatTableDataSource(x);
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
