import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'clients',
    loadComponent: () =>
      import('./pages/clients/clients.component').then((m) => m.ClientsComponent),
  },
  {
    path: 'clients/:id',
    loadComponent: () =>
      import('./pages/client-detail/client-detail.component').then((m) => m.ClientDetailComponent),
  },
  {
    path: 'rgpd',
    loadComponent: () =>
      import('./pages/rgpd/rgpd.component').then((m) => m.RgpdComponent),
  },
  {
    path: 'agent',
    loadComponent: () =>
      import('./pages/agent/agent.component').then((m) => m.AgentComponent),
  },
  {
    path: 'sdk',
    loadComponent: () =>
      import('./pages/sdk/sdk.component').then((m) => m.SdkComponent),
  },
];
