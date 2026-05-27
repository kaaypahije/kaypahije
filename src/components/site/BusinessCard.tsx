import { Link } from "react-router-dom";
import { Star, MapPin, Phone, BadgeCheck } from "lucide-react";
import { businessImage, type Business } from "@/data/businesses";

export function BusinessCard({ b, index = 0 }: { b: Business; index?: number }) {
  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-card border border-border shadow-soft hover-lift animate-fade-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={businessImage(b)}
          alt={b.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur px-2.5 py-1 text-xs font-bold text-foreground shadow">
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> {b.rating}
            <span className="text-muted-foreground font-normal">({b.reviews})</span>
          </span>
          {b.verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground shadow">
              <BadgeCheck className="h-3 w-3" /> Verified
            </span>
          )}
        </div>
        {b.featured && (
          <span className="absolute bottom-3 left-3 rounded-full bg-primary/90 backdrop-blur px-2.5 py-1 text-xs font-semibold text-primary-foreground">
            ⭐ Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">{b.category}</p>
        <h3 className="mt-1 text-lg font-bold text-foreground line-clamp-1">{b.name}</h3>
        <p className="mt-1 flex items-start gap-1 text-sm text-muted-foreground line-clamp-1">
          <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-accent" /> {b.address}
        </p>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{b.description}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {b.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-center gap-3 pt-4 border-t border-border">
          <a
            href={`tel:${b.phone}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground hover:bg-gradient-accent hover:text-accent-foreground transition"
            aria-label="Call"
          >
            <Phone className="h-4 w-4" />
          </a>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${b.name}, ${b.address}`)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground transition"
            aria-label="Location"
          >
            <MapPin className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
