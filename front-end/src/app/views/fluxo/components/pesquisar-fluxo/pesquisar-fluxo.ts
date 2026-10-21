import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FluxoService } from '../../services/fluxo';

@Component({
  selector: 'app-pesquisar-fluxo',
  standalone: false,
  templateUrl: './pesquisar-fluxo.html',
  styleUrl: './pesquisar-fluxo.scss'
})
export class PesquisarFluxo implements OnInit {
  fluxos: any[] = [];
  carregando = false;

  // Variáveis de Paginação
  paginaAtual = 1;
  limitePorPagina = 30;
  totalRegistros = 0;
  totalPaginas = 0;
  paginaDigitada = 1;

  filtros: any = {
    dataInicio: '', dataFim: '', horaInicio: '', horaFim: '', placa: '', equipamentoId: ''
  };

  constructor(private fluxoService: FluxoService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const filtrosSalvos = sessionStorage.getItem('filtrosPesquisaFluxo');
    if (filtrosSalvos) {
      this.filtros = JSON.parse(filtrosSalvos);
      if (this.temFiltroPreenchido()) {
        this.pesquisar(1); // Restaura na página 1
      }
    }
  }

  temFiltroPreenchido(): boolean {
    return Object.values(this.filtros).some(valor => valor !== null && valor !== '');
  }

  // Agora recebe a página que o utilizador quer ver
  pesquisar(paginaDesejada: number = 1): void {
    if (!this.temFiltroPreenchido()) {
      alert('Atenção: É obrigatório informar pelo menos um filtro.');
      return;
    }

    if (this.carregando) return;
    this.carregando = true;
    this.paginaAtual = paginaDesejada;

    sessionStorage.setItem('filtrosPesquisaFluxo', JSON.stringify(this.filtros));

    // Envia a página atual e o limite para o serviço
    this.fluxoService.pesquisar(this.filtros, this.paginaAtual, this.limitePorPagina).subscribe({
      next: (resposta) => {
        // Extrai os dados do novo formato JSON do Backend
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
      this.paginaDigitada = novaPagina; // Atualiza o input visualmente
    }
  }

  irParaPagina(): void {
    if (this.paginaDigitada >= 1 && this.paginaDigitada <= this.totalPaginas) {
      this.mudarPagina(this.paginaDigitada);
    } else {
      // Se ele digitar um absurdo (ex: 9999), o sistema reseta para a página atual
      this.paginaDigitada = this.paginaAtual;
    }
  }

  limparFiltros(): void {
    this.filtros = { dataInicio: '', dataFim: '', horaInicio: '', horaFim: '', placa: '', equipamentoId: '' };
    this.fluxos = [];
    this.totalRegistros = 0;
    this.totalPaginas = 0;
    this.paginaAtual = 1;
    sessionStorage.removeItem('filtrosPesquisaFluxo');
    this.cdr.detectChanges();
  }
}
