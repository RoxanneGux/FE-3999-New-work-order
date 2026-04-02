import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'new-work-order',
    pathMatch: 'full'
  },
  {
    path: 'new-work-order',
    loadComponent: () =>
      import('./pages/new-work-order/new-work-order.component').then(
        (m) => m.NewWorkOrderComponent
      )
  }
];
