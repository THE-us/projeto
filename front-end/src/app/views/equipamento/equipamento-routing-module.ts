import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PesquisarEquipamento } from './components/pesquisar-equipamento/pesquisar-equipamento';

const routes: Routes = [{ path: '', component: PesquisarEquipamento }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EquipamentoRoutingModule { }
