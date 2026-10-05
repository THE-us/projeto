import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FluxoService {

  private apiUrl = `${environment.apiUrl}/fluxo`;

  constructor(private http: HttpClient) {}

  pesquisar(filtros: any): Observable<any> {
    let params = new HttpParams();

    if (filtros.dataInicio) params = params.set('dataInicio', filtros.dataInicio);
    if (filtros.dataFim) params = params.set('dataFim', filtros.dataFim);
    if (filtros.horaInicio) params = params.set('horaInicio', filtros.horaInicio);
    if (filtros.horaFim) params = params.set('horaFim', filtros.horaFim);
    if (filtros.placa) params = params.set('placa', filtros.placa);
    if (filtros.equipamentoId) params = params.set('equipamentoId', filtros.equipamentoId);

    return this.http.get(`${this.apiUrl}/pesquisar`, { params });
  }

  analisar(filtros: any): Observable<any> {
    let params = new HttpParams();

    if (filtros.dataInicio) params = params.set('dataInicio', filtros.dataInicio);
    if (filtros.dataFim) params = params.set('dataFim', filtros.dataFim);

    return this.http.get(`${this.apiUrl}/analisar`, { params });
  }
}
