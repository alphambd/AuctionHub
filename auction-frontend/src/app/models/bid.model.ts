export interface Bid {
  id: number;
  amount: number;
  createdAt: string;
  bidder: {
    id: number;
    firstName: string;
    lastName: string;
  };
  product: {
    id: number;
    name: string;
  };
}

export interface BidRequest {
  amount: number;
  productId: number;
}

export interface BidMessage {
  productId: number;
  newPrice: number;
  bidderName: string;
  timestamp: string;
  message: string;
}
