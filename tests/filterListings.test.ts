// Unit tests for the marketplace's search/category filtering logic.
import { describe, expect, it } from "vitest";
import { filterListings } from "@/lib/marketplace/filterListings";
import type { MarketplaceListing } from "@/types/domain";

const listings: MarketplaceListing[] = [
  {
    id: "listing_dataset",
    providerAgentId: "agent_scraper",
    name: "Structured Web Dataset",
    category: "dataset",
    pricePerCall: 12.5,
    asset: "USDC",
  },
  {
    id: "listing_compute",
    providerAgentId: "agent_compute",
    name: "Inference Cycle",
    category: "compute",
    pricePerCall: 3.0,
    asset: "USDC",
  },
];

describe("filterListings", () => {
  it("returns all listings when search is empty and category is 'all'", () => {
    expect(filterListings(listings, "", "all")).toHaveLength(2);
  });

  it("matches listings by case-insensitive name substring", () => {
    const result = filterListings(listings, "dataset", "all");
    expect(result.map((l) => l.id)).toEqual(["listing_dataset"]);
  });

  it("filters by category", () => {
    const result = filterListings(listings, "", "compute");
    expect(result.map((l) => l.id)).toEqual(["listing_compute"]);
  });

  it("combines search and category filters", () => {
    const result = filterListings(listings, "dataset", "compute");
    expect(result).toHaveLength(0);
  });
});
