// Unit tests for the mock marketplace service: listing and creating listings.
import { describe, expect, it } from "vitest";
import { createListing, listMarketplaceListings } from "@/lib/services/marketplaceService";

describe("marketplaceService", () => {
  it("lists the seeded marketplace listings", async () => {
    const listings = await listMarketplaceListings();
    expect(listings.length).toBeGreaterThan(0);
  });

  it("creates a new listing and appends it to the list", async () => {
    const before = await listMarketplaceListings();
    const created = await createListing({
      providerAgentId: "agent_pricer",
      name: "Test Listing",
      category: "api_access",
      pricePerCall: 5,
      asset: "USDC",
    });
    const after = await listMarketplaceListings();

    expect(created.name).toBe("Test Listing");
    expect(created.id).toMatch(/^listing_/);
    expect(after.length).toBe(before.length + 1);
  });
});
