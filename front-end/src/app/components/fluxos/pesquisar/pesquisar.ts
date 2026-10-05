import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FluxoService } from '../../../services/fluxo';

@Component({
  selector: 'app-pesquisar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './pesquisar.html',
})
export class PesquisarComponent {
  fluxos: any[] = [];
  erro = '';
  pesquisado = false;

  filtros = {
    dataInicio: '',
    dataFim: '',
    horaInicio: '',
    horaFim: '',
    placa: '',
    equipamentoId: ''
  };

  constructor(private fluxoService: FluxoService) {}

  pesquisar() {
    this.erro = '';
    this.fluxoService.pesquisar(this.filtros).subscribe({
      next: (res) => {
        this.fluxos = res;
        this.pesquisado = true;
      },
      error: (err) => {
        this.erro = err.error?.message || 'Erro ao pesquisar fluxos';
        this.pesquisado = true;
      }
    });
  }
}
