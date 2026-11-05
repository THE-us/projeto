import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared-module';

import { FluxoRoutingModule } from './fluxo-routing-module';
import { PesquisarFluxo } from './components/pesquisar-fluxo/pesquisar-fluxo';
import { AnalisarFluxo } from './components/analisar-fluxo/analisar-fluxo';

@NgModule({
  declarations: [
    PesquisarFluxo,
    AnalisarFluxo
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    FluxoRoutingModule
  ]
})
export class FluxoModule { }
