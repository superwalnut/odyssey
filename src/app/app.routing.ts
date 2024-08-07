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
import { DevComponent } from "./views/dev/dev.component";
import { OfflineComponent } from "./views/offline/offline.component";
import { EnvCheckComponent } from "./views/env-check/env-check.component";
import { HbcOpenCompetition2022Component } from "./views/competition/hbc-open-competition2022/hbc-open-competition2022.component";
import { HbcCompetition2021Component } from "./views/competition/hbc-competition2021/hbc-competition2021.component";
import { HbcOpenCompetition2022DrawComponent } from "./views/competition/hbc-open-competition2022-draw/hbc-open-competition2022-draw.component";
import { StoreComponent } from "./views/store/store.component";
import { HbcOpen2023DrawComponent } from "./views/competition/hbc-open2023-draw/hbc-open2023-draw.component";
import { BookingRedirectComponent } from "./views/booking-redirect/booking-redirect.component";

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
    path: "session/:day",
    component: BookingRedirectComponent,
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
    path: "store",
    component: StoreComponent,
    //canActivate: [AuthGuard],
    data: {
      title: "Store",
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
    data: {
      title: "Competition",
    },
  },
  {
    path: "competition/2021",
    component: HbcCompetition2021Component,
    data: {
      title: "HBC Open 2021",
    },
  },
  {
    path: "competition/2022",
    component: HbcOpenCompetition2022Component,
    data: {
      title: "HBC Open 2022",
    },
  },
  {
    path: "competition/2022/intermediat-novice-draw",
    component: HbcOpenCompetition2022DrawComponent,
    data: {
      title: "HBC Open 2022 Draw",
    },
  },
  {
    path: "competition/2023",
    component: HbcOpen2023DrawComponent,
    data: {
      title: "HBC Open 2023",
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

  {
    path: "dev",
    component: DevComponent,
    data: {
      title: "{dev}",
    },
  },

  {
    path: "offline",
    component: OfflineComponent,
    data: {
      title: "Offline",
    },
  },

  {
    path: "env",
    component: EnvCheckComponent,
    data: {
      title: "Env check",
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
export class AppRoutingModule {}
