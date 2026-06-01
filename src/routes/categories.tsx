import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { CategoryGrid } from "@/components/site/CategoryGrid";

type Subcategory = {
  icon: string;
  name: string;
};

const subcategoriesByCategory: Record<string, Subcategory[]> = {
  Restaurants: [
    { icon: "🍽️", name: "Fine Dining" },
    { icon: "🍔", name: "Fast Food" },
    { icon: "🥗", name: "Veg Restaurant" },
    { icon: "🍗", name: "Non Veg Restaurant" },
    { icon: "☕", name: "Cafe" },
  ],
  Hotels: [
    { icon: "🏨", name: "Luxury Hotels" },
    { icon: "🛏️", name: "Budget Hotels" },
    { icon: "🏝️", name: "Resorts" },
    { icon: "💼", name: "Business Hotels" },
    { icon: "👨‍👩‍👧‍👦", name: "Family Hotels" },
  ],
  Hospitals: [
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
  ],
  Education: [
    { icon: "🏫", name: "Schools" },
    { icon: "🎓", name: "Colleges" },
    { icon: "📘", name: "Coaching Classes" },
    { icon: "🧪", name: "Training Institutes" },
  ],
  Electronics: [
    { icon: "📱", name: "Mobile Stores" },
    { icon: "💻", name: "Laptop Stores" },
    { icon: "📺", name: "Home Appliances" },
    { icon: "🛠️", name: "Repair Services" },
  ],
  Fashion: [
    { icon: "👔", name: "Mens Wear" },
    { icon: "👗", name: "Womens Wear" },
    { icon: "🧒", name: "Kids Wear" },
    { icon: "🛍️", name: "Boutiques" },
  ],
  Automobiles: [
    { icon: "🚗", name: "Car Service" },
    { icon: "🏍️", name: "Bike Service" },
    { icon: "⚙️", name: "Spare Parts" },
    { icon: "🧰", name: "Accessories" },
  ],
  "Packers & Movers": [
    { icon: "🏠", name: "Home Shifting" },
    { icon: "🏢", name: "Office Relocation" },
    { icon: "🚚", name: "Local Moving" },
    { icon: "📦", name: "Domestic Transport" },
  ],
  "Beauty Salon": [
    { icon: "💇", name: "Hair Services" },
    { icon: "✨", name: "Skin Care" },
    { icon: "💄", name: "Bridal Makeup" },
    { icon: "🧖", name: "Spa Services" },
  ],
  "Home Services": [
    { icon: "🚰", name: "Plumbing" },
    { icon: "💡", name: "Electrical" },
    { icon: "🧹", name: "Cleaning" },
    { icon: "❄️", name: "AC Repair" },
  ],
  "Gym & Fitness": [
    { icon: "🏋️", name: "Gyms" },
    { icon: "🧘", name: "Yoga Classes" },
    { icon: "🏃", name: "Personal Training" },
    { icon: "💪", name: "CrossFit" },
  ],
  "Interior Designers": [
    { icon: "🛋️", name: "Home Interior" },
    { icon: "🏢", name: "Office Interior" },
    { icon: "🍳", name: "Modular Kitchen" },
    { icon: "🪑", name: "Furniture Design" },
  ],
  "Event Management": [
    { icon: "💍", name: "Wedding Events" },
    { icon: "🏢", name: "Corporate Events" },
    { icon: "🎂", name: "Birthday Events" },
    { icon: "🎉", name: "Decoration Services" },
  ],
  "Digital Marketing": [
    { icon: "🔎", name: "SEO" },
    { icon: "📱", name: "Social Media Marketing" },
    { icon: "📣", name: "PPC Ads" },
    { icon: "📝", name: "Content Marketing" },
  ],
  "Travel & Tourism": [
    { icon: "🧳", name: "Tour Packages" },
    { icon: "✈️", name: "Flight Booking" },
    { icon: "🏨", name: "Hotel Booking" },
    { icon: "🛂", name: "Visa Services" },
  ],
  "Vivah Services": [
    { icon: "🏛️", name: "Marriage Hall" },
    { icon: "🍱", name: "Catering" },
    { icon: "📸", name: "Photography" },
    { icon: "🎊", name: "Decoration" },
  ],
  "Construction Services": [
    { icon: "👷", name: "Contractors" },
    { icon: "📐", name: "Architects" },
    { icon: "🧱", name: "Renovation" },
    { icon: "🚧", name: "Material Suppliers" },
  ],
};

export function CategoriesPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryName: string) => {
    const subcategories = subcategoriesByCategory[categoryName];
    if (subcategories?.length) {
      setSelectedCategory(categoryName);
      return;
    }
    navigate(`/listings?category=${encodeURIComponent(categoryName)}`);
  };

  const handleSubcategoryClick = (subcategoryName: string) => {
    if (!selectedCategory) return;
    setSelectedCategory(null);
    navigate(
      `/listings?category=${encodeURIComponent(selectedCategory)}&subcategory=${encodeURIComponent(subcategoryName)}`,
    );
  };

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedCategory(null);
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
        <CategoryGrid onCategoryClick={handleCategoryClick} activeCategory={selectedCategory ?? ""} />
      </div>

      {selectedCategory && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm p-4 md:p-6 grid place-items-center"
          onClick={() => setSelectedCategory(null)}
        >
          <div
            className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-background p-5 md:p-8 shadow-2xl animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold">{selectedCategory} Sub Categories</h2>
                <p className="mt-1 text-sm md:text-base text-muted-foreground">
                  Choose a suitable sub category under {selectedCategory}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                aria-label={`Close ${selectedCategory} sub categories`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border hover:bg-secondary transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {(subcategoriesByCategory[selectedCategory] ?? []).map((sub, i) => (
                <button
                  key={sub.name}
                  type="button"
                  onClick={() => handleSubcategoryClick(sub.name)}
                  className="rounded-2xl bg-card border border-border p-5 animate-fade-up text-center hover:bg-secondary transition-colors"
                  style={{ animationDelay: `${i * 20}ms` }}
                >
                  <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-rose-100 to-orange-100 grid place-items-center text-3xl">
                    {sub.icon}
                  </div>
                  <p className="mt-3 text-sm md:text-base font-semibold leading-snug">{sub.name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
