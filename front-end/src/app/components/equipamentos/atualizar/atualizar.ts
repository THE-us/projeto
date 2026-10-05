import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EquipamentoService } from '../../../services/equipamento';
import { IntegradorService } from '../../../services/integrador';
import { MunicipioService } from '../../../services/municipio';

@Component({
  selector: 'app-atualizar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './atualizar.html',
})
export class AtualizarComponent implements OnInit {
  integradores: any[] = [];
  municipios: any[] = [];
  erro = '';
  id: number = 0;

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
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.equipamentoService.buscarPorId(this.id).subscribe({
      next: (res) => {
        this.equipamento = {
          codigo: res.codigo,
          faixa: res.faixa,
          tipo: res.tipo,
          ativo: res.ativo,
          local: res.local,
          marca: res.marca,
          modelo: res.modelo,
          velocidadeLimite: res.velocidadeLimite,
          dataAfericao: res.dataAfericao,
          lacre: res.lacre,
          dataRegistroInmetro: res.dataRegistroInmetro,
          numeroInmetro: res.numeroInmetro,
          integradorId: res.integradorId,
          municipioId: res.municipioId
        };
      },
      error: () => this.erro = 'Erro ao carregar equipamento'
    });

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
    this.equipamentoService.atualizar(this.id, this.equipamento).subscribe({
      next: () => this.router.navigate(['/equipamentos']),
      error: () => this.erro = 'Erro ao atualizar equipamento'
    });
  }

  deletar() {
    if (confirm('Tem certeza que deseja excluir este equipamento?')) {
      this.equipamentoService.deletar(this.id).subscribe({
        next: () => this.router.navigate(['/equipamentos']),
        error: () => this.erro = 'Erro ao deletar equipamento'
      });
    }
  }

  voltar() {
    this.router.navigate(['/equipamentos']);
  }
}
