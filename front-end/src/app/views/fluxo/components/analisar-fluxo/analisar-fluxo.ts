import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FluxoService } from '../../services/fluxo';

@Component({
  selector: 'app-analisar-fluxo',
  standalone: false,
  templateUrl: './analisar-fluxo.html',
  styleUrl: './analisar-fluxo.scss'
})
export class AnalisarFluxo implements OnInit {
  dadosAnalise: any[] = [];
  carregando = false;
  vendoTotalGeral = false;

  // Flag para controlar se a tela deve exibir resultados/mensagens
  pesquisaRealizada = false;

  filtros = {
    dataInicio: '',
    dataFim: ''
  };

  constructor(
    private fluxoService: FluxoService,
    private cdr: ChangeDetectorRef,
    private router: Router // Injetado para navegar entre as telas
  ) {}

  ngOnInit(): void {
    const filtrosSalvos = sessionStorage.getItem('filtrosAnaliseFluxo');
    if (filtrosSalvos) {
      this.filtros = JSON.parse(filtrosSalvos);
      this.pesquisaRealizada = true;
      if (this.filtros.dataInicio || this.filtros.dataFim) {
        this.vendoTotalGeral = false;
      } else {
        this.vendoTotalGeral = true;
      }
      this.carregarAnalise();
    }
    // Se não houver filtros salvos, a tela permanece 100% limpa (não chama carregarAnalise)
  }

  carregarAnalise(): void {
    this.carregando = true;
    sessionStorage.setItem('filtrosAnaliseFluxo', JSON.stringify(this.filtros));

    this.fluxoService.analisar(this.filtros).subscribe({
      next: (dados) => {
        this.dadosAnalise = dados;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao carregar análise de fluxos:', erro);
        alert('Erro ao processar a análise no servidor.');
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  filtrar(): void {
    if (!this.filtros.dataInicio || !this.filtros.dataFim) {
      alert('Por favor, preencha a Data de Início e a Data de Fim.');
      return;
    }
    this.vendoTotalGeral = false;
    this.pesquisaRealizada = true;
    this.carregarAnalise();
  }

  mostrarTotalGeral(): void {
    this.filtros = { dataInicio: '', dataFim: '' };
    this.vendoTotalGeral = true;
    this.pesquisaRealizada = true;
    this.carregarAnalise();
  }

  limparFiltros(): void {
    // Apenas limpa a memória e esconde os resultados, voltando ao estado inicial
    this.filtros = { dataInicio: '', dataFim: '' };
    this.dadosAnalise = [];
    this.vendoTotalGeral = false;
    this.pesquisaRealizada = false;
    sessionStorage.removeItem('filtrosAnaliseFluxo');
    this.cdr.detectChanges();
  }

  verPassagens(item: any): void {
    // Constrói o objeto de filtros exigido pela tela de Pesquisar Fluxo
    const filtrosPesquisa = {
      dataInicio: this.filtros.dataInicio || '',
      dataFim: this.filtros.dataFim || '',
      horaInicio: '',
      horaFim: '',
      placa: '',
      equipamentoCodigo: item.Equipamento?.codigo || '',
      equipamentoFaixa: item.Equipamento?.faixa || ''
    };

    // Salva na memória fingindo que o utilizador digitou isso na outra tela
    sessionStorage.setItem('filtrosPesquisaFluxo', JSON.stringify(filtrosPesquisa));

    // Redireciona para a tela de Pesquisar Fluxo (Ajuste o caminho se a sua rota for diferente de '/fluxo')
    this.router.navigate(['/fluxo']);
  }
}
