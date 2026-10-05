import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MunicipioService {

  private apiUrl = `${environment.apiUrl}/municipio`;

  constructor(private http: HttpClient) {}

  listar(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
