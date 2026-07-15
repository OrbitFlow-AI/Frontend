// Unit tests for the dashboard's agent search/status filtering logic.
import { describe, expect, it } from "vitest";
import { filterAgents } from "@/lib/agents/filterAgents";
import type { Agent } from "@/types/domain";

const agents: Agent[] = [
  {
    id: "agent_pricer",
    name: "Pricer-7",
    description: "Fetches market price feeds.",
    network: "testnet",
    asset: "USDC",
    balance: 100,
    budget: 200,
    status: "active",
    walletConnected: true,
    createdAt: "2026-06-01T00:00:00.000Z",
  },
  {
    id: "agent_compute",
    name: "ComputeMesh-Node3",
    description: "Leases spare inference compute cycles.",
    network: "testnet",
    asset: "USDC",
    balance: 10,
    budget: 200,
    status: "over_limit",
    walletConnected: false,
    createdAt: "2026-06-04T00:00:00.000Z",
  },
];

describe("filterAgents", () => {
  it("returns all agents when search is empty and status is 'all'", () => {
    expect(filterAgents(agents, "", "all")).toHaveLength(2);
  });

  it("matches agents by case-insensitive name substring", () => {
    const result = filterAgents(agents, "pricer", "all");
    expect(result.map((a) => a.id)).toEqual(["agent_pricer"]);
  });

  it("matches agents by description substring", () => {
    const result = filterAgents(agents, "inference", "all");
    expect(result.map((a) => a.id)).toEqual(["agent_compute"]);
  });

  it("filters by status", () => {
    const result = filterAgents(agents, "", "over_limit");
    expect(result.map((a) => a.id)).toEqual(["agent_compute"]);
  });

  it("combines search and status filters", () => {
    const result = filterAgents(agents, "compute", "active");
    expect(result).toHaveLength(0);
  });
});
