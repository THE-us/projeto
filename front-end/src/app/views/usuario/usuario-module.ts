import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioRoutingModule } from './usuario-routing-module';
import { CadastrarUsuario } from './components/cadastrar-usuario/cadastrar-usuario';

@NgModule({
  declarations: [
    CadastrarUsuario
  ],
  imports: [
    CommonModule,
    FormsModule,
    UsuarioRoutingModule
  ]
})
export class UsuarioModule { }
