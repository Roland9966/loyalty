// src/types/index.ts
export type UserRole = 'customer' | 'shop_admin' | 'shop_employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface CustomerRegisterData {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface ShopRegisterData {
  shopName: string;
  adminName: string;
  email: string;
  password: string;
  address?: string;
}

export interface TokenPayload {
  sub: string; // felhasználó id
  role: UserRole;
  name: string;
  email: string;
  exp?: number; // lejárati idő
  iat?: number; // kiállítás időpontja
}