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

  paginaAtual = 1;
  paginaDigitada = 1;
  limitePorPagina = 10;
  totalRegistros = 0;
  totalPaginas = 0;

  modoExportacao: boolean = false;
  idsSelecionados: Set<number> = new Set<number>();
  todasPaginasSelecionadas = false;
  idsDesmarcados: Set<number> = new Set<number>();
  private filtrosAplicados: any = {};
  private filtrosSelecaoTotal: any = {};

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

    if (this.todasPaginasSelecionadas && JSON.stringify(filtrosLimpos) !== JSON.stringify(this.filtrosSelecaoTotal)) {
      this.desmarcarTodasPaginas();
    }
    this.filtrosAplicados = filtrosLimpos;

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

  iniciarExportacao(): void {
    this.modoExportacao = true;
    this.equipamentos.forEach(e => {
      if (e.id) this.idsSelecionados.add(e.id);
    });
  }

  cancelarExportacao(): void {
    this.modoExportacao = false;
    this.desmarcarTodasPaginas();
  }

  selecionarTodasPaginas(): void {
    this.todasPaginasSelecionadas = true;
    this.filtrosSelecaoTotal = { ...this.filtrosAplicados };
    this.idsDesmarcados.clear();
    this.idsSelecionados.clear();
  }

  desmarcarTodasPaginas(): void {
    this.todasPaginasSelecionadas = false;
    this.idsDesmarcados.clear();
    this.idsSelecionados.clear();
  }

  estaSelecionado(id: number | undefined): boolean {
    if (!id) return false;
    if (this.todasPaginasSelecionadas) {
      return !this.idsDesmarcados.has(id);
    }
    return this.idsSelecionados.has(id);
  }

  quantidadeSelecionada(): number {
    if (this.todasPaginasSelecionadas) {
      return this.totalRegistros - this.idsDesmarcados.size;
    }
    return this.idsSelecionados.size;
  }

  private marcarItem(id: number, marcado: boolean): void {
    if (this.todasPaginasSelecionadas) {
      if (marcado) {
        this.idsDesmarcados.delete(id);
      } else {
        this.idsDesmarcados.add(id);
      }
    } else if (marcado) {
      this.idsSelecionados.add(id);
    } else {
      this.idsSelecionados.delete(id);
    }
  }

  todasDestaPaginaSelecionadas(): boolean {
    if (this.equipamentos.length === 0) return false;
    return this.equipamentos.every(e => this.estaSelecionado(e.id));
  }

  toggleSelecaoTodos(event: any): void {
    this.equipamentos.forEach(e => {
      if (e.id) this.marcarItem(e.id, event.target.checked);
    });
  }

  toggleSelecaoItem(id: number | undefined, event: any): void {
    if (!id) return;
    this.marcarItem(id, event.target.checked);
  }

  confirmarExportacao(formato: 'xlsx' | 'pdf'): void {
    if (this.quantidadeSelecionada() === 0) {
      alert('Selecione pelo menos um equipamento para exportar.');
      return;
    }

    const idsParaExportar = this.todasPaginasSelecionadas ? [] : Array.from<number>(this.idsSelecionados);
    const selecaoTotal = this.todasPaginasSelecionadas
      ? { todos: true, filtrosPesquisa: this.filtrosSelecaoTotal, idsExcluidos: Array.from<number>(this.idsDesmarcados) }
      : {};

    const filtrosAtuais: any = {};
    if (this.filtros.codigo) filtrosAtuais.codigo = this.filtros.codigo;
    if (this.filtros.faixa) filtrosAtuais.faixa = this.filtros.faixa;
    if (this.filtros.integradorNome) filtrosAtuais.integradorNome = this.filtros.integradorNome;
    const ativoVal = String(this.filtros.ativo);
    if (ativoVal === '1' || ativoVal === '0') filtrosAtuais.ativo = Number(ativoVal);

    this.equipamentoService.exportarDados(idsParaExportar, formato, filtrosAtuais, selecaoTotal).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `exportacao-equipamentos.${formato}`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.cancelarExportacao();
      },
      error: (err) => {
        console.error('Erro na exportação:', err);
        alert('Ocorreu um erro ao exportar os dados.');
      }
    });
  }
}
