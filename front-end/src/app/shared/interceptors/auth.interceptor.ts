import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 1. Vai buscar o token que guardámos no momento do login
    const token = localStorage.getItem('token');

    // 2. Se o token existir, clona a requisição e injeta o cabeçalho de Autorização
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // 3. Deixa a requisição seguir viagem para o Node.js
    return next.handle(request);
  }
}
