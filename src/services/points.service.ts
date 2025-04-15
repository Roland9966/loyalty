// src/services/points.service.ts
import api from "./api.ts";
import { Transaction, UserPoints } from "../types/shop.types";

class PointsService {
  /**
   * Felhasználó pontjainak lekérdezése egy adott boltban
   * @param userId A felhasználó azonosítója
   * @param shopId A bolt azonosítója
   * @returns UserPoints objektum az adott boltban lévő pontokkal
   */
  static async getUserPointsForShop(userId: string, shopId: string): Promise<UserPoints> {
    try {
      const response = await api.get(`/points/${userId}/shops/${shopId}`);
      return response.data;
    } catch (error) {
      console.log("Points API hívás sikertelen, mock adatok használata");
      
      // Mock pontok
      return {
        shopId: shopId,
        currentPoints: shopId === "shop1" ? 150 : 75,
        totalPointsEarned: shopId === "shop1" ? 200 : 100,
        lastTransaction: new Date().toISOString()
      };
    }
  }

  /**
   * Felhasználó összes pontjának lekérdezése
   * @param userId A felhasználó azonosítója
   * @returns UserPoints objektumok listája
   */
  static async getAllUserPoints(userId: string): Promise<UserPoints[]> {
    try {
      const response = await api.get(`/points/${userId}`);
      return response.data;
    } catch (error) {
      console.log("All points API hívás sikertelen, mock adatok használata");
      
      // Mock adatok használata fejlesztéshez
      return [
        {
          shopId: "shop1",
          currentPoints: 150,
          totalPointsEarned: 200,
          lastTransaction: new Date().toISOString()
        },
        {
          shopId: "shop2",
          currentPoints: 75,
          totalPointsEarned: 100,
          lastTransaction: new Date(Date.now() - 86400000).toISOString() // Előző nap
        }
      ];
    }
  }

  /**
   * Felhasználó tranzakcióinak lekérdezése egy adott boltban
   * @param userId A felhasználó azonosítója
   * @param shopId A bolt azonosítója
   * @param page Lapozáshoz: jelenlegi oldal
   * @param limit Lapozáshoz: elemek száma oldalanként
   * @returns Tranzakciók listája és a teljes elemszám
   */
  static async getUserTransactionsForShop(
    userId: string, 
    shopId: string, 
    page: number = 1, 
    limit: number = 10
  ): Promise<{ transactions: Transaction[], total: number }> {
    try {
      const response = await api.get(`/transactions/${userId}/shops/${shopId}`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.log("Shop transactions API hívás sikertelen, mock adatok használata");
      
      // Mock tranzakciók
      return {
        transactions: [
          {
            id: "t1",
            shopId: shopId,
            userId: userId,
            amount: 5000,
            pointsEarned: 50,
            date: new Date().toISOString()
          },
          {
            id: "t2",
            shopId: shopId,
            userId: userId,
            amount: 3000,
            pointsEarned: 30,
            date: new Date(Date.now() - 86400000).toISOString() // Előző nap
          }
        ],
        total: 2
      };
    }
  }

  /**
   * Felhasználó összes tranzakciójának lekérdezése
   * @param userId A felhasználó azonosítója
   * @param page Lapozáshoz: jelenlegi oldal
   * @param limit Lapozáshoz: elemek száma oldalanként
   * @returns Tranzakciók listája és a teljes elemszám
   */
  static async getAllUserTransactions(
    userId: string, 
    page: number = 1, 
    limit: number = 10
  ): Promise<{ transactions: Transaction[], total: number }> {
    try {
      const response = await api.get(`/transactions/${userId}`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.log("All transactions API hívás sikertelen, mock adatok használata");
      
      // Mock tranzakciók
      return {
        transactions: [
          {
            id: "t1",
            shopId: "shop1",
            userId: userId,
            amount: 5000,
            pointsEarned: 50,
            date: new Date().toISOString()
          },
          {
            id: "t2",
            shopId: "shop2",
            userId: userId,
            amount: 3000,
            pointsEarned: 60,
            date: new Date(Date.now() - 86400000).toISOString() // Előző nap
          },
          {
            id: "t3",
            shopId: "shop1",
            userId: userId,
            amount: 2000,
            pointsEarned: 20,
            date: new Date(Date.now() - 172800000).toISOString() // 2 nappal ezelőtt
          }
        ],
        total: 3
      };
    }
  }
}

export default PointsService;