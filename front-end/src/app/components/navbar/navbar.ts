import { Component, OnInit } from '@angular/core';
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

  constructor(
    public router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.loginService.authStatus$.subscribe(status => {
      this.exibirNavbar = status;
    });
  }

  sair(): void {
    localStorage.removeItem('token');
    this.loginService.notificarLogin(false);
    this.router.navigate(['/login']);
  }
}
