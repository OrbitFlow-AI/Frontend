// Single dismissible notification pill rendered by the ToastProvider's viewport.
import { cn } from "@/lib/utils/cn";

export type ToastTone = "neutral" | "success" | "warning" | "danger";

const toneClasses: Record<ToastTone, string> = {
  neutral: "border-border bg-surface text-slate-200",
  success: "border-success/40 bg-success/10 text-success",
  warning: "border-warning/40 bg-warning/10 text-warning",
  danger: "border-danger/40 bg-danger/10 text-danger",
};

export interface ToastItem {
  id: string;
  message: string;
  tone: ToastTone;
}

export function Toast({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: string) => void }) {
  return (
    <div
      role="status"
      className={cn(
        "flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg",
        toneClasses[toast.tone],
      )}
    >
      <span>{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="text-current opacity-70 hover:opacity-100"
      >
        ✕
      </button>
    </div>
  );
}
