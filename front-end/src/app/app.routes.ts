import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'cadastro', loadComponent: () => import('./components/cadastro/cadastro').then(m => m.CadastroComponent) },
  { path: 'login', loadComponent: () => import('./components/login/login').then(m => m.LoginComponent) },
  { path: 'equipamentos', loadComponent: () => import('./components/equipamentos/pesquisar/pesquisar').then(m => m.PesquisarComponent), canActivate: [authGuard] },
  { path: 'equipamentos/cadastrar', loadComponent: () => import('./components/equipamentos/cadastrar/cadastrar').then(m => m.CadastrarComponent), canActivate: [authGuard] },
  { path: 'equipamentos/atualizar/:id', loadComponent: () => import('./components/equipamentos/atualizar/atualizar').then(m => m.AtualizarComponent), canActivate: [authGuard] },
  { path: 'fluxos/pesquisar', loadComponent: () => import('./components/fluxos/pesquisar/pesquisar').then(m => m.PesquisarComponent), canActivate: [authGuard] },
  { path: 'fluxos/analisar', loadComponent: () => import('./components/fluxos/analisar/analisar').then(m => m.AnalisarComponent), canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
