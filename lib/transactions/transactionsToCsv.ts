// Pure CSV formatter for the transaction ledger — kept side-effect-free so the download
// button only has to hand off the resulting string to a Blob.
import type { Agent, Transaction } from "@/types/domain";

const HEADER = ["id", "from", "to", "amount", "asset", "status", "violatedRule", "memo", "createdAt"];

function escapeCsvField(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function transactionsToCsv(
  transactions: Transaction[],
  agentsById: Record<string, Agent | undefined>,
): string {
  const rows = transactions.map((tx) => [
    tx.id,
    agentsById[tx.fromAgentId]?.name ?? tx.fromAgentId,
    agentsById[tx.toAgentId]?.name ?? tx.toAgentId,
    String(tx.amount),
    tx.asset,
    tx.status,
    tx.violatedRule ?? "",
    tx.memo,
    tx.createdAt,
  ]);

  return [HEADER, ...rows].map((row) => row.map(escapeCsvField).join(",")).join("\n");
}
