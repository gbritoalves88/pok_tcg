import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  registroForm: FormGroup;
  isLoading = false;
  mensagem = '';
  mensagemTitulo = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService
  ) {
    this.registroForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get nome() {
    return this.registroForm.get('nome')?.value;
  }

  get email() {
    return this.registroForm.get('email')?.value;
  }

  get senha() {
    return this.registroForm.get('senha')?.value;
  }

  onSubmit() {
    if (this.registroForm.invalid) return;

    this.isLoading = true;
    this.mensagem = '';

    const nome = this.nome;
    const email = this.email;
    const senha = this.senha;

    this.loginService.registrar(nome, email, senha).subscribe({
      next: (response) => {
        console.log('Registro realizado com sucesso:', response);
        this.mensagemTitulo = 'Cadastro realizado!';
        this.mensagem = 'Usuário cadastrado com sucesso. Aguarde ativação pelo administrador.';
        this.isLoading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Erro no registro:', err);
        this.mensagemTitulo = 'Erro no cadastro';

        let errorMsg = 'Erro ao realizar cadastro. Tente novamente.';
        if (err.status === 400) {
          errorMsg = 'Email já cadastrado. Utilize outro email.';
        } else if (err.error?.detail) {
          errorMsg = err.error.detail;
        }

        this.mensagem = errorMsg;
        this.isLoading = false;
      }
    });
  }

  fecharModal() {
    this.mensagem = '';
    if (this.mensagemTitulo === 'Cadastro realizado!') {
      this.router.navigate(['/login']);
    }
  }

  goToLogin(event: Event) {
    event.preventDefault();
    this.router.navigate(['/login']);
  }
}
