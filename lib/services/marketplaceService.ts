// Mock marketplace service: services agents advertise for other agents to "purchase",
// generating a real entry in the transaction ledger via the existing payment path.
import type { MarketplaceListing } from "@/types/domain";
import { createSeedListings } from "./mockData";
import { mockDelay } from "./mockLatency";

let listings: MarketplaceListing[] = createSeedListings();

export async function listMarketplaceListings(): Promise<MarketplaceListing[]> {
  return mockDelay(listings);
}

export interface CreateListingInput {
  providerAgentId: string;
  name: string;
  category: MarketplaceListing["category"];
  pricePerCall: number;
  asset: string;
}

export async function createListing(input: CreateListingInput): Promise<MarketplaceListing> {
  const listing: MarketplaceListing = {
    id: `listing_${crypto.randomUUID().slice(0, 8)}`,
    providerAgentId: input.providerAgentId,
    name: input.name,
    category: input.category,
    pricePerCall: input.pricePerCall,
    asset: input.asset,
  };
  listings = [...listings, listing];
  return mockDelay(listing);
}
