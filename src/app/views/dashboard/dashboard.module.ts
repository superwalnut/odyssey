import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

import { browser } from 'protractor';
import { environment } from '../../../environments/environment';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DashboardRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot()
  ],
  declarations: [DashboardComponent]
})
export class DashboardModule { 
  memberTopup50 = environment.payments.memberTopup50;
  memberTopup100 = environment.payments.memberTopup100;
  memberTopup170 = environment.payments.memberTopup170;
  memberTopup300 = environment.payments.memberTopup300;


}
