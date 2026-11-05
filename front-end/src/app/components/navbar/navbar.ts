import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../views/login/services/login.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent implements OnInit {
  exibirNavbar = false;
  menuAberto = false;
  usuarioLogado: { nome: string; login: string } | null = null;

  constructor(
    public router: Router,
    private loginService: LoginService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loginService.authStatus$.subscribe(status => {
      this.exibirNavbar = status;
      if (status) {
        this.carregarUsuarioLogado();
      } else {
        this.usuarioLogado = null;
      }
    });
  }

  carregarUsuarioLogado(): void {
    this.loginService.buscarUsuarioLogado().subscribe({
      next: (usuario) => {
        this.usuarioLogado = usuario;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao carregar o usuário logado:', erro);
        this.usuarioLogado = null;
        this.cdr.detectChanges();
      }
    });
  }

  toggleMenu(): void {
    this.menuAberto = !this.menuAberto;
  }

  fecharMenu(): void {
    this.menuAberto = false;
  }

  sair(): void {
    this.fecharMenu();
    localStorage.removeItem('token');
    this.loginService.notificarLogin(false);
    this.router.navigate(['/login']);
  }
}
