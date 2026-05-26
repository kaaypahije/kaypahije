import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import { categories } from "@/data/businesses";

type IconName = keyof typeof Icons;

export function CategoryGrid({ limit }: { limit?: number }) {
  const items = limit ? categories.slice(0, limit) : categories;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
      {items.map((c, i) => {
        const Icon = (Icons[c.icon as IconName] || Icons.Circle) as React.ComponentType<{
          className?: string;
        }>;
        return (
          <Link
            key={c.name}
            to={`/listings?category=${encodeURIComponent(c.name)}`}
            className="group relative flex flex-col items-center justify-center gap-3 rounded-2xl bg-card border border-border p-5 hover-lift animate-fade-up"
            style={{ animationDelay: `${i * 30}ms` }}
          >
            <div
              className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${c.color} grid place-items-center text-white shadow-soft group-hover:scale-110 transition-transform`}
            >
              <Icon className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-center text-foreground">{c.name}</p>
          </Link>
        );
      })}
    </div>
  );
}
