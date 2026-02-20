import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bid, BidRequest } from '../models/bid.model';

@Injectable({
  providedIn: 'root'
})
export class BidService {
  private apiUrl = 'http://localhost:8080/api/bids';

  constructor(private http: HttpClient) {}

  placeBid(bid: BidRequest): Observable<Bid> {
    return this.http.post<Bid>(this.apiUrl, bid);
  }

  getBidsForProduct(productId: number): Observable<Bid[]> {
    return this.http.get<Bid[]>(`${this.apiUrl}/product/${productId}`);
  }
}
