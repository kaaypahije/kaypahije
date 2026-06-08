import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How do I list my business?",
    a: "Click Post Business in the header, fill the form, and our team verifies within 24 hours.",
  },
  {
    q: "Is listing free?",
    a: "Yes - basic listings are 100% free, forever. Premium plans unlock more visibility.",
  },
  {
    q: "How are reviews moderated?",
    a: "We use a combination of AI and human moderators to flag fake or abusive reviews.",
  },
  {
    q: "Can I update my listing?",
    a: "Yes, from your dashboard you can edit details, photos and operating hours anytime.",
  },
  {
    q: "How do I report an issue?",
    a: "Use the Report option on any business page, or email kaaypahije@gmail.com.",
  },
  {
    q: "Do you offer ads or featured placement?",
    a: "Yes. Contact our team to feature your business at the top of search results in your city.",
  },
  {
    q: "Which cities are supported?",
    a: "We currently cover 500+ Indian cities with expanding daily.",
  },
  {
    q: "Is my personal data safe?",
    a: "Yes. We follow strict privacy practices - see our Privacy Policy for details.",
  },
];

export function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="mx-auto max-w-3xl px-4 md:px-6 py-16 md:py-24">
      <div className="text-center">
        <span className="inline-flex rounded-full bg-accent/10 text-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider">
          FAQ
        </span>
        <h1 className="mt-3 text-4xl md:text-5xl font-extrabold">Frequently asked questions</h1>
      </div>
      <div className="mt-10 space-y-3">
        {faqs.map((f, i) => (
          <button
            key={i}
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full text-left rounded-2xl bg-card border border-border p-5 hover:border-accent/40 transition"
          >
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-semibold">{f.q}</h3>
              <ChevronDown
                className={`h-5 w-5 text-accent shrink-0 transition-transform ${
                  open === i ? "rotate-180" : ""
                }`}
              />
            </div>
            {open === i && (
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
