import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PesquisarFluxo } from './components/pesquisar-fluxo/pesquisar-fluxo';
import { AnalisarFluxo } from './components/analisar-fluxo/analisar-fluxo';

const routes: Routes = [
  { path: 'pesquisar', component: PesquisarFluxo },
  { path: 'analisar', component: AnalisarFluxo },
  { path: '', redirectTo: 'pesquisar', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FluxoRoutingModule { }
