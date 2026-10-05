import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EquipamentoService } from '../../../services/equipamento';
import { IntegradorService } from '../../../services/integrador';
import { MunicipioService } from '../../../services/municipio';

@Component({
  selector: 'app-cadastrar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cadastrar.html',
})
export class CadastrarComponent implements OnInit {
  integradores: any[] = [];
  municipios: any[] = [];
  erro = '';

  equipamento = {
    codigo: '',
    faixa: null,
    tipo: '',
    ativo: null,
    local: '',
    marca: '',
    modelo: '',
    velocidadeLimite: null,
    dataAfericao: '',
    lacre: '',
    dataRegistroInmetro: '',
    numeroInmetro: '',
    integradorId: null,
    municipioId: null
  };

  constructor(
    private equipamentoService: EquipamentoService,
    private integradorService: IntegradorService,
    private municipioService: MunicipioService,
    private router: Router
  ) {}

  ngOnInit() {
    this.integradorService.listar().subscribe({
      next: (res) => this.integradores = res,
      error: () => this.erro = 'Erro ao carregar integradores'
    });
    this.municipioService.listar().subscribe({
      next: (res) => this.municipios = res,
      error: () => this.erro = 'Erro ao carregar municípios'
    });
  }

  onSubmit() {
    this.equipamentoService.cadastrar(this.equipamento).subscribe({
      next: () => this.router.navigate(['/equipamentos']),
      error: () => this.erro = 'Erro ao cadastrar equipamento'
    });
  }

  voltar() {
    this.router.navigate(['/equipamentos']);
  }
}
