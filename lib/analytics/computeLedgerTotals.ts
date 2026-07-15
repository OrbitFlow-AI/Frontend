// Pure aggregation of ledger-wide totals: settled volume, blocked count, and block rate —
// the headline numbers shown at the top of the analytics page.
import type { Transaction } from "@/types/domain";

export interface LedgerTotals {
  transactionCount: number;
  settledVolume: number;
  blockedCount: number;
  blockRatePct: number;
}

export function computeLedgerTotals(transactions: Transaction[]): LedgerTotals {
  const settledVolume = transactions
    .filter((tx) => tx.status === "settled")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const blockedCount = transactions.filter((tx) => tx.status === "blocked").length;
  const blockRatePct =
    transactions.length === 0 ? 0 : Math.round((blockedCount / transactions.length) * 100);

  return {
    transactionCount: transactions.length,
    settledVolume,
    blockedCount,
    blockRatePct,
  };
}
