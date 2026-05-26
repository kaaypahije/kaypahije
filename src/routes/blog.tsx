import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";

const posts = [
  {
    id: "1",
    title: "Top 10 must-try restaurants in Pune this season",
    excerpt:
      "From street food to fine dining, our editors curated the best spots in Pune right now.",
    category: "Food",
    date: "May 18, 2026",
    img: "photo-1555939594-58d7cb561ad1",
  },
  {
    id: "2",
    title: "How to choose the right interior designer for your home",
    excerpt: "Practical tips, red flags to watch, and how to budget for your dream space.",
    category: "Lifestyle",
    date: "May 12, 2026",
    img: "photo-1586023492125-27b2c045efd7",
  },
  {
    id: "3",
    title: "5 questions to ask before booking a wedding venue",
    excerpt: "Make sure you cover these before signing any contract for your big day.",
    category: "Events",
    date: "May 05, 2026",
    img: "photo-1519741497674-611481863552",
  },
  {
    id: "4",
    title: "AC repair near you: a homeowner's guide",
    excerpt: "What to expect, fair pricing, and when to repair vs. replace.",
    category: "Home Services",
    date: "Apr 28, 2026",
    img: "photo-1581094794329-c8112a89af12",
  },
];

export function BlogPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 py-16 md:py-24">
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-flex rounded-full bg-accent/10 text-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider">
          Blog
        </span>
        <h1 className="mt-3 text-4xl md:text-5xl font-extrabold">Stories, guides & local picks</h1>
        <p className="mt-3 text-muted-foreground">
          Discover the best of your city through our curated stories and tips.
        </p>
      </div>
      <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((p, i) => (
          <article
            key={p.id}
            className="group rounded-3xl bg-card border border-border overflow-hidden hover-lift animate-fade-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src={`https://images.unsplash.com/${p.img}?auto=format&fit=crop&w=900&q=70`}
                alt={p.title}
                loading="lazy"
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="rounded-full bg-accent/10 text-accent px-2.5 py-0.5 font-semibold">
                  {p.category}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {p.date}
                </span>
              </div>
              <h2 className="mt-3 text-lg font-bold leading-snug group-hover:text-accent transition-colors">
                {p.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>
              <Link
                to="/blog"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent"
              >
                Read more <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
