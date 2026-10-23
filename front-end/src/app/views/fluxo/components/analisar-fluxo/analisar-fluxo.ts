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

  pesquisaRealizada = false;

  filtros = {
    dataInicio: '',
    dataFim: ''
  };

  constructor(
    private fluxoService: FluxoService,
    private cdr: ChangeDetectorRef,
    private router: Router
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
    this.filtros = { dataInicio: '', dataFim: '' };
    this.dadosAnalise = [];
    this.vendoTotalGeral = false;
    this.pesquisaRealizada = false;
    sessionStorage.removeItem('filtrosAnaliseFluxo');
    this.cdr.detectChanges();
  }

  verPassagens(item: any): void {
    const filtrosPesquisa = {
      dataInicio: this.filtros.dataInicio || '',
      dataFim: this.filtros.dataFim || '',
      horaInicio: '',
      horaFim: '',
      placa: '',
      equipamentoCodigo: item.Equipamento?.codigo || '',
      equipamentoFaixa: item.Equipamento?.faixa || ''
    };

    sessionStorage.setItem('filtrosPesquisaFluxo', JSON.stringify(filtrosPesquisa));

    this.router.navigate(['/fluxo']);
  }
}
