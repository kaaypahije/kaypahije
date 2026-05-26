import { Mail, Phone, MapPin, Send } from "lucide-react";

export function ContactPage() {
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
      <div className="mt-12 grid lg:grid-cols-[1fr_1.4fr] gap-8">
        <div className="space-y-3">
          {[
            { icon: Phone, t: "Phone", d: "+91 98765 43210" },
            { icon: Mail, t: "Email", d: "hello@kaypahije.com" },
            { icon: MapPin, t: "Office", d: "Pune, Maharashtra, India" },
          ].map((i) => (
            <div
              key={i.t}
              className="rounded-2xl bg-card border border-border p-5 flex items-center gap-4"
            >
              <div className="h-12 w-12 rounded-xl bg-gradient-accent grid place-items-center text-accent-foreground">
                <i.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{i.t}</p>
                <p className="font-semibold">{i.d}</p>
              </div>
            </div>
          ))}
        </div>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="rounded-3xl bg-card border border-border p-6 md:p-8 shadow-soft"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              placeholder="Your name"
              className="rounded-xl bg-secondary px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <input
              placeholder="Email"
              className="rounded-xl bg-secondary px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <input
            placeholder="Subject"
            className="mt-4 w-full rounded-xl bg-secondary px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <textarea
            placeholder="Your message"
            rows={5}
            className="mt-4 w-full rounded-xl bg-secondary px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-accent px-6 py-3 font-semibold text-accent-foreground shadow-soft hover:shadow-glow transition">
            <Send className="h-4 w-4" /> Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
