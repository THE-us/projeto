import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EquipamentoService } from '../../services/equipamento.service';
import { MunicipioService } from '../../../municipio/services/municipio.service';
import { IntegradorService } from '../../services/integrador.service';

@Component({
  selector: 'app-editar-equipamento',
  standalone: false,
  templateUrl: './editar-equipamento.html',
  styleUrl: './editar-equipamento.scss'
})
export class EditarEquipamento implements OnInit {
  equipamentoId!: number;
  equipamento: any = {
    codigo: '', faixa: null, tipo: '', ativo: 1, local: '', marca: '', modelo: '',
    velocidadeLimite: null, lacre: '', dataAfericao: '', dataRegistroInmetro: '',
    numeroInmetro: '', municipioId: null, integradorId: null
  };

  // Controlo do Autocompletar
  municipios: any[] = [];
  municipiosFiltrados: any[] = [];
  buscaMunicipio = '';
  mostrarDropdownMunicipio = false;

  integradores: any[] = [];
  integradoresFiltrados: any[] = [];
  buscaIntegrador = '';
  mostrarDropdownIntegrador = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private equipamentoService: EquipamentoService,
    private municipioService: MunicipioService,
    private integradorService: IntegradorService
  ) {}

  ngOnInit(): void {
    // 1. Pega o ID do equipamento que está no URL
    this.equipamentoId = Number(this.route.snapshot.paramMap.get('id'));

    // 2. Carrega as listas primeiro para podermos mapear os nomes nos autocompletes
    this.municipioService.pesquisar().subscribe(muns => {
      this.municipios = muns;
      this.integradorService.listar().subscribe(ints => {
        this.integradores = ints;

        // 3. Só depois de ter as listas é que busca os dados do equipamento
        this.carregarEquipamento();
      });
    });
  }

  carregarEquipamento(): void {
    this.equipamentoService.buscarPorId(this.equipamentoId).subscribe({
      next: (dados) => {
        // Formatar datas para o input nativo HTML (YYYY-MM-DD)
        if (dados.dataAfericao) dados.dataAfericao = String(dados.dataAfericao).split('T')[0];
        if (dados.dataRegistroInmetro) dados.dataRegistroInmetro = String(dados.dataRegistroInmetro).split('T')[0];

        this.equipamento = dados;

        // Preencher os nomes visíveis nos campos de autocompletar
        const mun = this.municipios.find(m => m.id === dados.municipioId);
        if (mun) this.buscaMunicipio = mun.descricao;

        const int = this.integradores.find(i => i.id === dados.integradorId);
        if (int) this.buscaIntegrador = int.nome;
      },
      error: (erro) => {
        console.error('Erro ao buscar equipamento', erro);
        alert('Erro ao carregar os dados. Verifique se o equipamento existe.');
        this.voltar();
      }
    });
  }

  // --- LÓGICA DE FILTRAGEM DO AUTOCOMPLETAR ---
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

  fecharDropdowns(): void {
    setTimeout(() => {
      this.mostrarDropdownMunicipio = false;
      this.mostrarDropdownIntegrador = false;
    }, 200);
  }

  // --- ATUALIZAR ---
  salvar(): void {
    const payload = { ...this.equipamento };

    if (!payload.dataAfericao) payload.dataAfericao = null;
    if (!payload.dataRegistroInmetro) payload.dataRegistroInmetro = null;
    if (!payload.numeroInmetro) payload.numeroInmetro = null;

    this.equipamentoService.atualizar(this.equipamentoId, payload).subscribe({
      next: () => {
        alert('Equipamento atualizado com sucesso!');
        this.voltar();
      },
      error: (erro) => console.error('Erro ao atualizar:', erro)
    });
  }

  voltar(): void {
    this.router.navigate(['/equipamento']);
  }
}
