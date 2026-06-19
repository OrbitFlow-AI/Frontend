// Renders an agent's recent balance trend. Kept as its own module so the page that uses it
// can dynamically import it and keep the recharts bundle out of the initial page load.
"use client";

import { useEffect, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getBalanceHistory, type BalancePoint } from "@/lib/services/balanceHistoryService";

export default function BalanceHistoryChart({ currentBalance }: { currentBalance: number }) {
  const [points, setPoints] = useState<BalancePoint[]>([]);

  useEffect(() => {
    getBalanceHistory(currentBalance).then(setPoints);
  }, [currentBalance]);

  if (points.length === 0) {
    return <p className="text-sm text-muted">Loading balance history…</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={points}>
        <XAxis dataKey="label" stroke="#64748b" fontSize={12} />
        <YAxis stroke="#64748b" fontSize={12} width={48} />
        <Tooltip
          contentStyle={{ background: "#121826", border: "1px solid #1f2937" }}
          labelStyle={{ color: "#f8fafc" }}
        />
        <Line type="monotone" dataKey="balance" stroke="#5b8def" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
