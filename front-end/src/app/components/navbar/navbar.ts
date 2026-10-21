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
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.atualizarVisibilidade(event.urlAfterRedirects);
    });

    this.atualizarVisibilidade(this.router.url);
  }

  atualizarVisibilidade(url: string): void {
    this.exibirNavbar = url !== '/' && !url.includes('/login');
  }

  sair(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
