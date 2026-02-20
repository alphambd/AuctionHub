import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink], // Ajoute CommonModule et RouterLink
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('AuctionHub'); // Change le titre

  constructor(public authService: AuthService) {} // Injecte AuthService

  logout(): void {
    this.authService.logout();
  }
}
