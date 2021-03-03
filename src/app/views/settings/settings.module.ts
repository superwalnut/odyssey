import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { SettingsRoutingModule } from './settings-routing.module';
import { FamilyComponent } from './family/family.component';
import { ProfileComponent } from './profile/profile.component';
import { PasswordComponent } from './password/password.component';
import { CommonModule } from '@angular/common';  
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AutobookingComponent } from './autobooking/autobooking.component';
import { CreditstatementComponent } from './creditstatement/creditstatement.component';

@NgModule({
  imports: [
    FormsModule,
    SettingsRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    ReactiveFormsModule,
    CommonModule,
    MatSnackBarModule,
  ],
  declarations: [ 
      FamilyComponent,
      ProfileComponent,
      PasswordComponent,
      AutobookingComponent,
      CreditstatementComponent,
   ]
})
export class SettingsModule { }
