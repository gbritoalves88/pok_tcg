// app/app.component.ts - versão simplificada
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
    // Apenas verifica se o token existe, não valida no backend
    if (this.authService.isAutenticado()) {
      // Token existe, mantém na dashboard
      console.log('Usuário autenticado');
    }
  }
}
