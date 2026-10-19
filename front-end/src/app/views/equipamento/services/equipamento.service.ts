import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Equipamento } from '../models/equipamento';

@Injectable({
  providedIn: 'root'
})
export class EquipamentoService {
  private readonly baseUrl = `${environment.apiUrl}/equipamento`;

  constructor(private http: HttpClient) { }

  // O método recebe um objeto com os filtros preenchidos na tela
  pesquisar(filtros: any): Observable<Equipamento[]> {
    let params = new HttpParams();

    // Se o utilizador preencheu o filtro, adicionamos à requisição
    if (filtros.codigo) {
      params = params.set('codigo', filtros.codigo);
    }
    if (filtros.faixa) {
      params = params.set('faixa', filtros.faixa);
    }
    if (filtros.ativo !== null && filtros.ativo !== '') {
      params = params.set('ativo', filtros.ativo);
    }
    if (filtros.integradorId) {
      params = params.set('integradorId', filtros.integradorId);
    }

    // Faz o GET enviando os parâmetros (ex: /equipamento?codigo=123&ativo=1)
    return this.http.get<Equipamento[]>(this.baseUrl, { params });
  }
}
