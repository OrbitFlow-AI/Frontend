// Pure filter used by the Ledger page — extracted so the filtering rules are unit-testable
// independent of React rendering.
import type { Transaction, TransactionStatus } from "@/types/domain";

export function filterTransactions(
  transactions: Transaction[],
  agentFilter: string,
  statusFilter: TransactionStatus | "all",
): Transaction[] {
  return transactions.filter((tx) => {
    const matchesAgent =
      agentFilter === "all" || tx.fromAgentId === agentFilter || tx.toAgentId === agentFilter;
    const matchesStatus = statusFilter === "all" || tx.status === statusFilter;
    return matchesAgent && matchesStatus;
  });
}
