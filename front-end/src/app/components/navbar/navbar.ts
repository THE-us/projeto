import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../views/login/services/login.service'; // Ajuste o caminho se necessário

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent implements OnInit {
  exibirNavbar = false;

  constructor(
    public router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    // Fica a escutar as mensagens do login. Se for true, aparece. Se for false, some.
    this.loginService.authStatus$.subscribe(status => {
      this.exibirNavbar = status;
    });
  }

  sair(): void {
    localStorage.removeItem('token');
    this.loginService.notificarLogin(false); // Avisa a Navbar para sumir instantaneamente
    this.router.navigate(['/login']);
  }
}
