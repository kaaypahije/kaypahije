import { Mail, Phone, MapPin, Send } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ContactPage() {
  const categories = [
    "Hospitals",
    "Education",
    "Electronics",
    "Fashion",
    "Automobiles",
    "Packers & Movers",
    "Beauty Salon",
    "Home Services",
    "Gym & Fitness",
    "Interior Designers",
    "Event Management",
    "Digital Marketing",
    "Travel & Tourism",
  ];

  const inputClassName =
    "w-full rounded-xl border border-transparent bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/90 focus:outline-none focus:ring-2 focus:ring-accent/70";

  return (
    <section className="mx-auto max-w-6xl px-4 md:px-6 py-16 md:py-24">
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-flex rounded-full bg-accent/10 text-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider">
          Contact
        </span>
        <h1 className="mt-3 text-4xl md:text-5xl font-extrabold">Let's talk.</h1>
        <p className="mt-3 text-muted-foreground">
          We'd love to hear from you - drop a message and we'll reply within 24 hours.
        </p>
      </div>
      <div className="mt-8 grid lg:grid-cols-[1fr_1.05fr] gap-5">
        <div className="space-y-3">
          {[
            { icon: Phone, t: "Phone", d: "+91 98765 43210" },
            { icon: Mail, t: "Email", d: "kaaypahije@gmail.com" },
            { icon: MapPin, t: "Office", d: "Pune, Maharashtra, India" },
          ].map((i) => (
            <div
              key={i.t}
              className="rounded-2xl bg-card border border-border p-3.5 flex items-center gap-3"
            >
              <div className="h-10 w-10 rounded-lg bg-gradient-accent grid place-items-center text-accent-foreground">
                <i.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{i.t}</p>
                <p className="text-lg font-semibold">{i.d}</p>
              </div>
            </div>
          ))}
        </div>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="rounded-2xl bg-card border border-border p-4 md:p-5 shadow-soft"
        >
          <div className="grid sm:grid-cols-2 gap-3">
            <input placeholder="Your name" className={inputClassName} />
            <input placeholder="Email" className={inputClassName} />
          </div>
          <div className="mt-3 grid sm:grid-cols-2 gap-3">
            <input placeholder="City" className={inputClassName} />
            <input placeholder="Business name" className={inputClassName} />
          </div>
          <input
            placeholder="Contact"
            className={`mt-3 ${inputClassName}`}
          />
          <div className="mt-3">
            <Select>
              <SelectTrigger
                className={`${inputClassName} h-auto border-accent/70 shadow-none focus:ring-2 focus:ring-accent`}
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent side="top" align="start" className="rounded-2xl border-border">
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="text-base">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <input
            placeholder="Subject"
            className={`mt-3 ${inputClassName}`}
          />
          <textarea
            placeholder="Your message"
            rows={5}
            className={`mt-3 ${inputClassName} min-h-[110px] resize-y`}
          />
          <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-accent px-5 py-2.5 text-base font-semibold text-accent-foreground shadow-soft hover:shadow-glow transition">
            <Send className="h-4 w-4" /> Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
