import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
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
