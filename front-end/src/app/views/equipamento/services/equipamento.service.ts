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

  pesquisar(filtros: any, pagina: number = 1, limite: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('limite', limite.toString());

    if (filtros) {
      Object.keys(filtros).forEach(key => {
        const valor = filtros[key];
        if (valor !== null && valor !== undefined && valor !== '' && String(valor) !== 'undefined') {
          params = params.set(key, valor);
        }
      });
    }

    return this.http.get<any>(this.baseUrl, { params });
  }

  cadastrar(equipamento: Equipamento): Observable<Equipamento> {
    return this.http.post<Equipamento>(`${this.baseUrl}/cadastrar`, equipamento);
  }

  excluir(id: number): Observable<any>{
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  buscarPorId(id: number): Observable<Equipamento>{
    return this.http.get<Equipamento>(`${this.baseUrl}/${id}`);
  }

  atualizar(id: number, equipamento: any): Observable<Equipamento>{
    return this.http.post<Equipamento>(`${this.baseUrl}/${id}`, equipamento);
  }

  exportarDados(ids: number[], formato: 'xlsx' | 'pdf', filtros: any) {
    return this.http.post(
      `${environment.apiUrl}/exportacao/equipamentos`,
      { ids, formato, filtros },
      { responseType: 'blob' }
    );
  }
}
