// Analytics route: ledger-wide totals and a per-agent settled spend breakdown.
"use client";

import dynamic from "next/dynamic";
import { Topbar } from "@/components/layout/Topbar";
import { Card } from "@/components/ui/Card";
import { AnalyticsSummaryCards } from "@/components/analytics/AnalyticsSummaryCards";
import { useAgentContext } from "@/lib/context/AgentContext";
import { computeLedgerTotals } from "@/lib/analytics/computeLedgerTotals";
import { computeAgentSpendSummary } from "@/lib/analytics/computeAgentSpendSummary";

const SpendByAgentChart = dynamic(() => import("@/components/analytics/SpendByAgentChart"), {
  ssr: false,
  loading: () => <p className="text-sm text-muted">Loading chart…</p>,
});

export default function AnalyticsPage() {
  const { agents, transactions, isLoading } = useAgentContext();

  if (isLoading) {
    return (
      <>
        <Topbar title="Analytics" subtitle="Ledger-wide spend and policy enforcement metrics" />
        <main className="p-6">
          <p className="text-sm text-muted">Loading analytics…</p>
        </main>
      </>
    );
  }

  const totals = computeLedgerTotals(transactions);
  const spendByAgent = computeAgentSpendSummary(agents, transactions);

  return (
    <>
      <Topbar title="Analytics" subtitle="Ledger-wide spend and policy enforcement metrics" />
      <main className="space-y-4 p-6">
        <AnalyticsSummaryCards totals={totals} />
        <Card>
          <h2 className="mb-3 text-sm font-medium text-slate-200">Settled spend by agent</h2>
          <SpendByAgentChart data={spendByAgent} />
        </Card>
      </main>
    </>
  );
}
