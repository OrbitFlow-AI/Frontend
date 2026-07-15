// Marketplace route: services agents offer for sale to other agents.
"use client";

import { useEffect, useState } from "react";
import type { ListingCategory, MarketplaceListing } from "@/types/domain";
import { Topbar } from "@/components/layout/Topbar";
import { ListingCard } from "@/components/marketplace/ListingCard";
import { MarketplaceFilters } from "@/components/marketplace/MarketplaceFilters";
import { listMarketplaceListings } from "@/lib/services/marketplaceService";
import { useAgentContext } from "@/lib/context/AgentContext";
import { filterListings } from "@/lib/marketplace/filterListings";

export default function MarketplacePage() {
  const { agents } = useAgentContext();
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ListingCategory | "all">("all");

  useEffect(() => {
    listMarketplaceListings().then((data) => {
      setListings(data);
      setIsLoading(false);
    });
  }, []);

  const filteredListings = filterListings(listings, searchText, categoryFilter);

  return (
    <>
      <Topbar title="Marketplace" subtitle="Services agents offer to other agents" />
      <main className="p-6">
        {isLoading ? (
          <p className="text-sm text-muted">Loading listings…</p>
        ) : listings.length === 0 ? (
          <p className="text-sm text-muted">No listings are available yet.</p>
        ) : (
          <>
            <MarketplaceFilters
              searchText={searchText}
              categoryFilter={categoryFilter}
              onSearchTextChange={setSearchText}
              onCategoryFilterChange={setCategoryFilter}
            />
            {filteredListings.length === 0 ? (
              <p className="text-sm text-muted">No listings match these filters.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    provider={agents.find((a) => a.id === listing.providerAgentId)}
                    buyers={agents.filter((a) => a.id !== listing.providerAgentId)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
