import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Globe, Camera, MessageSquare, Video } from "lucide-react";

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
    <footer className="relative mt-4 bg-primary text-primary-foreground">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-5 md:px-6 md:py-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-2">
            <div className="inline-flex items-center gap-2 rounded-xl bg-white p-2 shadow-soft">
              <img src={logo} alt="Kay Pahije" className="h-8 w-auto" />
            </div>
            <p className="max-w-[22rem] text-xs md:text-sm text-primary-foreground/70 leading-relaxed">
              Discover trusted local businesses near you, all in one place.
            </p>
            <div className="space-y-0.5 text-xs md:text-sm text-primary-foreground/80">
              <p className="flex items-center gap-2 leading-6">
                <MapPin className="h-3.5 w-3.5 text-accent" /> Pune, Maharashtra, India
              </p>
              <p className="flex items-center gap-2 leading-6">
                <Phone className="h-3.5 w-3.5 text-accent" /> +91 98765 43210
              </p>
              <p className="flex items-center gap-2 leading-6">
                <Mail className="h-3.5 w-3.5 text-accent" /> hello@kaypahije.com
              </p>
            </div>
            <div className="flex gap-1.5 pt-1">
              {socials.slice(0, 3).map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 hover:bg-accent transition-colors"
                >
                  <Icon className="h-3 w-3" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-xs md:text-sm font-semibold uppercase tracking-wider text-accent mb-2">
                {title}
              </h4>
              <ul className="space-y-1">
                {items.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-xs md:text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-center border-t border-white/10 pt-2.5 text-[11px] md:text-xs text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} Kay Pahije. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
