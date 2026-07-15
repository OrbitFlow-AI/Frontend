// Pure aggregation of settled outgoing spend per agent, used to drive the analytics bar chart.
import type { Agent, Transaction } from "@/types/domain";

export interface AgentSpendSummary {
  agentId: string;
  agentName: string;
  totalSpent: number;
}

export function computeAgentSpendSummary(
  agents: Agent[],
  transactions: Transaction[],
): AgentSpendSummary[] {
  return agents
    .map((agent) => {
      const totalSpent = transactions
        .filter((tx) => tx.fromAgentId === agent.id && tx.status === "settled")
        .reduce((sum, tx) => sum + tx.amount, 0);
      return { agentId: agent.id, agentName: agent.name, totalSpent };
    })
    .sort((a, b) => b.totalSpent - a.totalSpent);
}
