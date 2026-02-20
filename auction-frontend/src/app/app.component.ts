import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

import { OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <a class="nav-brand" routerLink="/">AuctionHub</a>
        <div class="nav-links">
          <a routerLink="/products" routerLinkActive="active">Produits</a>
          <ng-container *ngIf="authService.currentUser$ | async as user; else notLoggedIn">
            <span class="user-info">{{ user.firstName }} {{ user.lastName }}</span>
            <button class="btn-logout" (click)="logout()">Déconnexion</button>
          </ng-container>
          <ng-template #notLoggedIn>
            <a routerLink="/login" routerLinkActive="active">Connexion</a>
            <a routerLink="/register" routerLinkActive="active">Inscription</a>
          </ng-template>
        </div>
      </div>
    </nav>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .navbar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .nav-brand {
      color: white;
      text-decoration: none;
      font-size: 1.5rem;
      font-weight: bold;
    }
    .nav-links {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    .nav-links a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.3s;
    }
    .nav-links a:hover, .nav-links a.active {
      background-color: rgba(255,255,255,0.2);
    }
    .user-info {
      margin-right: 1rem;
      padding: 0.5rem;
      background-color: rgba(255,255,255,0.2);
      border-radius: 4px;
    }
    .btn-logout {
      background: transparent;
      border: 1px solid white;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;
    }
    .btn-logout:hover {
      background: white;
      color: #764ba2;
    }
    main {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 1rem;
    }
  `]
})
export class AppComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Scroll to top on navigation
      window.scrollTo(0, 0);
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
