import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { CategoryGrid } from "@/components/site/CategoryGrid";

const hospitalSubcategories = [
  { icon: "🧑‍⚕️", name: "Doctor's" },
  { icon: "🏥", name: "Multi Speciality" },
  { icon: "👁️", name: "नेत्र रोग" },
  { icon: "👶", name: "बाल रोग तज्ज्ञ" },
  { icon: "👂", name: "कान, नाक, घसा" },
  { icon: "🤰", name: "स्त्री रोग" },
  { icon: "❤️", name: "हृदय विकार" },
  { icon: "🩸", name: "मधुमेह" },
  { icon: "🦴", name: "हाडांचे उपचार" },
  { icon: "🫘", name: "किडनी विकार" },
  { icon: "🧻", name: "पोटांचे विकार व मूळव्याध" },
  { icon: "🦷", name: "दंत रोग" },
  { icon: "🌿", name: "आयुर्वेद" },
  { icon: "⚗️", name: "होमिओपॅथी" },
  { icon: "🔬", name: "कॅन्सरचे विकार" },
  { icon: "🧠", name: "अर्धांगवायू" },
  { icon: "🖐️", name: "त्वचा रोग" },
  { icon: "😶‍🌫️", name: "मानसिक रोग" },
  { icon: "🎗️", name: "कॅन्सर रोग" },
  { icon: "🧑‍🦽", name: "फिजिओथेरपी" },
];

export function CategoriesPage() {
  const navigate = useNavigate();
  const [isHospitalModalOpen, setIsHospitalModalOpen] = useState(false);

  const handleCategoryClick = (categoryName: string) => {
    if (categoryName.trim().toLowerCase() === "hospitals") {
      setIsHospitalModalOpen(true);
      return;
    }
    navigate(`/listings?category=${encodeURIComponent(categoryName)}`);
  };

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsHospitalModalOpen(false);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 pt-6 md:pt-10 pb-12 md:pb-20">
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-flex rounded-full bg-accent/10 text-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider">
          Explore
        </span>
        <h1 className="mt-3 text-4xl md:text-5xl font-extrabold">All Categories</h1>
        <p className="mt-3 text-muted-foreground">
          Browse businesses by category to find exactly what you need.
        </p>
      </div>

      <div className="mt-12">
        <CategoryGrid
          onCategoryClick={handleCategoryClick}
          activeCategory={isHospitalModalOpen ? "Hospitals" : ""}
        />
      </div>

      {isHospitalModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm p-4 md:p-6 grid place-items-center"
          onClick={() => setIsHospitalModalOpen(false)}
        >
          <div
            className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-background p-5 md:p-8 shadow-2xl animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold">Hospital Sub Categories</h2>
                <p className="mt-1 text-sm md:text-base text-muted-foreground">
                  Choose a specialization under Hospitals.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsHospitalModalOpen(false)}
                aria-label="Close hospital sub categories"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border hover:bg-secondary transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {hospitalSubcategories.map((sub, i) => (
                <div
                  key={sub.name}
                  className="rounded-2xl bg-card border border-border p-5 animate-fade-up text-center"
                  style={{ animationDelay: `${i * 20}ms` }}
                >
                  <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-rose-100 to-orange-100 grid place-items-center text-3xl">
                    {sub.icon}
                  </div>
                  <p className="mt-3 text-sm md:text-base font-semibold leading-snug">{sub.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
