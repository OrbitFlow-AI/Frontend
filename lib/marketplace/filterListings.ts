// Pure filter used by the marketplace page — matches listings by category and a search term
// against the listing name, extracted so the matching rules are unit-testable.
import type { ListingCategory, MarketplaceListing } from "@/types/domain";

export function filterListings(
  listings: MarketplaceListing[],
  searchText: string,
  categoryFilter: ListingCategory | "all",
): MarketplaceListing[] {
  const normalizedSearch = searchText.trim().toLowerCase();

  return listings.filter((listing) => {
    const matchesSearch =
      normalizedSearch.length === 0 || listing.name.toLowerCase().includes(normalizedSearch);
    const matchesCategory = categoryFilter === "all" || listing.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
}
