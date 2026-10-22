import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { EquipamentoService } from '../../services/equipamento.service';
import { MunicipioService } from '../../../municipio/services/municipio.service';
import { IntegradorService } from '../../services/integrador.service';

@Component({
  selector: 'app-cadastrar-equipamento',
  standalone: false,
  templateUrl: './cadastrar-equipamento.html',
  styleUrl: './cadastrar-equipamento.scss'
})
export class CadastrarEquipamento implements OnInit, OnDestroy {
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

  private formSalvo = false;

  constructor(
    private equipamentoService: EquipamentoService,
    private municipioService: MunicipioService,
    private integradorService: IntegradorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.municipioService.pesquisar().subscribe(dados => this.municipios = dados);
    this.integradorService.listar().subscribe(dados => this.integradores = dados);

    const rascunho = sessionStorage.getItem('rascunhoCadastroEquipamento');
    if (rascunho) {
      const dadosSalvos = JSON.parse(rascunho);
      this.equipamento = dadosSalvos.equipamento;
      this.buscaMunicipio = dadosSalvos.buscaMunicipio;
      this.buscaIntegrador = dadosSalvos.buscaIntegrador;
    }
  }

  @HostListener('window:beforeunload')
  guardarRascunhoNavegador(): void {
    this.salvarRascunho();
  }

  ngOnDestroy(): void {
    this.salvarRascunho();
  }

  private salvarRascunho(): void {
    if (!this.formSalvo) {
      const rascunho = {
        equipamento: this.equipamento,
        buscaMunicipio: this.buscaMunicipio,
        buscaIntegrador: this.buscaIntegrador
      };
      sessionStorage.setItem('rascunhoCadastroEquipamento', JSON.stringify(rascunho));
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

    const anoMinimo = 2000;
    const anoMaximo = 2030;

    const validarData = (dataStr: string, nomeCampo: string): string | null => {
      if (!dataStr) return null;
      const ano = new Date(dataStr).getFullYear();
      if (ano < anoMinimo || ano > anoMaximo) {
        const aceitaNulo = confirm(`A data de ${nomeCampo} (Ano: ${ano}) está fora do limite permitido (${anoMinimo}-${anoMaximo}). Deseja salvá-la em branco (null)? Se clicar em Cancelar, você poderá corrigir a data.`);
        if (aceitaNulo) return null;
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

    this.equipamentoService.cadastrar(payload).subscribe({
      next: () => {
        alert('Equipamento cadastrado com sucesso!');
        this.formSalvo = true;
        sessionStorage.removeItem('rascunhoCadastroEquipamento');
        this.router.navigate(['/equipamento']);
      },
      error: (erro) => {
        console.error('Erro ao cadastrar:', erro);
        alert('Erro ao salvar o equipamento. Verifique se algum campo excedeu o limite máximo de caracteres ou se há dados duplicados.');
      }
    });
  }

  cancelar(): void {
    this.formSalvo = true;
    sessionStorage.removeItem('rascunhoCadastroEquipamento');
    this.router.navigate(['/equipamento']);
  }
}
