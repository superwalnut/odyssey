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
import { TermsComponent } from "./views/terms/terms.component";
export const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    data: {
      title: "Home",
    },
  },
  {
    path: "booking",
    component: BookingComponent,
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
    path: "register",
    component: RegisterComponent,
    data: {
      title: "Register Page",
    },
  },
  /// HBC admin
  {
    path: "admin",
    component: DefaultLayoutComponent,
    data: {
      title: "HBC Admin",
    },
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./views/admin/admin.module").then(
            (m) => m.AdminModule
          ),
      }
    ]
  },
  /// HBC template and pages
  {
    path: "",
    component: DefaultLayoutComponent,
    data: {
      title: "HBC",
    },
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
        loadChildren: () => import("./views/settings/settings.module").then(m=>m.SettingsModule),
      }
    ]
  },
  {
    path: "design",
    component: DefaultLayoutComponent,
    data: {
      title: "Design",
    },
    children: [
      {
        path: "base",
        loadChildren: () =>
          import("./views/base/base.module").then((m) => m.BaseModule),
      },
      {
        path: "buttons",
        loadChildren: () =>
          import("./views/buttons/buttons.module").then((m) => m.ButtonsModule),
      },
      {
        path: "charts",
        loadChildren: () =>
          import("./views/chartjs/chartjs.module").then((m) => m.ChartJSModule),
      },
      {
        path: "dashboard",
        loadChildren: () =>
          import(
            "./views/design/design-dashboard/design-dashboard.module"
          ).then((m) => m.DesignDashboardModule),
      },
      {
        path: "icons",
        loadChildren: () =>
          import("./views/icons/icons.module").then((m) => m.IconsModule),
      },
      {
        path: "notifications",
        loadChildren: () =>
          import("./views/notifications/notifications.module").then(
            (m) => m.NotificationsModule
          ),
      },
      {
        path: "theme",
        loadChildren: () =>
          import("./views/theme/theme.module").then((m) => m.ThemeModule),
      },
      {
        path: "widgets",
        loadChildren: () =>
          import("./views/widgets/widgets.module").then((m) => m.WidgetsModule),
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
