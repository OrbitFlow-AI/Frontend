// Compact feed of the most recent transactions across all agents, surfaced on the dashboard
// so an operator can spot activity without navigating to the full ledger.
import Link from "next/link";
import type { Agent, Transaction } from "@/types/domain";
import { Card } from "@/components/ui/Card";
import { TransactionRow } from "@/components/transactions/TransactionRow";

const RECENT_COUNT = 5;

export function RecentActivity({
  transactions,
  agentsById,
}: {
  transactions: Transaction[];
  agentsById: Record<string, Agent | undefined>;
}) {
  const recent = transactions.slice(0, RECENT_COUNT);

  return (
    <Card>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-medium text-slate-200">Recent activity</h2>
        <Link href="/dashboard/ledger" className="text-xs text-primary hover:underline">
          View full ledger
        </Link>
      </div>
      {recent.length === 0 ? (
        <p className="text-sm text-muted">No transactions yet.</p>
      ) : (
        recent.map((tx) => <TransactionRow key={tx.id} transaction={tx} agentsById={agentsById} />)
      )}
    </Card>
  );
}
