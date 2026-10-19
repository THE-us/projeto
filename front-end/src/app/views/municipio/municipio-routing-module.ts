import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PesquisarMunicipio } from './components/pesquisar-municipio/pesquisar-municipio';

const routes: Routes = [
  {
    path: '',
    component: PesquisarMunicipio
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MunicipioRoutingModule { }
