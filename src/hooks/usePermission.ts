// src/hooks/usePermission.ts
import { useAuth } from '../contexts/AuthContext.tsx';
import { hasPermission, hasAllPermissions, hasAnyPermission, Permission } from '../utils/rbac.ts';

export const usePermission = () => {
  const { user } = useAuth();
  
  return {
    // Egyetlen jogosultság ellenőrzése
    check: (permission: Permission): boolean => {
      return hasPermission(user?.role, permission);
    },
    
    // Összes jogosultság ellenőrzése
    checkAll: (permissions: Permission[]): boolean => {
      return hasAllPermissions(user?.role, permissions);
    },
    
    // Bármely jogosultság ellenőrzése
    checkAny: (permissions: Permission[]): boolean => {
      return hasAnyPermission(user?.role, permissions);
    }
  };
};