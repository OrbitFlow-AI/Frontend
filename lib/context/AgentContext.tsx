// Client-side state container: loads agents/transactions from the mock services once and
// exposes the one core-loop action (payAgent) plus a refresh hook to the component tree.
"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Agent, Network, Transaction } from "@/types/domain";
import {
  adjustBalance,
  createAgent as createAgentService,
  listAgents,
  setAgentStatus,
  setWalletConnected,
} from "@/lib/services/agentService";
import type { CreateAgentInput } from "@/lib/services/agentService";
import { listTransactions, recordTransaction } from "@/lib/services/transactionService";
import { getPolicyForAgent } from "@/lib/services/policyService";
import { evaluatePolicy } from "@/lib/policy/evaluatePolicy";
import { connectPasskey } from "@/lib/services/smartAccountService";
import { logger } from "@/lib/observability/logger";

export interface PayAgentResult {
  allowed: boolean;
  violatedRule?: Transaction["violatedRule"];
}

interface AgentContextValue {
  agents: Agent[];
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  network: Network;
  setNetwork: (network: Network) => void;
  refresh: () => Promise<void>;
  createAgent: (input: CreateAgentInput) => Promise<Agent>;
  connectWallet: (agentId: string) => Promise<void>;
  pauseAgent: (agentId: string) => Promise<void>;
  resumeAgent: (agentId: string) => Promise<void>;
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
  const [network, setNetwork] = useState<Network>(
    (process.env.NEXT_PUBLIC_STELLAR_NETWORK as Network) || "testnet",
  );

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [agentList, txList] = await Promise.all([listAgents(network), listTransactions()]);
      setAgents(agentList);
      setTransactions(txList);
    } catch (cause) {
      logger.error("Failed to load agent treasury data", { cause });
      setError("Failed to load agent treasury data.");
    } finally {
      setIsLoading(false);
    }
  }, [network]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createAgent = useCallback(
    async (input: CreateAgentInput) => {
      const agent = await createAgentService(input);
      await refresh();
      return agent;
    },
    [refresh],
  );

  const connectWallet = useCallback(
    async (agentId: string) => {
      await connectPasskey(agentId);
      await setWalletConnected(agentId, true);
      await refresh();
    },
    [refresh],
  );

  const pauseAgent = useCallback(
    async (agentId: string) => {
      await setAgentStatus(agentId, "paused");
      await refresh();
    },
    [refresh],
  );

  const resumeAgent = useCallback(
    async (agentId: string) => {
      await setAgentStatus(agentId, "active");
      await refresh();
    },
    [refresh],
  );

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
        logger.warn("Payment blocked by spend policy", {
          fromAgentId,
          toAgentId,
          amount,
          violatedRule: check.violatedRule,
        });
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
    <AgentContext.Provider
      value={{
        agents,
        transactions,
        isLoading,
        error,
        network,
        setNetwork,
        refresh,
        createAgent,
        connectWallet,
        pauseAgent,
        resumeAgent,
        payAgent,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
}

export function useAgentContext(): AgentContextValue {
  const ctx = useContext(AgentContext);
  if (!ctx) throw new Error("useAgentContext must be used within an AgentProvider");
  return ctx;
}
