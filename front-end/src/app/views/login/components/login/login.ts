import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {

  credenciais = {
    login: '',
    senha: ''
  };

  erroLogin = false;

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Passo C: Se o utilizador já tiver um token válido guardado, redireciona diretamente para o sistema
    if (localStorage.getItem('token')) {
      this.router.navigate(['/equipamento']);
    }
  }

  fazerLogin(): void {
    this.erroLogin = false;

    this.loginService.login(this.credenciais).subscribe({
      next: (resposta) => {
        localStorage.setItem('token', resposta.accessToken);

        console.log('Login efetuado com sucesso!');
        this.router.navigate(['/equipamento']);
      },
      error: (erro) => {
        console.error('Falha na autenticação', erro);
        this.erroLogin = true;
      }
    });
  }
}
