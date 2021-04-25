import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UsersComponent } from "./users/users.component";
import { UserGradeComponent } from "./user-grade/user-grade.component";

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
import { RptAutobookComponent } from "./reports/rpt-autobook/rpt-autobook.component";
import { RptBookingpersonComponent } from "./reports/rpt-bookingperson/rpt-bookingperson.component";

import { TriggersComponent } from "./triggers/triggers.component";

import { groupCollapsed } from "console";
import { RptUserCreditsComponent } from "./reports/rpt-user-credits/rpt-user-credits.component";
import { RptCsvComponent } from "./reports/rpt-csv/rpt-csv.component";

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
        path: "usergrade",
        component: UserGradeComponent,
        data: {
          title: "User grade",
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
        path: "rptautobook",
        component: RptAutobookComponent,
        data: {
          title: "Autobook",
        },
      },
      {
        path: "rptbookingperson/:id",
        component: RptBookingpersonComponent,
        data: {
          title: "Booking Person",
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
        path: "rptcredits",
        component: RptUserCreditsComponent,
        data: {
          title: "User Credits",
        }
      },
      {
        path:'downloadcsv',
        component: RptCsvComponent,
        data:{
          title: "Download CSV",
        }
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
