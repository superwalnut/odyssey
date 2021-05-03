import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FamilyComponent } from "./family/family.component";
import { PasswordComponent } from "./password/password.component";
import { ProfileComponent } from "./profile/profile.component";
import { AutobookingComponent } from "./autobooking/autobooking.component";
import { CreditstatementComponent } from "./creditstatement/creditstatement.component";
import { AttendancehistoryComponent } from "./attendancehistory/attendancehistory.component";
import { CointransferComponent } from "./cointransfer/cointransfer.component";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Settings",
    },
    children: [
      {
        path: "",
        redirectTo: "profile",
      },
      {
        path: "family",
        component: FamilyComponent,
        data: {
          title: "Family members",
        },
      },
      {
        path: "profile",
        component: ProfileComponent,
        data: {
          title: "Profile",
        },
      },
      {
        path: "schedule",
        component: AutobookingComponent,
        data: {
          title: "Auto Booking",
        },
      },
      {
        path: "attendancehistory",
        component: AttendancehistoryComponent,
        data: {
          title: "Attendance",
        },
      },

      {
        path: "password",
        component: PasswordComponent,
        data: {
          title: "Password",
        },
      },
      {
        path: "creditstatement",
        component: CreditstatementComponent,
        data: {
          title: "Statement",
        },
      },
      {
        path: "transfer",
        component: CointransferComponent,
        
      },

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
