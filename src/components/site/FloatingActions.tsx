import { useState } from "react";
import { Phone, Bot, X, Send } from "lucide-react";

export function FloatingActions() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-4 right-3 md:bottom-6 md:right-6 z-[60] flex flex-col items-end gap-3">
        <a
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center justify-center rounded-full bg-[#25D366] text-white shadow-glow hover:scale-110 transition-transform"
          style={{ height: 52, width: 52 }}
          aria-label="WhatsApp"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current">
            <path d="M19.05 4.91A9.82 9.82 0 0 0 12.03 2C6.58 2 2.14 6.42 2.14 11.86c0 1.74.46 3.44 1.33 4.93L2 22l5.37-1.41a9.86 9.86 0 0 0 4.66 1.19h.01c5.45 0 9.89-4.42 9.89-9.86a9.8 9.8 0 0 0-2.88-7.01zm-7.02 15.2h-.01a8.2 8.2 0 0 1-4.17-1.14l-.3-.18-3.19.84.85-3.11-.2-.32a8.14 8.14 0 0 1-1.26-4.34c0-4.5 3.67-8.16 8.19-8.16a8.12 8.12 0 0 1 5.79 2.39 8.1 8.1 0 0 1 2.4 5.78c0 4.5-3.68 8.14-8.1 8.14zm4.49-6.11c-.25-.13-1.47-.72-1.7-.8-.23-.09-.39-.13-.56.12-.17.25-.65.8-.8.96-.15.17-.29.19-.54.06-.25-.13-1.04-.38-1.98-1.2-.73-.65-1.23-1.45-1.37-1.69-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.84-.2-.48-.4-.41-.56-.42h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.44 1.03 2.61c.13.17 1.76 2.69 4.26 3.77.6.26 1.07.41 1.44.52.61.19 1.17.16 1.61.1.49-.07 1.47-.6 1.67-1.18.21-.58.21-1.08.15-1.18-.06-.1-.22-.16-.47-.28z" />
          </svg>
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
        <div className="fixed bottom-4 right-3 md:bottom-6 md:right-6 z-[70] w-[calc(100vw-1.5rem)] md:w-[calc(100vw-2.5rem)] max-w-sm rounded-3xl bg-card shadow-glow border border-border overflow-hidden animate-fade-up">
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
