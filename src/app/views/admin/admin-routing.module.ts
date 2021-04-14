import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UsersComponent } from "./users/users.component";
import { BookingsComponent } from "./bookings/bookings.component";
import { BookingdetailsComponent } from "./bookingdetails/bookingdetails.component";

import { UserdetailsComponent } from "./userdetails/userdetails.component";
import { SitesettingsComponent } from "./sitesettings/sitesettings.component";
import { UserCreditComponent } from "./user-credit/user-credit.component";
import { GroupsComponent } from "./groups/groups.component";
import { GroupdetailsComponent } from "./groupdetails/groupdetails.component";
import { GroupexpenseComponent } from "./groupexpense/groupexpense.component";
import { RptIncomeComponent } from "./reports/rpt-income/rpt-income.component";
import { RptUnpaidComponent } from "./reports/rpt-unpaid/rpt-unpaid.component";
import { RptAttendanceComponent } from "./reports/rpt-attendance/rpt-attendance.component";
import { RptEventviewerComponent } from "./reports/rpt-eventviewer/rpt-eventviewer.component";

import { TriggersComponent } from "./triggers/triggers.component";

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
          roles: ["God"],
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
        path: "groupexpense/:id",
        //path: "groupexpense",
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
        path: "bookings/:id",
        component: BookingsComponent,
        data: {
          title: "Manage bookings",
        },
      },
      {
        path: "bookingdetails/:id/:groupId",
        component: BookingdetailsComponent,
        data: {
          title: "Booking detailss",
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

      {
        path: "rptincome",
        component: RptIncomeComponent,
        data: {
          title: "Finance report",
        },
      },
      {
        path: "rptincome/:id",
        component: RptIncomeComponent,
        data: {
          title: "Finance report",
        },
      },
      {
        path: "rptattend",
        component: RptAttendanceComponent,
        data: {
          title: "Attendance report",
        },
      },


      {
        path: "rptunpaid",
        component: RptUnpaidComponent,
        data: {
          title: "Unpaid users",
        },
      },
      {
        path: "rpteventview",
        component: RptEventviewerComponent,
        data: {
          title: "Event viewer",
        },
      },


      {
        path: "triggers",
        component: TriggersComponent,
        data: {
          title: "triggers",
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
