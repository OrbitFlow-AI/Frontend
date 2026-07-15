// Unit tests for the ledger CSV export helper: header row, field mapping, and escaping.
import { describe, expect, it } from "vitest";
import { transactionsToCsv } from "@/lib/transactions/transactionsToCsv";
import type { Agent, Transaction } from "@/types/domain";

const agentsById: Record<string, Agent | undefined> = {
  agent_a: { id: "agent_a", name: "Agent, A" } as Agent,
  agent_b: { id: "agent_b", name: "Agent B" } as Agent,
};

const transactions: Transaction[] = [
  {
    id: "tx_1",
    fromAgentId: "agent_a",
    toAgentId: "agent_b",
    amount: 10,
    asset: "USDC",
    status: "blocked",
    violatedRule: "daily_cap",
    memo: "Weekly sync",
    createdAt: "2026-06-19T10:00:00.000Z",
  },
];

describe("transactionsToCsv", () => {
  it("includes a header row", () => {
    const csv = transactionsToCsv([], {});
    expect(csv.split("\n")[0]).toBe(
      "id,from,to,amount,asset,status,violatedRule,memo,createdAt",
    );
  });

  it("maps agent ids to names and includes the violated rule", () => {
    const csv = transactionsToCsv(transactions, agentsById);
    const [, row] = csv.split("\n");
    expect(row).toContain("USDC");
    expect(row).toContain("daily_cap");
    expect(row).toContain("Weekly sync");
  });

  it("quotes fields containing commas", () => {
    const csv = transactionsToCsv(transactions, agentsById);
    expect(csv).toContain('"Agent, A"');
  });

  it("falls back to the raw agent id when the agent is unknown", () => {
    const csv = transactionsToCsv(transactions, {});
    const [, row] = csv.split("\n");
    expect(row.startsWith("tx_1,agent_a,agent_b")).toBe(true);
  });
});
