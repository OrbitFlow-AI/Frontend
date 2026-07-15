// Headline metric cards shown at the top of the analytics page.
import { StatCard } from "@/components/ui/StatCard";
import type { LedgerTotals } from "@/lib/analytics/computeLedgerTotals";
import { formatAmount } from "@/lib/utils/format";

export function AnalyticsSummaryCards({ totals }: { totals: LedgerTotals }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Total transactions" value={totals.transactionCount} />
      <StatCard label="Settled volume" value={formatAmount(totals.settledVolume, "USDC")} />
      <StatCard label="Blocked payments" value={totals.blockedCount} />
      <StatCard label="Block rate" value={`${totals.blockRatePct}%`} />
    </div>
  );
}
