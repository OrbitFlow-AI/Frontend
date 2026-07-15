// Reusable label/value metric tile used by the analytics summary row and other dashboard stats.
import { Card } from "@/components/ui/Card";

export function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-100">{value}</p>
    </Card>
  );
}
