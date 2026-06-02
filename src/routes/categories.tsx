import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImageIcon, X } from "lucide-react";
import { CategoryGrid } from "@/components/site/CategoryGrid";
import { mapApiSubcategoryToSite, type SiteCategory, type SiteSubcategory } from "@/data/businesses";
import { fetchSubcategoriesByCategory } from "@/services/api";

export function CategoriesPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<SiteCategory | null>(null);
  const [subcategories, setSubcategories] = useState<SiteSubcategory[]>([]);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);

  const closeModal = () => {
    setSelectedCategory(null);
    setSubcategories([]);
  };

  const handleCategoryClick = async (category: SiteCategory) => {
    setSelectedCategory(category);
    setLoadingSubcategories(true);
    setSubcategories([]);

    try {
      const response = await fetchSubcategoriesByCategory(category.id);
      const mapped = response.data.map(mapApiSubcategoryToSite);

      if (mapped.length === 0) {
        closeModal();
        navigate(`/listings?category=${encodeURIComponent(category.slug)}`);
        return;
      }

      setSubcategories(mapped);
    } catch (_error) {
      closeModal();
      navigate(`/listings?category=${encodeURIComponent(category.slug)}`);
    } finally {
      setLoadingSubcategories(false);
    }
  };

  const handleSubcategoryClick = (subcategory: SiteSubcategory) => {
    if (!selectedCategory) {
      return;
    }

    closeModal();
    navigate(
      `/listings?category=${encodeURIComponent(selectedCategory.slug)}&subcategory=${encodeURIComponent(subcategory.slug)}&subcategoryId=${subcategory.id}`,
    );
  };

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
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
        <CategoryGrid onCategoryClick={handleCategoryClick} activeCategory={selectedCategory?.slug || ""} />
      </div>

      {selectedCategory && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm p-4 md:p-6 grid place-items-center"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-background p-5 md:p-8 shadow-2xl animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold">{selectedCategory.name} Sub Categories</h2>
                <p className="mt-1 text-sm md:text-base text-muted-foreground">
                  Choose a suitable sub category under {selectedCategory.name}.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label={`Close ${selectedCategory.name} sub categories`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border hover:bg-secondary transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {loadingSubcategories ? (
              <div className="mt-6 rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
                Loading subcategories...
              </div>
            ) : subcategories.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
                No subcategories available for this category.
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {subcategories.map((sub, i) => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => handleSubcategoryClick(sub)}
                    className="rounded-2xl bg-card border border-border p-5 animate-fade-up text-center hover:bg-secondary transition-colors"
                    style={{ animationDelay: `${i * 20}ms` }}
                  >
                    <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-rose-100 to-orange-100 grid place-items-center overflow-hidden">
                      {sub.image ? (
                        <img src={sub.image} alt={`${sub.name} icon`} className="h-12 w-12 object-contain" />
                      ) : (
                        <ImageIcon className="h-7 w-7 text-rose-500" />
                      )}
                    </div>
                    <p className="mt-3 text-sm md:text-base font-semibold leading-snug">{sub.name}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
