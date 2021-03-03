import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ChartsModule } from "ng2-charts";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ButtonsModule } from "ngx-bootstrap/buttons";

import { AdminRoutingModule } from "./admin-routing.module";
import { UsersComponent } from "./users/users.component";
import { BookingsComponent } from "./bookings/bookings.component";
import { AppMaterialModule } from "../../app-material.module";

@NgModule({
  imports: [
    FormsModule,
    AdminRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    AppMaterialModule,
  ],
  declarations: [UsersComponent, BookingsComponent],
})
export class AdminModule {}
