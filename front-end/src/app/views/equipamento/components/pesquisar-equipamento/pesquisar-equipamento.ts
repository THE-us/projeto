import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  carregando = false; // Impede duplo clique e "spam" de requisições

  // O campo ativo inicializado como null (para ignorar no backend caso não mexa)
  filtros = {
    codigo: '',
    faixa: '',
    ativo: null as number | null,
    integradorNome: ''
  };

  constructor(
    private equipamentoService: EquipamentoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Carrega tudo na primeira vez que abre
    this.pesquisar();
  }

  pesquisar(): void {
    if (this.carregando) return;
    this.carregando = true;

    const filtrosLimpos: any = {};

    if (this.filtros.codigo && this.filtros.codigo.trim() !== '') {
      filtrosLimpos.codigo = this.filtros.codigo.trim();
    }

    if (this.filtros.faixa && this.filtros.faixa.toString().trim() !== '') {
      filtrosLimpos.faixa = this.filtros.faixa;
    }

    if (this.filtros.integradorNome && this.filtros.integradorNome.trim() !== '') {
      filtrosLimpos.integradorNome = this.filtros.integradorNome.trim();
    }

    // CORREÇÃO: Converte para string e aceita ESTRITAMENTE '1' ou '0'.
    // Qualquer outra coisa ('undefined', nulo, vazio) será ignorada pelo backend.
    const ativoVal = String(this.filtros.ativo);
    if (ativoVal === '1' || ativoVal === '0') {
      filtrosLimpos.ativo = Number(ativoVal);
    }

    this.equipamentoService.pesquisar(filtrosLimpos).subscribe({
      next: (dados) => {
        this.equipamentos = [...dados];
        this.carregando = false;
        this.cdr.detectChanges(); // Força a atualização da tela
      },
      error: (erro) => {
        console.error('Erro ao pesquisar equipamentos:', erro);
        this.carregando = false;
      }
    });
  }

  limparFiltros(): void {
    this.filtros = { codigo: '', faixa: '', ativo: null, integradorNome: '' };
    this.pesquisar();
  }

  excluir(id: number | undefined): void {
    if (!id) return;

    if (confirm('Tem a certeza de que deseja excluir este equipamento?')) {
      this.equipamentoService.excluir(id).subscribe({
        next: () => {
          // Remove da tela instantaneamente sem precisar fazer nova requisição ao servidor
          this.equipamentos = this.equipamentos.filter(e => e.id !== id);
          this.cdr.detectChanges();
          alert('Equipamento excluído com sucesso!');
        },
        error: (erro) => {
          console.error('Erro ao excluir:', erro);
          alert('Erro ao excluir o equipamento.');
        }
      });
    }
  }
}
