import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DesignDashboardComponent } from './design-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DesignDashboardComponent,
    data: {
      title: 'Dashboard'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DesignDashboardRoutingModule {}
