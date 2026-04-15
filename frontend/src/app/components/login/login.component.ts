import { LoginService } from '../../services/login.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() {
    return this.loginForm.get('email')?.value;
  }

  get senha() {
    return this.loginForm.get('senha')?.value;
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;

    const email = this.email;
    const senha = this.senha;

    this.loginService.autenticarUsuario(email, senha).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.access_token);
        this.buscarUsuarioLogado();
      },
      error: (err) => {
        this.isLoading = false;


        if (err.status === 401) {
          alert('❌ Email ou senha incorretos');
        } else if (err.status === 422) {
          alert('❌ Dados inválidos. Verifique o formato.');
        } else if (err.status === 0) {
          alert('❌ Erro de conexão com o servidor.');
        } else {
          alert('❌ Email ou senha inválidos');
        }
      }
    });
  }

  buscarUsuarioLogado() {
    this.loginService.buscarUsuarioLogado().subscribe({
      next: (usuario) => {
        this.isLoading = false;
        if (usuario?.ativo === true) {
          localStorage.setItem('usuario', JSON.stringify(usuario));
          this.router.navigate(['/dashboard']);
        } else {
          alert('❌ Usuário inativo. Aguarde ativação pelo administrador.');
          this.loginService.logout();
        }
      },
      error: (err) => {
        this.isLoading = false;
        alert('❌ Erro ao carregar dados do usuário.');
        this.loginService.logout();
      }
    });
  }

  goToRegister(event: Event) {
    event.preventDefault();
    this.router.navigate(['/registro']);
  }
}
