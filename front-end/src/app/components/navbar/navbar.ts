import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent implements OnInit {
  exibirNavbar = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Escuta eventos de mudança de rota do Angular
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.atualizarVisibilidade(event.urlAfterRedirects);
    });

    // Valida também no carregamento inicial
    this.atualizarVisibilidade(this.router.url);
  }

  atualizarVisibilidade(url: string): void {
    // Exibe apenas se NÃO estiver na raiz nem na tela de login
    this.exibirNavbar = url !== '/' && !url.includes('/login');
  }

  sair(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
