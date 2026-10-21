import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token'); // Verifica se a sessão anterior ainda existe

    if (token) {
      return true; // Deixa o utilizador entrar na tela solicitada
    }

    // Se não tiver token, atira de volta para o login
    this.router.navigate(['/login']);
    return false;
  }
}
