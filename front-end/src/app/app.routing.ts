import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard'; // Importe o Guard

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./views/login/login-module').then(m => m.LoginModule)
  },
  {
    path: 'equipamento',
    canActivate: [AuthGuard], // Protege a rota: só entra se estiver logado
    loadChildren: () => import('./views/equipamento/equipamento-module').then(m => m.EquipamentoModule)
  },
  {
    path: 'fluxo',
    canActivate: [AuthGuard], // Protege a rota: só entra se estiver logado
    loadChildren: () => import('./views/fluxo/fluxo-module').then(m => m.FluxoModule)
  },
  {
    path: 'municipio',
    canActivate: [AuthGuard], // Protege a rota: só entra se estiver logado
    loadChildren: () => import('./views/municipio/municipio-module').then(m => m.MunicipioModule)
  },
  {
    path: '',
    redirectTo: 'equipamento', // Se abrir só localhost:4200, tenta ir para equipamentos (o Guard fará o resto)
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'equipamento' // Qualquer rota que não exista atira para o sistema
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
