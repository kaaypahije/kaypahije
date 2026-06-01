export function SectionCard({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-[#e8ebf5] bg-white shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0f7] px-5 py-4 md:px-6">
        <div>
          <h2 className="text-lg font-bold text-[#1f2b52]">{title}</h2>
          {subtitle ? <p className="text-sm text-[#7382a5]">{subtitle}</p> : null}
        </div>
        {action}
      </header>
      <div className="p-5 md:p-6">{children}</div>
    </section>
  );
}
