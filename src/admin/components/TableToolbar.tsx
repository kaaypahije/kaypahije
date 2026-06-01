import { Search } from "lucide-react";

export function TableToolbar({
  search,
  onSearch,
  right,
}: {
  search: string;
  onSearch: (value: string) => void;
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <label className="flex max-w-md items-center gap-2 rounded-xl border border-[#e6ebf6] bg-[#fafbfe] px-3 py-2.5">
        <Search className="h-4 w-4 text-[#8b97b8]" />
        <input
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Search..."
          className="w-full bg-transparent text-sm text-[#1f2b52] outline-none placeholder:text-[#94a0bd]"
        />
      </label>
      {right}
    </div>
  );
}
