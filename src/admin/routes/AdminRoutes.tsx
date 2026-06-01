import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "@/admin/layout/AdminLayout";
import { AdminProtectedRoute } from "@/admin/routes/AdminProtectedRoute";
import { AdminLoginPage } from "@/admin/pages/AdminLoginPage";
import { AdminDashboardPage } from "@/admin/pages/AdminDashboardPage";
import { AdminCategoriesPage } from "@/admin/pages/AdminCategoriesPage";
import { AdminSubcategoriesPage } from "@/admin/pages/AdminSubcategoriesPage";
import { AdminBusinessesPage } from "@/admin/pages/AdminBusinessesPage";

export function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="subcategories" element={<AdminSubcategoriesPage />} />
        <Route path="businesses" element={<AdminBusinessesPage />} />
      </Route>
      <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
