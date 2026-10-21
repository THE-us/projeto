import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FluxoService {
  private readonly baseUrl = `${environment.apiUrl}/fluxo`;

  constructor(private http: HttpClient) { }

  // Agora recebe página e limite, e retorna 'any' em vez de 'any[]', pois o backend envia um objeto com dados e totais
  pesquisar(filtros: any, pagina: number = 1, limite: number = 30): Observable<any> {
    let params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('limite', limite.toString());

    Object.keys(filtros).forEach(key => {
      if (filtros[key] !== null && filtros[key] !== '') {
        params = params.set(key, filtros[key]);
      }
    });

    return this.http.get<any>(`${this.baseUrl}/pesquisa`, { params });
  }

  analisar(filtros: any): Observable<any[]> {
    let params = new HttpParams();
    if (filtros.dataInicio) params = params.set('dataInicio', filtros.dataInicio);
    if (filtros.dataFim) params = params.set('dataFim', filtros.dataFim);

    return this.http.get<any[]>(`${this.baseUrl}/analisar`, { params });
  }
}
