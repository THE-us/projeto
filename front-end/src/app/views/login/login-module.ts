import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared-module';
import { LoginRoutingModule } from './login-routing-module';
import { Login } from './components/login/login';

@NgModule({
  declarations: [Login],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    LoginRoutingModule
  ]
})
export class LoginModule { }
