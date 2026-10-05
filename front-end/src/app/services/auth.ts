import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    signUp(dados: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/usuario/signUp`, dados); 
    }

    login(dados: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/usuario/login`, dados); 
    }

    salvarToken(token: string): void {
        localStorage.setItem('token', token);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    logout(): void {
        localStorage.removeItem('token');
    }

    estaLogado(): boolean {
        return this.getToken() !== null;
    }
}