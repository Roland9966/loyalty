// src/contexts/AuthContext.tsx frissítése
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import authService, { User, ProfilePictureResponse, UserProfile } from "../services/auth.service.ts";

// Felhasználói típusok definíciója
export type UserRole = "customer" | "shop_admin" | "shop_employee";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  registerCustomer: (userData: CustomerRegisterData) => Promise<boolean>;
  registerShop: (userData: ShopRegisterData) => Promise<boolean>;
  updateUser: (updatedUser: User) => void;
  // Új funkciók a profilkép kezeléséhez
  uploadProfilePicture: (userId: string, imageFile: File) => Promise<ProfilePictureResponse | null>;
  getUserProfile: (userId: string) => Promise<UserProfile | null>;
}

// Regisztrációs adatok típusok
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

// Context létrehozása
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider komponens
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Token és felhasználó betöltése indításkor
  useEffect(() => {
    const loadStoredAuth = () => {
      const storedToken = authService.getToken();
      const storedUser = authService.getUser();

      if (storedToken && storedUser && authService.isTokenValid()) {
        setToken(storedToken);
        setUser(storedUser);
      } else {
        // Ha a token érvénytelen vagy lejárt, töröljük
        authService.logout();
      }

      setIsLoading(false);
    };

    loadStoredAuth();
  }, []);

  // Bejelentkezés
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const authResponse = await authService.login(email, password);

      if (authResponse) {
        setToken(authResponse.token);
        setUser(authResponse.user);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // Kijelentkezés
  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  // Vásárló regisztráció
  const registerCustomer = async (
    userData: CustomerRegisterData
  ): Promise<boolean> => {
    return authService.registerCustomer(userData);
  };

  // Bolt regisztráció
  const registerShop = async (userData: ShopRegisterData): Promise<boolean> => {
    return authService.registerShop(userData);
  };

  // Felhasználó adatainak frissítése
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    // Frissített felhasználói adatok mentése localStorage-be is
    localStorage.setItem("auth_user", JSON.stringify(updatedUser));
  };

  // Új: Profilkép feltöltése
  const uploadProfilePicture = async (userId: string, imageFile: File): Promise<ProfilePictureResponse | null> => {
    try {
      const formData = new FormData();
      formData.append('profileImage', imageFile);
      
      const response = await authService.uploadProfilePicture(userId, formData);
      
      if (response && response.success && user) {
        // Frissítjük a lokális felhasználói állapotot az új profilképpel
        const updatedUser = {
          ...user,
          profileImage: response.imageUrl
        };
        setUser(updatedUser);
      }
      
      return response;
    } catch (error) {
      console.error("Profile picture upload error:", error);
      return null;
    }
  };

  // Új: Felhasználói profil lekérése
  const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    return authService.getUserProfile(userId);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    login,
    logout,
    registerCustomer,
    registerShop,
    updateUser,
    uploadProfilePicture,
    getUserProfile,
  };

  if (isLoading) {
    return <div>Betöltés...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook a Context használatához
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};