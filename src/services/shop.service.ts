// src/services/shop.service.ts
import api from "./api.ts";
import { Shop, ShopListResponse } from "../types/shop.types";

interface GetShopsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

export const ShopService = {
  /**
   * Boltok listázása
   * @param params Lekérdezési paraméterek
   * @returns Promise a boltok listájával
   */
  getShops: async (params?: GetShopsParams): Promise<ShopListResponse> => {
    try {
      const response = await api.get("/shops", { params });
      return response.data;
    } catch (error) {
      console.log("Shops API hívás sikertelen, mock adatok használata");
      
      // Mock boltlista
      return {
        shops: [
          {
            id: "shop1",
            name: "Demo Bolt",
            description: "Az első demo bolt",
            address: "Teszt utca 1., Budapest",
            pointsPerCurrency: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: "shop2",
            name: "Teszt Üzlet",
            description: "A második demo bolt",
            address: "Példa út 2., Budapest",
            pointsPerCurrency: 2,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ],
        total: 2
      };
    }
  },

  /**
   * Egy bolt részletes adatainak lekérése
   * @param id A bolt azonosítója
   * @returns Promise a bolt adataival
   */
  getShopById: async (id: string): Promise<Shop> => {
    try {
      const response = await api.get(`/shops/${id}`);
      return response.data;
    } catch (error) {
      console.log("Shop API hívás sikertelen, mock adatok használata");
      
      // Alap mock bolt adatok
      return {
        id: id,
        name: id === "shop1" ? "Demo Bolt" : "Teszt Üzlet",
        description: "Ez egy tesztbolt a fejlesztéshez",
        address: "Teszt utca 1., Budapest",
        pointsPerCurrency: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  }
};