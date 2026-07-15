// Unit tests for the ledger-wide analytics totals: settled volume, blocked count, block rate.
import { describe, expect, it } from "vitest";
import { computeLedgerTotals } from "@/lib/analytics/computeLedgerTotals";
import type { Transaction } from "@/types/domain";

const baseTransaction: Omit<Transaction, "id" | "status" | "amount"> = {
  fromAgentId: "agent_a",
  toAgentId: "agent_b",
  asset: "USDC",
  memo: "",
  createdAt: "2026-06-19T10:00:00.000Z",
};

const transactions: Transaction[] = [
  { ...baseTransaction, id: "tx_1", status: "settled", amount: 10 },
  { ...baseTransaction, id: "tx_2", status: "settled", amount: 20 },
  { ...baseTransaction, id: "tx_3", status: "blocked", amount: 30 },
  { ...baseTransaction, id: "tx_4", status: "pending", amount: 5 },
];

describe("computeLedgerTotals", () => {
  it("sums only settled amounts into settledVolume", () => {
    expect(computeLedgerTotals(transactions).settledVolume).toBe(30);
  });

  it("counts blocked transactions", () => {
    expect(computeLedgerTotals(transactions).blockedCount).toBe(1);
  });

  it("computes the block rate as a rounded percentage of all transactions", () => {
    expect(computeLedgerTotals(transactions).blockRatePct).toBe(25);
  });

  it("reports the total transaction count", () => {
    expect(computeLedgerTotals(transactions).transactionCount).toBe(4);
  });

  it("returns zeroed totals for an empty ledger without dividing by zero", () => {
    expect(computeLedgerTotals([])).toEqual({
      transactionCount: 0,
      settledVolume: 0,
      blockedCount: 0,
      blockRatePct: 0,
    });
  });
});
