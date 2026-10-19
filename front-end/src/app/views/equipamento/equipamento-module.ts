import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necessário para os filtros (ngModel)
import { EquipamentoRoutingModule } from './equipamento-routing-module';
import { PesquisarEquipamento } from './components/pesquisar-equipamento/pesquisar-equipamento';

@NgModule({
  declarations: [PesquisarEquipamento],
  imports: [
    CommonModule,
    FormsModule,
    EquipamentoRoutingModule
  ]
})
export class EquipamentoModule { }
