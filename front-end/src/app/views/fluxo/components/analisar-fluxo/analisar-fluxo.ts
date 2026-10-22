import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  vendoTotalGeral = true;

  filtros = {
    dataInicio: '',
    dataFim: ''
  };

  constructor(
    private fluxoService: FluxoService,
    private cdr: ChangeDetectorRef // Injetado para forçar a renderização
  ) {}

  ngOnInit(): void {
    const filtrosSalvos = sessionStorage.getItem('filtrosAnaliseFluxo');
    if (filtrosSalvos) {
      this.filtros = JSON.parse(filtrosSalvos);
      if (this.filtros.dataInicio || this.filtros.dataFim) {
        this.vendoTotalGeral = false;
      }
    }
    this.carregarAnalise();
  }

  carregarAnalise(): void {
    this.carregando = true;
    sessionStorage.setItem('filtrosAnaliseFluxo', JSON.stringify(this.filtros));

    this.fluxoService.analisar(this.filtros).subscribe({
      next: (dados) => {
        this.dadosAnalise = dados;
        this.carregando = false;
        this.cdr.detectChanges(); // Acorda a tela instantaneamente quando os dados chegam
      },
      error: (erro) => {
        console.error('Erro ao carregar análise de fluxos:', erro);
        alert('Erro ao processar a análise no servidor.');
        this.carregando = false;
        this.cdr.detectChanges(); // Acorda a tela também em caso de erro
      }
    });
  }

  filtrar(): void {
    if (!this.filtros.dataInicio || !this.filtros.dataFim) {
      alert('Por favor, preencha a Data de Início e a Data de Fim.');
      return;
    }
    this.vendoTotalGeral = false;
    this.carregarAnalise();
  }

  limparFiltros(): void {
    this.filtros = { dataInicio: '', dataFim: '' };
    this.vendoTotalGeral = true;
    sessionStorage.removeItem('filtrosAnaliseFluxo');
    this.carregarAnalise();
  }
}
