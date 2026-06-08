import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { FloatingActions } from "@/components/site/FloatingActions";
import { AdminProtectedRoute } from "@/admin/routes/AdminProtectedRoute";
import { AdminLayout } from "@/admin/layout/AdminLayout";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const AboutPage = lazy(() => import("@/routes/about").then((module) => ({ default: module.AboutPage })));
const CategoriesPage = lazy(() => import("@/routes/categories").then((module) => ({ default: module.CategoriesPage })));
const ContactPage = lazy(() => import("@/routes/contact").then((module) => ({ default: module.ContactPage })));
const HomePage = lazy(() => import("@/routes/index").then((module) => ({ default: module.HomePage })));
const ListingDetailPage = lazy(() =>
  import("@/routes/listings.$id").then((module) => ({ default: module.ListingDetailPage })),
);
const ListingsPage = lazy(() => import("@/routes/listings.index").then((module) => ({ default: module.ListingsPage })));
const LoginPage = lazy(() => import("@/routes/login").then((module) => ({ default: module.LoginPage })));
const PostBusinessPage = lazy(() =>
  import("@/routes/post-business").then((module) => ({ default: module.PostBusinessPage })),
);
const PrivacyPage = lazy(() => import("@/routes/privacy").then((module) => ({ default: module.PrivacyPage })));
const TermsPage = lazy(() => import("@/routes/terms").then((module) => ({ default: module.TermsPage })));
const YashaswiniMartPage = lazy(() =>
  import("@/routes/yashaswini-mart").then((module) => ({ default: module.YashaswiniMartPage })),
);
const AdminLoginPage = lazy(() =>
  import("@/admin/pages/AdminLoginPage").then((module) => ({ default: module.AdminLoginPage })),
);
const AdminDashboardPage = lazy(() =>
  import("@/admin/pages/AdminDashboardPage").then((module) => ({ default: module.AdminDashboardPage })),
);
const AdminCategoriesPage = lazy(() =>
  import("@/admin/pages/AdminCategoriesPage").then((module) => ({ default: module.AdminCategoriesPage })),
);
const AdminSubcategoriesPage = lazy(() =>
  import("@/admin/pages/AdminSubcategoriesPage").then((module) => ({ default: module.AdminSubcategoriesPage })),
);
const AdminBusinessesPage = lazy(() =>
  import("@/admin/pages/AdminBusinessesPage").then((module) => ({ default: module.AdminBusinessesPage })),
);

function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-8xl font-extrabold text-gradient-accent">404</h1>
        <h2 className="mt-4 text-2xl font-bold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We couldn't find the page you're looking for.
        </p>
        <a
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground shadow-soft"
        >
          Back home
        </a>
      </div>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

function TrackPageViews() {
  const location = useLocation();

  useEffect(() => {
    if (!window.gtag) {
      return;
    }

    window.gtag("event", "page_view", {
      page_title: document.title,
      page_path: `${location.pathname}${location.search}${location.hash}`,
      page_location: window.location.href,
    });
  }, [location.pathname, location.search, location.hash]);

  return null;
}

function AppShell() {
  const { pathname } = useLocation();
  const hideChrome = pathname === "/login" || pathname.startsWith("/admin");

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <TrackPageViews />
      {!hideChrome && <Header />}
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center px-4 text-sm text-muted-foreground">
              Loading page...
            </div>
          }
        >
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
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/listings" element={<ListingsPage />} />
            <Route path="/listings/:id" element={<ListingDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/post-business" element={<PostBusinessPage />} />
            <Route path="/yashaswini-mart" element={<YashaswiniMartPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      {!hideChrome && <Footer />}
      {!hideChrome && <FloatingActions />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
