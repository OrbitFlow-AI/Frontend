// Search text + category filter controls for the marketplace listing grid.
import type { ListingCategory } from "@/types/domain";

const categoryOptions: Array<ListingCategory | "all"> = ["all", "api_access", "dataset", "compute"];

const categoryLabel: Record<ListingCategory | "all", string> = {
  all: "All categories",
  api_access: "API Access",
  dataset: "Dataset",
  compute: "Compute",
};

export function MarketplaceFilters({
  searchText,
  categoryFilter,
  onSearchTextChange,
  onCategoryFilterChange,
}: {
  searchText: string;
  categoryFilter: ListingCategory | "all";
  onSearchTextChange: (value: string) => void;
  onCategoryFilterChange: (value: ListingCategory | "all") => void;
}) {
  return (
    <div className="mb-4 flex flex-wrap gap-3">
      <input
        type="search"
        value={searchText}
        onChange={(e) => onSearchTextChange(e.target.value)}
        placeholder="Search listings by name…"
        className="w-full max-w-xs rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-100"
      />
      <select
        value={categoryFilter}
        onChange={(e) => onCategoryFilterChange(e.target.value as ListingCategory | "all")}
        className="rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-100"
      >
        {categoryOptions.map((category) => (
          <option key={category} value={category}>
            {categoryLabel[category]}
          </option>
        ))}
      </select>
    </div>
  );
}
