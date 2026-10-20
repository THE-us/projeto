import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; // Garanta o HttpClientModule
import { AppRoutingModule } from './app.routing';

import { App } from './app';
import { NavbarComponent } from './components/navbar/navbar';
import { AuthInterceptor } from './services/auth.interceptor'; // Importa o interceptor

@NgModule({
  declarations: [
    App,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // Regista aqui
  ],
  bootstrap: [App]
})
export class AppModule { }
