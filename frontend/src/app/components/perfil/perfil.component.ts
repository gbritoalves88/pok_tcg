// app/components/perfil/perfil.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="perfil-container">
      <header class="header">
        <button class="btn-back" (click)="voltar()">← Voltar</button>
        <div class="logo">👤 Meu Perfil</div>
        <div class="placeholder"></div>
      </header>

      <main class="main-content">
        <div class="perfil-card">
          <div class="avatar">
            <div class="avatar-icon">🐱‍👤</div>
          </div>

          <div class="info-section">
            <div class="info-item">
              <span class="info-label">Nome</span>
              <span class="info-value">{{ usuario?.nome || 'Carregando...' }}</span>
            </div>

            <div class="info-item">
              <span class="info-label">Email</span>
              <span class="info-value">{{ usuario?.email || 'Carregando...' }}</span>
            </div>

            <div class="info-item">
              <span class="info-label">Status</span>
              <span class="info-value" [class.ativo]="usuario?.ativo" [class.inativo]="!usuario?.ativo">
                {{ usuario?.ativo ? '✅ Ativo' : '❌ Inativo' }}
              </span>
            </div>

            <div class="info-item">
              <span class="info-label">Perfil</span>
              <span class="info-value">{{ usuario?.admin ? 'Administrador' : 'Usuário' }}</span>
            </div>
          </div>

          <button class="btn-logout" (click)="logout()">
            🚪 Sair da conta
          </button>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .perfil-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding-bottom: 80px;
    }

    .header {
      background: white;
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .logo {
      font-size: 18px;
      font-weight: bold;
      color: #667eea;
    }

    .btn-back {
      background: #667eea;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
    }

    .placeholder {
      width: 60px;
    }

    .main-content {
      max-width: 500px;
      margin: 0 auto;
      padding: 20px;
    }

    .perfil-card {
      background: white;
      border-radius: 24px;
      padding: 32px;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }

    .avatar {
      margin-bottom: 24px;
    }

    .avatar-icon {
      font-size: 80px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      width: 120px;
      height: 120px;
      border-radius: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      font-size: 60px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    .info-section {
      text-align: left;
      margin: 24px 0;
    }

    .info-item {
      padding: 12px 0;
      border-bottom: 1px solid #eee;
    }

    .info-label {
      font-size: 12px;
      color: #999;
      display: block;
      margin-bottom: 4px;
    }

    .info-value {
      font-size: 16px;
      color: #333;
      font-weight: 500;
    }

    .info-value.ativo {
      color: #27ae60;
    }

    .info-value.inativo {
      color: #e74c3c;
    }

    .btn-logout {
      background: #e74c3c;
      color: white;
      border: none;
      padding: 14px 24px;
      border-radius: 30px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      width: 100%;
      transition: all 0.2s;
    }

    .btn-logout:hover {
      background: #c0392b;
      transform: scale(1.02);
    }
  `]
})
export class PerfilComponent implements OnInit {
  usuario: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.isAutenticado()) {
      this.router.navigate(['/login']);
      return;
    }

    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      this.usuario = JSON.parse(usuarioSalvo);
    }
  }

  voltar() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    this.authService.logout();
  }
}
