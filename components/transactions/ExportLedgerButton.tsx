// Downloads the currently filtered ledger rows as a CSV file for compliance/audit review.
"use client";

import type { Agent, Transaction } from "@/types/domain";
import { Button } from "@/components/ui/Button";
import { transactionsToCsv } from "@/lib/transactions/transactionsToCsv";

export function ExportLedgerButton({
  transactions,
  agentsById,
}: {
  transactions: Transaction[];
  agentsById: Record<string, Agent | undefined>;
}) {
  function handleExport() {
    const csv = transactionsToCsv(transactions, agentsById);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `orbitflow-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button variant="secondary" onClick={handleExport} disabled={transactions.length === 0}>
      Export CSV
    </Button>
  );
}
