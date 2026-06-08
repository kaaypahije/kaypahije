export type StatusType = "active" | "inactive";

export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  description: string | null;
  featured: boolean;
  status: StatusType;
  createdAt: string;
  updatedAt: string;
}

export interface Subcategory {
  id: number;
  categoryId: number;
  name: string;
  slug: string;
  image: string | null;
  description: string | null;
  status: StatusType;
  createdAt: string;
  updatedAt: string;
  category?: Pick<Category, "id" | "name" | "slug" | "status">;
}

export interface BusinessGallery {
  id: number;
  businessId: number;
  image: string;
  createdAt?: string;
}

export interface Business {
  id: number;
  categoryId: number;
  subcategoryId: number;
  businessName: string;
  slug: string;
  price?: string | null;
  priceLabel?: string | null;
  logo: string | null;
  banner: string | null;
  mobile: string;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
  address: string;
  area: string | null;
  city: string;
  state: string;
  pincode: string | null;
  mapLink: string | null;
  latitude: string | null;
  longitude: string | null;
  description: string | null;
  services: string[];
  openingTime: string | null;
  closingTime: string | null;
  featured: boolean;
  verified: boolean;
  status: StatusType;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
  updatedAt: string;
  category?: Pick<Category, "id" | "name" | "slug" | "status">;
  subcategory?: Pick<Subcategory, "id" | "name" | "slug" | "status" | "categoryId">;
  gallery?: BusinessGallery[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiListResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
}

export interface ApiSingleResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface DashboardStats {
  cards: {
    totalCategories: number;
    totalSubcategories: number;
    totalBusinesses: number;
    featuredBusinesses: number;
    verifiedBusinesses: number;
    activeListings: number;
  };
  monthlyBusinesses: Array<{
    key: string;
    label: string;
    count: number;
  }>;
  recentBusinesses: Business[];
}

export interface HeroSettings {
  heroBannerPrimary: string | null;
  heroBannerSecondary: string | null;
}
