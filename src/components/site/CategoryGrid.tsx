import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import { useEffect, useState } from "react";
import { legacyCategories, mapApiCategoryToSite, mergeWithLegacyCategories, type SiteCategory } from "@/data/businesses";
import { fetchCategories } from "@/services/api";

type IconName = keyof typeof Icons;

export function CategoryGrid({
  limit,
  mode = "default",
  onCategoryClick,
  activeCategory,
}: {
  limit?: number;
  mode?: "default" | "home";
  onCategoryClick?: (categoryName: string) => void;
  activeCategory?: string;
}) {
  const [categories, setCategories] = useState<SiteCategory[]>(legacyCategories);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await fetchCategories({ page: 1, limit: 200, status: "active" });
        if (!active) {
          return;
        }
        const mapped = response.data.map((category, index) => mapApiCategoryToSite(category, index));
        setCategories(mergeWithLegacyCategories(mapped));
      } catch (_error) {
        if (active) {
          setCategories(legacyCategories);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  const items = limit ? categories.slice(0, limit) : categories;
  const isHome = mode === "home";
  return (
    <div
      className={
        isHome
          ? "grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5"
          : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4"
      }
    >
      {items.map((c, i) => {
        const Icon = (Icons[c.icon as IconName] || Icons.Circle) as React.ComponentType<{
          className?: string;
        }>;
        const cardClass = `group relative flex flex-col items-center justify-center rounded-2xl bg-card border hover-lift animate-fade-up ${
          activeCategory === c.name ? "border-accent shadow-glow" : "border-border"
        } ${isHome ? "min-h-[170px] gap-4 p-6" : "gap-3 p-5"}`;

        if (onCategoryClick) {
          return (
            <button
              key={c.name}
              type="button"
              onClick={() => onCategoryClick(c.name)}
              className={cardClass}
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <div
                className={`rounded-2xl bg-gradient-to-br ${c.color} grid place-items-center text-white shadow-soft group-hover:scale-110 transition-transform ${
                  isHome ? "h-16 w-16" : "h-14 w-14"
                }`}
              >
                <Icon className={isHome ? "h-7 w-7" : "h-6 w-6"} />
              </div>
              <p className={`text-center text-foreground font-semibold ${isHome ? "text-lg" : "text-sm"}`}>
                {c.name}
              </p>
            </button>
          );
        }

        return (
          <Link
            key={c.name}
            to={`/listings?category=${encodeURIComponent(c.slug)}`}
            className={cardClass}
            style={{ animationDelay: `${i * 30}ms` }}
          >
            <div
              className={`rounded-2xl bg-gradient-to-br ${c.color} grid place-items-center text-white shadow-soft group-hover:scale-110 transition-transform ${
                isHome ? "h-16 w-16" : "h-14 w-14"
              }`}
            >
              <Icon className={isHome ? "h-7 w-7" : "h-6 w-6"} />
            </div>
            <p className={`text-center text-foreground font-semibold ${isHome ? "text-lg" : "text-sm"}`}>
              {c.name}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
