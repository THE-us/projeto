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

  veiculosFrequentes: any[] = [];
  carregandoVeiculos = false;
  placaExpandida: string | null = null;
  equipamentosPorPlaca: { [placa: string]: any[] } = {};

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
    } else {
      this.mostrarTotalGeral();
    }

    this.carregarVeiculosFrequentes();
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

  carregarVeiculosFrequentes(): void {
    this.carregandoVeiculos = true;

    this.fluxoService.veiculosMaisFrequentes(5).subscribe({
      next: (dados) => {
        this.veiculosFrequentes = dados;
        this.carregandoVeiculos = false;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao carregar os veículos mais frequentes:', erro);
        this.carregandoVeiculos = false;
        this.cdr.detectChanges();
      }
    });
  }

  filtrar(): void {
    if (!this.filtros.dataInicio || !this.filtros.dataFim) {
      alert('Por favor, preencha a Data de Início e a Data de Fim.');
      return;
    }
    if (this.filtros.dataInicio > this.filtros.dataFim) {
      alert('A Data de Início não pode ser posterior à Data de Fim.');
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

  totalPassagens(): number {
    return this.dadosAnalise.reduce((soma, item) => soma + Number(item.totalFluxos || 0), 0);
  }

  mediaPorEquipamento(): number {
    if (this.dadosAnalise.length === 0) return 0;
    return Math.round(this.totalPassagens() / this.dadosAnalise.length);
  }

  percentual(item: any): number {
    const total = this.totalPassagens();
    if (total === 0) return 0;
    return (Number(item.totalFluxos || 0) / total) * 100;
  }

  formatarDataHora(valor: string): string {
    if (!valor) return '-';
    const [data, hora] = valor.split(' ');
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano} ${hora || ''}`.trim();
  }

  alternarDetalheVeiculo(placa: string): void {
    if (this.placaExpandida === placa) {
      this.placaExpandida = null;
      return;
    }

    this.placaExpandida = placa;

    if (this.equipamentosPorPlaca[placa]) return;

    this.fluxoService.equipamentosQueMaisRegistraram(placa, 3).subscribe({
      next: (dados) => {
        this.equipamentosPorPlaca[placa] = dados;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao carregar os equipamentos do veículo:', erro);
        this.equipamentosPorPlaca[placa] = [];
        this.cdr.detectChanges();
      }
    });
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

  verPassagensPlaca(placa: string): void {
    const filtrosPesquisa = {
      dataInicio: '',
      dataFim: '',
      horaInicio: '',
      horaFim: '',
      placa: placa,
      equipamentoCodigo: '',
      equipamentoFaixa: ''
    };

    sessionStorage.setItem('filtrosPesquisaFluxo', JSON.stringify(filtrosPesquisa));

    this.router.navigate(['/fluxo']);
  }
}
