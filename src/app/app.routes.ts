import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard').then(m => m.DashboardComponent),
  },
  {
    path: 'sales',
    loadComponent: () =>
      import('./features/sales/sales').then(m => m.Sales),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/products').then(m => m.Products),
  },
  {
    path: 'customers',
    loadComponent: () =>
      import('./features/customers/customers').then(m => m.Customers),
  },
  { path: '**', redirectTo: 'dashboard' },
];