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

  filtros: any = {
    dataInicio: '', dataFim: '', horaInicio: '', horaFim: '', placa: '', equipamentoId: ''
  };

  constructor(private fluxoService: FluxoService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const filtrosSalvos = sessionStorage.getItem('filtrosPesquisaFluxo');
    if (filtrosSalvos) {
      this.filtros = JSON.parse(filtrosSalvos);

      if (this.temFiltroPreenchido()) {
        this.pesquisar();
      }
    }
  }

  temFiltroPreenchido(): boolean {
    return Object.values(this.filtros).some(valor => valor !== null && valor !== '');
  }

  pesquisar(): void {
    if (!this.temFiltroPreenchido()) {
      alert('Atenção: É obrigatório informar pelo menos um filtro (ex: intervalo de datas, placa ou equipamento).');
      return;
    }

    if (this.carregando) return;
    this.carregando = true;

    sessionStorage.setItem('filtrosPesquisaFluxo', JSON.stringify(this.filtros));

    this.fluxoService.pesquisar(this.filtros).subscribe({
      next: (dados) => {
        this.fluxos = [...dados];
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao pesquisar fluxos:', erro);
        this.carregando = false;
        alert('Erro ao realizar a pesquisa. Verifique se os filtros são válidos.');
      }
    });
  }

  limparFiltros(): void {
    this.filtros = { dataInicio: '', dataFim: '', horaInicio: '', horaFim: '', placa: '', equipamentoId: '' };
    this.fluxos = [];

    sessionStorage.removeItem('filtrosPesquisaFluxo');
    this.cdr.detectChanges();
  }
}
