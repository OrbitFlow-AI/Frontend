// Mock marketplace service: services agents advertise for other agents to "purchase",
// generating a real entry in the transaction ledger via the existing payment path.
import type { MarketplaceListing } from "@/types/domain";
import { createSeedListings } from "./mockData";
import { mockDelay } from "./mockLatency";

const listings: MarketplaceListing[] = createSeedListings();

export async function listMarketplaceListings(): Promise<MarketplaceListing[]> {
  return mockDelay(listings);
}
