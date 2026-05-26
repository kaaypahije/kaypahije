import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, MapPin, Search, User, PlusCircle } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const nav = [
  { to: "/", label: "Home" },
  { to: "/categories", label: "Categories" },
  { to: "/listings", label: "Listings" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "glass shadow-soft" : "bg-background/80 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-20 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Kay Pahije" className="h-10 w-auto md:h-12" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((n) => {
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active ? "text-accent" : "text-foreground/80 hover:text-foreground"
                }`}
              >
                {n.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-accent" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <button className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition">
            <MapPin className="h-3.5 w-3.5 text-accent" /> Pune
          </button>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition"
          >
            <User className="h-4 w-4" /> Login
          </Link>
          <Link
            to="/post-business"
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-soft hover:shadow-glow transition-all hover:-translate-y-0.5"
          >
            <PlusCircle className="h-4 w-4" /> Post Business
          </Link>
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/60"
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-lg">
          <div className="mx-auto max-w-7xl px-4 py-4 space-y-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={`block rounded-xl px-4 py-3 text-sm font-medium ${
                  pathname === n.to ? "bg-secondary text-accent" : "text-foreground/80"
                }`}
              >
                {n.label}
              </Link>
            ))}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link
                to="/login"
                className="rounded-full border border-border px-4 py-2 text-center text-sm font-medium"
              >
                Login
              </Link>
              <Link
                to="/post-business"
                className="rounded-full bg-gradient-accent px-4 py-2 text-center text-sm font-semibold text-accent-foreground"
              >
                Post Business
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
