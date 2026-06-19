// Formatting helpers for currency amounts and relative timestamps used across the dashboard.

export function formatAmount(amount: number, asset: string): string {
  return `${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${asset}`;
}

export function formatRelativeTime(isoDate: string): string {
  const deltaMs = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(deltaMs / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
