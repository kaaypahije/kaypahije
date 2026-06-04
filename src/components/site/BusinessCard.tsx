import { MapPin, Phone, BadgeCheck, MessageCircle, Navigation, IndianRupee } from "lucide-react";
import { Link } from "react-router-dom";
import {
  businessImage,
  isYashaswiniMartCategoryName,
  normalizeCardPriceText,
  type Business,
} from "@/data/businesses";

export function BusinessCard({ b, index = 0 }: { b: Business; index?: number }) {
  const directionLink =
    b.imageLink ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${b.name}, ${b.address}`)}`;

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-white border border-[#e7ebf4] shadow-[0_16px_34px_-24px_rgba(15,40,110,0.55)] hover:-translate-y-1 hover:shadow-[0_20px_44px_-24px_rgba(240,130,45,0.45)] transition-all duration-300 animate-fade-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={businessImage(b)}
          alt={b.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        <div className="absolute inset-x-0 top-0 flex items-start justify-end p-3">
          {b.verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground shadow">
              <BadgeCheck className="h-3 w-3" /> Verified
            </span>
          )}
        </div>

        {b.featured && (
          <span className="absolute bottom-3 left-3 rounded-full bg-[#1e2d61] px-2.5 py-1 text-xs font-semibold text-white">
            Star Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">{b.category}</p>
        <Link to={`/listings/${b.slug}`} className="mt-1 block">
          <h3 className="text-lg font-bold leading-snug text-foreground line-clamp-2 min-h-[3.5rem] hover:text-accent transition-colors">
            {b.name}
          </h3>
        </Link>

        <p className="mt-1 flex items-start gap-1 text-sm text-muted-foreground line-clamp-2 min-h-[2.75rem]">
          <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-accent" /> {b.address}
        </p>

        {isYashaswiniMartCategoryName(b.category) ? (
          <div className="mt-3 inline-flex items-center gap-1.5 self-start rounded-full border border-[#ffd8b0] bg-[#fff6ec] px-3 py-1 text-sm font-semibold text-[#c96a00]">
            <IndianRupee className="h-3.5 w-3.5" />
            <span>{normalizeCardPriceText(b.price)}</span>
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-1.5">
          {b.tags.slice(0, 3).map((t) => (
            <span key={t} className="rounded-full bg-[#edf2fb] px-2.5 py-0.5 text-xs text-[#2b3a64]">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-center gap-3 pt-4 border-t border-border">
          <a
            href={`tel:${b.phone}`}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#ebf0f8] text-[#22315c] hover:bg-gradient-accent hover:text-white transition"
            aria-label="Call now"
          >
            <Phone className="h-4 w-4" />
          </a>

          <a
            href={`https://wa.me/${b.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#ebf0f8] text-[#22315c] hover:bg-[#25D366] hover:text-white transition"
            aria-label="WhatsApp"
          >
            <MessageCircle className="h-4 w-4" />
          </a>

          <a
            href={directionLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#ebf0f8] text-[#22315c] hover:bg-primary hover:text-primary-foreground transition"
            aria-label="Get direction"
          >
            <Navigation className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
