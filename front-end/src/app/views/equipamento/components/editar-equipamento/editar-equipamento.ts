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

  // Variável para guardar a "foto" original dos dados
  equipamentoOriginal: any = null;
  formSalvo = false; // Flag para não exibir o alerta caso clique em "Salvar" com sucesso

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

        // TIRA A FOTO ORIGINAL DOS DADOS PARA COMPARAÇÃO FUTURA
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

  // Função que verifica se os dados atuais estão diferentes da foto original
  temAlteracoesPendentes(): boolean {
    if (this.formSalvo || !this.equipamentoOriginal) return false;
    return JSON.stringify(this.equipamento) !== JSON.stringify(this.equipamentoOriginal);
  }

  // ESCUTA O F5 OU TENTATIVA DE FECHAR A ABA DO NAVEGADOR
  @HostListener('window:beforeunload', ['$event'])
  aoTentarSair($event: any): void {
    if (this.temAlteracoesPendentes()) {
      // Define a mensagem para o navegador disparar a caixa de alerta nativa
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
    if (!payload.dataAfericao) payload.dataAfericao = null;
    if (!payload.dataRegistroInmetro) payload.dataRegistroInmetro = null;
    if (!payload.numeroInmetro) payload.numeroInmetro = null;

    this.equipamentoService.atualizar(this.equipamentoId, payload).subscribe({
      next: () => {
        alert('Equipamento atualizado com sucesso!');
        this.formSalvo = true; // Avisa que salvou com sucesso para não exibir o alerta
        this.router.navigate(['/equipamento']);
      },
      error: (erro) => console.error('Erro ao atualizar:', erro)
    });
  }

  voltar(): void {
    // ESCUTA O BOTÃO VOLTAR / CANCELAR DA SUA TELA
    if (this.temAlteracoesPendentes()) {
      const confirmar = confirm('Você tem alterações não salvas. Deseja descartá-las e sair?');
      if (!confirmar) return; // Se ele cancelar, interrompe a navegação
    }

    this.router.navigate(['/equipamento']);
  }
}
