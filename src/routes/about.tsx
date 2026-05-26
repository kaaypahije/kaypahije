import { Link } from "react-router-dom";
import { Users, Target, Award, Sparkles } from "lucide-react";

export function AboutPage() {
  return (
    <>
      <section className="bg-gradient-hero text-primary-foreground py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 md:px-6 text-center">
          <span className="inline-flex rounded-full bg-white/10 backdrop-blur px-3 py-1 text-xs font-semibold uppercase tracking-wider border border-white/20">
            About Us
          </span>
          <h1 className="mt-4 text-4xl md:text-6xl font-extrabold">
            We connect India with trusted local businesses.
          </h1>
          <p className="mt-5 text-lg text-white/80">
            Kay Pahije is built on a simple idea: finding the right business should be fast,
            friendly and fully trustworthy.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 md:px-6 py-16 md:py-24 grid md:grid-cols-4 gap-5">
        {[
          {
            icon: Target,
            t: "Our Mission",
            d: "Make every local business discoverable and trustworthy for every Indian customer.",
          },
          {
            icon: Users,
            t: "Our Community",
            d: "10M+ users and 1M+ businesses across 500+ cities trust Kay Pahije every day.",
          },
          {
            icon: Award,
            t: "Our Promise",
            d: "Verified listings, real reviews, and a beautifully simple search experience.",
          },
          {
            icon: Sparkles,
            t: "Our Future",
            d: "A complete platform with AI search, payments, lead management and more.",
          },
        ].map((f) => (
          <div key={f.t} className="rounded-3xl bg-card border border-border p-6 hover-lift">
            <div className="h-12 w-12 rounded-2xl bg-gradient-accent grid place-items-center text-accent-foreground">
              <f.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-lg font-bold">{f.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.d}</p>
          </div>
        ))}
      </section>
      <section className="mx-auto max-w-4xl px-4 md:px-6 pb-16 md:pb-24 text-center">
        <Link
          to="/post-business"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-accent px-7 py-3 font-semibold text-accent-foreground shadow-soft hover:shadow-glow transition"
        >
          Join as a business
        </Link>
      </section>
    </>
  );
}
