// app/components/bottom-nav/bottom-nav.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bottom-nav">
      <div class="nav-container">
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
          <div class="nav-icon">🏠</div>
          <span class="nav-label">Dashboard</span>
        </a>

        <a routerLink="/catalogo" routerLinkActive="active" class="nav-item">
          <div class="nav-icon">📋</div>
          <span class="nav-label">Catálogo</span>
        </a>

        <a routerLink="/perfil" routerLinkActive="active" class="nav-item">
          <div class="nav-icon">👤</div>
          <span class="nav-label">Perfil</span>
        </a>
      </div>
    </nav>
  `,
  styles: [`
    .bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: white;
      border-radius: 20px 20px 0 0;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
      z-index: 100;
      padding: 8px 0 16px 0;
    }

    .nav-container {
      display: flex;
      justify-content: space-around;
      align-items: center;
      max-width: 500px;
      margin: 0 auto;
    }

    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-decoration: none;
      color: #999;
      transition: all 0.3s ease;
      padding: 8px 16px;
      border-radius: 12px;
    }

    .nav-item.active {
      color: #667eea;
      background: rgba(102, 126, 234, 0.1);
    }

    .nav-icon {
      font-size: 24px;
      margin-bottom: 4px;
    }

    .nav-label {
      font-size: 12px;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .bottom-nav {
        padding: 6px 0 12px 0;
      }

      .nav-item {
        padding: 6px 12px;
      }

      .nav-icon {
        font-size: 22px;
      }

      .nav-label {
        font-size: 10px;
      }
    }
  `]
})
export class BottomNavComponent {
  constructor(private router: Router) {}
}
