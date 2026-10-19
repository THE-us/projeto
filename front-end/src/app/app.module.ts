import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// Atualize este import para incluir as novas ferramentas
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app.routing';
import { App } from './app';
// Importe o seu novo interceptor
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';

@NgModule({
  declarations: [
    App
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    // Dizemos ao HttpClient para aceitar interceptors clássicos baseados em classes
    provideHttpClient(withInterceptorsFromDi()),
    // Registamos o nosso interceptor
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [App]
})
export class AppModule { }
