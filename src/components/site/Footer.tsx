import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Send, Globe, Camera, MessageSquare, Video } from "lucide-react";

const socials = [Globe, Camera, MessageSquare, Video];
import logo from "@/assets/logo.jpeg";

const links = {
  Company: [
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact" },
    { to: "/blog", label: "Blog" },
    { to: "/post-business", label: "Post Business" },
  ],
  Explore: [
    { to: "/categories", label: "All Categories" },
    { to: "/listings", label: "Listings" },
    { to: "/listings?category=Restaurants", label: "Restaurants" },
    { to: "/listings?category=Hotels", label: "Hotels" },
  ],
  Support: [
    { to: "/faqs", label: "FAQs" },
    { to: "/privacy", label: "Privacy Policy" },
    { to: "/terms", label: "Terms & Conditions" },
    { to: "/contact", label: "Help Center" },
  ],
};

export function Footer() {
  return (
    <footer className="relative mt-24 bg-primary text-primary-foreground">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-2xl bg-white p-3 shadow-soft">
              <img src={logo} alt="Kay Pahije" className="h-12 w-auto" />
            </div>
            <p className="max-w-sm text-sm text-primary-foreground/70 leading-relaxed">
              India's modern business listing platform. Discover, connect and grow with verified
              local businesses in your city.
            </p>
            <div className="space-y-2 text-sm text-primary-foreground/80">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" /> Pune, Maharashtra, India
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-accent" /> +91 98765 43210
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-accent" /> hello@kaypahije.com
              </p>
            </div>
            <div className="flex gap-3">
              {socials.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-accent transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-accent mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {items.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h4 className="text-lg font-semibold">Stay in the loop</h4>
              <p className="text-sm text-primary-foreground/70">
                Get weekly picks, offers and trending businesses near you.
              </p>
            </div>
            <form className="flex w-full max-w-md gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 rounded-full bg-white/10 border border-white/15 px-4 py-2.5 text-sm placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button className="inline-flex items-center gap-1.5 rounded-full bg-gradient-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-soft">
                <Send className="h-4 w-4" /> Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-primary-foreground/60">
          <p>© {new Date().getFullYear()} Kay Pahije. All rights reserved.</p>
          <p>Made with ❤ in India</p>
        </div>
      </div>
    </footer>
  );
}
