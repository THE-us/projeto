import { Component, OnInit } from '@angular/core';
import { Equipamento } from '../../models/equipamento';
import { EquipamentoService } from '../../services/equipamento.service';

@Component({
  selector: 'app-pesquisar-equipamento',
  standalone: false,
  templateUrl: './pesquisar-equipamento.html',
  styleUrl: './pesquisar-equipamento.scss'
})
export class PesquisarEquipamento implements OnInit {
  equipamentos: Equipamento[] = [];

  // Objeto que liga diretamente aos campos da interface
  filtros = {
    codigo: '',
    faixa: '',
    ativo: '',
    integradorId: ''
  };

  constructor(private equipamentoService: EquipamentoService) {}

  ngOnInit(): void {
    this.pesquisar(); // Carrega todos os equipamentos ao abrir a página
  }

  pesquisar(): void {
    this.equipamentoService.pesquisar(this.filtros).subscribe({
      next: (dados) => {
        this.equipamentos = dados;
        console.log('Equipamentos encontrados:', dados);
      },
      error: (erro) => {
        console.error('Erro ao pesquisar equipamentos:', erro);
      }
    });
  }

  limparFiltros(): void {
    this.filtros = { codigo: '', faixa: '', ativo: '', integradorId: '' };
    this.pesquisar();
  }
}
