import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EquipamentoRoutingModule } from './equipamento-routing-module';
import { PesquisarEquipamento } from './components/pesquisar-equipamento/pesquisar-equipamento';

@NgModule({
  declarations: [PesquisarEquipamento],
  imports: [CommonModule, EquipamentoRoutingModule],
})
export class EquipamentoModule {}
