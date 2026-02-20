export interface Product {
  id: number;
  name: string;
  description: string;
  startingPrice: number;
  currentPrice: number;
  endTime: string;
  imageUrl?: string;
  active: boolean;
  seller: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface ProductRequest {
  name: string;
  description: string;
  startingPrice: number;
  endTime: string;
}
