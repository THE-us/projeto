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
    // 1. TENTA RECUPERAR A ÚLTIMA ANÁLISE FEITA
    const filtrosSalvos = sessionStorage.getItem('filtrosAnaliseFluxo');
    if (filtrosSalvos) {
      this.filtros = JSON.parse(filtrosSalvos);
    }

    // Carrega o total geral (ou os dados com os filtros restaurados) ao abrir a tela
    this.carregarAnalise();
  }

  carregarAnalise(): void {
    // 2. GUARDA OS FILTROS ATUAIS NA MEMÓRIA
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
    // 3. APAGA OS FILTROS DA MEMÓRIA
    sessionStorage.removeItem('filtrosAnaliseFluxo');
    this.carregarAnalise(); // Recarrega sem filtros para mostrar o total geral novamente
  }
}
