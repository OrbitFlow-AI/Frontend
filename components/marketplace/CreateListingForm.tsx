// Validated form for advertising a new marketplace listing on behalf of a provider agent,
// used inside the marketplace page's Create Listing modal.
"use client";

import { useState } from "react";
import type { Agent, MarketplaceListing } from "@/types/domain";
import { Button } from "@/components/ui/Button";
import { createListing } from "@/lib/services/marketplaceService";
import { createListingSchema } from "@/lib/validation/listingSchema";
import { useToast } from "@/lib/context/ToastContext";

export function CreateListingForm({
  providers,
  onCreated,
}: {
  providers: Agent[];
  onCreated: (listing: MarketplaceListing) => void;
}) {
  const { notify } = useToast();
  const [values, setValues] = useState({
    providerAgentId: providers[0]?.id ?? "",
    name: "",
    category: "api_access" as MarketplaceListing["category"],
    pricePerCall: "1",
    asset: "USDC",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (providers.length === 0) {
    return <p className="text-sm text-muted">No agents available to provide a listing yet.</p>;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = createListingSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    try {
      const listing = await createListing(parsed.data);
      notify(`${listing.name} listed on the marketplace.`, "success");
      onCreated(listing);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs text-muted">Provider agent</label>
        <select
          value={values.providerAgentId}
          onChange={(e) => setValues({ ...values, providerAgentId: e.target.value })}
          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-100"
        >
          {providers.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.name}
            </option>
          ))}
        </select>
        {errors.providerAgentId ? (
          <p className="mt-1 text-xs text-danger">{errors.providerAgentId}</p>
        ) : null}
      </div>

      <div>
        <label className="block text-xs text-muted">Listing name</label>
        <input
          value={values.name}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-100"
        />
        {errors.name ? <p className="mt-1 text-xs text-danger">{errors.name}</p> : null}
      </div>

      <div className="flex gap-3">
        <div>
          <label className="block text-xs text-muted">Category</label>
          <select
            value={values.category}
            onChange={(e) =>
              setValues({
                ...values,
                category: e.target.value as MarketplaceListing["category"],
              })
            }
            className="mt-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-100"
          >
            <option value="api_access">API Access</option>
            <option value="dataset">Dataset</option>
            <option value="compute">Compute</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-muted">Price per call</label>
          <input
            type="number"
            min={0.01}
            step={0.01}
            value={values.pricePerCall}
            onChange={(e) => setValues({ ...values, pricePerCall: e.target.value })}
            className="mt-1 w-32 rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-100"
          />
          {errors.pricePerCall ? (
            <p className="mt-1 text-xs text-danger">{errors.pricePerCall}</p>
          ) : null}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Listing…" : "Create Listing"}
      </Button>
    </form>
  );
}
