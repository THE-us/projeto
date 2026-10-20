import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EquipamentoRoutingModule } from './equipamento-routing-module';

import { PesquisarEquipamento } from './components/pesquisar-equipamento/pesquisar-equipamento';
import { CadastrarEquipamento } from './components/cadastrar-equipamento/cadastrar-equipamento';
import { EditarEquipamento } from './components/editar-equipamento/editar-equipamento';

@NgModule({
  declarations: [
    PesquisarEquipamento,
    CadastrarEquipamento,
    EditarEquipamento
  ],
  imports: [
    CommonModule,
    FormsModule,
    EquipamentoRoutingModule
  ]
})
export class EquipamentoModule { }
