import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";
import { businesses, cities, categories } from "@/data/businesses";
import { BusinessCard } from "@/components/site/BusinessCard";

export function ListingsPage() {
  const [searchParams] = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return businesses.filter((b) => {
      if (
        q &&
        !`${b.name} ${b.description} ${b.category} ${b.tags.join(" ")}`
          .toLowerCase()
          .includes(q.toLowerCase())
      )
        return false;
      if (city && b.city !== city) return false;
      if (category && b.category !== category) return false;
      return true;
    });
  }, [q, city, category]);

  return (
    <>
      <section className="bg-gradient-hero text-primary-foreground py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-extrabold">Browse Listings</h1>
          <p className="mt-2 text-white/75">{filtered.length} businesses found</p>
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
                  onClick={() => setCategory("")}
                  className={`w-full text-left rounded-lg px-3 py-1.5 text-sm ${!category ? "bg-accent/10 text-accent font-semibold" : "hover:bg-secondary"}`}
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setCategory(c.name)}
                    className={`w-full text-left rounded-lg px-3 py-1.5 text-sm ${category === c.name ? "bg-accent/10 text-accent font-semibold" : "hover:bg-secondary"}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div>
            {filtered.length === 0 ? (
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
