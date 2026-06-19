// Generic surface container used to group related dashboard content.
import { cn } from "@/lib/utils/cn";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-lg border border-border bg-surface p-5", className)}>
      {children}
    </div>
  );
}
