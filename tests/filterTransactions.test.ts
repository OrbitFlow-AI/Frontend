// Unit tests for the ledger's filtering logic: by agent, by status, and combined.
import { describe, expect, it } from "vitest";
import { filterTransactions } from "@/lib/transactions/filterTransactions";
import type { Transaction } from "@/types/domain";

const transactions: Transaction[] = [
  {
    id: "tx_1",
    fromAgentId: "agent_a",
    toAgentId: "agent_b",
    amount: 10,
    asset: "USDC",
    status: "settled",
    memo: "",
    createdAt: "2026-06-19T10:00:00.000Z",
  },
  {
    id: "tx_2",
    fromAgentId: "agent_b",
    toAgentId: "agent_c",
    amount: 20,
    asset: "USDC",
    status: "blocked",
    violatedRule: "max_per_transaction",
    memo: "",
    createdAt: "2026-06-19T11:00:00.000Z",
  },
  {
    id: "tx_3",
    fromAgentId: "agent_a",
    toAgentId: "agent_c",
    amount: 5,
    asset: "USDC",
    status: "settled",
    memo: "",
    createdAt: "2026-06-19T12:00:00.000Z",
  },
];

describe("filterTransactions", () => {
  it("returns all transactions when both filters are 'all'", () => {
    expect(filterTransactions(transactions, "all", "all")).toHaveLength(3);
  });

  it("filters to transactions involving the given agent as sender or recipient", () => {
    const result = filterTransactions(transactions, "agent_b", "all");
    expect(result.map((tx) => tx.id)).toEqual(["tx_1", "tx_2"]);
  });

  it("filters to transactions matching the given status", () => {
    const result = filterTransactions(transactions, "all", "blocked");
    expect(result.map((tx) => tx.id)).toEqual(["tx_2"]);
  });

  it("combines agent and status filters", () => {
    const result = filterTransactions(transactions, "agent_a", "settled");
    expect(result.map((tx) => tx.id)).toEqual(["tx_1", "tx_3"]);
  });

  it("returns an empty array when no transaction matches", () => {
    const result = filterTransactions(transactions, "agent_a", "blocked");
    expect(result).toHaveLength(0);
  });
});
