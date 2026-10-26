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

  // Variáveis da Paginação
  paginaAtual = 1;
  paginaDigitada = 1;
  limitePorPagina = 10;
  totalRegistros = 0;
  totalPaginas = 0;

  // Variáveis da Exportação
  modoExportacao: boolean = false;
  idsSelecionados: Set<number> = new Set<number>();

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

    this.pesquisar(1);
  }

  pesquisar(paginaDesejada: number = 1): void {
    if (this.carregando) return;
    this.carregando = true;
    this.paginaAtual = paginaDesejada;
    this.paginaDigitada = paginaDesejada;

    sessionStorage.setItem('filtrosPesquisaEquipamento', JSON.stringify(this.filtros));

    const filtrosLimpos: any = {};
    if (this.filtros.codigo && this.filtros.codigo.trim() !== '') filtrosLimpos.codigo = this.filtros.codigo.trim();
    if (this.filtros.faixa && this.filtros.faixa.toString().trim() !== '') filtrosLimpos.faixa = this.filtros.faixa;
    if (this.filtros.integradorNome && this.filtros.integradorNome.trim() !== '') filtrosLimpos.integradorNome = this.filtros.integradorNome.trim();

    const ativoVal = String(this.filtros.ativo);
    if (ativoVal === '1' || ativoVal === '0') {
      filtrosLimpos.ativo = Number(ativoVal);
    }

    this.equipamentoService.pesquisar(filtrosLimpos, this.paginaAtual, this.limitePorPagina).subscribe({
      next: (resposta) => {
        this.equipamentos = [...resposta.dados];
        this.totalRegistros = resposta.totalRegistros;
        this.totalPaginas = resposta.totalPaginas;

        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao pesquisar equipamentos:', erro);
        this.carregando = false;
      }
    });
  }

  mudarPagina(novaPagina: number): void {
    if (novaPagina >= 1 && novaPagina <= this.totalPaginas) {
      this.pesquisar(novaPagina);
    }
  }

  irParaPagina(): void {
    if (this.paginaDigitada >= 1 && this.paginaDigitada <= this.totalPaginas) {
      this.mudarPagina(this.paginaDigitada);
    } else {
      this.paginaDigitada = this.paginaAtual;
    }
  }

  limparFiltros(): void {
    this.filtros = { codigo: '', faixa: '', ativo: null, integradorNome: '' };
    sessionStorage.removeItem('filtrosPesquisaEquipamento');
    this.pesquisar(1);
  }

  excluir(id: number | undefined): void {
    if (!id) return;

    if (confirm('Tem a certeza de que deseja excluir este equipamento?')) {
      this.equipamentoService.excluir(id).subscribe({
        next: () => {
          this.pesquisar(this.paginaAtual);
          alert('Equipamento excluído com sucesso!');
        },
        error: (erro) => {
          console.error('Erro ao excluir:', erro);
          alert('Erro ao excluir o equipamento.');
        }
      });
    }
  }

  // --- MÉTODOS DE EXPORTAÇÃO ---

  iniciarExportacao(): void {
    this.modoExportacao = true;
    // Adiciona os da página atual sem apagar os que já possam estar noutras páginas
    this.equipamentos.forEach(e => this.idsSelecionados.add(e.id as number));
  }

  cancelarExportacao(): void {
    this.modoExportacao = false;
    this.idsSelecionados.clear();
  }

  // Verifica se TODOS os itens da PÁGINA ATUAL estão marcados
  todasDestaPaginaSelecionadas(): boolean {
    if (this.equipamentos.length === 0) return false;
    return this.equipamentos.every(e => this.idsSelecionados.has(e.id as number));
  }

  toggleSelecaoTodos(event: any): void {
    if (event.target.checked) {
      // Adiciona todos desta página à lista existente
      this.equipamentos.forEach(e => this.idsSelecionados.add(e.id as number));
    } else {
      // Remove todos desta página da lista existente
      this.equipamentos.forEach(e => this.idsSelecionados.delete(e.id as number));
    }
  }

  toggleSelecaoItem(id: number | undefined, event: any): void {
    if (id === undefined) return;
    if (event.target.checked) {
      this.idsSelecionados.add(id);
    } else {
      this.idsSelecionados.delete(id);
    }
  }

  confirmarExportacao(formato: 'xlsx' | 'pdf'): void {
    if (this.idsSelecionados.size === 0) {
      alert('Selecione pelo menos um equipamento para exportar.');
      return;
    }

    const idsParaExportar = Array.from<number>(this.idsSelecionados);

    // Preparar os filtros exatos que estão na tela para irem para o Excel
    const filtrosAtuais: any = {};
    if (this.filtros.codigo) filtrosAtuais.codigo = this.filtros.codigo;
    if (this.filtros.faixa) filtrosAtuais.faixa = this.filtros.faixa;
    if (this.filtros.integradorNome) filtrosAtuais.integradorNome = this.filtros.integradorNome;
    const ativoVal = String(this.filtros.ativo);
    if (ativoVal === '1' || ativoVal === '0') filtrosAtuais.ativo = Number(ativoVal);

    // Passamos os filtros como 3º parâmetro
    this.equipamentoService.exportarDados(idsParaExportar, formato, filtrosAtuais).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `exportacao-equipamentos.${formato}`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.modoExportacao = false;
      },
      error: (err) => {
        console.error('Erro na exportação', err);
        alert('Ocorreu um erro ao exportar os dados.');
      }
    });
  }
}
