import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ChartsModule } from "ng2-charts";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ButtonsModule } from "ngx-bootstrap/buttons";
import { SettingsRoutingModule } from "./settings-routing.module";
import { FamilyComponent } from "./family/family.component";
import { ProfileComponent } from "./profile/profile.component";
import { PasswordComponent } from "./password/password.component";
import { CommonModule } from "@angular/common";
import { AutobookingComponent } from "./autobooking/autobooking.component";
import { CreditstatementComponent } from "./creditstatement/creditstatement.component";
import { AppMaterialModule } from "../../app-material.module";
import { AttendancehistoryComponent } from "./attendancehistory/attendancehistory.component";
import { SharedModule } from "../shared/shared.module";

AppMaterialModule;
@NgModule({
  imports: [
    FormsModule,
    SettingsRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    ReactiveFormsModule,
    CommonModule,
    AppMaterialModule,
    SharedModule,
  ],
  declarations: [
    FamilyComponent,
    ProfileComponent,
    PasswordComponent,
    AutobookingComponent,
    CreditstatementComponent,
    AttendancehistoryComponent,
  ],
})
export class SettingsModule {}
