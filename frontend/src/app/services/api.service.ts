import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { environment } from '../../environment/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl: string = environment.endpoint;

  constructor(private http: HttpClient,
              private router: Router
  ) {}



  get<T>(endpoint: string, customTimeout?: number): Observable<T> {
    const timeoutMs = customTimeout || 120000;
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`).pipe(
      timeout(timeoutMs),
      catchError((err) => this.handleError(err))
    );
  }

  post<T>(endpoint: string, body: any, options?: { headers?: HttpHeaders }): Observable<T> {
    const headers =
      options?.headers ||
      (body instanceof FormData
        ? undefined
        : new HttpHeaders({ 'Content-Type': 'application/json' }));

    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body, { headers }).pipe(
      catchError((err) => this.handleError(err))
    );
  }



  put<T>(endpoint: string, id: number, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}/${id}`, body).pipe(
      catchError((err) => this.handleError(err))
    );
  }


  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  private handleError(error: HttpErrorResponse | TimeoutError) {
    if (error instanceof TimeoutError) {
      console.error('Request timeout occurred');
      return throwError(() => new Error('Tempo de requisição excedido. Tente novamente.'));
    }
    const msg = this.extractErrorMessage(error);
    console.error(`Erro na API: ${msg}`);
    return throwError(() => new Error(msg));
  }

  private extractErrorMessage(error: HttpErrorResponse): string {
    const body = error.error;
    if (body && typeof body === 'object') {
      if (typeof body.detail === 'string') return body.detail;
      if (typeof body.message === 'string') return body.message;
    }
    if (body && typeof body === 'string') return body;
    return error.message || 'Erro na comunicação com a API';
  }
}
