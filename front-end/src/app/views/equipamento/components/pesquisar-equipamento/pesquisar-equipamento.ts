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
  carregando = false;

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
    const filtrosSalvos = sessionStorage.getItem('filtrosPesquisaEquipamento');
    if (filtrosSalvos) {
      this.filtros = JSON.parse(filtrosSalvos);
    }

    this.pesquisar();
  }

  pesquisar(): void {
    if (this.carregando) return;
    this.carregando = true;

    sessionStorage.setItem('filtrosPesquisaEquipamento', JSON.stringify(this.filtros));

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

    const ativoVal = String(this.filtros.ativo);
    if (ativoVal === '1' || ativoVal === '0') {
      filtrosLimpos.ativo = Number(ativoVal);
    }

    this.equipamentoService.pesquisar(filtrosLimpos).subscribe({
      next: (dados) => {
        this.equipamentos = [...dados];
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao pesquisar equipamentos:', erro);
        this.carregando = false;
      }
    });
  }

  limparFiltros(): void {
    this.filtros = { codigo: '', faixa: '', ativo: null, integradorNome: '' };
    sessionStorage.removeItem('filtrosPesquisaEquipamento');
    this.pesquisar();
  }

  excluir(id: number | undefined): void {
    if (!id) return;

    if (confirm('Tem a certeza de que deseja excluir este equipamento?')) {
      this.equipamentoService.excluir(id).subscribe({
        next: () => {
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
