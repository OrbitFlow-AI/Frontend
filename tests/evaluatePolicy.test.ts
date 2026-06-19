// Unit tests for the pure policy evaluation function — the logic that decides whether a
// simulated payment settles or gets blocked, and why.
import { describe, expect, it } from "vitest";
import { evaluatePolicy } from "@/lib/policy/evaluatePolicy";
import type { Policy, Transaction } from "@/types/domain";

const basePolicy: Policy = {
  id: "policy_1",
  agentId: "agent_a",
  active: true,
  maxPerTransaction: 50,
  dailyCap: 100,
  allowedCounterpartyIds: null,
};

function tx(amount: number, status: Transaction["status"], createdAt: string): Transaction {
  return {
    id: "tx_test",
    fromAgentId: "agent_a",
    toAgentId: "agent_b",
    amount,
    asset: "USDC",
    status,
    memo: "test",
    createdAt,
  };
}

describe("evaluatePolicy", () => {
  it("allows a payment with no policy", () => {
    const result = evaluatePolicy(undefined, 1000, "agent_b", []);
    expect(result.allowed).toBe(true);
  });

  it("allows a payment with an inactive policy regardless of amount", () => {
    const result = evaluatePolicy({ ...basePolicy, active: false }, 1000, "agent_b", []);
    expect(result.allowed).toBe(true);
  });

  it("blocks a payment exceeding max_per_transaction", () => {
    const result = evaluatePolicy(basePolicy, 75, "agent_b", []);
    expect(result.allowed).toBe(false);
    expect(result.violatedRule).toBe("max_per_transaction");
  });

  it("blocks a payment to a counterparty not on the allow-list", () => {
    const policy = { ...basePolicy, allowedCounterpartyIds: ["agent_c"] };
    const result = evaluatePolicy(policy, 10, "agent_b", []);
    expect(result.allowed).toBe(false);
    expect(result.violatedRule).toBe("allowed_counterparties");
  });

  it("allows a payment to a counterparty on the allow-list", () => {
    const policy = { ...basePolicy, allowedCounterpartyIds: ["agent_b"] };
    const result = evaluatePolicy(policy, 10, "agent_b", []);
    expect(result.allowed).toBe(true);
  });

  it("blocks a payment that would exceed the daily cap", () => {
    const now = "2026-06-19T12:00:00.000Z";
    const earlierToday = tx(60, "settled", "2026-06-19T08:00:00.000Z");
    const result = evaluatePolicy(basePolicy, 45, "agent_b", [earlierToday], now);
    expect(result.allowed).toBe(false);
    expect(result.violatedRule).toBe("daily_cap");
  });

  it("ignores prior-day spend when checking the daily cap", () => {
    const now = "2026-06-19T12:00:00.000Z";
    const yesterday = tx(90, "settled", "2026-06-18T08:00:00.000Z");
    const result = evaluatePolicy(basePolicy, 45, "agent_b", [yesterday], now);
    expect(result.allowed).toBe(true);
  });

  it("ignores blocked transactions when summing today's spend", () => {
    const now = "2026-06-19T12:00:00.000Z";
    const blockedEarlier = tx(90, "blocked", "2026-06-19T08:00:00.000Z");
    const result = evaluatePolicy(basePolicy, 45, "agent_b", [blockedEarlier], now);
    expect(result.allowed).toBe(true);
  });
});
