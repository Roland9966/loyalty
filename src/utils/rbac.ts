// src/utils/rbac.ts
import { UserRole } from "../types";

// Művelet típusok definíciója
export type Permission =
  | "view_shop_list"
  | "generate_qr_code"
  | "view_points"
  | "update_profile"
  | "scan_qr_code"
  | "add_points"
  | "view_transactions"
  | "manage_employees"
  | "update_shop"
  | "view_statistics";

// Szerepkörökhöz tartozó jogosultságok
const rolePermissions: Record<UserRole, Permission[]> = {
  customer: [
    "view_shop_list",
    "generate_qr_code",
    "view_points",
    "update_profile",
  ],
  shop_admin: [
    "scan_qr_code",
    "add_points",
    "view_transactions",
    "manage_employees",
    "update_shop",
    "view_statistics",
  ],
  shop_employee: ["scan_qr_code", "add_points", "view_transactions"],
};

// Ellenőrzés, hogy egy szerepkör rendelkezik-e adott jogosultsággal
export const hasPermission = (
  role: UserRole | undefined,
  permission: Permission
): boolean => {
  if (!role) return false;
  return rolePermissions[role].includes(permission);
};

// Ellenőrzés, hogy egy szerepkör rendelkezik-e az összes felsorolt jogosultsággal
export const hasAllPermissions = (
  role: UserRole | undefined,
  permissions: Permission[]
): boolean => {
  if (!role) return false;
  return permissions.every((permission) =>
    rolePermissions[role].includes(permission)
  );
};

// Ellenőrzés, hogy egy szerepkör rendelkezik-e bármely felsorolt jogosultsággal
export const hasAnyPermission = (
  role: UserRole | undefined,
  permissions: Permission[]
): boolean => {
  if (!role) return false;
  return permissions.some((permission) =>
    rolePermissions[role].includes(permission)
  );
};
