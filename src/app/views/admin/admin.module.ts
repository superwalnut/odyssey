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
import { TransactionListComponent } from "../shared/transaction-list/transaction-list.component";

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
    UserdetailsComponent,
    SitesettingsComponent,
    UserCreditComponent,
    TransactionListComponent
  ],
})
export class AdminModule {}
