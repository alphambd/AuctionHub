import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-container">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1>AuctionHub</h1>
          <p class="hero-subtitle">La plateforme d'enchères en temps réel</p>
          <p class="hero-description">
            Enchérissez sur des produits exceptionnels et vivez l'excitation des enchères
            en direct depuis votre navigateur.
          </p>
          <div class="hero-actions">
            <a routerLink="/products" class="btn-primary">Voir les enchères</a>
            @if (!(authService.currentUser$ | async)) {
              <a routerLink="/register" class="btn-secondary">Créer un compte</a>
            }
          </div>
        </div>
        <div class="hero-image">
          <img src="https://picsum.photos/600/400?random=auction" alt="Auction illustration">
        </div>
      </section>

      <!-- Features Section -->
      <section class="features">
        <h2>Comment ça marche ?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🔍</div>
            <h3>1. Explorez</h3>
            <p>Parcourez notre sélection de produits mis aux enchères par des vendeurs vérifiés.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <h3>2. Enchérissez en direct</h3>
            <p>Placez vos enchères et voyez les prix évoluer en temps réel sans rafraîchir la page.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🏆</div>
            <h3>3. Gagnez</h3>
            <p>Si vous êtes le meilleur enchérisseur à la fin du temps imparti, le produit est à vous !</p>
          </div>
        </div>
      </section>

      <!-- Call to Action -->
      <section class="cta">
        <h2>Prêt à commencer ?</h2>
        @if (authService.currentUser$ | async) {
          <a routerLink="/products" class="btn-primary">Voir les enchères en cours</a>
        } @else {
          <div class="cta-buttons">
            <a routerLink="/login" class="btn-primary">Se connecter</a>
            <a routerLink="/register" class="btn-secondary">S'inscrire</a>
          </div>
        }
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    /* Hero Section */
    .hero {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
      padding: 4rem 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 8px;
      margin-bottom: 4rem;
    }

    .hero-content {
      padding: 2rem;
    }

    .hero h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
      font-weight: bold;
    }

    .hero-subtitle {
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
      opacity: 0.95;
    }

    .hero-description {
      font-size: 1.1rem;
      margin-bottom: 2rem;
      line-height: 1.6;
      opacity: 0.9;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
    }

    .hero-image img {
      width: 100%;
      height: auto;
      border-radius: 8px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    }

    /* Features Section */
    .features {
      padding: 4rem 2rem;
      text-align: center;
    }

    .features h2 {
      font-size: 2.5rem;
      color: #333;
      margin-bottom: 3rem;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }

    .feature-card {
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: transform 0.3s;
    }

    .feature-card:hover {
      transform: translateY(-4px);
    }

    .feature-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .feature-card h3 {
      font-size: 1.25rem;
      color: #333;
      margin-bottom: 1rem;
    }

    .feature-card p {
      color: #666;
      line-height: 1.6;
    }

    /* CTA Section */
    .cta {
      text-align: center;
      padding: 4rem 2rem;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
      border-radius: 8px;
      margin-top: 4rem;
    }

    .cta h2 {
      font-size: 2.5rem;
      margin-bottom: 2rem;
    }

    .cta-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    /* Buttons */
    .btn-primary, .btn-secondary {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      text-decoration: none;
      font-weight: bold;
      transition: all 0.3s;
      cursor: pointer;
    }

    .btn-primary {
      background: white;
      color: #667eea;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    .btn-secondary {
      background: transparent;
      color: white;
      border: 2px solid white;
    }

    .btn-secondary:hover {
      background: white;
      color: #f5576c;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .hero {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }

      .cta-buttons {
        flex-direction: column;
      }
    }
  `]
})
export class HomeComponent {
  constructor(public authService: AuthService) {}
}
