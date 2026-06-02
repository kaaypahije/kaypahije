import { useEffect, useState } from "react";
import { BusinessCard } from "@/components/site/BusinessCard";
import {
  isYashaswiniMartCategoryName,
  mapApiBusinessToSite,
  mergeWithLegacyYashaswiniBusinesses,
  type Business,
} from "@/data/businesses";
import { fetchBusinesses } from "@/services/api";

export function YashaswiniMartPage() {
  const [cards, setCards] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

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

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading ? (
          <div className="col-span-full rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
            Loading Yashaswini Mart listings...
          </div>
        ) : cards.length > 0 ? (
          cards.map((business, index) => <BusinessCard key={business.id} b={business} index={index} />)
        ) : (
          <div className="col-span-full rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
            No Yashaswini Mart listings available yet.
          </div>
        )}
      </div>
    </section>
  );
}
