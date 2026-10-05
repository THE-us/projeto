import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FluxoService } from '../../../services/fluxo';

@Component({
  selector: 'app-analisar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './analisar.html',
})
export class AnalisarComponent implements OnInit {
  fluxos: any[] = [];
  erro = '';

  filtros = {
    dataInicio: '',
    dataFim: ''
  };

  constructor(private fluxoService: FluxoService) {}

  ngOnInit() {
    this.analisar();
  }

  analisar() {
    this.erro = '';
    this.fluxoService.analisar(this.filtros).subscribe({
      next: (res) => this.fluxos = res,
      error: () => this.erro = 'Erro ao analisar fluxos'
    });
  }
}
