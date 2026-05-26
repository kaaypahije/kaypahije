import { CategoryGrid } from "@/components/site/CategoryGrid";

export function CategoriesPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 py-12 md:py-20">
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
        <CategoryGrid />
      </div>
    </section>
  );
}
