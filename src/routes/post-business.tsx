import { CheckCircle2 } from "lucide-react";
import { categories, cities } from "@/data/businesses";

export function PostBusinessPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 md:px-6 py-16 md:py-24">
      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10">
        <div>
          <span className="inline-flex rounded-full bg-accent/10 text-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            Post Business
          </span>
          <h1 className="mt-3 text-4xl md:text-5xl font-extrabold">
            Grow your business with Kay Pahije.
          </h1>
          <p className="mt-4 text-muted-foreground">
            Reach millions of customers in your city. List for free, get verified, and start
            receiving leads in days.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Free basic listing forever",
              "Verified badge & trust signals",
              "Direct calls & WhatsApp leads",
              "Featured placement available",
              "Lead management dashboard",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" /> {t}
              </li>
            ))}
          </ul>
        </div>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="rounded-3xl bg-card border border-border p-6 md:p-8 shadow-soft"
        >
          <h2 className="text-xl font-bold">Business Details</h2>
          <div className="mt-5 space-y-4">
            <input
              placeholder="Business name"
              className="w-full rounded-xl bg-secondary px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <div className="grid sm:grid-cols-2 gap-3">
              <select className="w-full rounded-xl bg-secondary px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent">
                <option>Select category</option>
                {categories.map((c) => (
                  <option key={c.name}>{c.name}</option>
                ))}
              </select>
              <select className="w-full rounded-xl bg-secondary px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent">
                <option>Select city</option>
                {cities.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <input
              placeholder="Full address"
              className="w-full rounded-xl bg-secondary px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                placeholder="Phone"
                className="rounded-xl bg-secondary px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <input
                placeholder="Email"
                className="rounded-xl bg-secondary px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <textarea
              placeholder="Tell us about your business..."
              rows={4}
              className="w-full rounded-xl bg-secondary px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button className="w-full rounded-xl bg-gradient-accent px-6 py-3 font-semibold text-accent-foreground shadow-soft hover:shadow-glow transition">
              Submit for Verification
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
