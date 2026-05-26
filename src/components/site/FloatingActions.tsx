import { useState } from "react";
import { MessageCircle, Phone, Bot, X, Send } from "lucide-react";

export function FloatingActions() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
        <a
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noreferrer"
          className="group inline-flex h-13 w-13 h-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-glow hover:scale-110 transition-transform"
          style={{ height: 52, width: 52 }}
          aria-label="WhatsApp"
        >
          <MessageCircle className="h-6 w-6" />
        </a>
        <a
          href="tel:+919876543210"
          className="inline-flex items-center justify-center rounded-full bg-gradient-accent text-accent-foreground shadow-glow hover:scale-110 transition-transform"
          style={{ height: 52, width: 52 }}
          aria-label="Call"
        >
          <Phone className="h-6 w-6" />
        </a>
        <button
          onClick={() => setChatOpen(true)}
          className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow hover:scale-110 transition-transform animate-float"
          style={{ height: 56, width: 56 }}
          aria-label="Chat"
        >
          <Bot className="h-6 w-6" />
        </button>
      </div>

      {chatOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-[calc(100vw-2.5rem)] max-w-sm rounded-3xl bg-card shadow-glow border border-border overflow-hidden animate-fade-up">
          <div className="bg-gradient-hero p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/15 grid place-items-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">Kay Pahije Assistant</p>
                <p className="text-xs text-white/70 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Online
                </p>
              </div>
            </div>
            <button onClick={() => setChatOpen(false)} className="text-white/80 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4 space-y-3 max-h-80 overflow-y-auto bg-gradient-soft">
            <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-card border border-border px-4 py-2.5 text-sm">
              Hi! 👋 I'm here to help you find the best businesses near you. What are you looking
              for today?
            </div>
            <div className="flex flex-wrap gap-2">
              {["Restaurants", "Plumbers", "Salons", "Doctors"].map((q) => (
                <button
                  key={q}
                  className="rounded-full border border-accent/30 bg-accent/5 px-3 py-1 text-xs font-medium text-accent hover:bg-accent hover:text-accent-foreground transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="border-t border-border p-3 flex gap-2 bg-card"
          >
            <input
              placeholder="Type your message..."
              className="flex-1 rounded-full bg-secondary px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-accent text-accent-foreground">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
