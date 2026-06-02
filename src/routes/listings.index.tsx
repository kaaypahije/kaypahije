import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";
import { BusinessCard } from "@/components/site/BusinessCard";
import {
  cities,
  legacyBusinesses,
  legacyCategories,
  mapApiBusinessToSite,
  mapApiCategoryToSite,
  mergeWithLegacyCategories,
  type Business,
  type SiteCategory,
} from "@/data/businesses";
import { fetchBusinesses, fetchCategories, fetchSubcategories } from "@/services/api";
import type { Subcategory } from "@/types/directory";

function slugifyText(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ListingsPage() {
  const [searchParams] = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [subcategory, setSubcategory] = useState(searchParams.get("subcategory") ?? "");
  const [subcategoryIdParam, setSubcategoryIdParam] = useState(searchParams.get("subcategoryId") ?? "");
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<SiteCategory[]>(legacyCategories);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setQ(searchParams.get("q") ?? "");
    setCity(searchParams.get("city") ?? "");
    setCategory(searchParams.get("category") ?? "");
    setSubcategory(searchParams.get("subcategory") ?? "");
    setSubcategoryIdParam(searchParams.get("subcategoryId") ?? "");
  }, [searchParams]);

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      try {
        const response = await fetchCategories({ page: 1, limit: 200, status: "active" });
        if (!active) {
          return;
        }
        const mapped = response.data.map((item, index) => mapApiCategoryToSite(item, index));
        setCategories(mergeWithLegacyCategories(mapped));
      } catch (_error) {
        if (active) {
          setCategories(legacyCategories);
        }
      }
    }

    loadCategories();

    return () => {
      active = false;
    };
  }, []);

  const selectedCategory = useMemo(() => {
    const lowered = category.trim().toLowerCase();
    if (!lowered) {
      return null;
    }

    return (
      categories.find((item) => item.slug.toLowerCase() === lowered || item.name.toLowerCase() === lowered) || null
    );
  }, [categories, category]);

  useEffect(() => {
    let active = true;

    async function loadSubcategories() {
      if (!selectedCategory?.id) {
        setSubcategories([]);
        return;
      }

      try {
        const response = await fetchSubcategories({
          page: 1,
          limit: 300,
          status: "active",
          categoryId: selectedCategory.id,
        });

        if (!active) {
          return;
        }

        setSubcategories(response.data);
      } catch (_error) {
        if (active) {
          setSubcategories([]);
        }
      }
    }

    loadSubcategories();

    return () => {
      active = false;
    };
  }, [selectedCategory?.id]);

  useEffect(() => {
    let active = true;

    async function loadBusinesses() {
      try {
        setLoading(true);

        const normalizedSubcategory = subcategory.trim().toLowerCase();
        const rawSubcategoryId = Number(subcategoryIdParam);
        const hasNumericSubcategoryId = Number.isInteger(rawSubcategoryId) && rawSubcategoryId > 0;

        let selectedSubcategoryId: number | undefined;
        if (hasNumericSubcategoryId) {
          selectedSubcategoryId = rawSubcategoryId;
        } else if (normalizedSubcategory) {
          const matched = subcategories.find(
            (item) =>
              item.slug.toLowerCase() === normalizedSubcategory ||
              item.name.toLowerCase() === normalizedSubcategory,
          );
          selectedSubcategoryId = matched?.id;
        }

        const response = await fetchBusinesses({
          page: 1,
          limit: 120,
          status: "active",
          search: q,
          city,
          categoryId: selectedCategory?.id,
          subcategoryId: selectedSubcategoryId,
        });

        if (!active) {
          return;
        }

        const apiBusinesses = response.data.map(mapApiBusinessToSite);
        const merged = [...apiBusinesses];
        const existing = new Set(apiBusinesses.map((item) => item.slug));

        for (const item of legacyBusinesses) {
          if (!existing.has(item.slug)) {
            merged.push(item);
            existing.add(item.slug);
          }
        }

        setBusinesses(merged);
      } catch (_error) {
        if (active) {
          setBusinesses(legacyBusinesses);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    const timer = setTimeout(loadBusinesses, 250);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [q, city, selectedCategory?.id, subcategory, subcategoryIdParam, subcategories]);

  const filtered = useMemo(() => {
    const normalizedQuery = q.trim().toLowerCase();
    const normalizedCategory = category.trim().toLowerCase();
    const normalizedSubcategory = subcategory.trim().toLowerCase();
    const rawSubcategoryId = Number(subcategoryIdParam);
    const hasNumericSubcategoryId = Number.isInteger(rawSubcategoryId) && rawSubcategoryId > 0;

    return businesses.filter((business) => {
      if (normalizedQuery) {
        const haystack =
          `${business.name} ${business.description} ${business.category} ${business.tags.join(" ")}`.toLowerCase();
        if (!haystack.includes(normalizedQuery)) {
          return false;
        }
      }

      if (city && business.city !== city) {
        return false;
      }

      if (normalizedCategory) {
        const businessCategorySlug = slugifyText(business.category);
        if (businessCategorySlug !== normalizedCategory && business.category.toLowerCase() !== normalizedCategory) {
          return false;
        }
      }

      if (normalizedSubcategory) {
        if (hasNumericSubcategoryId && business.subcategoryId) {
          if (business.subcategoryId !== rawSubcategoryId) {
            return false;
          }
        } else {
          const businessSubcategoryName = (business.subcategory || "").toLowerCase();
          const businessSubcategorySlug = business.subcategorySlug
            ? business.subcategorySlug.toLowerCase()
            : slugifyText(business.subcategory || "");

          if (
            businessSubcategoryName !== normalizedSubcategory &&
            businessSubcategorySlug !== normalizedSubcategory
          ) {
            return false;
          }
        }
      }

      return true;
    });
  }, [businesses, q, city, category, subcategory, subcategoryIdParam]);

  return (
    <>
      <section className="bg-gradient-hero text-primary-foreground py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-extrabold">Browse Listings</h1>
          <p className="mt-2 text-white/75">{loading ? "Loading..." : `${filtered.length} businesses found`}</p>
          <div className="mt-6 rounded-2xl glass p-2 flex flex-col md:flex-row gap-2">
            <div className="flex items-center gap-2 px-3 py-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search businesses..."
                className="bg-transparent text-foreground placeholder:text-muted-foreground w-full text-sm focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2 px-3 py-2 md:border-l border-border md:w-44">
              <MapPin className="h-4 w-4 text-accent" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="bg-transparent text-foreground w-full text-sm focus:outline-none"
              >
                <option value="">All Cities</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowFilters((s) => !s)}
              className="md:hidden inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6 py-10">
        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          <aside className={`${showFilters ? "block" : "hidden"} lg:block space-y-6`}>
            <div className="rounded-2xl bg-card border border-border p-5">
              <h3 className="font-bold mb-3">Category</h3>
              <div className="space-y-1.5 max-h-72 overflow-y-auto">
                <button
                  onClick={() => {
                    setCategory("");
                    setSubcategory("");
                    setSubcategoryIdParam("");
                  }}
                  className={`w-full text-left rounded-lg px-3 py-1.5 text-sm ${!category ? "bg-accent/10 text-accent font-semibold" : "hover:bg-secondary"}`}
                >
                  All Categories
                </button>
                {categories.map((c) => {
                  const isActive =
                    category.toLowerCase() === c.slug.toLowerCase() ||
                    category.toLowerCase() === c.name.toLowerCase();

                  return (
                    <button
                      key={c.slug}
                      onClick={() => {
                        setCategory(c.slug);
                        setSubcategory("");
                        setSubcategoryIdParam("");
                      }}
                      className={`w-full text-left rounded-lg px-3 py-1.5 text-sm ${isActive ? "bg-accent/10 text-accent font-semibold" : "hover:bg-secondary"}`}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <div>
            {loading ? (
              <div className="rounded-2xl bg-card border border-border p-12 text-center">
                <p className="text-lg font-semibold">Loading businesses...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl bg-card border border-border p-12 text-center">
                <p className="text-lg font-semibold">No results found</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try adjusting your filters or search terms.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((b, i) => (
                  <BusinessCard key={b.id} b={b} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
