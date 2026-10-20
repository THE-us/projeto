import { Component } from '@angular/core';
import { FluxoService } from '../../services/fluxo';

@Component({
  selector: 'app-pesquisar-fluxo',
  standalone: false,
  templateUrl: './pesquisar-fluxo.html',
  styleUrl: './pesquisar-fluxo.scss'
})
export class PesquisarFluxo {
  fluxos: any[] = [];

  filtros: any = {
    dataInicio: '',
    dataFim: '',
    horaInicio: '',
    horaFim: '',
    placa: '',
    equipamentoId: ''
  };

  constructor(private fluxoService: FluxoService) {}

  temFiltroPreenchido(): boolean {
    return Object.values(this.filtros).some(valor => valor !== null && valor !== '');
  }

  pesquisar(): void {
    if (!this.temFiltroPreenchido()) {
      alert('Atenção: É obrigatório informar pelo menos um filtro (ex: intervalo de datas, placa ou equipamento).');
      return;
    }

    this.fluxoService.pesquisar(this.filtros).subscribe({
      next: (dados) => {
        this.fluxos = dados;
      },
      error: (erro) => {
        console.error('Erro ao pesquisar fluxos:', erro);
        alert('Erro ao realizar a pesquisa. Verifique se os filtros são válidos.');
      }
    });
  }

  limparFiltros(): void {
    this.filtros = { dataInicio: '', dataFim: '', horaInicio: '', horaFim: '', placa: '', equipamentoId: '' };
    this.fluxos = [];
  }
}
