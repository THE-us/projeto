import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app.routing';

import { App } from './app';
import { NavbarComponent } from './components/navbar/navbar';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { SharedModule } from './shared/shared-module';

registerLocaleData(localePt);

@NgModule({
  declarations: [
    App,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule,
    SharedModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
  bootstrap: [App]
})
export class AppModule { }
