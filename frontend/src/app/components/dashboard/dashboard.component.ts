import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartaService } from '../../services/carta.service';
import { CartaCatalogo, CartaUsuario, ReconhecerResponse } from '../../models/carta.model';
import { AuthService } from '../../services/auth.service';
import { timer } from 'rxjs';

interface Carta {
  id?: string;
  carta_id?: string;
  nome: string;
  colecao: string;
  numero: string;
  raridade: string;
  imagem_url?: string;
  condicao?: string;
  quantidade: number;
  data_adicao?: string;
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
  @ViewChild('cropImage') cropImage!: ElementRef<HTMLImageElement>;
  @ViewChild('edgeCanvas') edgeCanvas!: ElementRef<HTMLCanvasElement>;

  userName: string = '';
  previewUrl: string | null = null;
  selectedFile: File | null = null;
  isLoading = false;
  errorMessage = '';
  cards: Carta[] = [];
  cartaParaAdicionar: Partial<CartaUsuario> = {};

  // Modal
  modalSucesso = false;
  modalErro = false;
  cartaReconhecida: CartaCatalogo | null = null;
  confiancaTexto = '';
  mensagemErro = '';
  mensagemSucesso = '';

  // Camera e imagem
  cameraFacing: string = 'environment';
  flashAtivado = false;
  modoCamera = false;
  mostrarOpcoesCamera = false;

  // Zoom e Crop
  zoomLevel: number = 1;
  modoCrop: boolean = false;

  // Timer
  timerAtivo = false;
  timerContagem = 3;

  // Detecção de bordas
  detectarBordas = false;
  mensagemBordas = '';

  // Tempo restante
  tempoRestante: number = 0;
  private interval: any;

  constructor(
    private router: Router,
    private cartaService: CartaService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      const usuario = JSON.parse(usuarioSalvo);
      this.userName = usuario.nome;
      this.loadCards();
      this.iniciarContadorTempo();
    } else {
      this.logout();
    }
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  // ========== CONTADOR DE TEMPO ==========
  iniciarContadorTempo() {
    this.interval = setInterval(() => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const agora = Math.floor(Date.now() / 1000);
          this.tempoRestante = payload.exp - agora;

          if (this.tempoRestante <= 0) {
            this.authService.logout();
          }
        } catch (e) {}
      }
    }, 1000);
  }

  // ========== FEEDBACK HÁPTICO (VIBRAÇÃO) ==========
  vibrar(duracao: number | number[]) {
    if ('vibrate' in navigator) {
      navigator.vibrate(duracao);
    }
  }

  // ========== CÂMERA ==========
  tirarFoto() {
    this.vibrar(50);
    this.modoCamera = true;
    this.mostrarOpcoesCamera = true;
    setTimeout(() => {
      this.cameraInput.nativeElement.click();
    }, 100);
  }

  switchCamera() {
    this.vibrar(30);
    this.cameraFacing = this.cameraFacing === 'environment' ? 'user' : 'environment';
    this.cameraInput.nativeElement.setAttribute('capture', this.cameraFacing);
  }

  toggleFlash() {
    this.flashAtivado = !this.flashAtivado;
    this.vibrar(20);
    // Nota: Flash não é suportado diretamente via HTML, é apenas indicativo visual
  }

  startTimer() {
    this.vibrar(30);
    this.timerAtivo = true;
    this.timerContagem = 3;

    const interval = setInterval(() => {
      this.timerContagem--;
      this.vibrar(10);
      this.cdr.detectChanges();

      if (this.timerContagem === 0) {
        clearInterval(interval);
        this.timerAtivo = false;
        this.tirarFoto();
      }
    }, 1000);
  }

  fecharGuia() {
    this.modoCamera = false;
    this.mostrarOpcoesCamera = false;
  }

  // ========== ZOOM ==========
  zoomIn() {
    this.zoomLevel = Math.min(this.zoomLevel + 0.1, 3);
    this.vibrar(10);
  }

  zoomOut() {
    this.zoomLevel = Math.max(this.zoomLevel - 0.1, 0.5);
    this.vibrar(10);
  }

  // ========== CROP ==========
  iniciarCrop() {
    this.vibrar(50);
    this.modoCrop = true;
  }

  confirmarCrop() {
    this.vibrar(100);
    // Aqui você implementaria a lógica de crop real
    // Por simplicidade, vamos apenas fechar o modal
    this.modoCrop = false;
    this.mensagemSucesso = '✂️ Imagem recortada!';
    setTimeout(() => {
      this.mensagemSucesso = '';
    }, 2000);
  }

  cancelarCrop() {
    this.vibrar(30);
    this.modoCrop = false;
  }

  // ========== AJUSTE DE BRILHO ==========
  ajustarBrilho() {
    this.vibrar(20);
    // Simulação de ajuste de brilho
    this.detectarBordas = true;
    this.analisarQualidadeImagem();
  }

  // ========== DETECÇÃO DE BORDAS E QUALIDADE ==========
  analisarQualidadeImagem() {
    if (!this.previewUrl) return;

    const img = new Image();
    img.onload = () => {
      this.mensagemBordas = this.avaliarQualidade(img);
      this.cdr.detectChanges();

      setTimeout(() => {
        this.detectarBordas = false;
      }, 3000);
    };
    img.src = this.previewUrl;
  }

  avaliarQualidade(img: HTMLImageElement): string {
    // Análise simples da imagem
    const tamanho = this.selectedFile?.size || 0;
    const largura = img.width;
    const altura = img.height;

    if (largura < 500 || altura < 700) {
      return '⚠️ Imagem pequena. Aproxime a carta para melhor reconhecimento.';
    }
    if (tamanho > 5 * 1024 * 1024) {
      return '📦 Imagem muito grande. Vamos comprimir para melhor performance.';
    }
    if (largura > 2000 || altura > 2000) {
      return '🔄 Imagem muito grande. Reduzindo para melhor processamento...';
    }

    return '✅ Boa qualidade! A carta está bem posicionada.';
  }

  // ========== COMPRESSÃO DE IMAGEM ==========
  compressImage(file: File, maxSizeMB: number = 1): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          const maxDimension = 1024;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height * maxDimension) / width;
              width = maxDimension;
            } else {
              width = (width * maxDimension) / height;
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            const blobReader = new FileReader();
            blobReader.readAsDataURL(blob!);
            blobReader.onloadend = () => {
              resolve(blobReader.result as string);
            };
          }, 'image/jpeg', 0.8);
        };
      };
      reader.onerror = reject;
    });
  }

  // ========== ON FILE SELECTED ==========
  async onFileSelected(event: Event) {
    this.vibrar(50);
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      // Compressão automática
      const compressedBase64 = await this.compressImage(this.selectedFile);
      this.previewUrl = compressedBase64;

      this.modoCamera = false;
      this.mostrarOpcoesCamera = false;
      this.zoomLevel = 1;
      this.errorMessage = '';

      // Analisa qualidade
      setTimeout(() => this.analisarQualidadeImagem(), 500);

      this.cdr.detectChanges();
    }
  }

  limparPreview() {
    this.vibrar(30);
    this.previewUrl = null;
    this.selectedFile = null;
    this.errorMessage = '';
    this.detectarBordas = false;
    this.zoomLevel = 1;

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }

    if (this.cameraInput) {
      this.cameraInput.nativeElement.value = '';
    }

    this.cdr.detectChanges();
  }

  // ========== RECONHECIMENTO ==========
  recognizeCards() {
    if (!this.selectedFile || !this.previewUrl) {
      this.errorMessage = 'Selecione uma foto primeiro!';
      this.cdr.detectChanges();
      return;
    }

    this.vibrar(100);
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.cartaService.reconhecerCarta(this.previewUrl).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.vibrar(200);

        if (response.encontrada && response.carta) {
          this.cartaReconhecida = response.carta;

          if (response.confianca === 'excelente') {
            this.confiancaTexto = 'Alta ⭐⭐⭐';
          } else if (response.confianca === 'boa') {
            this.confiancaTexto = 'Média ⭐⭐';
          } else {
            this.confiancaTexto = 'Baixa ⭐';
          }

          this.cartaParaAdicionar = {
            carta_id: response.carta.id,
            condicao: response.confianca || 'media',
            observacao: `Reconhecida com confiança`,
            quantidade: 1,
            nome_carta: response.carta.nome,
            imagem_url: response.carta.imagem_url
          };

          this.modalSucesso = true;
          this.cdr.detectChanges();
        } else {
          this.vibrar([100, 50, 100]);
          this.mensagemErro = response.mensagem || 'Não foi possível identificar a carta.';
          this.modalErro = true;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Erro na requisição:', err);
        this.isLoading = false;
        this.vibrar([100, 50, 100]);
        this.mensagemErro = 'Erro ao reconhecer carta. Tente novamente.';
        this.modalErro = true;
        this.cdr.detectChanges();
      }
    });
  }

  // ========== CARTAS ==========
  adicionarCarta() {
    this.cartaService.adicionarCartaColecao(
      this.cartaParaAdicionar?.carta_id,
      this.cartaParaAdicionar?.condicao,
      this.cartaParaAdicionar.observacao,
      this.cartaParaAdicionar?.quantidade
    ).subscribe({
      next: () => {
        this.isLoading = false;
        this.vibrar(100);
        this.fecharModalSucesso();
        this.loadCards();
        this.mensagemSucesso = '✅ Carta adicionada à coleção!';
        setTimeout(() => { this.mensagemSucesso = ''; }, 2000);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro na requisição:', err);
        this.isLoading = false;
        this.vibrar([100, 50, 100]);
        this.mensagemErro = 'Erro ao adicionar carta à coleção.';
        this.modalErro = true;
        this.cdr.detectChanges();
      }
    });
  }

  incrementarQuantidade(card: Carta) {
    this.cartaService.adicionarCartaColecao(
      card.carta_id || card.id || '',
      card.condicao || 'media',
      'Adicionada +1 via dashboard',
      1
    ).subscribe({
      next: () => {
        this.mensagemSucesso = `✅ +1 cópia de ${card.nome}!`;
        setTimeout(() => { this.mensagemSucesso = ''; }, 2000);
        this.loadCards();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro:', err);
        this.mensagemErro = 'Erro ao adicionar mais uma cópia.';
        this.modalErro = true;
        this.cdr.detectChanges();
      }
    });
  }

  decrementarQuantidade(card: Carta) {
    this.cartaService.removerCarta(card.carta_id || card.id || '').subscribe({
      next: () => {
        this.mensagemSucesso = `✅ -1 cópia de ${card.nome}!`;
        setTimeout(() => { this.mensagemSucesso = ''; }, 2000);
        this.loadCards();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro:', err);
        this.mensagemErro = 'Erro ao remover uma cópia.';
        this.modalErro = true;
        this.cdr.detectChanges();
      }
    });
  }

  cartaNaoIdentificada() {
    this.mensagemErro = 'Obrigado pelo feedback! Vamos melhorar nosso sistema, tente incluir outra foto!';
    this.fecharModalSucesso();
    this.modalErro = true;
    this.cdr.detectChanges();
  }

  loadCards() {
    this.isLoading = true;

    this.cartaService.buscarMinhasCartas().subscribe({
      next: (response: any) => {
        console.log('Resposta do backend:', response);
        const cartas = Array.isArray(response) ? response : [];

        this.cards = cartas.map((carta: any) => ({
          id: carta.id,
          carta_id: carta.carta_id,
          nome: carta.nome || 'Carta sem nome',
          colecao: carta.set_nome || 'Coleção desconhecida',
          numero: carta.carta_id ? carta.carta_id.split('-')[1] : '---',
          raridade: this.getRaridadeTexto(carta.condicao),
          imagem_url: carta.imagem_url,
          condicao: carta.condicao,
          quantidade: carta.quantidade || 1,
          data_adicao: carta.data_adicao
        }));

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erro ao carregar cartas:', err);
        this.isLoading = false;
        this.errorMessage = 'Erro ao carregar suas cartas. Tente novamente.';
        this.cdr.detectChanges();
      }
    });
  }

  getRaridadeTexto(condicao: string): string {
    const raridadeMap: { [key: string]: string } = {
      'excelente': 'Lendária ⭐⭐⭐',
      'boa': 'Rara ⭐⭐',
      'media': 'Comum ⭐',
      'near mint': 'Mint ⭐⭐⭐',
      'mint': 'Mint ⭐⭐⭐'
    };
    return raridadeMap[condicao?.toLowerCase()] || 'Comum';
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
    this.detectarBordas = false;

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }

    if (this.cameraInput) {
      this.cameraInput.nativeElement.value = '';
    }

    this.cdr.detectChanges();
  }

  logout() {
    this.authService.logout();
  }
}
