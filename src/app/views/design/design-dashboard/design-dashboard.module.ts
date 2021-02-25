import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { DesignDashboardComponent } from './design-dashboard.component';
import { DesignDashboardRoutingModule } from './design-dashboard-routing.module';

@NgModule({
  imports: [
    FormsModule,
    DesignDashboardRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot()
  ],
  declarations: [ DesignDashboardComponent ]
})
export class DesignDashboardModule { }
