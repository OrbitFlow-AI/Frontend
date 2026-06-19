// Mock transaction ledger service. Stands in for reading Soroban contract events — the
// real implementation would subscribe to/poll on-chain payment events instead of an array.
import type { Transaction } from "@/types/domain";
import { createSeedTransactions } from "./mockData";
import { mockDelay } from "./mockLatency";

let transactions: Transaction[] = createSeedTransactions();

export async function listTransactions(): Promise<Transaction[]> {
  return mockDelay([...transactions].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
}

export async function listTransactionsForAgent(agentId: string): Promise<Transaction[]> {
  const scoped = transactions.filter(
    (tx) => tx.fromAgentId === agentId || tx.toAgentId === agentId,
  );
  return mockDelay(scoped.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
}

export interface RecordTransactionInput {
  fromAgentId: string;
  toAgentId: string;
  amount: number;
  asset: string;
  memo: string;
}

export async function recordSettledTransaction(
  input: RecordTransactionInput,
): Promise<Transaction> {
  const transaction: Transaction = {
    id: `tx_${crypto.randomUUID().slice(0, 8)}`,
    fromAgentId: input.fromAgentId,
    toAgentId: input.toAgentId,
    amount: input.amount,
    asset: input.asset,
    status: "settled",
    memo: input.memo,
    createdAt: new Date().toISOString(),
  };
  transactions = [...transactions, transaction];
  return mockDelay(transaction);
}
