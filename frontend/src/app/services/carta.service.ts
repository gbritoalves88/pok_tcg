// carta.service.ts
import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, throwError, TimeoutError } from "rxjs";
import { Router } from "@angular/router";
import { ReconhecerRequest, ReconhecerResponse } from "../models/carta.model";
import { ApiService } from "../services/api.service";

@Injectable({
    providedIn: 'root'
})
export class CartaService {
    constructor(
        private apiService: ApiService,
        private router: Router
    ) {}

    /**
     * Reconhece uma carta a partir de uma imagem em base64
     * @param imagemBase64 - imagem no formato data:image/png;base64,...
     */
    reconhecerCarta(imagemBase64: string) {
        const body: ReconhecerRequest = { imagem_base64: imagemBase64 };

        return this.apiService.post<ReconhecerResponse>('reconhecer/carta', body).pipe(
            map(response => response),
            catchError(this.handleError)
        );
    }

    /**
     * Adiciona uma carta reconhecida à coleção do usuário
     * @param cartaId - ID da carta no catálogo
     * @param imagemOriginalBase64 - imagem original enviada pelo usuário
     * @param condicao - condição da carta (opcional)
     * @param observacao - observação (opcional)
     */
    adicionarCartaColecao(cartaId: string, imagemOriginalBase64: string, condicao?: string, observacao?: string) {
        const body = {
            carta_id: cartaId,
            imagem_original_base64: imagemOriginalBase64,
            condicao: condicao || '',
            observacao: observacao || ''
        };

        return this.apiService.post('/usuarios/cartas', body).pipe(
            map(response => response),
            catchError(this.handleError)
        );
    }

    /**
     * Busca todas as cartas do usuário logado
     */
    buscarMinhasCartas() {
        return this.apiService.get('/usuarios/cartas').pipe(
            map(response => response),
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse | TimeoutError) {
        if (error instanceof TimeoutError) {
            console.error('Request timeout occurred');
            return throwError(() => new Error('Tempo de requisição excedido. Tente novamente.'));
        }
        console.error(`Erro na API: ${error.message}`);
        return throwError(() => new Error('Erro na comunicação com a API'));
    }
}
