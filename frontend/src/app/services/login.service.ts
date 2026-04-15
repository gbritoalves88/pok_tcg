import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, throwError, TimeoutError } from "rxjs";
import { Router } from "@angular/router";
import { Usuario, LoginResponse } from "../models/usuario.model";
import { ApiService } from "../services/api.service";

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    constructor(
        private apiService: ApiService,
        private router: Router
    ) {}

    autenticarUsuario(email: string, senha: string) {
        const body = { email, senha };

        return this.apiService.post<LoginResponse>('auth/token', body).pipe(
            map(response => {
                if (response && response.access_token) {
                    localStorage.setItem('token', response.access_token);
                }
                return response;
            }),
            catchError(this.handleError)
        );
    }

    buscarUsuarioLogado() {
        return this.apiService.get<Usuario>('auth/buscar-usuario').pipe(
            map(response => response),
            catchError(this.handleError)
        );
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    logout(): void {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }

    private handleError(error: HttpErrorResponse | TimeoutError) {
        console.error('=== HANDLE ERROR ===');
        console.error('Status:', error instanceof HttpErrorResponse ? error.status : 'Timeout');

        // Repassa o erro original para o componente tratar
        return throwError(() => error);
    }

    registrar(nome: string, email: string, senha: string) {
    const body = { nome, email, senha };

    return this.apiService.post('auth/registrar', body).pipe(
        map(response => response),
        catchError(this.handleError)
    );
}
}
