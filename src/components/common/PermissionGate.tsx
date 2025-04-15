// src/components/common/PermissionGate.tsx
import React, { ReactNode } from "react";
import { Permission } from "../../utils/rbac.ts";
import { usePermission } from "../../hooks/usePermission.ts";

interface PermissionGateProps {
  children: ReactNode;
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  fallback?: ReactNode;
}

const PermissionGate: React.FC<PermissionGateProps> = ({
    children,
    permission,
    permissions = [],
    requireAll = false,
    fallback = null
  }) => {
    const { check, checkAll, checkAny } = usePermission();
  
    // Ellenőrizzük a jogosultságokat
    let hasPermission = true;
    
    if (permission) {
      hasPermission = check(permission);
    } else if (permissions.length > 0) {
      hasPermission = requireAll ? checkAll(permissions) : checkAny(permissions);
    }
  
    // Ha nincs jogosultság, akkor a fallback-et jelenítjük meg
    if (!hasPermission) {
      return <>{fallback}</>;
    }
  
    // Ha van jogosultság, akkor megjelenítjük a gyermek elemeket
    return <>{children}</>;
  };

export default PermissionGate;
