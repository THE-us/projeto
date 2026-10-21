import { Component, ChangeDetectorRef } from '@angular/core';
import { FluxoService } from '../../services/fluxo';

@Component({
  selector: 'app-pesquisar-fluxo',
  standalone: false,
  templateUrl: './pesquisar-fluxo.html',
  styleUrl: './pesquisar-fluxo.scss'
})
export class PesquisarFluxo {
  fluxos: any[] = [];
  carregando = false;

  filtros: any = {
    dataInicio: '', dataFim: '', horaInicio: '', horaFim: '', placa: '', equipamentoId: ''
  };

  // Injetamos o ChangeDetectorRef aqui
  constructor(private fluxoService: FluxoService, private cdr: ChangeDetectorRef) {}

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

    this.fluxoService.pesquisar(this.filtros).subscribe({
      next: (dados) => {
        this.fluxos = [...dados]; // Recria a lista para o HTML notar a diferença
        this.carregando = false;
        this.cdr.detectChanges(); // Acorda o Angular imediatamente no primeiro clique
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
    this.cdr.detectChanges();
  }
}
