import { useEffect, useMemo, useState } from "react";
import { BusinessCard } from "@/components/site/BusinessCard";
import {
  extractPriceValue,
  isYashaswiniMartCategoryName,
  mapApiBusinessToSite,
  mergeWithLegacyYashaswiniBusinesses,
  type Business,
} from "@/data/businesses";
import { fetchBusinesses } from "@/services/api";

const ALL_CATEGORIES = "all";

function normalizeCategoryKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function YashaswiniMartPage() {
  const [cards, setCards] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "priceAsc" | "priceDesc">("default");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        const response = await fetchBusinesses({ page: 1, limit: 300, status: "active" });
        if (!active) {
          return;
        }

        const apiCards = response.data
          .map(mapApiBusinessToSite)
          .filter((item) => isYashaswiniMartCategoryName(item.category));

        const merged = mergeWithLegacyYashaswiniBusinesses(apiCards);
        setCards(merged);
      } catch (_error) {
        if (active) {
          setCards(mergeWithLegacyYashaswiniBusinesses([]));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  const baseFilteredCards = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return cards.filter((business) => {
      if (!searchTerm) {
        return true;
      }

      const haystack = [
        business.name,
        business.category,
        business.subcategory,
        business.city,
        business.address,
        business.description,
        ...(business.tags || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(searchTerm);
    });
  }, [cards, search]);

  const availableCategories = useMemo(() => {
    const labelsByKey = new Map<string, string>();

    for (const business of baseFilteredCards) {
      const key = normalizeCategoryKey(business.category);
      if (!labelsByKey.has(key)) {
        labelsByKey.set(key, business.category);
      }
    }

    return Array.from(labelsByKey.entries())
      .map(([key, label]) => ({ key, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [baseFilteredCards]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();

    for (const business of baseFilteredCards) {
      const key = normalizeCategoryKey(business.category);
      counts.set(key, (counts.get(key) || 0) + 1);
    }

    return counts;
  }, [baseFilteredCards]);

  const visibleCards = useMemo(() => {
    const scopedCards =
      activeCategory === ALL_CATEGORIES
        ? baseFilteredCards
        : baseFilteredCards.filter((business) => normalizeCategoryKey(business.category) === activeCategory);

    const sortedCards = [...scopedCards];

    if (sortBy === "priceAsc") {
      sortedCards.sort((left, right) => {
        const leftPrice = extractPriceValue(left.price) ?? Number.POSITIVE_INFINITY;
        const rightPrice = extractPriceValue(right.price) ?? Number.POSITIVE_INFINITY;
        return leftPrice - rightPrice;
      });
    } else if (sortBy === "priceDesc") {
      sortedCards.sort((left, right) => {
        const leftPrice = extractPriceValue(left.price) ?? Number.NEGATIVE_INFINITY;
        const rightPrice = extractPriceValue(right.price) ?? Number.NEGATIVE_INFINITY;
        return rightPrice - leftPrice;
      });
    }

    return sortedCards;
  }, [activeCategory, baseFilteredCards, sortBy]);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 pt-10 md:px-6 md:pb-24 md:pt-14">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
          Yashaswini Mart
        </span>
        <h1 className="mt-3 text-4xl font-extrabold md:text-5xl">All Yashaswini Mart Listings</h1>
        <p className="mt-3 text-muted-foreground">
          Explore all products and businesses managed through Yashaswini Mart.
        </p>
      </div>

      <div className="mt-8 rounded-[1.75rem] border border-[#e7edf7] bg-white/90 p-3 shadow-[0_14px_40px_-30px_rgba(15,40,110,0.35)] backdrop-blur">
        <div className="flex flex-col gap-3 px-2 py-1 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1 overflow-x-auto">
            <div className="flex min-w-max items-center gap-2 pb-1">
              <button
                type="button"
                onClick={() => setActiveCategory(ALL_CATEGORIES)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeCategory === ALL_CATEGORIES
                    ? "bg-gradient-to-r from-[#1f315f] to-[#3f568a] text-white shadow-[0_10px_24px_-14px_rgba(31,49,95,0.55)] ring-1 ring-[#1f315f]/10"
                    : "border border-[#e3e9f2] bg-[#f7f9fc] text-[#425071] hover:border-[#d8e1ee] hover:bg-[#eef3f9]"
                }`}
              >
                All
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                    activeCategory === ALL_CATEGORIES ? "bg-white/15 text-white" : "bg-white text-[#425071]"
                  }`}
                >
                  {baseFilteredCards.length}
                </span>
              </button>

              {availableCategories.map((category) => {
                const count = categoryCounts.get(category.key) || 0;
                const isActive = activeCategory === category.key;

                return (
                  <button
                    key={category.key}
                    type="button"
                    onClick={() => setActiveCategory(category.key)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "bg-gradient-to-r from-[#1f315f] to-[#3f568a] text-white shadow-[0_10px_24px_-14px_rgba(31,49,95,0.55)] ring-1 ring-[#1f315f]/10"
                        : "border border-[#e3e9f2] bg-[#f7f9fc] text-[#425071] hover:border-[#d8e1ee] hover:bg-[#eef3f9]"
                    }`}
                  >
                    {category.label}
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        isActive ? "bg-white/15 text-white" : "bg-white text-[#425071]"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        <div className="shrink-0 text-sm font-medium text-[#66738f]">
          {loading ? "Loading filters..." : `${visibleCards.length} result${visibleCards.length === 1 ? "" : "s"}`}
        </div>
      </div>

        <div className="mt-3 grid gap-3 border-t border-[#edf1f8] px-2 pt-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_auto]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products, tags, category..."
            className="rounded-2xl border border-[#e3e8f3] px-4 py-2.5 text-sm text-[#23325d] outline-none focus:border-[#f39a4f]"
          />
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as "default" | "priceAsc" | "priceDesc")}
            className="rounded-2xl border border-[#e3e8f3] bg-white px-4 py-2.5 text-sm text-[#23325d] outline-none focus:border-[#f39a4f]"
          >
            <option value="default">Default order</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
          </select>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSortBy("default");
              setActiveCategory(ALL_CATEGORIES);
            }}
            className="rounded-2xl border border-[#e3e8f3] px-4 py-2.5 text-sm font-semibold text-[#425071] hover:bg-[#f7f9fc]"
          >
            Clear filters
          </button>
        </div>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <div className="col-span-full rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
            Loading Yashaswini Mart listings...
          </div>
        ) : visibleCards.length > 0 ? (
          visibleCards.map((business, index) => <BusinessCard key={business.id} b={business} index={index} />)
        ) : (
          <div className="col-span-full rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
            No listings available yet.
          </div>
        )}
      </div>
    </section>
  );
}
