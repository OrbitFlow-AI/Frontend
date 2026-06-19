// Client-side state container: loads agents/transactions from the mock services once and
// exposes the one core-loop action (payAgent) plus a refresh hook to the component tree.
"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Agent, Transaction } from "@/types/domain";
import { adjustBalance, listAgents } from "@/lib/services/agentService";
import { listTransactions, recordTransaction } from "@/lib/services/transactionService";
import { getPolicyForAgent } from "@/lib/services/policyService";
import { evaluatePolicy } from "@/lib/policy/evaluatePolicy";

export interface PayAgentResult {
  allowed: boolean;
  violatedRule?: Transaction["violatedRule"];
}

interface AgentContextValue {
  agents: Agent[];
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  payAgent: (
    fromAgentId: string,
    toAgentId: string,
    amount: number,
    memo: string,
  ) => Promise<PayAgentResult>;
}

const AgentContext = createContext<AgentContextValue | null>(null);

export function AgentProvider({ children }: { children: React.ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [agentList, txList] = await Promise.all([listAgents(), listTransactions()]);
      setAgents(agentList);
      setTransactions(txList);
    } catch {
      setError("Failed to load agent treasury data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const payAgent = useCallback(
    async (
      fromAgentId: string,
      toAgentId: string,
      amount: number,
      memo: string,
    ): Promise<PayAgentResult> => {
      const policy = await getPolicyForAgent(fromAgentId);
      const todaysOutgoing = transactions.filter((tx) => tx.fromAgentId === fromAgentId);
      const check = evaluatePolicy(policy, amount, toAgentId, todaysOutgoing);

      if (!check.allowed) {
        await recordTransaction({
          fromAgentId,
          toAgentId,
          amount,
          asset: "USDC",
          memo,
          status: "blocked",
          violatedRule: check.violatedRule,
        });
        await refresh();
        return { allowed: false, violatedRule: check.violatedRule };
      }

      await adjustBalance(fromAgentId, -amount);
      await adjustBalance(toAgentId, amount);
      await recordTransaction({
        fromAgentId,
        toAgentId,
        amount,
        asset: "USDC",
        memo,
        status: "settled",
      });
      await refresh();
      return { allowed: true };
    },
    [refresh, transactions],
  );

  return (
    <AgentContext.Provider value={{ agents, transactions, isLoading, error, refresh, payAgent }}>
      {children}
    </AgentContext.Provider>
  );
}

export function useAgentContext(): AgentContextValue {
  const ctx = useContext(AgentContext);
  if (!ctx) throw new Error("useAgentContext must be used within an AgentProvider");
  return ctx;
}
