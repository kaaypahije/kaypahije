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
import { businesses, businessImage } from "@/data/businesses";
import { BusinessCard } from "@/components/site/BusinessCard";

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
  const b = businesses.find((x) => x.id === id);

  if (!b) return <BusinessNotFound />;

  const related = businesses.filter((x) => x.category === b.category && x.id !== b.id).slice(0, 3);
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: b.name,
    image: businessImage(b),
    address: b.address,
    telephone: b.phone,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: b.rating,
      reviewCount: b.reviews,
    },
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
              <img src={businessImage(b)} alt={b.name} className="h-full w-full object-cover" />
              <div className="absolute top-4 left-4 flex gap-2">
                {b.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-accent px-3 py-1 text-xs font-semibold text-accent-foreground shadow">
                    <BadgeCheck className="h-3.5 w-3.5" /> Verified
                  </span>
                )}
                {b.featured && (
                  <span className="rounded-full bg-primary/90 backdrop-blur px-3 py-1 text-xs font-semibold text-primary-foreground">
                    Featured
                  </span>
                )}
              </div>
            </div>

            <div className="mt-8">
              <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                {b.category}
              </p>
              <h1 className="mt-2 text-3xl md:text-4xl font-extrabold">{b.name}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 px-3 py-1 font-semibold">
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" /> {b.rating}{" "}
                  <span className="text-muted-foreground font-normal">({b.reviews} reviews)</span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-accent" /> {b.address}
                </span>
                <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <Clock className="h-4 w-4" /> Open now
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {b.tags.map((t: string) => (
                  <span key={t} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-3xl bg-card border border-border p-6">
              <h2 className="text-xl font-bold">About</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                {b.description} We pride ourselves on quality service and customer satisfaction.
                With years of experience in {b.category.toLowerCase()}, we serve the {b.city}
                community with care and professionalism.
              </p>
            </div>

            <div className="mt-6 rounded-3xl bg-card border border-border p-6">
              <h2 className="text-xl font-bold">Location</h2>
              <div className="mt-4 aspect-[16/9] rounded-2xl bg-gradient-to-br from-secondary to-muted grid place-items-center">
                <div className="text-center">
                  <MapPin className="h-10 w-10 text-accent mx-auto" />
                  <p className="mt-2 font-semibold">{b.address}</p>
                  <p className="text-xs text-muted-foreground">Google Maps integration</p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-3xl bg-card border border-border p-6">
              <h2 className="text-xl font-bold">Reviews</h2>
              <div className="mt-4 space-y-4">
                {[
                  { n: "Aarav P.", t: "Excellent service! Highly recommend.", r: 5 },
                  { n: "Sneha R.", t: "Quick response and professional team.", r: 5 },
                  { n: "Vikram T.", t: "Good experience overall, would visit again.", r: 4 },
                ].map((rv, i) => (
                  <div key={i} className="rounded-2xl bg-secondary/50 p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{rv.n}</p>
                      <div className="flex gap-0.5">
                        {Array.from({ length: rv.r }).map((_, j) => (
                          <Star key={j} className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        ))}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{rv.t}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 self-start">
            <div className="rounded-3xl bg-card border border-border p-6 shadow-soft">
              <h3 className="font-bold mb-4">Contact this business</h3>
              <div className="space-y-2">
                <a
                  href={`tel:${b.phone}`}
                  className="flex items-center gap-3 rounded-2xl bg-gradient-accent text-accent-foreground p-3 font-semibold shadow-soft hover:shadow-glow transition"
                >
                  <Phone className="h-5 w-5" /> Call Now
                </a>
                <a
                  href={`https://wa.me/${b.whatsapp}`}
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
              {related.map((r, i) => (
                <BusinessCard key={r.id} b={r} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
