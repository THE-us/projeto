import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./views/login/login-module').then(m => m.LoginModule)
  },
  {
    path: 'equipamento',
    canActivate: [AuthGuard],
    loadChildren: () => import('./views/equipamento/equipamento-module').then(m => m.EquipamentoModule)
  },
  {
    path: 'fluxo',
    canActivate: [AuthGuard],
    loadChildren: () => import('./views/fluxo/fluxo-module').then(m => m.FluxoModule)
  },
  {
    path: 'municipio',
    canActivate: [AuthGuard],
    loadChildren: () => import('./views/municipio/municipio-module').then(m => m.MunicipioModule)
  },
  {
    path: '',
    redirectTo: 'equipamento',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'equipamento'
  },
  {
    path: 'usuario',
    loadChildren: () => import('./views/usuario/usuario-module').then(m => m.UsuarioModule),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
