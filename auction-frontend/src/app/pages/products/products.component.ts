import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { AuthService } from '../../services/auth.service';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="products-container">
      <h1>Enchères en cours</h1>

      @if (isLoading) {
        <div class="loading-container">
          <div class="spinner"></div>
          <p>Chargement des produits...</p>
        </div>
      }

      @if (errorMessage) {
        <div class="error-message">{{ errorMessage }}</div>
      }

      @if (!isLoading && !errorMessage) {
        @if (products.length === 0) {
          <div class="no-products">Aucune enchère en cours pour le moment</div>
        } @else {
          <div class="products-grid">
            @for (product of products; track product.id) {
              <div class="product-card">
                <div class="product-image">
                  <img [src]="product.imageUrl || 'https://picsum.photos/300/200?random=' + product.id"
                       [alt]="product.name">
                  <span class="time-badge" [class.urgent]="isUrgent(product)">
                    {{ getTimeRemaining(product.endTime) }}
                  </span>
                </div>

                <div class="product-info">
                  <h3>{{ product.name }}</h3>
                  <p class="description">{{ product.description }}</p>

                  <div class="price-info">
                    <div class="current-price">
                      <span class="label">Prix actuel</span>
                      <span class="value">{{ product.currentPrice }}€</span>
                    </div>
                    <div class="starting-price">
                      <span class="label">Départ</span>
                      <span class="value">{{ product.startingPrice }}€</span>
                    </div>
                  </div>

                  <div class="seller-info">
                    Vendu par {{ product.seller.firstName }} {{ product.seller.lastName }}
                  </div>

                  <a [routerLink]="['/product', product.id]" class="btn-bid">
                    Voir les enchères
                  </a>
                </div>
              </div>
            }
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .products-container {
      padding: 1rem;
    }
    h1 {
      text-align: center;
      color: #333;
      margin-bottom: 2rem;
    }
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 300px;
    }
    .spinner {
      width: 50px;
      height: 50px;
      border: 3px solid #f3f3f3;
      border-top: 3px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .error-message, .no-products {
      text-align: center;
      padding: 2rem;
      color: #666;
    }
    .error-message {
      color: #e74c3c;
      background-color: #f8d7da;
      border-radius: 4px;
    }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }
    .product-card {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.3s, box-shadow 0.3s;
    }
    .product-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }
    .product-image {
      position: relative;
      height: 200px;
      overflow: hidden;
    }
    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .time-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: bold;
    }
    .time-badge.urgent {
      background: #e74c3c;
    }
    .product-info {
      padding: 1.5rem;
    }
    h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }
    .description {
      color: #666;
      font-size: 0.875rem;
      margin-bottom: 1rem;
      line-height: 1.4;
      height: 2.8em;
      overflow: hidden;
    }
    .price-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
      padding: 0.5rem;
      background: #f8f9fa;
      border-radius: 4px;
    }
    .current-price, .starting-price {
      text-align: center;
    }
    .label {
      display: block;
      font-size: 0.75rem;
      color: #999;
    }
    .value {
      display: block;
      font-size: 1.25rem;
      font-weight: bold;
      color: #667eea;
    }
    .starting-price .value {
      color: #999;
    }
    .seller-info {
      font-size: 0.875rem;
      color: #666;
      margin-bottom: 1rem;
    }
    .btn-bid {
      display: block;
      text-align: center;
      padding: 0.75rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      border-radius: 4px;
      transition: opacity 0.3s;
    }
    .btn-bid:hover {
      opacity: 0.9;
    }
  `]
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  isLoading = true;
  errorMessage = '';
  private routerSubscription: Subscription | null = null;

  constructor(
    private productService: ProductService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Chargement initial
    this.loadProducts();

    // Réagir aux changements de route (quand on revient sur la page)
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd && event.url === '/products')
    ).subscribe(() => {
      console.log('🔄 Retour sur /products, rechargement...');
      this.loadProducts();
    });
  }

  ngOnDestroy(): void {
    // Nettoyer la souscription
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.products = []; // Vider la liste existante
    this.cdr.detectChanges(); // Forcer la mise à jour de la vue

    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
        this.cdr.detectChanges(); // Forcer la mise à jour de la vue
        console.log('✅ Produits chargés:', data.length);
      },
      error: (error) => {
        console.error('Erreur chargement produits', error);
        this.errorMessage = 'Impossible de charger les produits';
        this.isLoading = false;
        this.cdr.detectChanges(); // Forcer la mise à jour de la vue
      }
    });
  }

  getTimeRemaining(endTime: string): string {
    const end = new Date(endTime).getTime();
    const now = new Date().getTime();
    const diff = end - now;

    if (diff <= 0) {
      return 'Terminé';
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}j`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }

  isUrgent(product: Product): boolean {
    const end = new Date(product.endTime).getTime();
    const now = new Date().getTime();
    const hoursLeft = (end - now) / (1000 * 60 * 60);
    return hoursLeft < 24;
  }
}
