import {Component, OnInit, OnDestroy, ChangeDetectorRef, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { BidService } from '../../services/bid.service';
import { WebSocketService } from '../../services/websocket.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';
import { Bid, BidMessage } from '../../models/bid.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="detail-container">
      @if (isLoading) {
        <div class="loading">Chargement...</div>
      }

      <!-- À ajouter temporairement juste après le @if (isLoading) -->
      @if (isLoading) {
        <div class="loading">Chargement... ({{ isLoading }})</div>
      }

      @if (errorMessage) {
        <div class="error-message">{{ errorMessage }}</div>
      }

      @if (product && !isLoading) {
        <div class="product-detail">
          <!-- En-tête avec image -->
          <div class="product-header">
            <div class="product-image">
              <img [src]="product.imageUrl || 'https://picsum.photos/600/400?random=' + product.id"
                   [alt]="product.name">
              <div class="time-badge" [class.urgent]="isUrgent()">
                {{ timeRemaining }}
              </div>
            </div>

            <div class="product-info">
              <h1>{{ product.name }}</h1>
              <p class="description">{{ product.description }}</p>

              <div class="seller">
                Vendu par <strong>{{ product.seller.firstName }} {{ product.seller.lastName }}</strong>
              </div>

              <div class="price-box">
                <div class="current-price">
                  <span class="label">Prix actuel</span>
                  <span class="value">{{ currentPrice }}€</span>
                </div>
                <div class="starting-price">
                  <span class="label">Prix de départ</span>
                  <span class="value">{{ product.startingPrice }}€</span>
                </div>
              </div>

              <!-- Formulaire d'enchère (visible seulement si connecté et non vendeur) -->
              @if (canBid()) {
                <div class="bid-form">
                  <h3>Placer une enchère</h3>
                  @if (bidError) {
                    <div class="bid-error">{{ bidError }}</div>
                  }
                  @if (bidSuccess) {
                    <div class="bid-success">{{ bidSuccess }}</div>
                  }

                  <div class="input-group">
                    <input
                      type="number"
                      [(ngModel)]="bidAmount"
                      [min]="minBidAmount"
                      [step]="1"
                      placeholder="Montant"
                      class="bid-input">
                    <button
                      (click)="placeBid()"
                      [disabled]="!isValidBid() || isPlacingBid"
                      class="btn-bid">
                      {{ isPlacingBid ? 'Envoi...' : 'Enchérir' }}
                    </button>
                  </div>
                  <p class="min-bid">Minimum: {{ minBidAmount }}€</p>
                </div>
              } @else if (!authService.isAuthenticated()) {
                <div class="login-prompt">
                  <a routerLink="/login">Connectez-vous</a> pour enchérir
                </div>
              } @else if (isSeller()) {
                <div class="seller-note">
                  Vous ne pouvez pas enchérir sur votre propre produit
                </div>
              }
            </div>
          </div>

          <!-- Historique des enchères -->
          <div class="bids-history">
            <h2>Historique des enchères</h2>

            @if (bidsLoading()) {  <!-- ← Utilisation du signal -->
              <div class="loading-bids">
                <div class="small-spinner"></div>
                <p>Chargement des enchères...</p>
              </div>
            } @else {
              @if (bids.length === 0) {
                <p class="no-bids">Aucune enchère pour le moment</p>
              } @else {
                <div class="bids-list">
                  @for (bid of bids; track bid.id) {
                    <div class="bid-item">
                      <div class="bid-amount">{{ bid.amount }}€</div>
                      <div class="bid-info">
                        <span class="bidder">{{ bid.bidder.firstName }} {{ bid.bidder.lastName }}</span>
                        <span class="bid-time">{{ formatDate(bid.createdAt) }}</span>
                      </div>
                    </div>
                  }
                </div>
              }
            }
          </div>

          <!-- Lien retour -->
          <a routerLink="/products" class="back-link">← Retour à la liste</a>
        </div>
      }

      <!-- Après le @if, ajoute ceci pour debug -->
      @if (product) {
        <div style="display: none;">Produit chargé: {{ product.name }}</div>
      }
    </div>
  `,
  styles: [`
    .detail-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem;
    }
    .loading, .error-message {
      text-align: center;
      padding: 2rem;
    }
    .error-message {
      color: #e74c3c;
      background-color: #f8d7da;
      border-radius: 4px;
    }
    .product-header {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }
    .product-image {
      position: relative;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .product-image img {
      width: 100%;
      height: auto;
      display: block;
    }
    .time-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: bold;
    }
    .time-badge.urgent {
      background: #e74c3c;
    }
    .product-info {
      padding: 1rem;
    }
    h1 {
      margin: 0 0 1rem 0;
      color: #333;
    }
    .description {
      color: #666;
      line-height: 1.6;
      margin-bottom: 1rem;
    }
    .seller {
      margin-bottom: 1.5rem;
      padding: 0.5rem;
      background: #f8f9fa;
      border-radius: 4px;
    }
    .price-box {
      display: flex;
      gap: 2rem;
      margin-bottom: 2rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 4px;
    }
    .current-price, .starting-price {
      text-align: center;
    }
    .label {
      display: block;
      font-size: 0.875rem;
      color: #999;
    }
    .value {
      display: block;
      font-size: 2rem;
      font-weight: bold;
      color: #667eea;
    }
    .starting-price .value {
      color: #999;
    }
    .bid-form {
      margin-top: 1rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 4px;
    }
    h3 {
      margin: 0 0 1rem 0;
    }
    .bid-error {
      background-color: #f8d7da;
      color: #721c24;
      padding: 0.5rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
    .bid-success {
      background-color: #d4edda;
      color: #155724;
      padding: 0.5rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
    .input-group {
      display: flex;
      gap: 0.5rem;
    }
    .bid-input {
      flex: 1;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
    .btn-bid {
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: opacity 0.3s;
    }
    .btn-bid:hover:not(:disabled) {
      opacity: 0.9;
    }
    .btn-bid:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .min-bid {
      font-size: 0.875rem;
      color: #666;
      margin-top: 0.5rem;
    }
    .login-prompt, .seller-note {
      text-align: center;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 4px;
    }
    .bids-history {
      margin: 2rem 0;
    }
    h2 {
      margin-bottom: 1rem;
    }

    .loading-bids {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      color: #666;
    }

    .small-spinner {
      width: 30px;
      height: 30px;
      border: 2px solid #f3f3f3;
      border-top: 2px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 0.5rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .no-bids {
      text-align: center;
      color: #666;
      padding: 2rem;
      background: #f8f9fa;
      border-radius: 4px;
    }
    .bids-list {
      max-height: 400px;
      overflow-y: auto;
      border: 1px solid #eee;
      border-radius: 4px;
    }
    .bid-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid #eee;
      transition: background-color 0.3s;
    }
    .bid-item:hover {
      background-color: #f8f9fa;
    }
    .bid-item:last-child {
      border-bottom: none;
    }
    .bid-amount {
      font-size: 1.25rem;
      font-weight: bold;
      color: #667eea;
    }
    .bid-info {
      text-align: right;
    }
    .bidder {
      display: block;
      font-weight: bold;
    }
    .bid-time {
      font-size: 0.875rem;
      color: #999;
    }
    .back-link {
      display: inline-block;
      margin-top: 1rem;
      color: #667eea;
      text-decoration: none;
    }
    .back-link:hover {
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .product-header {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  productId: number = 0;
  product: Product | null = null;
  bids: Bid[] = [];
  currentPrice: number = 0;

  //Pour le chargement des enchères
  bidsLoading = signal(true);

  isLoading = true;
  errorMessage = '';

  bidAmount: number = 0;
  isPlacingBid = false;
  bidError = '';
  bidSuccess = '';

  timeRemaining = '';
  private timeInterval: any;
  private wsSubscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private bidService: BidService,
    private webSocketService: WebSocketService,
    public authService: AuthService,
  private cdr: ChangeDetectorRef
) {}

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProductDetails();
    this.loadBids();
    this.subscribeToWebSocket();
    this.startTimer();
  }

  ngOnDestroy(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
    if (this.wsSubscription) {
      this.wsSubscription.unsubscribe();
    }
    this.webSocketService.unsubscribeFromProduct(this.productId);
  }

  loadProductDetails(): void {
    this.isLoading = true;
    this.productService.getProductById(this.productId).subscribe({
      next: (product) => {
        this.product = product;
        this.currentPrice = product.currentPrice;
        this.bidAmount = Math.ceil(product.currentPrice + 1);
        this.isLoading = false;
        this.cdr.detectChanges(); // Force la détection de changements
      },
      error: (error) => {
        console.error('Erreur chargement produit', error);
        this.errorMessage = 'Produit non trouvé';
        this.isLoading = false;
        this.cdr.detectChanges(); // Force la détection de changements
      }
    });
  }

  loadBids(): void {
    this.bidsLoading.set(true);  // ← Active le chargement

    this.bidService.getBidsForProduct(this.productId).subscribe({
      next: (bids) => {
        this.bids = bids.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.bidsLoading.set(false);  // ← Désactive le chargement
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur chargement enchères', error);
        if (error.status === 401) {
          this.bids = [];
        } else {
          this.errorMessage = 'Impossible de charger les enchères';
        }
        this.bidsLoading.set(false);  // ← Désactive le chargement même en cas d'erreur
        this.cdr.detectChanges();
      }
    });
  }

  subscribeToWebSocket(): void {
    this.wsSubscription = this.webSocketService.subscribeToProduct(this.productId).subscribe({
      next: (message: BidMessage) => {
        console.log('Nouvelle enchère reçue:', message);
        this.currentPrice = message.newPrice;
        // Recharger les enchères pour avoir la liste à jour
        this.loadBids();
        // Afficher une notification
        this.bidSuccess = message.message;
        setTimeout(() => this.bidSuccess = '', 3000);
      },
      error: (error) => {
        console.error('Erreur WebSocket', error);
      }
    });
  }

  startTimer(): void {
    this.updateTimeRemaining();
    this.timeInterval = setInterval(() => {
      this.updateTimeRemaining();
    }, 60000); // Mise à jour chaque minute
  }

  updateTimeRemaining(): void {
    if (!this.product) return;

    const end = new Date(this.product.endTime).getTime();
    const now = new Date().getTime();
    const diff = end - now;

    if (diff <= 0) {
      this.timeRemaining = 'Enchère terminée';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      this.timeRemaining = `${days}j ${hours}h restantes`;
    } else if (hours > 0) {
      this.timeRemaining = `${hours}h ${minutes}m restantes`;
    } else {
      this.timeRemaining = `${minutes}m restantes`;
    }
  }

  isUrgent(): boolean {
    if (!this.product) return false;
    const end = new Date(this.product.endTime).getTime();
    const now = new Date().getTime();
    const hoursLeft = (end - now) / (1000 * 60 * 60);
    return hoursLeft < 24;
  }

  canBid(): boolean {
    if (!this.product || !this.authService.isAuthenticated()) return false;
    return !this.isSeller() && this.product.active;
  }

  isSeller(): boolean {
    if (!this.product || !this.authService.getCurrentUser()) return false;
    return this.product.seller.id === this.authService.getCurrentUser()?.id;
  }

  get minBidAmount(): number {
    return Math.ceil(this.currentPrice + 1);
  }

  isValidBid(): boolean {
    return this.bidAmount >= this.minBidAmount;
  }

  placeBid(): void {
    if (!this.isValidBid() || !this.product) return;

    this.isPlacingBid = true;
    this.bidError = '';
    this.bidSuccess = '';

    this.bidService.placeBid({
      amount: this.bidAmount,
      productId: this.product.id
    }).subscribe({
      next: (bid) => {
        this.bidSuccess = 'Enchère placée avec succès !';
        // Le WebSocket va mettre à jour le prix
        this.bidAmount = this.minBidAmount;
        this.isPlacingBid = false;
        setTimeout(() => this.bidSuccess = '', 3000);
      },
      error: (error) => {
        console.error('Erreur enchère', error);
        if (error.status === 400) {
          this.bidError = error.error?.message || 'Enchère invalide';
        } else if (error.status === 401) {
          this.bidError = 'Veuillez vous connecter';
        } else {
          this.bidError = 'Erreur lors de l\'enchère';
        }
        this.isPlacingBid = false;
      }
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
