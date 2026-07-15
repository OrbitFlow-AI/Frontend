// Unit tests for the mock agent treasury service: listing, scoping by network, and balance ops.
import { describe, expect, it } from "vitest";
import {
  adjustBalance,
  createAgent,
  getAgent,
  listAgents,
  setAgentStatus,
} from "@/lib/services/agentService";

describe("agentService", () => {
  it("lists agents scoped to a given network", async () => {
    const testnetAgents = await listAgents("testnet");
    expect(testnetAgents.every((agent) => agent.network === "testnet")).toBe(true);
  });

  it("returns undefined for an unknown agent id", async () => {
    const agent = await getAgent("agent_does_not_exist");
    expect(agent).toBeUndefined();
  });

  it("creates a new agent with the requested budget as its starting balance", async () => {
    const agent = await createAgent({
      name: "Test Agent",
      description: "A test agent",
      network: "testnet",
      asset: "USDC",
      budget: 42,
    });
    expect(agent.balance).toBe(42);
    expect(agent.budget).toBe(42);
    expect(agent.status).toBe("active");
    expect(agent.walletConnected).toBe(false);
  });

  it("adjusts an existing agent's balance by the given delta", async () => {
    const created = await createAgent({
      name: "Delta Agent",
      description: "",
      network: "testnet",
      asset: "USDC",
      budget: 100,
    });
    const updated = await adjustBalance(created.id, -25);
    expect(updated.balance).toBe(75);
  });

  it("updates an agent's status", async () => {
    const created = await createAgent({
      name: "Pausable Agent",
      description: "",
      network: "testnet",
      asset: "USDC",
      budget: 10,
    });
    const paused = await setAgentStatus(created.id, "paused");
    expect(paused.status).toBe("paused");
  });

  it("throws when setting status on an unknown agent", async () => {
    await expect(setAgentStatus("agent_does_not_exist", "paused")).rejects.toThrow();
  });
});
