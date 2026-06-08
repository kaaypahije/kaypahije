import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  TrendingUp,
  Star,
  Users,
  BadgeCheck,
  Sparkles,
  ArrowRight,
  Quote,
  ChevronDown,
  Shield,
  Zap,
  Heart,
  ImageIcon,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BusinessCard } from "@/components/site/BusinessCard";
import { CategoryGrid } from "@/components/site/CategoryGrid";
import { DeferredSection } from "@/components/site/DeferredSection";
import {
  cities,
  isYashaswiniMartCategoryName,
  legacyBusinesses,
  mapApiBusinessToSite,
  mapApiSubcategoryToSite,
  mergeWithLegacyYashaswiniBusinesses,
  getLegacySubcategoriesForCategory,
  mergeSubcategoriesWithLegacyFallback,
  trendingSearches,
  type Business,
  type SiteCategory,
  type SiteSubcategory,
} from "@/data/businesses";
import { fetchBusinesses, fetchFeaturedBusinesses, fetchHeroSettings, fetchSubcategoriesByCategory } from "@/services/api";
import { buildApiUrl } from "@/services/http";

const stats = [
  { value: "35,000", label: "Happy Users", icon: Users },
  { value: "1,000+", label: "Total Listings", icon: BadgeCheck },
];

const features = [
  {
    icon: BadgeCheck,
    title: "Verified Listings",
    desc: "Every business is verified by our team for authenticity.",
  },
  {
    icon: Zap,
    title: "Lightning Fast Search",
    desc: "Find what you need in seconds with smart filters.",
  },
  {
    icon: Shield,
    title: "Trusted Reviews",
    desc: "Real reviews from real customers you can trust.",
  },
  {
    icon: Heart,
    title: "Made for India",
    desc: "Built with Indian local businesses & customers in mind.",
  },
];

const testimonials = [
  {
    name: "Priya S.",
    role: "Pune",
    text: "Found the best interior designer in my city within minutes. Loved the experience!",
    rating: 5,
  },
  {
    name: "Rahul M.",
    role: "Mumbai",
    text: "Booked a hospital appointment seamlessly. Verified listings give peace of mind.",
    rating: 5,
  },
  {
    name: "Anita K.",
    role: "Bengaluru",
    text: "As a small business owner, Kay Pahije brought me 3x more leads in a month.",
    rating: 5,
  },
];

const faqs = [
  {
    q: "How do I list my business on Kay Pahije?",
    a: "Click 'Post Business' in the header, fill in your details, and our team will verify and publish your listing within 24 hours.",
  },
  {
    q: "Is it free to list a business?",
    a: "Yes! Basic listings are completely free. We also offer premium plans with featured placement and lead management.",
  },
  {
    q: "How are businesses verified?",
    a: "We manually verify each business by phone, email, and documents to ensure authenticity for our users.",
  },
  {
    q: "Can I edit my listing later?",
    a: "Absolutely. Log in to your business dashboard anytime to update photos, hours, contact info and services.",
  },
  {
    q: "How do I report a wrong listing?",
    a: "Every business detail page has a 'Report' option. Our moderation team responds within 12 hours.",
  },
];

function listingsUrl(params: { q?: string; city?: string }) {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.city) search.set("city", params.city);
  const q = search.toString();
  return q ? `/listings?${q}` : "/listings";
}

function resolveHeroImage(path: string | null | undefined) {
  if (!path) {
    return "";
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return buildApiUrl(path);
}

const defaultHeroSlides = [
  {
    badge: "India's Modern Business Directory",
    headingTop: "Tumhala kay pahije?",
    headingBottom: "We'll find it for you.",
    description:
      "Discover 1M+ verified local businesses across India. Restaurants, services, hospitals, hotels - all in one beautifully simple place.",
    points: ["100% Verified", "Top Locations", "Affordable Options", "24/7 Support"],
    rightLabel: "Trusted Across India",
    rightValue: "1M+ Listings",
    heroImage:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
  },
  {
    badge: "Find Local. Choose Smart.",
    headingTop: "Trusted businesses are just one search away.",
    headingBottom: "",
    description:
      "Explore verified restaurants, hospitals, hotels, shops, and services near you - faster, easier, and all in one place.",
    points: ["Fast Search", "Rated Businesses", "Instant Contact", "Easy Compare"],
    rightLabel: "Search Smarter",
    rightValue: "500+ Cities",
    heroImage:
      "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1200&q=80",
  },
];

export function HomePage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [city, setCity] = useState("Pune");
  const [query, setQuery] = useState("");
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [heroSlides, setHeroSlides] = useState(defaultHeroSlides);
  const [featuredCards, setFeaturedCards] = useState<Business[]>([]);
  const [popularCards, setPopularCards] = useState<Business[]>([]);
  const [yashaswiniCards, setYashaswiniCards] = useState<Business[]>([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [loadDiscoverySections, setLoadDiscoverySections] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<SiteCategory | null>(null);
  const [subcategories, setSubcategories] = useState<SiteSubcategory[]>([]);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const subcategoryRequestRef = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [heroSlides.length]);

  useEffect(() => {
    let active = true;

    async function loadHeroSettings() {
      try {
        const response = await fetchHeroSettings();
        if (!active) {
          return;
        }

        setHeroSlides([
          {
            ...defaultHeroSlides[0],
            heroImage: response.data.heroBannerPrimary
              ? resolveHeroImage(response.data.heroBannerPrimary)
              : defaultHeroSlides[0].heroImage,
          },
          {
            ...defaultHeroSlides[1],
            heroImage: response.data.heroBannerSecondary
              ? resolveHeroImage(response.data.heroBannerSecondary)
              : defaultHeroSlides[1].heroImage,
          },
        ]);
      } catch (_error) {
        if (active) {
          setHeroSlides(defaultHeroSlides);
        }
      }
    }

    loadHeroSettings();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const onEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedCategory(null);
        setSubcategories([]);
      }
    };

    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  useEffect(() => {
    if (!loadDiscoverySections) {
      return;
    }

    let active = true;

    async function loadListings() {
      try {
        setListingsLoading(true);
        const [featuredResponse, recentResponse] = await Promise.all([
          fetchFeaturedBusinesses(8),
          fetchBusinesses({ page: 1, limit: 48, status: "active" }),
        ]);

        if (!active) {
          return;
        }

        const apiFeatured = featuredResponse.data.map(mapApiBusinessToSite);
        const apiPopular = recentResponse.data.map(mapApiBusinessToSite);

        const featuredMerged = [...apiFeatured];
        const featuredExisting = new Set(apiFeatured.map((item) => item.slug));
        for (const item of legacyBusinesses.filter((entry) => entry.featured)) {
          if (!featuredExisting.has(item.slug)) {
            featuredMerged.push(item);
            featuredExisting.add(item.slug);
          }
        }

        const popularMerged = [...apiPopular];
        const popularExisting = new Set(apiPopular.map((item) => item.slug));
        for (const item of legacyBusinesses) {
          if (!popularExisting.has(item.slug)) {
            popularMerged.push(item);
            popularExisting.add(item.slug);
          }
        }

        setFeaturedCards(featuredMerged.slice(0, 8));
        setPopularCards(popularMerged.slice(0, 8));

        const martCandidates = popularMerged.filter((item) => isYashaswiniMartCategoryName(item.category));
        const martMerged = mergeWithLegacyYashaswiniBusinesses(martCandidates);
        setYashaswiniCards(martMerged.slice(0, 8));
      } catch (_error) {
        if (active) {
          setFeaturedCards(legacyBusinesses.filter((item) => item.featured).slice(0, 8));
          setPopularCards(legacyBusinesses.slice(0, 8));
          setYashaswiniCards(mergeWithLegacyYashaswiniBusinesses([]).slice(0, 8));
        }
      } finally {
        if (active) {
          setListingsLoading(false);
        }
      }
    }

    loadListings();

    return () => {
      active = false;
    };
  }, [loadDiscoverySections]);

  const closeCategoryModal = () => {
    subcategoryRequestRef.current += 1;
    setSelectedCategory(null);
    setSubcategories([]);
    setLoadingSubcategories(false);
  };

  const handleCategoryClick = async (category: SiteCategory) => {
    const requestId = ++subcategoryRequestRef.current;
    setSelectedCategory(category);
    const fallbackSubcategories = getLegacySubcategoriesForCategory(category);
    setSubcategories(fallbackSubcategories);
    setLoadingSubcategories(fallbackSubcategories.length === 0);

    try {
      const response = await fetchSubcategoriesByCategory(category.id);
      if (requestId !== subcategoryRequestRef.current) {
        return;
      }
      const mapped = response.data.map(mapApiSubcategoryToSite);
      setSubcategories(mergeSubcategoriesWithLegacyFallback(category, mapped));
    } catch (_error) {
      if (requestId !== subcategoryRequestRef.current) {
        return;
      }
      if (fallbackSubcategories.length === 0) {
        closeCategoryModal();
        navigate(`/listings?category=${encodeURIComponent(category.slug)}`);
      }
    } finally {
      if (requestId === subcategoryRequestRef.current) {
        setLoadingSubcategories(false);
      }
    }
  };

  const handleSubcategoryClick = (subcategory: SiteSubcategory) => {
    if (!selectedCategory) {
      return;
    }

    closeCategoryModal();
    const subcategoryIdQuery = subcategory.id > 0 ? `&subcategoryId=${subcategory.id}` : "";
    navigate(
      `/listings?category=${encodeURIComponent(selectedCategory.slug)}&subcategory=${encodeURIComponent(subcategory.slug)}${subcategoryIdQuery}`,
    );
  };

  return (
    <>
      <section className="relative overflow-visible bg-gradient-hero text-primary-foreground">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, oklch(0.78 0.17 55 / 0.4) 0%, transparent 40%), radial-gradient(circle at 80% 80%, oklch(0.45 0.16 280 / 0.5) 0%, transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 md:px-6 py-10 md:py-16">
          <div className="max-w-6xl mx-auto animate-fade-up">
            <div className="relative min-h-[460px] md:min-h-[430px] lg:min-h-[390px] rounded-[2rem] border border-white/15 bg-white/10 p-4 md:p-5 backdrop-blur">
              {heroSlides.map((slide, idx) => (
                <div
                  key={slide.badge}
                  className={`absolute inset-0 transition-all duration-700 ease-out ${
                    idx === activeHeroSlide
                      ? "opacity-100 translate-x-0 pointer-events-auto"
                      : "opacity-0 translate-x-4 pointer-events-none"
                  }`}
                >
                  <div className="h-full w-full rounded-[1.5rem] bg-gradient-to-r from-[#f7dfcc]/95 via-[#f3c79f]/90 to-[#efb177]/85 p-6 md:p-8 text-[#1a2033] shadow-soft">
                    <div className="grid h-full items-center gap-6 md:grid-cols-[1.1fr_0.9fr]">
                      <div className="min-w-0">
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#ef8f37]/35 bg-[#fff3e9] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#de6b00]">
                          <Sparkles className="h-3.5 w-3.5" /> {slide.badge}
                        </span>
                        {idx === 0 ? (
                          <h1 className="mt-4 text-3xl md:text-5xl font-extrabold leading-tight text-[#25304d]">
                            Tumhala <span className="text-[#e77315]">kay pahije?</span>
                            <br />
                            <span className="text-[#2f3a57]">We'll find it for you.</span>
                          </h1>
                        ) : (
                          <h1 className="mt-4 text-3xl md:text-5xl font-extrabold leading-tight text-[#25304d]">
                            {slide.headingTop}
                          </h1>
                        )}
                        <p className="mt-4 max-w-2xl text-sm md:text-base text-[#3f4a66]">
                          {slide.description}
                        </p>
                        <div className="mt-6 grid grid-cols-2 gap-2 text-xs md:text-sm">
                          {slide.points.map((point) => (
                            <div key={point} className="rounded-xl bg-white/45 px-3 py-2 font-medium">
                              {point}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="relative hidden h-full min-h-[220px] overflow-hidden rounded-[1.2rem] md:block">
                        <img
                          src={slide.heroImage}
                          alt={slide.headingTop}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#e98336]/65 via-[#db6f1f]/55 to-[#c75c10]/75" />
                        <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/20" />
                        <div className="absolute -left-10 -bottom-10 h-44 w-44 rounded-full bg-white/10" />
                        <div className="absolute inset-0 flex items-end justify-center p-6">
                          <div className="rounded-2xl border border-white/30 bg-white/20 px-5 py-3 text-center text-white backdrop-blur">
                            <p className="text-xs uppercase tracking-wider text-white/80">
                              {slide.rightLabel}
                            </p>
                            <p className="mt-1 text-xl font-extrabold">{slide.rightValue}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-center gap-2">
              {heroSlides.map((slide, idx) => (
                <button
                  key={`${slide.badge}-indicator`}
                  type="button"
                  onClick={() => setActiveHeroSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all ${
                    idx === activeHeroSlide ? "w-8 bg-accent" : "w-2.5 bg-white/40 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </div>

          <div
            className="mt-10 max-w-4xl mx-auto animate-fade-up"
            style={{ animationDelay: "100ms" }}
          >
            <div className="rounded-3xl glass shadow-glow p-2 md:p-3 flex flex-col md:flex-row gap-2">
              <div className="flex items-center gap-2 px-4 py-3 md:border-r border-border md:w-48">
                <MapPin className="h-5 w-5 text-accent shrink-0" />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-transparent text-foreground font-medium text-sm focus:outline-none w-full"
                >
                  {cities.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 px-4 py-3 flex-1">
                <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search 'restaurants', 'AC repair', 'doctors'..."
                  className="bg-transparent text-foreground placeholder:text-muted-foreground text-sm w-full focus:outline-none"
                />
              </div>
              <Link
                to={listingsUrl({ q: query, city })}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-accent px-6 py-3 font-semibold text-accent-foreground shadow-soft hover:shadow-glow transition-all"
              >
                <Search className="h-4 w-4" /> Search
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="text-white/70 inline-flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5" /> Trending:
              </span>
              {trendingSearches.slice(0, 6).map((t) => (
                <Link
                  key={t}
                  to={listingsUrl({ q: t })}
                  className="rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-white/15 px-3 py-1 text-xs font-medium transition"
                >
                  {t}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="group glass rounded-2xl p-4 text-center animate-fade-up transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-glow"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <s.icon className="h-5 w-5 text-accent mx-auto transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110" />
                <p className="mt-2 text-2xl md:text-3xl font-extrabold text-foreground">
                  {s.value}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DeferredSection
        onVisible={() => setLoadDiscoverySections(true)}
        className="mx-auto max-w-7xl px-4 md:px-6 pt-16 md:pt-24 pb-8 md:pb-10"
        placeholder={
          <div className="rounded-3xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Categories and listings load as you scroll.
          </div>
        }
      >
        <section>
          <SectionHeader
            eyebrow="Explore"
            title="Browse by Category"
            subtitle="Pick a category to open its subcategories, then browse the matching business cards."
          />
          <div className="mt-10">
            <CategoryGrid
              limit={8}
              mode="home"
              excludeSlugs={["beauty-salon", "home-services"]}
              onCategoryClick={handleCategoryClick}
              activeCategory={selectedCategory?.slug || ""}
            />
          </div>
          <div className="mt-8 flex justify-center">
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-soft hover:shadow-glow transition-all"
            >
              Explore More <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </DeferredSection>

      {selectedCategory && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm p-4 md:p-6"
          onClick={closeCategoryModal}
        >
          <div
            className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-background p-5 md:p-8 shadow-2xl animate-fade-up"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold">{selectedCategory.name} Sub Categories</h2>
                <p className="mt-1 text-sm md:text-base text-muted-foreground">
                  Choose a suitable sub category under {selectedCategory.name}.
                </p>
              </div>
              <button
                type="button"
                onClick={closeCategoryModal}
                aria-label={`Close ${selectedCategory.name} sub categories`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border hover:bg-secondary transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {loadingSubcategories ? (
              <div className="mt-6 rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
                Loading subcategories...
              </div>
            ) : subcategories.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
                No subcategories available for this category.
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {subcategories.map((sub, index) => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => handleSubcategoryClick(sub)}
                    className="rounded-2xl bg-card border border-border p-5 animate-fade-up text-center hover:bg-secondary transition-colors"
                    style={{ animationDelay: `${index * 20}ms` }}
                  >
                    <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-rose-100 to-orange-100 grid place-items-center overflow-hidden">
                      {sub.image ? (
                        <img src={sub.image} alt={`${sub.name} icon`} className="h-12 w-12 object-contain" />
                      ) : (
                        <ImageIcon className="h-7 w-7 text-rose-500" />
                      )}
                    </div>
                    <p className="mt-3 text-sm md:text-base font-semibold leading-snug">{sub.name}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <DeferredSection
        className="mx-auto max-w-7xl px-4 md:px-6 pt-4 md:pt-6 pb-12 md:pb-16"
        placeholder={
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Yashaswini Mart listings load when needed.
          </div>
        }
      >
        <section>
          <h2 className="text-center text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground">
            Yashaswini Mart
          </h2>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {listingsLoading ? (
              <div className="col-span-full rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
                Loading Yashaswini Mart listings...
              </div>
            ) : yashaswiniCards.length > 0 ? (
              yashaswiniCards.slice(0, 4).map((b, i) => <BusinessCard key={b.id} b={b} index={i} />)
            ) : (
              <div className="col-span-full rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
                No Yashaswini Mart listings available yet.
              </div>
            )}
          </div>
          <div className="mt-8 flex justify-center">
            <Link
              to="/yashaswini-mart"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-soft hover:shadow-glow transition-all"
            >
              Explore More <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </DeferredSection>

      <DeferredSection
        className="mx-auto max-w-7xl px-4 md:px-6 pt-4 md:pt-2 pb-12 md:pb-16"
        placeholder={
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Featured listings load after the first section.
          </div>
        }
      >
        <section>
          <h2 className="text-center text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground">
            Featured Listings
          </h2>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {listingsLoading ? (
              <div className="col-span-full rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
                Loading featured listings...
              </div>
            ) : featuredCards.length > 0 ? (
              featuredCards.map((b, i) => <BusinessCard key={b.id} b={b} index={i} />)
            ) : (
              <div className="col-span-full rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
                No featured listings available yet.
              </div>
            )}
          </div>
        </section>
      </DeferredSection>

      <DeferredSection
        className="mx-auto max-w-7xl px-4 md:px-6 pt-8 md:pt-10 pb-16 md:pb-24"
        placeholder={
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Trending listings load when you scroll.
          </div>
        }
      >
        <section>
          <SectionHeader
            eyebrow="Popular near you"
            title="Trending in Your City"
            subtitle="What people are searching for right now."
          />
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {listingsLoading ? (
              <div className="col-span-full rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
                Loading trending listings...
              </div>
            ) : popularCards.length > 0 ? (
              popularCards.map((b, i) => <BusinessCard key={b.id} b={b} index={i} />)
            ) : (
              <div className="col-span-full rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
                No listings found right now.
              </div>
            )}
          </div>
        </section>
      </DeferredSection>

      <DeferredSection
        className="mx-auto max-w-7xl px-4 md:px-6 py-16 md:py-24"
        placeholder={
          <div className="rounded-3xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Trust and feature sections load later.
          </div>
        }
      >
        <section>
          <SectionHeader
            eyebrow="Why Kay Pahije"
            title="Built for trust. Designed for you."
            subtitle="A modern business directory that puts quality, transparency and speed first."
          />
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="group rounded-3xl bg-card border border-border p-6 hover-lift animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="h-12 w-12 rounded-2xl bg-gradient-accent grid place-items-center text-accent-foreground shadow-soft group-hover:scale-110 transition-transform">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </DeferredSection>

      <DeferredSection
        className="bg-primary text-primary-foreground py-16 md:py-24 relative overflow-hidden"
        placeholder={
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/70">
              Testimonials load after the page settles.
            </div>
          </div>
        }
      >
        <section>
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 80% 20%, oklch(0.78 0.17 55 / 0.5) 0%, transparent 50%)",
            }}
          />
          <div className="relative mx-auto max-w-7xl px-4 md:px-6">
            <SectionHeader eyebrow="Loved by thousands" title="What our users say" inverted />
            <div className="mt-12 grid md:grid-cols-3 gap-5">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="rounded-3xl bg-white/5 backdrop-blur border border-white/10 p-6 animate-fade-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <Quote className="h-8 w-8 text-accent" />
                  <p className="mt-4 text-base leading-relaxed text-white/90">"{t.text}"</p>
                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{t.name}</p>
                      <p className="text-xs text-white/60">{t.role}</p>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </DeferredSection>

      <DeferredSection
        className="mx-auto max-w-4xl px-4 md:px-6 py-16 md:py-24"
        placeholder={
          <div className="rounded-3xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            FAQ loads lower on the page.
          </div>
        }
      >
        <section>
          <SectionHeader
            eyebrow="FAQ"
            title="Frequently Asked Questions"
            subtitle="Everything you need to know about Kay Pahije."
          />
          <div className="mt-10 space-y-3">
            {faqs.map((f, i) => (
              <button
                key={i}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left rounded-2xl bg-card border border-border p-5 hover:border-accent/40 transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-semibold text-foreground">{f.q}</h3>
                  <ChevronDown
                    className={`h-5 w-5 text-accent shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </div>
                {openFaq === i && (
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                )}
              </button>
            ))}
          </div>
        </section>
      </DeferredSection>

      <DeferredSection
        className="mx-auto max-w-7xl px-4 md:px-6 pb-16 md:pb-24"
        placeholder={
          <div className="rounded-4xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Radio and final CTA load at the end.
          </div>
        }
      >
        <section>
          <div className="rounded-4xl bg-gradient-accent p-8 md:p-14 text-accent-foreground text-center shadow-glow">
            <span className="inline-flex items-center rounded-full border border-white/30 bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
              Live Radio
            </span>
            <h2 className="mt-4 text-3xl md:text-5xl font-extrabold">Tune in to Radio Parbhani 90.8 FM</h2>
            <p className="mt-4 max-w-xl mx-auto text-accent-foreground/90">
              Live music, local updates, and community stories from Parbhani.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <a
                href="https://liveradios.in/radio-parbhani-90-8.html"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-3 font-semibold shadow-soft hover:bg-primary-glow transition"
              >
                Listen Live <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
      </DeferredSection>
    </>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  inverted = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  inverted?: boolean;
}) {
  return (
    <div className={align === "center" ? "text-center max-w-2xl mx-auto" : "max-w-2xl"}>
      {eyebrow && (
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${inverted ? "bg-white/10 text-accent-glow" : "bg-accent/10 text-accent"}`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`mt-3 text-3xl md:text-4xl lg:text-5xl font-extrabold ${inverted ? "text-white" : "text-foreground"}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3 text-base ${inverted ? "text-white/70" : "text-muted-foreground"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
