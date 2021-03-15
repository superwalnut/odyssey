import { Component, OnInit } from '@angular/core';
import { Group } from "../../models/group";
import { GroupService } from "../../services/group.service";

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {

  groups:Group[];
  constructor(private groupService:GroupService) { }

  ngOnInit(): void {
    this.getAllGroups();
  }

  getAllGroups(){
    this.groupService.getGroups().subscribe(groups=>{
      this.groups = groups;

    })

  }

}
