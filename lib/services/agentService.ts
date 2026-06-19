// Mock "treasury" service. Stands in for the future Soroban contract read/write calls —
// real balance reads and on-chain transfers would replace the bodies of these functions.
import type { Agent } from "@/types/domain";
import { createSeedAgents } from "./mockData";
import { mockDelay } from "./mockLatency";

let agents: Agent[] = createSeedAgents();

export async function listAgents(network?: Agent["network"]): Promise<Agent[]> {
  const scoped = network ? agents.filter((agent) => agent.network === network) : agents;
  return mockDelay(scoped);
}

export async function getAgent(agentId: string): Promise<Agent | undefined> {
  return mockDelay(agents.find((agent) => agent.id === agentId));
}

export interface CreateAgentInput {
  name: string;
  description: string;
  network: Agent["network"];
  asset: string;
  budget: number;
}

export async function createAgent(input: CreateAgentInput): Promise<Agent> {
  const agent: Agent = {
    id: `agent_${crypto.randomUUID().slice(0, 8)}`,
    name: input.name,
    description: input.description,
    network: input.network,
    asset: input.asset,
    balance: input.budget,
    budget: input.budget,
    status: "active",
    walletConnected: false,
    createdAt: new Date().toISOString(),
  };
  agents = [...agents, agent];
  return mockDelay(agent);
}

export async function adjustBalance(agentId: string, delta: number): Promise<Agent> {
  agents = agents.map((agent) =>
    agent.id === agentId ? { ...agent, balance: agent.balance + delta } : agent,
  );
  const updated = agents.find((agent) => agent.id === agentId);
  if (!updated) throw new Error(`Unknown agent: ${agentId}`);
  return mockDelay(updated);
}

export async function setWalletConnected(agentId: string, connected: boolean): Promise<Agent> {
  agents = agents.map((agent) =>
    agent.id === agentId ? { ...agent, walletConnected: connected } : agent,
  );
  const updated = agents.find((agent) => agent.id === agentId);
  if (!updated) throw new Error(`Unknown agent: ${agentId}`);
  return mockDelay(updated);
}
