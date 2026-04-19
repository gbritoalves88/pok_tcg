import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartaService } from '../../services/carta.service';
import { CartaCatalogo } from '../../models/carta.model';

interface Carta {
  nome: string;
  colecao: string;
  numero: string;
  raridade: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  userName: string = '';
  previewUrl: string | null = null;
  selectedFile: File | null = null;
  isLoading = false;
  errorMessage = '';
  cards: Carta[] = [];

  // Modal
  modalSucesso = false;
  modalErro = false;
  cartaReconhecida: CartaCatalogo | null = null;
  confiancaTexto = '';
  mensagemErro = '';

  constructor(private router: Router, private cartaService: CartaService) {}

  ngOnInit() {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      const usuario = JSON.parse(usuarioSalvo);
      this.userName = usuario.nome;
      this.loadCards();
    } else {
      this.logout();
    }
  }

  logout() {
    this.router.navigate(['/login']);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string;
        console.log('Preview carregado'); // Debug
      };
      reader.readAsDataURL(this.selectedFile);
      this.errorMessage = '';
    }
  }

  recognizeCards() {
    console.log('Iniciando reconhecimento...'); // Debug
    console.log('selectedFile:', this.selectedFile);
    console.log('previewUrl:', this.previewUrl ? 'tem preview' : 'sem preview');

    if (!this.selectedFile) {
      console.log('Sem arquivo selecionado');
      return;
    }

    if (!this.previewUrl) {
      console.log('Sem preview');
      this.errorMessage = 'Erro ao carregar imagem. Tente novamente.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const imagemBase64 = this.previewUrl;

    this.cartaService.reconhecerCarta(imagemBase64).subscribe({
      next: (response) => {
        console.log('Resposta recebida:', response);
        this.isLoading = false;

        if (response.encontrada && response.carta) {
          this.cartaReconhecida = response.carta;

          if (response.confianca === 'excelente') {
            this.confiancaTexto = 'Alta ⭐⭐⭐';
          } else if (response.confianca === 'boa') {
            this.confiancaTexto = 'Média ⭐⭐';
          } else {
            this.confiancaTexto = 'Baixa ⭐';
          }

          console.log('Abrindo modal de sucesso');
          this.modalSucesso = true;
        } else {
          this.mensagemErro = response.mensagem || 'Não foi possível identificar a carta. Tente outra foto.';
          console.log('Abrindo modal de erro:', this.mensagemErro);
          this.modalErro = true;
        }
      },
      error: (err) => {
        console.error('Erro na requisição:', err);
        this.isLoading = false;
        this.mensagemErro = 'Erro ao reconhecer carta. Tente novamente.';
        this.modalErro = true;
      }
    });
  }

  adicionarCarta() {
    // TODO: Implementar adição à coleção
    console.log('Adicionando carta:', this.cartaReconhecida);
    this.fecharModalSucesso();
  }

  fecharModalSucesso() {
    console.log('Fechando modal sucesso');
    this.modalSucesso = false;
    this.cartaReconhecida = null;
    this.previewUrl = null;
    this.selectedFile = null;
    this.isLoading = false;
    this.errorMessage = '';

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  fecharModalErro() {
    console.log('Fechando modal erro');
    this.modalErro = false;
    this.mensagemErro = '';
    this.previewUrl = null;
    this.selectedFile = null;
    this.isLoading = false;

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  loadCards() {
    // TODO: Carregar cartas do usuário do backend
  }

}
