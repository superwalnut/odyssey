import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UsersComponent } from "./users/users.component";
import { BookingsComponent } from "./bookings/bookings.component";

import { UserdetailsComponent } from "./userdetails/userdetails.component";
import { SitesettingsComponent } from "./sitesettings/sitesettings.component";
import { UserCreditComponent } from "./user-credit/user-credit.component";

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
export class AdminRoutingModule {}
