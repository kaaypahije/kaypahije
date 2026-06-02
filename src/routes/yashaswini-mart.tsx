import { useEffect, useMemo, useState } from "react";
import { BusinessCard } from "@/components/site/BusinessCard";
import {
  isYashaswiniMartCategoryName,
  mapApiBusinessToSite,
  mergeWithLegacyYashaswiniBusinesses,
  type Business,
  yashaswiniMartCategoryNames,
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

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();

    for (const business of cards) {
      const key = normalizeCategoryKey(business.category);
      counts.set(key, (counts.get(key) || 0) + 1);
    }

    return counts;
  }, [cards]);

  const visibleCards = useMemo(() => {
    if (activeCategory === ALL_CATEGORIES) {
      return cards;
    }

    return cards.filter((business) => normalizeCategoryKey(business.category) === activeCategory);
  }, [activeCategory, cards]);

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 pt-10 pb-16 md:pt-14 md:pb-24">
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-flex rounded-full bg-accent/10 text-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider">
          Yashaswini Mart
        </span>
        <h1 className="mt-3 text-4xl md:text-5xl font-extrabold">All Yashaswini Mart Listings</h1>
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
                    : "bg-[#f7f9fc] text-[#425071] border border-[#e3e9f2] hover:bg-[#eef3f9] hover:border-[#d8e1ee]"
                }`}
              >
                All
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                    activeCategory === ALL_CATEGORIES ? "bg-white/15 text-white" : "bg-white text-[#425071]"
                  }`}
                >
                  {cards.length}
                </span>
              </button>

              {yashaswiniMartCategoryNames.map((category) => {
                const key = normalizeCategoryKey(category);
                const count = categoryCounts.get(key) || 0;
                const isActive = activeCategory === key;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(key)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "bg-gradient-to-r from-[#1f315f] to-[#3f568a] text-white shadow-[0_10px_24px_-14px_rgba(31,49,95,0.55)] ring-1 ring-[#1f315f]/10"
                        : "bg-[#f7f9fc] text-[#425071] border border-[#e3e9f2] hover:bg-[#eef3f9] hover:border-[#d8e1ee]"
                    }`}
                  >
                    {category}
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
            {loading ? "Loading categories..." : `${visibleCards.length} result${visibleCards.length === 1 ? "" : "s"}`}
          </div>
        </div>
      </div>

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading ? (
          <div className="col-span-full rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
            Loading Yashaswini Mart listings...
          </div>
        ) : visibleCards.length > 0 ? (
          visibleCards.map((business, index) => <BusinessCard key={business.id} b={business} index={index} />)
        ) : (
          <div className="col-span-full rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
            No listings found in this category yet.
          </div>
        )}
      </div>
    </section>
  );
}
