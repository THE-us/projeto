import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MunicipioRoutingModule } from './municipio-routing-module';
import { PesquisarMunicipio } from './components/pesquisar-municipio/pesquisar-municipio';

@NgModule({
  declarations: [
    PesquisarMunicipio
  ],
  imports: [
    CommonModule,
    MunicipioRoutingModule
  ]
})
export class MunicipioModule { }
