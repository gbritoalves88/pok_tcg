// app/components/catalogo/catalogo.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartaService } from '../../services/carta.service';
import { AuthService } from '../../services/auth.service';
import { BottomNavComponent } from '../bottom-nav/bottom-nav.component';

interface CartaCatalogo {
  _id?: string;
  id: string;
  nome: string;
  set_id: string;
  set_nome: string;
  hash: string;
  imagem_url: string;
}

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule, BottomNavComponent],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {
  cartasCatalogo: CartaCatalogo[] = [];
  cartasFiltradas: CartaCatalogo[] = [];
  termoBusca: string = '';
  isLoading = true;
  errorMessage = '';
  mensagemSucesso: string = '';

  constructor(
    private cartaService: CartaService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (!this.authService.isAutenticado()) {
      this.router.navigate(['/login']);
      return;
    }
    this.carregarCatalogo();
  }

  carregarCatalogo() {
    this.isLoading = true;

    this.cartaService.buscarCatalogo().subscribe({
      next: (response: any) => {
        console.log('Catálogo recebido:', response);
        this.cartasCatalogo = Array.isArray(response) ? response : [];
        this.cartasFiltradas = [...this.cartasCatalogo];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar catálogo:', err);
        this.errorMessage = err.error?.detail || 'Erro ao carregar catálogo de cartas.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  filtrarCartas() {
    if (!this.termoBusca || this.termoBusca.trim() === '') {
      this.cartasFiltradas = [...this.cartasCatalogo];
      return;
    }

    const termo = this.termoBusca.toLowerCase().trim();
    this.cartasFiltradas = this.cartasCatalogo.filter(carta => {
      return (
        carta.nome.toLowerCase().includes(termo) ||
        carta.set_nome.toLowerCase().includes(termo) ||
        carta.id.toLowerCase().includes(termo)
      );
    });
  }

  limparFiltro() {
    this.termoBusca = '';
    this.cartasFiltradas = [...this.cartasCatalogo];
  }

  // ← ADICIONE ESTE MÉTODO
  adicionarAoColecao(carta: CartaCatalogo) {
    // Adiciona a carta com quantidade 1 e condição padrão
    this.cartaService.adicionarCartaColecao(
      carta.id,
      'media',
      `Adicionada do catálogo`,
      1
    ).subscribe({
      next: (response) => {
        console.log('Carta adicionada:', response);
        this.mensagemSucesso = `✅ ${carta.nome} adicionada à sua coleção!`;

        // Remove a mensagem após 3 segundos
        setTimeout(() => {
          this.mensagemSucesso = '';
          this.cdr.detectChanges();
        }, 3000);

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao adicionar:', err);
        this.errorMessage = err.error?.detail || `❌ Erro ao adicionar ${carta.nome}`;

        setTimeout(() => {
          this.errorMessage = '';
          this.cdr.detectChanges();
        }, 3000);

        this.cdr.detectChanges();
      }
    });
  }

  voltar() {
    this.router.navigate(['/dashboard']);
  }
}
