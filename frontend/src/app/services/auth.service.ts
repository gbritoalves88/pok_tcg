// app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  isAutenticado(): boolean {
    if (typeof window === 'undefined') return false;

    const token = localStorage.getItem('token');

    if (!token) {
      return false;
    }

    // Verifica se o token não está expirado
    const tokenExpirado = this.isTokenExpirado(token);
    if (tokenExpirado) {
      this.logout();
      return false;
    }

    return true;
  }

  isTokenExpirado(token: string): boolean {
    try {
      // Decodifica o token JWT
      const payload = JSON.parse(atob(token.split('.')[1]));

      // Verifica se tem expiração
      if (!payload.exp) return false;

      // Compara com a data atual
      const dataAtual = Math.floor(new Date().getTime() / 1000);
      return payload.exp < dataAtual;

    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return true;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  validarTokenNoBackend(): Observable<any> {
    return this.apiService.get('auth/validar-token');
  }
}
