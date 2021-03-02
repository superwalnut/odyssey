import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { SettingsRoutingModule } from './settings-routing.module';
import { FamilyComponent } from './family/family.component';
import { ProfileComponent } from './profile/profile.component';
import { PasswordComponent } from './password/password.component';

@NgModule({
  imports: [
    FormsModule,
    SettingsRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot()
  ],
  declarations: [ 
      FamilyComponent,
      ProfileComponent,
      PasswordComponent,
   ]
})
export class SettingsModule { }
