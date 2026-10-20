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

  filtros = {
    codigo: '',
    faixa: '',
    ativo: '',
    integradorNome: ''
  };

  constructor(private equipamentoService: EquipamentoService) {}

  ngOnInit(): void {
    this.pesquisar();
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
    this.filtros = { codigo: '', faixa: '', ativo: '', integradorNome: '' };
    this.pesquisar();
  }

  excluir(id: number | undefined): void {
    if (!id) return;

    if (confirm('Tem a certeza de que deseja excluir este equipamento? Esta ação não pode ser desfeita.')) {
      this.equipamentoService.excluir(id).subscribe({
        next: () => {
          alert('Equipamento excluído com sucesso!');
          this.pesquisar();
        },
        error: (erro) => {
          console.error('Erro ao excluir:', erro);
          alert('Erro ao excluir o equipamento. Verifique se ele não tem dependências no banco de dados.');
        }
      });
    }
  }
}
