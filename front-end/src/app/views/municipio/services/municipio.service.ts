import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Municipio } from '../models/municipio';

@Injectable({
  providedIn: 'root'
})
export class MunicipioService{
  private readonly baseUrl = `${environment.apiUrl}/municipio`;

  constructor(private http: HttpClient){ }

  pesquisar(): Observable<Municipio[]>{
    return this.http.get<Municipio[]>(this.baseUrl);
  }
}
