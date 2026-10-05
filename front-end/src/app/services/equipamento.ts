import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EquipamentoService {

  private apiUrl = `${environment.apiUrl}/equipamento`;

  constructor(private http: HttpClient) {}

  listar(filtros?: any): Observable<any> {
    let params = new HttpParams();

    if (filtros?.codigo) params = params.set('codigo', filtros.codigo);
    if (filtros?.faixa) params = params.set('faixa', filtros.faixa);
    if (filtros?.ativo !== undefined && filtros?.ativo !== '') params = params.set('ativo', filtros.ativo);
    if (filtros?.integradorId) params = params.set('integradorId', filtros.integradorId);

    return this.http.get(this.apiUrl, { params });
  }

  buscarPorId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  cadastrar(dados: any): Observable<any> {
    return this.http.post(this.apiUrl, dados);
  }

  atualizar(id: number, dados: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, dados);
  }

  deletar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
