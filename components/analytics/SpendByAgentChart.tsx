// Bar chart of settled outgoing spend per agent. Kept as its own module, like
// BalanceHistoryChart, so the page that uses it can dynamically import it and keep the
// recharts bundle out of the initial page load.
"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { AgentSpendSummary } from "@/lib/analytics/computeAgentSpendSummary";

export default function SpendByAgentChart({ data }: { data: AgentSpendSummary[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-muted">No spend data yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
        <XAxis dataKey="agentName" stroke="#64748b" fontSize={12} />
        <YAxis stroke="#64748b" fontSize={12} width={48} />
        <Tooltip
          contentStyle={{ background: "#121826", border: "1px solid #1f2937" }}
          labelStyle={{ color: "#f8fafc" }}
        />
        <Bar dataKey="totalSpent" fill="#5b8def" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
