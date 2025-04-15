// src/services/qrcode.service.ts
export interface QRCodeData {
    userId: string;
    shopId: string;
    timestamp: string;
    version: string;
  }
  
  export class QRCodeService {
    /**
     * QR kód adatok generálása
     * @param userId A felhasználó azonosítója
     * @param shopId A bolt azonosítója
     * @returns QRCodeData objektum
     */
    static generateQRData(userId: string, shopId: string): QRCodeData {
      return {
        userId,
        shopId,
        timestamp: new Date().toISOString(),
        version: '1'
      };
    }
  
    /**
     * QR kód adatok átalakítása JSON formátumba
     * @param data QRCodeData objektum
     * @returns JSON formátumú string
     */
    static getQRCodeValue(data: QRCodeData): string {
      return JSON.stringify(data);
    }
  
    /**
     * QR kód értelmezése
     * @param qrValue QR kód tartalma (JSON string)
     * @returns Dekódolt QRCodeData objektum vagy null ha érvénytelen
     */
    static parseQRCode(qrValue: string): QRCodeData | null {
      try {
        const data = JSON.parse(qrValue) as QRCodeData;
        
        // Alapvető validáció
        if (!data.userId || !data.shopId || !data.timestamp) {
          return null;
        }
        
        return data;
      } catch (error) {
        console.error('QR kód értelmezési hiba:', error);
        return null;
      }
    }
  }
  
  export default QRCodeService;