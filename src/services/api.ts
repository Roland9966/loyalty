// src/services/api.ts

import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

// Alap URL a backend API-hoz
const API_BASE_URL = "http://localhost:3001/api"; // Ezt változtasd meg a backend URL-re

// Axios instance létrehozása
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Kérés interceptor hozzáadása a tokenek automatikus beillesztéséhez
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem("auth_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Válasz interceptor a token frissítéshez és hibakezeléshez
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Ha 401 Unauthorized és még nem próbáltuk újra, akkor frissítsük a tokent
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Itt lehetne implementálni a token frissítési logikát
        // pl. refreshToken endpoint meghívásával

        // Ha sikeres a token frissítés, újra próbáljuk az eredeti kérést
        return api(originalRequest);
      } catch (refreshError) {
        // Ha nem sikerül a token frissítése, irányítsuk a felhasználót a bejelentkezési oldalra
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API végpontok típusai
export interface AuthEndpoints {
  login: (credentials: {
    email: string;
    password: string;
  }) => Promise<AxiosResponse>;
  registerCustomer: (data: any) => Promise<AxiosResponse>;
  registerShop: (data: any) => Promise<AxiosResponse>;
  logout: () => Promise<AxiosResponse>;
}

// API végpontok implementációja
export const authApi: AuthEndpoints = {
  login: (credentials) => api.post("/auth/login", credentials),
  registerCustomer: (data) => api.post("/auth/register/customer", data),
  registerShop: (data) => api.post("/auth/register/shop", data),
  logout: () => api.post("/auth/logout"),
};

export default api;
