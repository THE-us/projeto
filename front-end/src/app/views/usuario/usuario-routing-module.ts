import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CadastrarUsuario } from './components/cadastrar-usuario/cadastrar-usuario';

const routes: Routes = [
  { path: 'novo', component: CadastrarUsuario },
  { path: '', redirectTo: 'novo', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioRoutingModule { }
