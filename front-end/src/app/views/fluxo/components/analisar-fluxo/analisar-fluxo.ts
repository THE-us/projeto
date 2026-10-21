import { Component, OnInit } from '@angular/core';
import { FluxoService } from '../../services/fluxo';

@Component({
  selector: 'app-analisar-fluxo',
  standalone: false,
  templateUrl: './analisar-fluxo.html',
  styleUrl: './analisar-fluxo.scss'
})
export class AnalisarFluxo implements OnInit {
  dadosAnalise: any[] = [];

  filtros = {
    dataInicio: '',
    dataFim: ''
  };

  constructor(private fluxoService: FluxoService) {}

  ngOnInit(): void {
    const filtrosSalvos = sessionStorage.getItem('filtrosAnaliseFluxo');
    if (filtrosSalvos) {
      this.filtros = JSON.parse(filtrosSalvos);
    }

    this.carregarAnalise();
  }

  carregarAnalise(): void {
    sessionStorage.setItem('filtrosAnaliseFluxo', JSON.stringify(this.filtros));

    this.fluxoService.analisar(this.filtros).subscribe({
      next: (dados) => {
        this.dadosAnalise = dados;
      },
      error: (erro) => {
        console.error('Erro ao carregar análise de fluxos:', erro);
        alert('Erro ao processar a análise no servidor.');
      }
    });
  }

  filtrar(): void {
    this.carregarAnalise();
  }

  limparFiltros(): void {
    this.filtros = { dataInicio: '', dataFim: '' };
    sessionStorage.removeItem('filtrosAnaliseFluxo');
    this.carregarAnalise();
  }
}
