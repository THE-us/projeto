import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./views/login/login-module').then(m => m.LoginModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'municipio',
    loadChildren: () => import('./views/municipio/municipio-module').then(m => m.MunicipioModule)
  },
  {
    path: 'equipamento',
    loadChildren: () => import('./views/equipamento/equipamento-module').then(m => m.EquipamentoModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
