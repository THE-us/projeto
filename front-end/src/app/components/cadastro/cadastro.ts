import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './cadastro.html',
})
export class CadastroComponent {
  login = '';
  senha = '';
  nome = '';
  ativo = 1;
  erro = '';
  sucesso = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.signUp({ login: this.login, senha: this.senha, nome: this.nome, ativo: this.ativo }).subscribe({
      next: () => {
        this.authService.login({ login: this.login, senha: this.senha }).subscribe({
          next: (res) => {
            this.authService.salvarToken(res.token);
            this.router.navigate(['/equipamentos']);
          },
          error: () => this.erro = 'Erro ao fazer login automático'
        });
      },
      error: () => this.erro = 'Erro ao cadastrar usuário'
    });
  }
}
