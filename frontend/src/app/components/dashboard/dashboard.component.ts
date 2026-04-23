import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartaService } from '../../services/carta.service';
import { CartaCatalogo, CartaUsuario, ReconhecerResponse } from '../../models/carta.model';
import { AuthService } from '../../services/auth.service';



interface Carta {
  id?: string;
  carta_id: string,
  nome: string;
  colecao: string;
  numero: string;
  raridade: string;
  imagem_url?: string;
  condicao?: string;
  quantidade?: number;
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
  mensagemSucesso: string = '';

  constructor(
    private router: Router,
    private cartaService: CartaService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {}

  ngOnInit() {

    if (!this.authService.isAutenticado()) {
      this.router.navigate(['/login']);
      return;
    }

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


     this.cartaService.adicionarCartaColecao(this.cartaParaAdicionar?.carta_id, this.cartaParaAdicionar?.condicao , this.cartaParaAdicionar.observacao , this.cartaParaAdicionar?.quantidade).subscribe({
      next: (response) => {
        this.isLoading = false;

          this.fecharModalSucesso();
          this.loadCards();
          this.cdr.detectChanges();


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

  incrementarQuantidade(card: Carta) {
  // Usa o mesmo método de adicionar carta (backend já soma a quantidade)
  this.cartaService.adicionarCartaColecao(
    card.carta_id || card.carta_id || '',  // ID da carta
    card.condicao || 'media',        // Condição existente
    `Adicionada +1 via dashboard`,   // Observação
    1                                 // Quantidade a adicionar (soma +1)
  ).subscribe({
    next: (response: any) => {
      console.log('Carta adicionada/incrementada:', response);

      // Atualiza a quantidade localmente
      const novaQuantidade = (card.quantidade || 1) + 1;
      card.quantidade = novaQuantidade;

      // Mostra mensagem de sucesso
      this.mostrarMensagemTemporaria(`✅ ${card.nome} agora tem ${novaQuantidade} cópias!`);

      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Erro ao adicionar carta:', err);
      this.mensagemErro = err.error?.detail || 'Erro ao adicionar mais uma cópia.';
      this.modalErro = true;
      this.cdr.detectChanges();
    }
  });
}

decrementarQuantidade(card: Carta) {

  if (confirm(`Deseja remover ${card.nome} da sua coleção?`)) {

    this.cartaService.removerCarta(card.carta_id || card.id || '').subscribe({
      next: () => {
        console.log('Carta removida:', card);

        // Remove da lista local
        this.cards = this.cards.filter(c => c.id !== card.id);

        this.mostrarMensagemTemporaria(`🗑️ ${card.nome} removida da coleção!`);
        this.loadCards();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao remover carta:', err);
        this.mensagemErro = err.error?.detail || 'Erro ao remover carta.';
        this.modalErro = true;
        this.cdr.detectChanges();
      }
    });
  }

}

mostrarMensagemTemporaria(mensagem: string) {
  this.mensagemSucesso = mensagem;
  this.cdr.detectChanges();

  setTimeout(() => {
    this.mensagemSucesso = '';
    this.cdr.detectChanges();
  }, 2000);
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
  this.isLoading = true;

  this.cartaService.buscarMinhasCartas().subscribe({
    next: (response: any) => {
      console.log('Resposta do backend:', response);

      // O backend retorna diretamente um array (conforme seu exemplo)
      // [{"id": "...", "carta_id": "...", ...}]
      const cartas = Array.isArray(response) ? response : [];

      if (cartas.length === 0) {
        console.log('Nenhuma carta encontrada');
        this.cards = [];
        this.isLoading = false;
        this.cdr.detectChanges();
        return;
      }

      this.cards = cartas.map((carta: any) => ({
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

      console.log('Cartas processadas:', this.cards);
      this.isLoading = false;
      this.cdr.detectChanges();
    },
    error: (err: any) => {
      console.error('Erro ao carregar cartas:', err);
      this.isLoading = false;
      this.errorMessage = err.message || 'Erro ao carregar suas cartas. Tente novamente.';
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

}
