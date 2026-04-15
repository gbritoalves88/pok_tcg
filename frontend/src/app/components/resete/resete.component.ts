import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-resete',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './resete.component.html',
  styleUrls: ['./resete.component.css']
})
export class ReseteComponent {
  reseteForm: FormGroup;
  isLoading = false;
  mensagem = '';
  mensagemTitulo = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService
  ) {
    this.reseteForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }



  get email() {
    return this.reseteForm.get('email')?.value;
  }

  get senha() {
    return this.reseteForm.get('senha')?.value;
  }

  onSubmit() {
    if (this.reseteForm.invalid) return;

    this.isLoading = true;
    this.mensagem = '';

    const email = this.email;
    const senha = this.senha;

    this.loginService.resete(email, senha).subscribe({
      next: (response) => {
        console.log('Senha atualizado com sucesso:', response);
        this.mensagemTitulo = 'Resete de senha realizado!';
        this.mensagem = 'Usuário resetado com sucesso. Aguarde ativação pelo administrador.';
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
