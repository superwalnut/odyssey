import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UsersComponent } from "./users/users.component";
import { BookingsComponent } from "./bookings/bookings.component";

import { UserdetailsComponent } from "./userdetails/userdetails.component";
import { SitesettingsComponent } from "./sitesettings/sitesettings.component";
import { UserCreditComponent } from "./user-credit/user-credit.component";
import { GroupsComponent } from "./groups/groups.component";
import { GroupdetailsComponent } from "./groupdetails/groupdetails.component";
import { GroupexpenseComponent } from "./groupexpense/groupexpense.component";

import { groupCollapsed } from "console";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Admin",
    },
    children: [
      {
        path: "",
        redirectTo: "users",
      },
      {
        path: "users",
        component: UsersComponent,
        data: {
          title: "Manage users",
        },
      },
      {
        path: "groups",
        component: GroupsComponent,
        data: {
          title: "Groups",
        },
      },
      {
        path: "groupdetails/:id",
        component: GroupdetailsComponent,
        data: {
          title: "Group details",
        },
      },
      {
        path: "groupdetails",
        component: GroupdetailsComponent,
        data: {
          title: "Group details",
        },
      },
      {
        //path: "groupexpense/:id",
        path: "groupexpense",
        component: GroupexpenseComponent,
        data: {
          title: "Group Expense",
        },
      },

      {
        path: "bookings",
        component: BookingsComponent,
        data: {
          title: "Manage bookings",
        },
      },
      {
        path: "sitesettings",
        component: SitesettingsComponent,
        data: {
          title: "Site settings",
        },
      },
      {
        path: "usercredits/:id",
        component: UserCreditComponent,
        data: {
          title: "User credit",
        },
      },
      {
        path: "userdetails/:id",
        component: UserdetailsComponent,
        data: {
          title: "User details",
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
