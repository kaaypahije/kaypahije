import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const links = {
  Company: [
    { to: "/", label: "Home" },
    { to: "/categories", label: "Categories" },
    { to: "/yashaswini-mart", label: "Yashaswini Mart" },
    { to: "/listings", label: "Business Listings" },
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact Us" },
  ],
  Explore: [
    { to: "/categories", label: "All Categories" },
    { to: "/listings", label: "Listings" },
    { to: "/listings?category=Restaurants", label: "Restaurants" },
    { to: "/listings?category=Hotels", label: "Hotels" },
  ],
};

export function Footer() {
  const [showRadioTooltip, setShowRadioTooltip] = useState(false);
  const radioTooltipTimerRef = useRef<number | null>(null);
  const mapQuery = "Pune, Maharashtra, India";
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=12&output=embed`;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

  useEffect(() => {
    return () => {
      if (radioTooltipTimerRef.current !== null) {
        window.clearTimeout(radioTooltipTimerRef.current);
      }
    };
  }, []);

  const showMobileRadioTooltip = () => {
    setShowRadioTooltip(true);
    if (radioTooltipTimerRef.current !== null) {
      window.clearTimeout(radioTooltipTimerRef.current);
    }
    radioTooltipTimerRef.current = window.setTimeout(() => {
      setShowRadioTooltip(false);
    }, 1400);
  };

  return (
    <footer className="relative mt-4 bg-primary text-primary-foreground">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-5 md:px-6 md:py-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-2">
            <div className="inline-flex items-center gap-2 rounded-xl bg-white p-2.5 shadow-soft">
              <img src={logo} alt="Kay Pahije" className="h-10 w-auto md:h-11" />
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
                <Mail className="h-3.5 w-3.5 text-accent" /> kaaypahije@gmail.com
              </p>
            </div>
            <div className="flex gap-2 pt-1.5">
              <a
                href="#"
                aria-label="Instagram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-accent transition-colors"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5Zm9.3 1.35a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8A3.2 3.2 0 1 0 12 15.2 3.2 3.2 0 0 0 12 8.8Z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-accent transition-colors"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5h1.7V4.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.4V11H8v3h2.1v8h3.4Z" />
                </svg>
              </a>
              <a
                href="https://liveradios.in/radio-parbhani-90-8.html"
                target="_blank"
                rel="noreferrer"
                aria-label="Radio"
                className="group relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-accent transition-colors"
                onTouchStart={showMobileRadioTooltip}
                onFocus={showMobileRadioTooltip}
                onBlur={() => setShowRadioTooltip(false)}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                  <path
                    d="M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7M6 6a8.5 8.5 0 0 0 0 12M18 6a8.5 8.5 0 0 1 0 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
                <span
                  className={`pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/85 px-2 py-1 text-[11px] text-white opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 group-active:opacity-100 ${
                    showRadioTooltip ? "opacity-100" : ""
                  }`}
                >
                  Listen to Radio Parbhani 90.8 FM
                </span>
              </a>
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

          <div className="lg:col-span-1">
            <h4 className="text-xs md:text-sm font-semibold uppercase tracking-wider text-accent mb-2">
              Our Location
            </h4>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-soft">
              <div className="relative h-40 md:h-44">
                <iframe
                  title="Kay Pahije location map"
                  src={mapEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent p-2.5">
                  <div className="flex items-end justify-between gap-2">
                    <div className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-primary shadow-soft">
                      <MapPin className="h-3 w-3 text-accent" />
                      Pune, Maharashtra
                    </div>
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="pointer-events-auto inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-primary shadow-soft transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      Directions <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center border-t border-white/10 pt-2.5 text-[11px] md:text-xs text-primary-foreground/60">
          <div className="text-center space-y-1">
            <p>
              © 2026 All Rights Reserved By Kay Pahije. Designed By{" "}
              <a
                href="https://webakoof.com/index.html"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-primary-foreground underline decoration-primary-foreground/40 underline-offset-2 hover:text-accent hover:decoration-accent transition-colors"
              >
                Webakoof
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
