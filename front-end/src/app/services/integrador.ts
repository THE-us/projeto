import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IntegradorService {
  private apiUrl = `${environment.apiUrl}/integrador`;
  private cache$: Observable<any> | null = null;

  constructor(private http: HttpClient) {}

  listar(): Observable<any> {
    if (!this.cache$) {
      this.cache$ = this.http.get(this.apiUrl).pipe(shareReplay(1));
    }
    return this.cache$;
  }
}
