import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FluxoService } from '../../services/fluxo';

@Component({
  selector: 'app-pesquisar-fluxo',
  standalone: false,
  templateUrl: './pesquisar-fluxo.html',
  styleUrl: './pesquisar-fluxo.scss'
})
export class PesquisarFluxo implements OnInit {
  @ViewChild('formPesquisa') formPesquisa!: NgForm;

  fluxos: any[] = [];
  carregando = false;

  paginaAtual = 1;
  limitePorPagina = 30;
  totalRegistros = 0;
  totalPaginas = 0;
  paginaDigitada = 1;

  modoExportacao: boolean = false;
  idsSelecionados: Set<number> = new Set<number>();
  todasPaginasSelecionadas = false;
  idsDesmarcados: Set<number> = new Set<number>();
  private filtrosAplicados: any = {};
  private filtrosSelecaoTotal: any = {};

  filtros: any = {
    dataInicio: '', dataFim: '', horaInicio: '', horaFim: '', placa: '', equipamentoCodigo: '', equipamentoFaixa: ''
  };

  constructor(private fluxoService: FluxoService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const filtrosSalvos = sessionStorage.getItem('filtrosPesquisaFluxo');
    if (filtrosSalvos) {
      this.filtros = JSON.parse(filtrosSalvos);
      if (this.temFiltroPreenchido()) {
        this.pesquisar(1);
      }
    }
  }

  temFiltroPreenchido(): boolean {
    return Object.values(this.filtros).some(valor => valor !== null && valor !== '');
  }

  pesquisar(paginaDesejada: number = 1): void {
    if (!this.temFiltroPreenchido()) {
      alert('Atenção: É obrigatório informar pelo menos um filtro.');
      return;
    }

    if (this.carregando) return;
    this.carregando = true;
    this.paginaAtual = paginaDesejada;

    sessionStorage.setItem('filtrosPesquisaFluxo', JSON.stringify(this.filtros));

    const filtrosPreenchidos: any = {};
    Object.keys(this.filtros).forEach(chave => {
      if (this.filtros[chave] !== null && this.filtros[chave] !== '') {
        filtrosPreenchidos[chave] = this.filtros[chave];
      }
    });

    if (this.todasPaginasSelecionadas && JSON.stringify(filtrosPreenchidos) !== JSON.stringify(this.filtrosSelecaoTotal)) {
      this.desmarcarTodasPaginas();
    }
    this.filtrosAplicados = filtrosPreenchidos;

    this.fluxoService.pesquisar(this.filtros, this.paginaAtual, this.limitePorPagina).subscribe({
      next: (resposta) => {
        this.fluxos = [...resposta.dados];
        this.totalRegistros = resposta.totalRegistros;
        this.totalPaginas = resposta.totalPaginas;

        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao pesquisar fluxos:', erro);
        this.carregando = false;
        alert('Erro ao realizar a pesquisa.');
      }
    });
  }

  mudarPagina(novaPagina: number): void {
    if (novaPagina >= 1 && novaPagina <= this.totalPaginas) {
      this.pesquisar(novaPagina);
      this.paginaDigitada = novaPagina;
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
    if (this.formPesquisa) {
      this.formPesquisa.resetForm();
    }

    this.filtros = { dataInicio: '', dataFim: '', horaInicio: '', horaFim: '', placa: '', equipamentoCodigo: '', equipamentoFaixa: '' };
    this.fluxos = [];
    this.totalRegistros = 0;
    this.totalPaginas = 0;
    this.paginaAtual = 1;
    sessionStorage.removeItem('filtrosPesquisaFluxo');
    this.cdr.detectChanges();
  }

  iniciarExportacao(): void {
    this.modoExportacao = true;
    this.fluxos.forEach(f => {
      if (f.id) this.idsSelecionados.add(f.id);
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
    if (this.fluxos.length === 0) return false;
    return this.fluxos.every(f => this.estaSelecionado(f.id));
  }

  toggleSelecaoTodos(event: any): void {
    this.fluxos.forEach(f => {
      if (f.id) this.marcarItem(f.id, event.target.checked);
    });
  }

  toggleSelecaoItem(id: number | undefined, event: any): void {
    if (!id) return;
    this.marcarItem(id, event.target.checked);
  }

  confirmarExportacao(formato: 'xlsx' | 'pdf'): void {
    if (this.quantidadeSelecionada() === 0) {
      alert('Selecione pelo menos um fluxo para exportar.');
      return;
    }

    const idsParaExportar = this.todasPaginasSelecionadas ? [] : Array.from<number>(this.idsSelecionados);
    const selecaoTotal = this.todasPaginasSelecionadas
      ? { todos: true, filtrosPesquisa: this.filtrosSelecaoTotal, idsExcluidos: Array.from<number>(this.idsDesmarcados) }
      : {};
    const fAtuais: any = {};
    if (this.filtros.dataInicio) fAtuais['Data Início'] = this.filtros.dataInicio;
    if (this.filtros.dataFim) fAtuais['Data Fim'] = this.filtros.dataFim;
    if (this.filtros.horaInicio) fAtuais['Hora Início'] = this.filtros.horaInicio;
    if (this.filtros.horaFim) fAtuais['Hora Fim'] = this.filtros.horaFim;
    if (this.filtros.placa) fAtuais.Placa = this.filtros.placa;
    if (this.filtros.equipamentoCodigo) fAtuais['Cód. Equipamento'] = this.filtros.equipamentoCodigo;
    if (this.filtros.equipamentoFaixa) fAtuais.Faixa = this.filtros.equipamentoFaixa;

    this.fluxoService.exportarDados(idsParaExportar, formato, fAtuais, selecaoTotal).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `exportacao-fluxos.${formato}`;
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
