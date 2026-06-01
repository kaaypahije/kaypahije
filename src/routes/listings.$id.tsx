import { Link, useParams } from "react-router-dom";
import {
  Star,
  MapPin,
  Phone,
  MessageCircle,
  BadgeCheck,
  Clock,
  Share2,
  Heart,
  ArrowLeft,
  Send,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { BusinessCard } from "@/components/site/BusinessCard";
import { fetchBusinessById, fetchBusinesses } from "@/services/api";
import type { Business as ApiBusiness } from "@/types/directory";
import { mapApiBusinessToSite } from "@/data/businesses";
import { getApiBaseUrl } from "@/services/http";

const API_BASE = getApiBaseUrl();

function resolveImage(path?: string | null) {
  if (!path) {
    return "";
  }
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${API_BASE}${path}`;
}

function primaryImage(business: ApiBusiness) {
  return (
    resolveImage(business.banner) ||
    resolveImage(business.logo) ||
    resolveImage(business.gallery?.[0]?.image) ||
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=70"
  );
}

function BusinessNotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Business not found</h1>
      <Link
        to="/listings"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-accent px-5 py-2.5 font-semibold text-accent-foreground"
      >
        Back to listings
      </Link>
    </div>
  );
}

export function ListingDetailPage() {
  const { id } = useParams();
  const [business, setBusiness] = useState<ApiBusiness | null>(null);
  const [related, setRelated] = useState<ApiBusiness[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!id) {
        if (active) {
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        const response = await fetchBusinessById(id);
        if (!active) {
          return;
        }

        const selected = response.data;
        setBusiness(selected);

        const relatedResponse = await fetchBusinesses({
          page: 1,
          limit: 12,
          categoryId: selected.categoryId,
          status: "active",
        });

        if (!active) {
          return;
        }

        setRelated(relatedResponse.data.filter((item) => item.id !== selected.id).slice(0, 3));
      } catch (_error) {
        if (active) {
          setBusiness(null);
          setRelated([]);
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
  }, [id]);

  const siteBusiness = useMemo(() => (business ? mapApiBusinessToSite(business) : null), [business]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="text-muted-foreground">Loading business details...</p>
      </div>
    );
  }

  if (!business || !siteBusiness) {
    return <BusinessNotFound />;
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.businessName,
    image: primaryImage(business),
    address: business.address,
    telephone: business.mobile,
    url: typeof window !== "undefined" ? window.location.href : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="bg-gradient-soft border-b border-border">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-4">
          <Link
            to="/listings"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" /> Back to listings
          </Link>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 md:px-6 py-8 md:py-12">
        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          <div>
            <div className="relative overflow-hidden rounded-3xl aspect-[16/9] shadow-card">
              <img src={primaryImage(business)} alt={business.businessName} className="h-full w-full object-cover" />
              <div className="absolute top-4 left-4 flex gap-2">
                {business.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-accent px-3 py-1 text-xs font-semibold text-accent-foreground shadow">
                    <BadgeCheck className="h-3.5 w-3.5" /> Verified
                  </span>
                )}
                {business.featured && (
                  <span className="rounded-full bg-primary/90 backdrop-blur px-3 py-1 text-xs font-semibold text-primary-foreground">
                    Featured
                  </span>
                )}
              </div>
            </div>

            <div className="mt-8">
              <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                {business.category?.name || "Business"}
              </p>
              <h1 className="mt-2 text-3xl md:text-4xl font-extrabold">{business.businessName}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 px-3 py-1 font-semibold">
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" /> 4.5
                  <span className="text-muted-foreground font-normal">(Directory rating)</span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-accent" />
                  {[business.area, business.city, business.state].filter(Boolean).join(", ")}
                </span>
                <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <Clock className="h-4 w-4" />
                  {business.openingTime && business.closingTime
                    ? `${business.openingTime} - ${business.closingTime}`
                    : "Hours available"}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {(business.services || []).map((tag) => (
                  <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-3xl bg-card border border-border p-6">
              <h2 className="text-xl font-bold">About</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                {business.description ||
                  "This business profile is managed via admin panel and updated dynamically."}
              </p>
            </div>

            <div className="mt-6 rounded-3xl bg-card border border-border p-6">
              <h2 className="text-xl font-bold">Location</h2>
              <div className="mt-4 aspect-[16/9] rounded-2xl bg-gradient-to-br from-secondary to-muted grid place-items-center">
                <div className="text-center px-4">
                  <MapPin className="h-10 w-10 text-accent mx-auto" />
                  <p className="mt-2 font-semibold">{business.address}</p>
                  {business.mapLink ? (
                    <a
                      href={business.mapLink}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-sm font-semibold text-accent"
                    >
                      Open on Google Maps
                    </a>
                  ) : (
                    <p className="text-xs text-muted-foreground">Map link not available</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 self-start">
            <div className="rounded-3xl bg-card border border-border p-6 shadow-soft">
              <h3 className="font-bold mb-4">Contact this business</h3>
              <div className="space-y-2">
                <a
                  href={`tel:${business.mobile}`}
                  className="flex items-center gap-3 rounded-2xl bg-gradient-accent text-accent-foreground p-3 font-semibold shadow-soft hover:shadow-glow transition"
                >
                  <Phone className="h-5 w-5" /> Call Now
                </a>
                <a
                  href={`https://wa.me/${business.whatsapp || business.mobile}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-2xl bg-[#25D366] text-white p-3 font-semibold hover:opacity-90 transition"
                >
                  <MessageCircle className="h-5 w-5" /> WhatsApp
                </a>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border p-2 text-sm hover:bg-secondary">
                  <Heart className="h-4 w-4" /> Save
                </button>
                <button className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border p-2 text-sm hover:bg-secondary">
                  <Share2 className="h-4 w-4" /> Share
                </button>
              </div>
            </div>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="rounded-3xl bg-card border border-border p-6 shadow-soft"
            >
              <h3 className="font-bold">Send an Inquiry</h3>
              <div className="mt-4 space-y-3">
                <input
                  placeholder="Your name"
                  className="w-full rounded-xl bg-secondary px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <input
                  placeholder="Phone number"
                  className="w-full rounded-xl bg-secondary px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <textarea
                  placeholder="Your message"
                  rows={3}
                  className="w-full rounded-xl bg-secondary px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <button className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 font-semibold hover:bg-primary-glow transition">
                  <Send className="h-4 w-4" /> Send Inquiry
                </button>
              </div>
            </form>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-secondary/50 py-16">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <h2 className="text-2xl md:text-3xl font-extrabold">Related Businesses</h2>
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((item, i) => (
                <BusinessCard key={item.id} b={mapApiBusinessToSite(item)} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
