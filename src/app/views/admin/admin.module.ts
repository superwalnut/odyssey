import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { ChartsModule } from "ng2-charts";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ButtonsModule } from "ngx-bootstrap/buttons";

import { AdminRoutingModule } from "./admin-routing.module";
import { UsersComponent } from "./users/users.component";
import { BookingsComponent } from "./bookings/bookings.component";
import { AppMaterialModule } from "../../app-material.module";
import { UserdetailsComponent } from "./userdetails/userdetails.component";
import { SitesettingsComponent } from "./sitesettings/sitesettings.component";
import { UserCreditComponent } from './user-credit/user-credit.component';
import { GroupsComponent } from './groups/groups.component';
import { GroupdetailsComponent } from './groupdetails/groupdetails.component';
import { GroupexpenseComponent } from './groupexpense/groupexpense.component';
import { SharedModule } from "../shared/shared.module";
import { RptIncomeComponent } from './reports/rpt-income/rpt-income.component';
import { TriggersComponent } from './triggers/triggers.component';

@NgModule({
  imports: [
    FormsModule,
    AdminRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    ReactiveFormsModule,
    AppMaterialModule,
    CommonModule,
    SharedModule,
  ],
  declarations: [
    UsersComponent,
    BookingsComponent,
    UserdetailsComponent,
    SitesettingsComponent,
    UserCreditComponent,
    GroupsComponent,
    GroupdetailsComponent,
    GroupexpenseComponent,
    RptIncomeComponent,
    TriggersComponent,
  ],
})
export class AdminModule { }
