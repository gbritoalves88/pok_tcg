import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
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
  @ViewChild('cameraInput') cameraInput!: ElementRef<HTMLInputElement>;

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

  constructor(
    private router: Router,
    private cartaService: CartaService,
    private cdr: ChangeDetectorRef
  ) {}

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

  openCamera() {
    if (this.cameraInput) {
      this.cameraInput.nativeElement.click();
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string;

        this.cdr.detectChanges();
      };
      reader.readAsDataURL(this.selectedFile);
      this.errorMessage = '';
      this.cdr.detectChanges(); // ✅ Força atualização imediata
    }
  }

  // ✅ MÉTODO CORRIGIDO - Limpar preview
  limparPreview() {
    this.previewUrl = null;
    this.selectedFile = null;
    this.errorMessage = '';

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }

    if (this.cameraInput) {
      this.cameraInput.nativeElement.value = '';
    }

    this.cdr.detectChanges(); // ✅ Força atualização da UI
    console.log('Preview limpo, UI atualizada');
  }

  recognizeCards() {

    if (!this.selectedFile) {
      console.log('Sem arquivo selecionado');
      this.errorMessage = 'Selecione uma foto primeiro!';
      this.cdr.detectChanges();
      return;
    }

    if (!this.previewUrl) {
      console.log('Sem preview');
      this.errorMessage = 'Erro ao carregar imagem. Tente novamente.';
      this.cdr.detectChanges();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    const imagemBase64 = this.previewUrl;

    this.cartaService.reconhecerCarta(imagemBase64).subscribe({
      next: (response) => {
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

          this.modalSucesso = true;
          this.cdr.detectChanges();

        } else {
          this.mensagemErro = response.mensagem || 'Não foi possível identificar a carta. Tente outra foto.';
          console.log('Abrindo modal de erro');
          this.modalErro = true;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Erro na requisição:', err);
        this.isLoading = false;
        this.mensagemErro = 'Erro ao reconhecer carta. Tente novamente.';
        this.modalErro = true;
        this.cdr.detectChanges();
      }
    });
  }

  adicionarCarta() {
    this.fecharModalSucesso();
  }

  cartaNaoIdentificada() {
    this.mensagemErro = 'Obrigado pelo feedback! Vamos melhorar nosso sistema, tente incluir outra foto!';
    this.fecharModalSucesso();
    this.modalErro = true;
    this.cdr.detectChanges();
  }

  fecharModalSucesso() {
    this.modalSucesso = false;
    this.cartaReconhecida = null;
    this.previewUrl = null;
    this.selectedFile = null;
    this.isLoading = false;
    this.errorMessage = '';

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }

    if (this.cameraInput) {
      this.cameraInput.nativeElement.value = '';
    }

    this.cdr.detectChanges();
  }

  fecharModalErro() {
    this.modalErro = false;
    this.mensagemErro = '';
    this.previewUrl = null;
    this.selectedFile = null;
    this.isLoading = false;

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }

    if (this.cameraInput) {
      this.cameraInput.nativeElement.value = '';
    }

    this.cdr.detectChanges();
  }

  loadCards() {
    // TODO: Carregar cartas do usuário do backend
  }
}
