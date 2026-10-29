import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <-- IMPORTANTE: Resolve o erro do [(ngModel)] no HTML
import { UsuarioService } from '../service/usuario.service';

@Component({
  selector: 'app-cadastrar-usuario',
  standalone: true, // Configurado como standalone
  imports: [FormsModule], // Módulo necessário para formulários
  templateUrl: './cadastrar-usuario.html',
  styleUrl: './cadastrar-usuario.scss' // Aponta para o novo ficheiro de estilos
})
export class CadastrarUsuarioComponent {
  usuario = { nome: '', login: '', senha: '', ativo: 1 };
  carregando = false;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  salvar(): void {
    if (!this.usuario.nome || !this.usuario.login || !this.usuario.senha) {
      alert('Preencha os campos obrigatórios (Nome, Login e Senha).');
      return;
    }

    this.carregando = true;
    this.usuarioService.cadastrar(this.usuario).subscribe({
      next: () => {
        alert('Usuário cadastrado com sucesso!');
        this.router.navigate(['/equipamento']);
      },
      error: (erro) => {
        console.error(erro);
        alert('Erro ao cadastrar usuário. Verifique se o login já está em uso ou se a senha tem menos de 6 caracteres.');
        this.carregando = false;
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/equipamento']);
  }
}
