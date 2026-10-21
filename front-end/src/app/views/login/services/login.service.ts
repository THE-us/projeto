import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly baseUrl = `${environment.apiUrl}/auth/login`;
  private authSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
  authStatus$ = this.authSubject.asObservable();

  constructor(private http: HttpClient) { }

  login(credenciais: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, credenciais);
  }
  notificarLogin(status: boolean): void {
    this.authSubject.next(status);
  }
}
