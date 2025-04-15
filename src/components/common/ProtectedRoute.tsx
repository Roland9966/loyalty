import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.tsx";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Csak a bejelentkezés állapotát ellenőrizzük, ne a useEffect-ben
  if (!isAuthenticated) {
    // Csak a pathname-t adjuk át, ne a teljes location objektumot
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Jogosultság ellenőrzése
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;