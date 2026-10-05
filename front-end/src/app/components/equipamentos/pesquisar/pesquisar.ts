import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EquipamentoService } from '../../../services/equipamento';
import { IntegradorService } from '../../../services/integrador';

@Component({
  selector: 'app-pesquisar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './pesquisar.html',
})
export class PesquisarComponent implements OnInit {
  equipamentos: any[] = [];
  integradores: any[] = [];
  erro = '';

  filtros = {
    codigo: '',
    faixa: '',
    ativo: '',
    integradorId: ''
  };

  constructor(
    private equipamentoService: EquipamentoService,
    private integradorService: IntegradorService,
    private router: Router
  ) {}

  ngOnInit() {
    this.integradorService.listar().subscribe({
      next: (res) => this.integradores = res,
      error: () => this.erro = 'Erro ao carregar integradores'
    });
    this.pesquisar();
  }

  pesquisar() {
    this.equipamentoService.listar(this.filtros).subscribe({
      next: (res) => this.equipamentos = res,
      error: () => this.erro = 'Erro ao pesquisar equipamentos'
    });
  }

  cadastrar() {
    this.router.navigate(['/equipamentos/cadastrar']);
  }

  atualizar(id: number) {
    this.router.navigate(['/equipamentos/atualizar', id]);
  }
}
