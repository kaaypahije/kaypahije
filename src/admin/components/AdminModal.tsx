import { X } from "lucide-react";

export function AdminModal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/45 p-4" onClick={onClose}>
      <div
        className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-[#e8ebf5] bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#edf0f7] bg-white px-5 py-4 md:px-6">
          <h3 className="text-lg font-bold text-[#1f2b52]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#e5eaf5] p-2 text-[#617196] hover:bg-[#f6f8fd]"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="p-5 md:p-6">{children}</div>
      </div>
    </div>
  );
}
