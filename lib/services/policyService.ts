// Mock policy storage service. A real backend would persist policies alongside (or inside)
// the Soroban contract that enforces them; here they just live in memory.
import type { Policy } from "@/types/domain";
import { createSeedPolicies } from "./mockData";
import { mockDelay } from "./mockLatency";

let policies: Policy[] = createSeedPolicies();

export async function getPolicyForAgent(agentId: string): Promise<Policy | undefined> {
  return mockDelay(policies.find((policy) => policy.agentId === agentId));
}

export interface SavePolicyInput {
  agentId: string;
  active: boolean;
  maxPerTransaction: number;
  dailyCap: number;
  allowedCounterpartyIds: string[] | null;
}

export async function savePolicyForAgent(input: SavePolicyInput): Promise<Policy> {
  const existing = policies.find((policy) => policy.agentId === input.agentId);
  const updated: Policy = {
    id: existing?.id ?? `policy_${crypto.randomUUID().slice(0, 8)}`,
    agentId: input.agentId,
    active: input.active,
    maxPerTransaction: input.maxPerTransaction,
    dailyCap: input.dailyCap,
    allowedCounterpartyIds: input.allowedCounterpartyIds,
  };
  policies = existing
    ? policies.map((policy) => (policy.agentId === input.agentId ? updated : policy))
    : [...policies, updated];
  return mockDelay(updated);
}

export async function resetPolicies(): Promise<Policy[]> {
  policies = createSeedPolicies();
  return mockDelay(policies);
}
