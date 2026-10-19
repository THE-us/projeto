import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'municipio',
    loadChildren: () => import('./views/municipio/municipio-module').then(m => m.MunicipioModule)
  },
  {
    path: '',
    redirectTo: 'municipio',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
