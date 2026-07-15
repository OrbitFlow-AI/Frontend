// Headline metric cards shown at the top of the analytics page.
import { Card } from "@/components/ui/Card";
import type { LedgerTotals } from "@/lib/analytics/computeLedgerTotals";
import { formatAmount } from "@/lib/utils/format";

export function AnalyticsSummaryCards({ totals }: { totals: LedgerTotals }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <p className="text-xs text-muted">Total transactions</p>
        <p className="mt-1 text-2xl font-semibold text-slate-100">{totals.transactionCount}</p>
      </Card>
      <Card>
        <p className="text-xs text-muted">Settled volume</p>
        <p className="mt-1 text-2xl font-semibold text-slate-100">
          {formatAmount(totals.settledVolume, "USDC")}
        </p>
      </Card>
      <Card>
        <p className="text-xs text-muted">Blocked payments</p>
        <p className="mt-1 text-2xl font-semibold text-slate-100">{totals.blockedCount}</p>
      </Card>
      <Card>
        <p className="text-xs text-muted">Block rate</p>
        <p className="mt-1 text-2xl font-semibold text-slate-100">{totals.blockRatePct}%</p>
      </Card>
    </div>
  );
}
