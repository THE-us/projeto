import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs'; // Importação crucial para executar chamadas em paralelo
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
    private integradorService: IntegradorService,
    private cdr: ChangeDetectorRef // Injetado para sincronizar a tela
  ) {}

  ngOnInit(): void {
    this.equipamentoId = Number(this.route.snapshot.paramMap.get('id'));

    // O forkJoin executa todas as requisições API em simultâneo.
    // O código só continua quando TUDO estiver pronto.
    forkJoin({
      municipios: this.municipioService.pesquisar(),
      integradores: this.integradorService.listar(),
      equipamento: this.equipamentoService.buscarPorId(this.equipamentoId)
    }).subscribe({
      next: (resultados) => {
        this.municipios = resultados.municipios;
        this.integradores = resultados.integradores;

        const dados = resultados.equipamento;

        // Formatar datas
        if (dados.dataAfericao) dados.dataAfericao = String(dados.dataAfericao).split('T')[0];
        if (dados.dataRegistroInmetro) dados.dataRegistroInmetro = String(dados.dataRegistroInmetro).split('T')[0];

        // Atualiza o objeto clonando-o para forçar a renderização
        this.equipamento = { ...dados };

        const mun = this.municipios.find(m => m.id === dados.municipioId);
        if (mun) this.buscaMunicipio = mun.descricao;

        const int = this.integradores.find(i => i.id === dados.integradorId);
        if (int) this.buscaIntegrador = int.nome;

        // Avisa a tela que os dados já chegaram e ela deve desenhar as caixas de texto preenchidas
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao carregar dados', erro);
        alert('Erro ao carregar os dados.');
        this.voltar();
      }
    });
  }

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
