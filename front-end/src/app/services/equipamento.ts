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

  listar(): Observable<any> {
    return this.http.get(this.apiUrl);
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
