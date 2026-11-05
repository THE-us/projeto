import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Icone } from './components/icone/icone';

@NgModule({
  declarations: [
    Icone
  ],
  imports: [
    CommonModule
  ],
  exports: [
    Icone
  ]
})
export class SharedModule { }
