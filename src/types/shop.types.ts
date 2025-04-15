// src/types/shop.types.ts
export interface Shop {
    id: string;
    name: string;
    description: string;
    address: string;
    logo?: string;
    category?: string;
    phone?: string;
    email?: string;
    website?: string;
    pointsPerCurrency: number; // pl.: 1 pont per 100 Ft
    openingHours?: OpeningHours[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface OpeningHours {
    day: string;
    open: string;
    close: string;
  }
  
  export interface ShopListResponse {
    shops: Shop[];
    total: number;
  }
  
  export interface UserPoints {
    shopId: string;
    currentPoints: number;
    totalPointsEarned: number;
    lastTransaction?: string;
  }
  
  export interface Transaction {
    id: string;
    shopId: string;
    userId: string;
    amount: number;
    pointsEarned: number;
    date: string;
  }