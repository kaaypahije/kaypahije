import type {
  ApiListResponse,
  ApiSingleResponse,
  Business,
  Category,
  DashboardStats,
  Subcategory,
} from "@/types/directory";
import { request } from "./http";

interface AuthPayload {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
    };
  };
}

export function loginAdmin(payload: { email: string; password: string }) {
  return request<AuthPayload>("/api/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function registerAdmin(payload: { name: string; email: string; password: string }) {
  return request<AuthPayload>("/api/auth/register", {
    method: "POST",
    body: payload,
  });
}

export function fetchAuthUser(token: string) {
  return request<{ success: boolean; data: AuthPayload["data"]["user"] }>("/api/auth/me", {
    token,
  });
}

export function fetchDashboardStats(token: string) {
  return request<{ success: boolean; data: DashboardStats }>("/api/dashboard/stats", { token });
}

export interface ListQuery {
  page?: number;
  limit?: number;
  q?: string;
  search?: string;
  status?: string;
  featured?: string;
  categoryId?: number;
  subcategoryId?: number;
  city?: string;
  verified?: string;
}

function buildQuery(query: ListQuery = {}) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }
    params.set(key, String(value));
  });
  const serialized = params.toString();
  return serialized ? `?${serialized}` : "";
}

export function fetchCategories(query: ListQuery = {}) {
  return request<ApiListResponse<Category>>(`/api/categories${buildQuery(query)}`);
}

export function createCategory(token: string, formData: FormData) {
  return request<ApiSingleResponse<Category>>("/api/categories", {
    method: "POST",
    body: formData,
    token,
    isFormData: true,
  });
}

export function updateCategory(token: string, id: number, formData: FormData) {
  return request<ApiSingleResponse<Category>>(`/api/categories/${id}`, {
    method: "PUT",
    body: formData,
    token,
    isFormData: true,
  });
}

export function deleteCategory(token: string, id: number) {
  return request<{ success: boolean; message: string }>(`/api/categories/${id}`, {
    method: "DELETE",
    token,
  });
}

export function fetchSubcategories(query: ListQuery = {}) {
  return request<ApiListResponse<Subcategory>>(`/api/subcategories${buildQuery(query)}`);
}

export function fetchSubcategoriesByCategory(categoryId: number) {
  return request<{ success: boolean; data: Subcategory[] }>(`/api/subcategories/category/${categoryId}`);
}

export function createSubcategory(token: string, formData: FormData) {
  return request<ApiSingleResponse<Subcategory>>("/api/subcategories", {
    method: "POST",
    body: formData,
    token,
    isFormData: true,
  });
}

export function updateSubcategory(token: string, id: number, formData: FormData) {
  return request<ApiSingleResponse<Subcategory>>(`/api/subcategories/${id}`, {
    method: "PUT",
    body: formData,
    token,
    isFormData: true,
  });
}

export function deleteSubcategory(token: string, id: number) {
  return request<{ success: boolean; message: string }>(`/api/subcategories/${id}`, {
    method: "DELETE",
    token,
  });
}

export function fetchBusinesses(query: ListQuery = {}) {
  return request<ApiListResponse<Business>>(`/api/businesses${buildQuery(query)}`);
}

export function fetchBusinessById(id: number | string) {
  return request<ApiSingleResponse<Business>>(`/api/businesses/${id}`);
}

export function fetchBusinessesByCategory(categoryId: number, limit = 24) {
  return request<ApiListResponse<Business>>(
    `/api/businesses/category/${categoryId}${buildQuery({ limit })}`,
  );
}

export function fetchBusinessesBySubcategory(subcategoryId: number, limit = 24) {
  return request<ApiListResponse<Business>>(
    `/api/businesses/subcategory/${subcategoryId}${buildQuery({ limit })}`,
  );
}

export function fetchFeaturedBusinesses(limit = 20) {
  return request<{ success: boolean; data: Business[] }>(`/api/businesses/featured${buildQuery({ limit })}`);
}

export function fetchVerifiedBusinesses(limit = 20) {
  return request<{ success: boolean; data: Business[] }>(`/api/businesses/verified${buildQuery({ limit })}`);
}

export function searchBusinesses(q: string, limit = 20) {
  return request<{ success: boolean; data: Business[] }>(
    `/api/businesses/search${buildQuery({ q, limit })}`,
  );
}

export function createBusiness(token: string, formData: FormData) {
  return request<ApiSingleResponse<Business>>("/api/businesses", {
    method: "POST",
    body: formData,
    token,
    isFormData: true,
  });
}

export function updateBusiness(token: string, id: number, formData: FormData) {
  return request<ApiSingleResponse<Business>>(`/api/businesses/${id}`, {
    method: "PUT",
    body: formData,
    token,
    isFormData: true,
  });
}

export function deleteBusiness(token: string, id: number) {
  return request<{ success: boolean; message: string }>(`/api/businesses/${id}`, {
    method: "DELETE",
    token,
  });
}
