// app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  standalone: true,
  imports: [RouterOutlet]
})
export class AppComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Verifica se o token é válido ao iniciar
    if (this.authService.isAutenticado()) {
      // Token existe, verifica se é válido no backend
      this.authService.validarTokenNoBackend().subscribe({
        next: () => {
          // Token válido, mantém na dashboard
          console.log('Token válido');
        },
        error: () => {
          // Token inválido, faz logout
          console.log('Token inválido');
          this.authService.logout();
        }
      });
    }
  }
}
