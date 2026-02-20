export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'BUYER' | 'SELLER';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'BUYER' | 'SELLER';
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}
