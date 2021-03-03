import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FamilyComponent } from './family/family.component';
import { PasswordComponent } from './password/password.component';
import { ProfileComponent } from './profile/profile.component';
import { AutobookingComponent } from './autobooking/autobooking.component';
import { CreditstatementComponent } from './creditstatement/creditstatement.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Settings'
    },
    children: [
      {
        path: '',
        redirectTo: 'profile'
      },
      {
        path: 'family',
        component: FamilyComponent,
        data: {
          title: 'Manage family members'
        }
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: {
          title: 'Manage Profile'
        }
      },
      {
        path: 'schedule',
        component: AutobookingComponent,
        data: {
          title: 'Setup your booking schedule'
        }
      },
      {
        path: 'password',
        component: PasswordComponent,
        data: {
          title: 'Manage Password'
        }
      },
      {
        path: 'creditstatement',
        component: CreditstatementComponent,
        data: {
          title: 'your credit statement'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
