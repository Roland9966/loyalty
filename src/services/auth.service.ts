// src/services/auth.service.ts
import { authApi } from './api.ts';
import api from './api.ts';
import { CustomerRegisterData, ShopRegisterData, UserRole } from '../contexts/AuthContext.tsx';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string; // Új: profilkép URL-je
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Új interfész a profilkép válaszhoz
export interface ProfilePictureResponse {
  imageUrl: string;
  success: boolean;
}

// Új interfész a teljes felhasználói profilhoz
export interface UserProfile extends User {
  phoneNumber?: string;
  notifications?: boolean;
  publicProfile?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

class AuthService {
  // Bejelentkezés
  async login(email: string, password: string): Promise<AuthResponse | null> {
    try {
      const response = await authApi.login({ email, password });
      if (response.data) {
        this.setToken(response.data.token);
        this.setUser(response.data.user);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  // Meglévő funkciók...
  
  // Felhasználói adatok frissítéséhez
  async updateUserProfile(userId: string, userData: Partial<User>): Promise<boolean> {
    try {
      // API hívás a backend felé
      const response = await api.put(`/auth/users/${userId}`, userData);
      
      if (response.data) {
        // Frissített adatok tárolása lokálisan
        this.setUser(response.data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Update user profile error:', error);
      return false;
    }
  }

  // Új metódus: Teljes felhasználói profil lekérése
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const response = await api.get(`/auth/users/${userId}/profile`);
      if (response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Get user profile error:', error);
      return null;
    }
  }

  // Új metódus: Profilkép feltöltése
  async uploadProfilePicture(userId: string, formData: FormData): Promise<ProfilePictureResponse | null> {
    try {
      const response = await api.post(`/auth/users/${userId}/profile-picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data) {
        // Ha sikeres a feltöltés, frissítjük a tárolt felhasználói adatokat
        const currentUser = this.getUser();
        if (currentUser && response.data.imageUrl) {
          const updatedUser = {
            ...currentUser,
            profileImage: response.data.imageUrl
          };
          this.setUser(updatedUser);
        }
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Upload profile picture error:', error);
      return null;
    }
  }

  // Vásárló regisztráció
  async registerCustomer(data: CustomerRegisterData): Promise<boolean> {
    try {
      const response = await authApi.registerCustomer(data);
      return !!response.data;
    } catch (error) {
      console.error('Customer registration error:', error);
      return false;
    }
  }

  // Bolt regisztráció
  async registerShop(data: ShopRegisterData): Promise<boolean> {
    try {
      const response = await authApi.registerShop(data);
      return !!response.data;
    } catch (error) {
      console.error('Shop registration error:', error);
      return false;
    }
  }

  // Kijelentkezés
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    // Opcionálisan meghívhatjuk a backend logout végpontját is
    authApi.logout().catch(error => {
      console.error('Logout error:', error);
    });
  }

  // JWT token lekérése
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // JWT token beállítása
  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  // Felhasználó adatainak lekérése
  getUser(): User | null {
    const userStr = localStorage.getItem('auth_user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }

  // Felhasználó adatainak beállítása
  setUser(user: User): void {
    localStorage.setItem('auth_user', JSON.stringify(user));
  }

  // Ellenőrzi, hogy a felhasználó be van-e jelentkezve
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Token érvényesség ellenőrzése
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Egyszerű ellenőrzés, hogy a token egy valid JWT-e
      const parts = token.split('.');
      if (parts.length !== 3) return false;

      // Az időbélyeg ellenőrzése a token payload részében
      const payload = JSON.parse(atob(parts[1]));
      if (!payload.exp) return true; // Ha nincs lejárati idő, feltételezzük, hogy érvényes

      // Ellenőrizzük, hogy a token nem járt-e le
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }
 
}
const authServiceInstance = new AuthService();
export default authServiceInstance;