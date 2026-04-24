import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { RegistroComponent } from './components/registro/registro.component';
import { ReseteComponent } from './components/resete/resete.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login - Pokémon TCG'
  },
  {
    path: 'registro',
    component: RegistroComponent,
    title: 'Registro - Pokémon TCG'
  },
  {
    path: 'resete',
    component: ReseteComponent,
    title: 'Resetar Senha - Pokémon TCG'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    title: 'Dashboard - Pokémon TCG'
  },
  {
    path: 'catalogo',
    component: CatalogoComponent,
    canActivate: [AuthGuard],
    title: 'Catálogo - Pokémon TCG'
  },
  {
    path: 'perfil',
    component: PerfilComponent,
    canActivate: [AuthGuard],
    title: 'Perfil - Pokémon TCG'
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
