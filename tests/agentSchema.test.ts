// Unit tests for the Create Agent form's Zod schema.
import { describe, expect, it } from "vitest";
import { createAgentSchema } from "@/lib/validation/agentSchema";

describe("createAgentSchema", () => {
  it("accepts a valid agent payload", () => {
    const result = createAgentSchema.safeParse({
      name: "Pricer-9",
      description: "Fetches price feeds",
      network: "testnet",
      asset: "USDC",
      budget: 250,
    });
    expect(result.success).toBe(true);
  });

  it("rejects a name shorter than 2 characters", () => {
    const result = createAgentSchema.safeParse({
      name: "P",
      description: "",
      network: "testnet",
      asset: "USDC",
      budget: 100,
    });
    expect(result.success).toBe(false);
  });

  it("rejects a non-positive budget", () => {
    const result = createAgentSchema.safeParse({
      name: "Pricer-9",
      description: "",
      network: "testnet",
      asset: "USDC",
      budget: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid network value", () => {
    const result = createAgentSchema.safeParse({
      name: "Pricer-9",
      description: "",
      network: "devnet",
      asset: "USDC",
      budget: 100,
    });
    expect(result.success).toBe(false);
  });

  it("coerces a numeric string budget", () => {
    const result = createAgentSchema.safeParse({
      name: "Pricer-9",
      description: "",
      network: "testnet",
      asset: "USDC",
      budget: "150",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.budget).toBe(150);
    }
  });
});
