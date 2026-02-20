import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/user.model';  // ← Import du type

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="register-container">
      <div class="register-card">
        <h2>Inscription</h2>

        @if (errorMessage) {
          <div class="error-message">{{ errorMessage }}</div>
        }
        @if (successMessage) {
          <div class="success-message">{{ successMessage }}</div>
        }

        <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="userData.email"
              required
              email
              #email="ngModel"
              class="form-control"
              [class.error]="email.invalid && email.touched"
            >
            @if (email.invalid && email.touched) {
              <div class="error-text">Email valide requis</div>
            }
          </div>

          <div class="form-row">
            <div class="form-group half">
              <label for="firstName">Prénom</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                [(ngModel)]="userData.firstName"
                required
                #firstName="ngModel"
                class="form-control"
                [class.error]="firstName.invalid && firstName.touched"
              >
            </div>

            <div class="form-group half">
              <label for="lastName">Nom</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                [(ngModel)]="userData.lastName"
                required
                #lastName="ngModel"
                class="form-control"
                [class.error]="lastName.invalid && lastName.touched"
              >
            </div>
          </div>

          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="userData.password"
              required
              minlength="6"
              #password="ngModel"
              class="form-control"
              [class.error]="password.invalid && password.touched"
            >
            @if (password.invalid && password.touched) {
              <div class="error-text">Minimum 6 caractères</div>
            }
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirmer le mot de passe</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              [(ngModel)]="confirmPassword"
              required
              #confirm="ngModel"
              class="form-control"
              [class.error]="(confirm.touched && passwordsMismatch) || (confirm.invalid && confirm.touched)"
            >
            @if (confirm.touched && passwordsMismatch) {
              <div class="error-text">Les mots de passe ne correspondent pas</div>
            }
          </div>

          <div class="form-group">
            <label>Type de compte</label>
            <div class="radio-group">
              <label class="radio-label">
                <input
                  type="radio"
                  name="role"
                  [(ngModel)]="userData.role"
                  value="BUYER"
                  required
                >
                Acheteur
              </label>
              <label class="radio-label">
                <input
                  type="radio"
                  name="role"
                  [(ngModel)]="userData.role"
                  value="SELLER"
                  required
                >
                Vendeur
              </label>
            </div>
          </div>

          <button
            type="submit"
            [disabled]="registerForm.invalid || isLoading || passwordsMismatch"
            class="btn-primary"
          >
            {{ isLoading ? 'Inscription...' : "S'inscrire" }}
          </button>
        </form>

        <p class="login-link">
          Déjà inscrit ?
          <a routerLink="/login">Se connecter</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 200px);
    }
    .register-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      padding: 2rem;
      width: 100%;
      max-width: 500px;
    }
    h2 {
      text-align: center;
      color: #333;
      margin-bottom: 2rem;
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    .form-row {
      display: flex;
      gap: 1rem;
    }
    .form-group.half {
      flex: 1;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #555;
    }
    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }
    .form-control:focus {
      outline: none;
      border-color: #667eea;
    }
    .form-control.error {
      border-color: #e74c3c;
    }
    .error-text {
      color: #e74c3c;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
    .error-message {
      background-color: #f8d7da;
      color: #721c24;
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
    .success-message {
      background-color: #d4edda;
      color: #155724;
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
    .radio-group {
      display: flex;
      gap: 2rem;
      margin-top: 0.5rem;
    }
    .radio-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }
    .btn-primary {
      width: 100%;
      padding: 0.75rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: opacity 0.3s;
    }
    .btn-primary:hover:not(:disabled) {
      opacity: 0.9;
    }
    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .login-link {
      text-align: center;
      margin-top: 1rem;
      color: #666;
    }
    .login-link a {
      color: #667eea;
      text-decoration: none;
    }
  `]
})
export class RegisterComponent {
  // 👇 ICI : Typage explicite avec RegisterRequest
  userData: RegisterRequest = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'BUYER'  // OK car c'est "BUYER" | "SELLER"
  };

  confirmPassword = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  get passwordsMismatch(): boolean {
    return this.userData.password !== this.confirmPassword;
  }

  onSubmit(): void {
    if (this.passwordsMismatch) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(this.userData).subscribe({
      next: () => {
        this.successMessage = 'Inscription réussie ! Redirection...';
        setTimeout(() => {
          this.router.navigate(['/products']);
        }, 2000);
      },
      error: (error) => {
        if (error.status === 400) {
          this.errorMessage = 'Cet email est déjà utilisé';
        } else {
          this.errorMessage = 'Erreur lors de l\'inscription';
        }
        this.isLoading = false;
      }
    });
  }
}
