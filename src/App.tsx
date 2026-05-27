import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { FloatingActions } from "@/components/site/FloatingActions";
import { AboutPage } from "@/routes/about";
import { BlogPage } from "@/routes/blog";
import { CategoriesPage } from "@/routes/categories";
import { ContactPage } from "@/routes/contact";
import { FaqPage } from "@/routes/faqs";
import { HomePage } from "@/routes/index";
import { ListingDetailPage } from "@/routes/listings.$id";
import { ListingsPage } from "@/routes/listings.index";
import { LoginPage } from "@/routes/login";
import { PostBusinessPage } from "@/routes/post-business";
import { PrivacyPage } from "@/routes/privacy";
import { TermsPage } from "@/routes/terms";

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

function AppShell() {
  const { pathname } = useLocation();
  const hideChrome = pathname === "/login";

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      {!hideChrome && <Header />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faqs" element={<FaqPage />} />
          <Route path="/listings" element={<ListingsPage />} />
          <Route path="/listings/:id" element={<ListingDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/post-business" element={<PostBusinessPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
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
