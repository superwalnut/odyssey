import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { BookingsComponent } from './bookings/bookings.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Admin'
    },
    children: [
      {
        path: '',
        redirectTo: 'users'
      },
      {
        path: 'users',
        component: UsersComponent,
        data: {
          title: 'Manage users'
        }
      },
      {
        path: 'bookings',
        component: BookingsComponent,
        data: {
          title: 'Manage bookings'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
