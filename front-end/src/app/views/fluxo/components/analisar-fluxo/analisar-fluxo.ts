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
    // Carrega o total geral de fluxos por equipamento ao abrir a tela, conforme o requisito 4
    this.carregarAnalise();
  }

  carregarAnalise(): void {
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
    this.carregarAnalise(); // Recarrega sem filtros para mostrar o total geral novamente
  }
}
