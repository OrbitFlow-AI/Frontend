// Unit tests for the policy template presets: ensures caps are positive and ordered sanely.
import { describe, expect, it } from "vitest";
import { policyTemplates } from "@/lib/policy/policyTemplates";

describe("policyTemplates", () => {
  it("defines a conservative, standard, and permissive preset", () => {
    expect(policyTemplates.map((t) => t.id)).toEqual(["conservative", "standard", "permissive"]);
  });

  it("has positive max-per-transaction and daily-cap values for every preset", () => {
    for (const template of policyTemplates) {
      expect(template.maxPerTransaction).toBeGreaterThan(0);
      expect(template.dailyCap).toBeGreaterThan(0);
    }
  });

  it("orders presets from tightest to loosest caps", () => {
    const maxPerTransactionValues = policyTemplates.map((t) => t.maxPerTransaction);
    const dailyCapValues = policyTemplates.map((t) => t.dailyCap);
    expect(maxPerTransactionValues).toEqual([...maxPerTransactionValues].sort((a, b) => a - b));
    expect(dailyCapValues).toEqual([...dailyCapValues].sort((a, b) => a - b));
  });

  it("keeps daily cap greater than or equal to max per transaction in every preset", () => {
    for (const template of policyTemplates) {
      expect(template.dailyCap).toBeGreaterThanOrEqual(template.maxPerTransaction);
    }
  });
});
