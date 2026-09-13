import { Routes } from '@angular/router';

import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/topicos', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login-page').then((m) => m.LoginPage),
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/auth/registro-page').then((m) => m.RegistroPage),
  },
  {
    path: 'perfil',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/perfil/perfil-page').then((m) => m.PerfilPage),
  },
  {
    path: 'topicos',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/topicos/topico-page/topicos-page').then((m) => m.TopicosPage),
  },
  {
    path: 'topicos/mios',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/topicos/mis-topicos-page/mis-topicos-page').then((m) => m.MisTopicosPage),
  },
  {
    path: 'topicos/nuevo',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/topicos/topico-form-page/topico-form-page').then((m) => m.TopicoFormPage),
  },
  {
    path: 'topicos/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/topicos/topico-datalle-page/topico-detalle-page').then((m) => m.TopicoDetallePage),
  },
  {
    path: 'topicos/:id/editar',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/topicos/topico-form-page/topico-form-page').then((m) => m.TopicoFormPage),
  },
  {
    path: 'cursos',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./pages/admin/admin-cursos-pages/cursos-page').then((m) => m.CursosPage),
  },
  {
    path: 'usuarios',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./pages/admin/admin-usuarios-pages/usuarios-page').then((m) => m.UsuariosPage),
  },
  { path: '**', redirectTo: '/topicos' },
];