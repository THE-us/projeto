import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
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

  equipamentoOriginal: any = null;
  formSalvo = false;

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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.equipamentoId = Number(this.route.snapshot.paramMap.get('id'));

    forkJoin({
      municipios: this.municipioService.pesquisar(),
      integradores: this.integradorService.listar(),
      equipamento: this.equipamentoService.buscarPorId(this.equipamentoId)
    }).subscribe({
      next: (resultados) => {
        this.municipios = resultados.municipios;
        this.integradores = resultados.integradores;

        const dados = resultados.equipamento;

        if (dados.dataAfericao) dados.dataAfericao = String(dados.dataAfericao).split('T')[0];
        if (dados.dataRegistroInmetro) dados.dataRegistroInmetro = String(dados.dataRegistroInmetro).split('T')[0];

        this.equipamento = { ...dados };

        this.equipamentoOriginal = JSON.parse(JSON.stringify(this.equipamento));

        const mun = this.municipios.find(m => m.id === dados.municipioId);
        if (mun) this.buscaMunicipio = mun.descricao;

        const int = this.integradores.find(i => i.id === dados.integradorId);
        if (int) this.buscaIntegrador = int.nome;

        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao carregar dados', erro);
        alert('Erro ao carregar os dados.');
        this.router.navigate(['/equipamento']);
      }
    });
  }

  temAlteracoesPendentes(): boolean {
    if (this.formSalvo || !this.equipamentoOriginal) return false;
    return JSON.stringify(this.equipamento) !== JSON.stringify(this.equipamentoOriginal);
  }

  @HostListener('window:beforeunload', ['$event'])
  aoTentarSair($event: any): void {
    if (this.temAlteracoesPendentes()) {
      $event.returnValue = 'Existem alterações não salvas. Deseja mesmo sair?';
    }
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
    payload.marca = this.buscaIntegrador;

    const validarData = (dataStr: string, nomeCampo: string): string | null | 'INTERROMPER_SALVAMENTO' => {
      if (!dataStr) return null;

      const dataInserida = new Date(dataStr + 'T12:00:00');
      const dataMinima = new Date('2000-01-01T00:00:00');
      const hoje = new Date();
      hoje.setHours(23, 59, 59, 999);

      if (dataInserida < dataMinima) {
        alert(`A data de ${nomeCampo} não pode ser anterior ao ano 2000.`);
        return 'INTERROMPER_SALVAMENTO';
      }

      if (dataInserida > hoje) {
        alert(`A data de ${nomeCampo} não pode ser uma data futura.`);
        return 'INTERROMPER_SALVAMENTO';
      }

      return dataStr;
    };

    const afericaoValidada = validarData(payload.dataAfericao, 'Aferição');
    if (afericaoValidada === 'INTERROMPER_SALVAMENTO') return;
    payload.dataAfericao = afericaoValidada;

    const inmetroValidado = validarData(payload.dataRegistroInmetro, 'Registro Inmetro');
    if (inmetroValidado === 'INTERROMPER_SALVAMENTO') return;
    payload.dataRegistroInmetro = inmetroValidado;

    if (!payload.numeroInmetro) payload.numeroInmetro = null;

    this.equipamentoService.atualizar(this.equipamentoId, payload).subscribe({
      next: () => {
        alert('Equipamento atualizado com sucesso!');
        this.formSalvo = true;
        this.router.navigate(['/equipamento']);
      },
      error: (erro) => {
        console.error('Erro ao atualizar:', erro);
        alert('Erro ao salvar o equipamento. Verifique se algum campo excedeu o limite máximo de caracteres ou se há dados duplicados.');
      }
    });
  }

  voltar(): void {
    if (this.temAlteracoesPendentes()) {
      const confirmar = confirm('Você tem alterações não salvas. Deseja descartá-las e sair?');
      if (!confirmar) return;
    }

    this.router.navigate(['/equipamento']);
  }
}
