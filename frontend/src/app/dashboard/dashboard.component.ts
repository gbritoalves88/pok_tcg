import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
  userName: string = '';
  previewUrl: string | null = null;
  selectedFile: File | null = null;
  isLoading = false;
  errorMessage = '';
  cards: Carta[] = [];

  constructor(private router: Router) {}


  ngOnInit() {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
        const usuario = JSON.parse(usuarioSalvo);
        this.userName  = usuario.nome;

        this.loadCards();
    } else {

      this.logout();
    }
  }


  logout() {
    // TODO: Remover token
    this.router.navigate(['/login']);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      // Preview da imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);

      this.errorMessage = '';
    }
  }

  recognizeCards() {
    if (!this.selectedFile) return;

    this.isLoading = true;
    this.errorMessage = '';

    // TODO: Enviar imagem para backend
    console.log('Reconhecendo cartas...', this.selectedFile);

    // Simulação de resposta
    setTimeout(() => {
      this.isLoading = false;

      // Mock de cartas reconhecidas
      const novasCartas: Carta[] = [
        { nome: 'Charizard', colecao: 'Base Set', numero: '4/102', raridade: 'rara' },
        { nome: 'Pikachu', colecao: 'Base Set', numero: '58/102', raridade: 'comum' },
        { nome: 'Mewtwo', colecao: 'Base Set', numero: '10/102', raridade: 'rara' }
      ];

      this.cards = [...this.cards, ...novasCartas];
      this.previewUrl = null;
      this.selectedFile = null;
    }, 2000);
  }

  loadCards() {
    // TODO: Carregar cartas do usuário do backend
    // Mock
    this.cards = [
      { nome: 'Charizard', colecao: 'Base Set', numero: '4/102', raridade: 'rara' },
      { nome: 'Blastoise', colecao: 'Base Set', numero: '2/102', raridade: 'rara' },
      { nome: 'Venusaur', colecao: 'Base Set', numero: '15/102', raridade: 'rara' }
    ];
  }
}
