import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly baseUrl = `${environment.apiUrl}/usuario`;

  constructor(private http: HttpClient) { }

  cadastrar(usuario: any): Observable<any> {
    return this.http.post(this.baseUrl, usuario);
  }
}
