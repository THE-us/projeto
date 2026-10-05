import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  login = '';
  senha = '';
  erro = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login({ login: this.login, senha: this.senha }).subscribe({
      next: (res) => {
        this.authService.salvarToken(res.token);
        this.router.navigate(['/equipamentos']);
      },
      error: () => {
        this.erro = 'Login ou senha inválidos';
      }
    });
  }
}
