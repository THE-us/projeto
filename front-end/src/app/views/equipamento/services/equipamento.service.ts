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

  pesquisar(filtros: any): Observable<Equipamento[]> {
    let params = new HttpParams();

    if (filtros.codigo) {
      params = params.set('codigo', filtros.codigo);
    }
    if (filtros.faixa) {
      params = params.set('faixa', filtros.faixa);
    }
    if (filtros.ativo !== null && filtros.ativo !== '') {
      params = params.set('ativo', filtros.ativo);
    }
    if (filtros.integradorNome) {
      params = params.set('integradorNome', filtros.integradorNome);
    }

    return this.http.get<Equipamento[]>(this.baseUrl, { params });
  }

  cadastrar(equipamento: Equipamento): Observable<Equipamento> {
    return this.http.post<Equipamento>(`${this.baseUrl}/cadastrar`, equipamento);
  }
}
