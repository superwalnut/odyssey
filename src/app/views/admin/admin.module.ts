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
import { UsercreditComponent } from "./usercredit/usercredit.component";
import { UserdetailsComponent } from "./userdetails/userdetails.component";
import { SitesettingsComponent } from "./sitesettings/sitesettings.component";

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
  ],
  declarations: [
    UsersComponent,
    BookingsComponent,
    UsercreditComponent,
    UserdetailsComponent,
    SitesettingsComponent,
  ],
})
export class AdminModule {}
