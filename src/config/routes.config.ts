// src/config/routes.config.ts
import { UserRole } from '../types';

interface RouteConfig {
  path: string;
  allowedRoles: UserRole[];
  title: string;
  description?: string;
}

// Vásárlói útvonalak
export const customerRoutes: RouteConfig[] = [
  {
    path: '/customer',
    allowedRoles: ['customer'],
    title: 'Kezdőlap',
    description: 'Vásárlói kezdőlap és bolt lista'
  },
  {
    path: '/customer/profile',
    allowedRoles: ['customer'],
    title: 'Profil',
    description: 'Vásárlói profil szerkesztése'
  },
  {
    path: '/customer/points',
    allowedRoles: ['customer'],
    title: 'Pontjaim',
    description: 'Összegyűjtött hűségpontok megtekintése'
  }
];

// Bolti útvonalak
export const shopRoutes: RouteConfig[] = [
  {
    path: '/shop',
    allowedRoles: ['shop_admin', 'shop_employee'],
    title: 'Kezdőlap',
    description: 'Bolti kezdőlap és statisztikák'
  },
  {
    path: '/shop/profile',
    allowedRoles: ['shop_admin'],
    title: 'Bolt adatai',
    description: 'Bolt profil szerkesztése'
  },
  {
    path: '/shop/employees',
    allowedRoles: ['shop_admin'],
    title: 'Alkalmazottak',
    description: 'Alkalmazottak kezelése'
  },
  {
    path: '/shop/scanner',
    allowedRoles: ['shop_admin', 'shop_employee'],
    title: 'QR szkennelő',
    description: 'Hűségpontok hozzáadása QR kód beolvasásával'
  },
  {
    path: '/shop/transactions',
    allowedRoles: ['shop_admin', 'shop_employee'],
    title: 'Tranzakciók',
    description: 'Tranzakciók listája és kezelése'
  }
];

// Összes védett útvonal
export const protectedRoutes = [...customerRoutes, ...shopRoutes];