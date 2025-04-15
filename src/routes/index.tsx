import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "../components/common/ProtectedRoute.tsx";
import CustomerProfile from "../pages/customer/Profile.tsx";

// Lazy loading az oldalaknak
const Login = lazy(() => import("../pages/auth/Login.tsx"));
const CustomerRegister = lazy(
  () => import("../pages/auth/CustomerRegister.tsx")
);
const ShopRegister = lazy(() => import("../pages/auth/ShopRegister.tsx"));
const ShopHome = lazy(() => import("../pages/shop/Home.tsx"));
const ShopProfile = lazy(() => import("../pages/shop/Profile.tsx"));
const ShopEmployees = lazy(() => import("../pages/shop/Employees.tsx"));
const ShopScanner = lazy(() => import("../pages/shop/Scanner.tsx"));
const ShopTransactions = lazy(() => import("../pages/shop/Transactions.tsx"));
const NotFound = lazy(() => import("../pages/NotFound.tsx"));
const Unauthorized = lazy(() => import("../pages/Unauthorized.tsx"));
const ChangePassword = lazy(() => import("../pages/auth/ChangePassword.tsx"));
const ShopDetails = lazy(() => import("../pages/customer/ShopDetails.tsx"));
const ShopQRCode = lazy(() => import("../pages/customer/ShopQRCode.tsx"));
const CustomerHome = lazy(() => import("../pages/customer/Home.tsx"));
const CustomerPoints = lazy(() => import("../pages/customer/Points.tsx"));
// Egyszerű loader komponens
const Loading = () => <div>Betöltés...</div>;

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Nyilvános útvonalak */}
          <Route path="/login" element={<Login />} />
          <Route path="/register/customer" element={<CustomerRegister />} />
          <Route path="/register/shop" element={<ShopRegister />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Vásárlói útvonalak */}
          {/* <Route
            path="/customer"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <div>Vásárlói kezdőlap</div>
              </ProtectedRoute>
            }
          /> */}

          <Route
            path="/customer"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <CustomerHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/profile"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <CustomerProfile />
              </ProtectedRoute>
            }
          />
           <Route
            path="/customer/points"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <CustomerPoints />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/shops/:shopId"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <ShopDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/shops/:shopId/qrcode"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <ShopQRCode />
              </ProtectedRoute>
            }
          />

          {/* Üzleti útvonalak */}
          <Route
            path="/shop"
            element={
              <ProtectedRoute allowedRoles={["shop_admin", "shop_employee"]}>
                <ShopHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop/profile"
            element={
              <ProtectedRoute allowedRoles={["shop_admin"]}>
                <ShopProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop/employees"
            element={
              <ProtectedRoute allowedRoles={["shop_admin"]}>
                <ShopEmployees />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop/scanner"
            element={
              <ProtectedRoute allowedRoles={["shop_admin", "shop_employee"]}>
                <ShopScanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop/transactions"
            element={
              <ProtectedRoute allowedRoles={["shop_admin", "shop_employee"]}>
                <ShopTransactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/change-password"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <ChangePassword />
              </ProtectedRoute>
            }
          />

          <Route
            path="/shop/change-password"
            element={
              <ProtectedRoute allowedRoles={["shop_admin", "shop_employee"]}>
                <ChangePassword />
              </ProtectedRoute>
            }
          />

          {/* Alapértelmezett átirányítás */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* 404 oldal */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
