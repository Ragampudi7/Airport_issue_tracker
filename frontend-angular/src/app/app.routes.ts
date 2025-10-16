import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { 
    path: 'staff-dashboard', 
    loadComponent: () => import('./pages/staff-dashboard/staff-dashboard.component').then(m => m.StaffDashboardComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'passenger-dashboard', 
    loadComponent: () => import('./pages/passenger-dashboard/passenger-dashboard.component').then(m => m.PassengerDashboardComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'sos-portal', 
    loadComponent: () => import('./pages/sos-portal/sos-portal.component').then(m => m.SosPortalComponent)
  },
  { path: '**', redirectTo: '/login' }
];
