import { Component, OnInit } from '@angular/core';
import { Municipio } from '../../models/municipio';
import { MunicipioService } from '../../services/municipio.service';

@Component({
  selector: 'app-pesquisar-municipio',
  standalone: false,
  styleUrl: './pesquisar-municipio.scss',
  templateUrl: './pesquisar-municipio.html',
})
export class PesquisarMunicipio implements OnInit {
  municipios: Municipio[] = [];

  constructor(private municipioService: MunicipioService){}

  ngOnInit(): void{
    this.carregarMunicipios();
  }

  carregarMunicipios(): void{
    this.municipioService.pesquisar().subscribe({
      next: (dados) => {
        this.municipios = dados.slice(0, 20);
        console.log('Municipios carregados: ', this.municipios);
      },
      error: (erro) => {
        console.error('Erro ao buscar municipios: ', erro);
      }
    });
  }
}
