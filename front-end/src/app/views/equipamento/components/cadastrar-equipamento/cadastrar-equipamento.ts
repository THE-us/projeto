import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Equipamento } from '../../models/equipamento';
import { EquipamentoService } from '../../services/equipamento.service';
import { MunicipioService } from '../../../municipio/services/municipio.service';
import { IntegradorService } from '../../services/integrador.service';

@Component({
  selector: 'app-cadastrar-equipamento',
  standalone: false,
  templateUrl: './cadastrar-equipamento.html',
  styleUrl: './cadastrar-equipamento.scss'
})
export class CadastrarEquipamento implements OnInit {
  equipamento: any = {
    codigo: '', faixa: null, tipo: '', ativo: 1, local: '', marca: '', modelo: '',
    velocidadeLimite: null, lacre: '', dataAfericao: '', dataRegistroInmetro: '',
    numeroInmetro: '', municipioId: null, integradorId: null
  };

  // Controlo do Autocompletar Municípios
  municipios: any[] = [];
  municipiosFiltrados: any[] = [];
  buscaMunicipio = '';
  mostrarDropdownMunicipio = false;

  // Controlo do Autocompletar Integradores
  integradores: any[] = [];
  integradoresFiltrados: any[] = [];
  buscaIntegrador = '';
  mostrarDropdownIntegrador = false;

  constructor(
    private equipamentoService: EquipamentoService,
    private municipioService: MunicipioService,
    private integradorService: IntegradorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Carrega todos os dados ao abrir a tela
    this.municipioService.pesquisar().subscribe(dados => this.municipios = dados);
    this.integradorService.listar().subscribe(dados => this.integradores = dados);
  }

  // --- LÓGICA DE FILTRAGEM MUNICÍPIO ---
  filtrarMunicipios(): void {
    this.mostrarDropdownMunicipio = true;
    this.municipiosFiltrados = this.municipios.filter(m =>
      m.descricao.toLowerCase().includes(this.buscaMunicipio.toLowerCase())
    );
  }

  selecionarMunicipio(m: any): void {
    this.equipamento.municipioId = m.id;
    this.buscaMunicipio = m.descricao;
    this.mostrarDropdownMunicipio = false;
  }

  // --- LÓGICA DE FILTRAGEM INTEGRADOR ---
  filtrarIntegradores(): void {
    this.mostrarDropdownIntegrador = true;
    this.integradoresFiltrados = this.integradores.filter(i =>
      i.nome.toLowerCase().includes(this.buscaIntegrador.toLowerCase())
    );
  }

  selecionarIntegrador(i: any): void {
    this.equipamento.integradorId = i.id;
    this.buscaIntegrador = i.nome;
    this.mostrarDropdownIntegrador = false;
  }

  // Ocultar dropdowns ao clicar fora (Opcional)
  fecharDropdowns(): void {
    setTimeout(() => {
      this.mostrarDropdownMunicipio = false;
      this.mostrarDropdownIntegrador = false;
    }, 200); // Timeout permite o registo do clique antes de fechar
  }

  // --- SALVAR ---
  salvar(): void {
    const payload = { ...this.equipamento };

    if (!payload.dataAfericao) payload.dataAfericao = null;
    if (!payload.dataRegistroInmetro) payload.dataRegistroInmetro = null;
    if (!payload.numeroInmetro) payload.numeroInmetro = null;

    this.equipamentoService.cadastrar(payload).subscribe({
      next: () => {
        alert('Equipamento cadastrado com sucesso!');
        this.router.navigate(['/equipamento']);
      },
      error: (erro) => console.error('Erro ao cadastrar:', erro)
    });
  }

  cancelar(): void {
    this.router.navigate(['/equipamento']);
  }
}
