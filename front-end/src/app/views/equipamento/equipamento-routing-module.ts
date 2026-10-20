import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PesquisarEquipamento } from './components/pesquisar-equipamento/pesquisar-equipamento';
import { CadastrarEquipamento } from './components/cadastrar-equipamento/cadastrar-equipamento';
import { EditarEquipamento } from './components/editar-equipamento/editar-equipamento';

const routes: Routes = [
  { path: '', component: PesquisarEquipamento },
  { path: 'novo', component: CadastrarEquipamento },
  { path: 'editar/:id', component: EditarEquipamento }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EquipamentoRoutingModule { }
