// Unit tests for the Create Listing form's Zod schema.
import { describe, expect, it } from "vitest";
import { createListingSchema } from "@/lib/validation/listingSchema";

describe("createListingSchema", () => {
  it("accepts a valid listing payload", () => {
    const result = createListingSchema.safeParse({
      providerAgentId: "agent_pricer",
      name: "Live Price Feed API",
      category: "api_access",
      pricePerCall: 1.5,
      asset: "USDC",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a name shorter than 2 characters", () => {
    const result = createListingSchema.safeParse({
      providerAgentId: "agent_pricer",
      name: "A",
      category: "api_access",
      pricePerCall: 1.5,
      asset: "USDC",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a non-positive price per call", () => {
    const result = createListingSchema.safeParse({
      providerAgentId: "agent_pricer",
      name: "Live Price Feed API",
      category: "api_access",
      pricePerCall: 0,
      asset: "USDC",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid category value", () => {
    const result = createListingSchema.safeParse({
      providerAgentId: "agent_pricer",
      name: "Live Price Feed API",
      category: "storage",
      pricePerCall: 1.5,
      asset: "USDC",
    });
    expect(result.success).toBe(false);
  });

  it("coerces a numeric string price", () => {
    const result = createListingSchema.safeParse({
      providerAgentId: "agent_pricer",
      name: "Live Price Feed API",
      category: "api_access",
      pricePerCall: "2.25",
      asset: "USDC",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.pricePerCall).toBe(2.25);
    }
  });
});
