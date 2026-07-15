// Unit tests for the per-agent settled spend aggregation used by the analytics chart.
import { describe, expect, it } from "vitest";
import { computeAgentSpendSummary } from "@/lib/analytics/computeAgentSpendSummary";
import type { Agent, Transaction } from "@/types/domain";

const agents: Agent[] = [
  { id: "agent_a", name: "Agent A" } as Agent,
  { id: "agent_b", name: "Agent B" } as Agent,
];

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
    fromAgentId: "agent_a",
    toAgentId: "agent_b",
    amount: 30,
    asset: "USDC",
    status: "blocked",
    memo: "",
    createdAt: "2026-06-19T11:00:00.000Z",
  },
  {
    id: "tx_3",
    fromAgentId: "agent_b",
    toAgentId: "agent_a",
    amount: 50,
    asset: "USDC",
    status: "settled",
    memo: "",
    createdAt: "2026-06-19T12:00:00.000Z",
  },
];

describe("computeAgentSpendSummary", () => {
  it("sums only settled outgoing transactions per agent", () => {
    const result = computeAgentSpendSummary(agents, transactions);
    const agentA = result.find((r) => r.agentId === "agent_a");
    expect(agentA?.totalSpent).toBe(10);
  });

  it("excludes blocked transactions from the total", () => {
    const result = computeAgentSpendSummary(agents, transactions);
    const agentA = result.find((r) => r.agentId === "agent_a");
    expect(agentA?.totalSpent).not.toBe(40);
  });

  it("sorts agents by total spent, descending", () => {
    const result = computeAgentSpendSummary(agents, transactions);
    expect(result.map((r) => r.agentId)).toEqual(["agent_b", "agent_a"]);
  });

  it("returns a zero total for an agent with no settled outgoing transactions", () => {
    const result = computeAgentSpendSummary(
      [{ id: "agent_c", name: "Agent C" } as Agent],
      transactions,
    );
    expect(result).toEqual([{ agentId: "agent_c", agentName: "Agent C", totalSpent: 0 }]);
  });
});
