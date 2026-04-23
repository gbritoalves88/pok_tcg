// app/interceptors/auth.interceptor.fn.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    // Verifica se o token está expirado
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const dataAtual = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp < dataAtual) {
        // Token expirado - limpa storage e redireciona
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        router.navigate(['/login']);

        // Mostra mensagem amigável (opcional)
        alert('⏰ Sua sessão expirou! Faça login novamente.');

        // Cancela a requisição
        throw new Error('Token expirado');
      }
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      // Se não conseguir decodificar, considera inválido
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      router.navigate(['/login']);
      throw new Error('Token inválido');
    }

    const cloned = req.clone({
      headers: req.headers.set('bearer', `Bearer ${token}`)
    });
    return next(cloned);
  }

  return next(req);
};
