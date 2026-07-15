// One marketplace offering: lets the operator pick a buyer agent and simulate a purchase,
// which creates a real transaction via the same payAgent path used by the core loop.
"use client";

import { useState } from "react";
import type { Agent, MarketplaceListing } from "@/types/domain";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatAmount } from "@/lib/utils/format";
import { useAgentContext } from "@/lib/context/AgentContext";
import { useToast } from "@/lib/context/ToastContext";

const categoryLabel: Record<MarketplaceListing["category"], string> = {
  api_access: "API Access",
  dataset: "Dataset",
  compute: "Compute",
};

export function ListingCard({
  listing,
  provider,
  buyers,
}: {
  listing: MarketplaceListing;
  provider: Agent | undefined;
  buyers: Agent[];
}) {
  const { payAgent } = useAgentContext();
  const { notify } = useToast();
  const [buyerId, setBuyerId] = useState(buyers[0]?.id ?? "");
  const [status, setStatus] = useState<"idle" | "purchasing" | "settled" | "blocked">("idle");

  async function handlePurchase() {
    if (!buyerId) return;
    setStatus("purchasing");
    const result = await payAgent(buyerId, listing.providerAgentId, listing.pricePerCall, `Purchased: ${listing.name}`);
    setStatus(result.allowed ? "settled" : "blocked");
    notify(
      result.allowed ? `Purchased ${listing.name}.` : "Purchase blocked by buyer's spend policy.",
      result.allowed ? "success" : "danger",
    );
  }

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-slate-100">{listing.name}</h3>
          <p className="mt-1 text-xs text-muted">Provided by {provider?.name ?? "Unknown agent"}</p>
        </div>
        <Badge tone="neutral">{categoryLabel[listing.category]}</Badge>
      </div>

      <p className="mt-3 text-lg font-semibold text-slate-100">
        {formatAmount(listing.pricePerCall, listing.asset)}
        <span className="ml-1 text-xs font-normal text-muted">/ call</span>
      </p>

      {buyers.length === 0 ? (
        <p className="mt-3 text-xs text-muted">No buyer agents available.</p>
      ) : (
        <div className="mt-3 flex items-center gap-2">
          <select
            value={buyerId}
            onChange={(e) => setBuyerId(e.target.value)}
            className="rounded-md border border-border bg-background px-2 py-1.5 text-xs text-slate-100"
          >
            {buyers.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name}
              </option>
            ))}
          </select>
          <Button
            variant="secondary"
            onClick={handlePurchase}
            disabled={status === "purchasing"}
            className="text-xs"
          >
            {status === "purchasing" ? "Purchasing…" : "Purchase"}
          </Button>
        </div>
      )}

      {status === "settled" ? <p className="mt-2 text-xs text-success">Purchase settled.</p> : null}
      {status === "blocked" ? (
        <p className="mt-2 text-xs text-danger">Purchase blocked by buyer&rsquo;s spend policy.</p>
      ) : null}
    </Card>
  );
}
