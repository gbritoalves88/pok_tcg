// app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) {}

  isAutenticado(): boolean {
    if (typeof window === 'undefined') return false;

    const token = localStorage.getItem('token');
    const usuario = localStorage.getItem('usuario');

    if (!token || !usuario) {
      return false;
    }

    // Verifica se o token está expirado
    if (this.isTokenExpirado(token)) {
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
      if (!payload.exp) {
        return true;
      }

      // Converte para timestamp (segundos)
      const dataAtual = Math.floor(Date.now() / 1000);

      // Se expirou, retorna true
      return payload.exp < dataAtual;

    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return true;
    }
  }

  getTempoRestante(token: string): number {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload.exp) return 0;

      const dataAtual = Math.floor(Date.now() / 1000);
      const tempoRestante = payload.exp - dataAtual;

      return tempoRestante > 0 ? tempoRestante : 0;

    } catch (error) {
      return 0;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
}
