import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Import Containers
import { DefaultLayoutComponent } from "./containers";
import { AuthGuard } from "./services/auth-guard";

import { P404Component } from "./views/error/404.component";
import { P500Component } from "./views/error/500.component";
import { LoginComponent } from "./views/login/login.component";
import { RegisterComponent } from "./views/register/register.component";
import { HomeComponent } from "./views/home/home.component";
import { BookingComponent } from "./views/booking/booking.component";
import { GroupsComponent } from "./views/groups/groups.component";
import { TermsComponent } from "./views/terms/terms.component";
import { LogoutComponent } from "./views/logout/logout.component";
import { ResetpasswordComponent } from "./views/resetpassword/resetpassword.component";
import { CreateNewPasswordComponent } from "./views/create-new-password/create-new-password.component";
import { AirtagComponent } from "./views/promo/airtag/airtag.component";
import { CompetitionComponent } from "./views/competition/competition.component";


export const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    data: {
      title: "Home",
    },
  },
  {
    path: "groups",
    component: GroupsComponent,
    //canActivate: [AuthGuard],
    data: {
      title: "groups",
    },
  },

  {
    path: "booking/:id/:groupId",
    component: BookingComponent,
    canActivate: [AuthGuard],
    data: {
      title: "booking",
    },
  },
  {
    path: "termsconditions",
    component: TermsComponent,
    data: {
      title: "Terms & Conditions",
    },
  },
  {
    path: "promo/airtag",
    component: AirtagComponent,
    data: {
      title: "Airtag promotion",
    },
  },
  {
    path: "competition",
    component: CompetitionComponent,
    canActivate: [AuthGuard],
    data: {
      title: "Competition",
    },
  },
  {
    path: "404",
    component: P404Component,
    data: {
      title: "Page 404",
    },
  },
  {
    path: "500",
    component: P500Component,
    data: {
      title: "Page 500",
    },
  },
  {
    path: "login",
    component: LoginComponent,
    data: { title: "Login Page" },
  },
  {
    path: "logout",
    component: LogoutComponent,
    data: { title: "Logout Page" },
  },
  {
    path: "register",
    component: RegisterComponent,
    data: {
      title: "Register Page",
    },
  },
  {
    path: "resetpassword",
    component: ResetpasswordComponent,
    data: {
      title: "Reset password",
    },
  },
  {
    path: "createpassword/:hashkey",
    component: CreateNewPasswordComponent,
    data: {
      title: "Create a new password",
    },
  },

  /// HBC admin
  {
    path: "admin",
    component: DefaultLayoutComponent,
    data: {
      title: "HBC Admin",
      roles: ["Admin", "God"],
    },
    canActivate: [AuthGuard],
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./views/admin/admin.module").then((m) => m.AdminModule),
      },
    ],
  },
  /// HBC template and pages
  {
    path: "",
    component: DefaultLayoutComponent,
    data: {
      title: "HBC",
    },
    canActivate: [AuthGuard],
    children: [
      {
        path: "dashboard",
        loadChildren: () =>
          import("./views/dashboard/dashboard.module").then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: "settings",
        loadChildren: () =>
          import("./views/settings/settings.module").then(
            (m) => m.SettingsModule
          ),
      },
      {
        path: "icons",
        loadChildren: () =>
          import("./views/icons/icons.module").then((m) => m.IconsModule),
      },
    ],
  },
  { path: "**", component: P404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
