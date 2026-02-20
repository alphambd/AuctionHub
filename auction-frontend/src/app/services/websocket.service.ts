import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BidMessage } from '../models/bid.model';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private client!: Client;  // ← Ajout du ! ici
  private bidSubjects: Map<number, Subject<BidMessage>> = new Map();
  private connected = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeWebSocket();
    }
  }

  private initializeWebSocket(): void {
    this.client = new Client({  // ← Initialisation ici
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      debug: (str) => {
        // Désactiver les logs en production
        // console.log('WebSocket:', str);
      }
    });

    this.client.onConnect = () => {
      console.log('✅ Connecté au WebSocket');
      this.connected = true;
    };

    this.client.onDisconnect = () => {
      console.log('❌ Déconnecté du WebSocket');
      this.connected = false;
    };

    this.client.onStompError = (frame) => {
      console.error('Erreur STOMP', frame);
    };

    this.client.activate();
  }

  subscribeToProduct(productId: number): Observable<BidMessage> {
    if (!isPlatformBrowser(this.platformId)) {
      return new Observable();
    }

    if (!this.bidSubjects.has(productId)) {
      const subject = new Subject<BidMessage>();
      this.bidSubjects.set(productId, subject);

      // Attendre la connexion avant de s'abonner
      const trySubscribe = () => {
        if (this.connected && this.client.connected) {
          this.client.subscribe(`/topic/product/${productId}`, (message: Message) => {
            const bidMessage: BidMessage = JSON.parse(message.body);
            subject.next(bidMessage);
          });
          console.log(`✅ Abonné au produit #${productId}`);
        } else {
          setTimeout(trySubscribe, 1000);
        }
      };
      trySubscribe();
    }

    return this.bidSubjects.get(productId)!.asObservable();
  }

  unsubscribeFromProduct(productId: number): void {
    const subject = this.bidSubjects.get(productId);
    if (subject) {
      subject.complete();
      this.bidSubjects.delete(productId);
      console.log(`❌ Désabonné du produit #${productId}`);
    }
  }
}
