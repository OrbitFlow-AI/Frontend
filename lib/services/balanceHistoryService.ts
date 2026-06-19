// Mock balance history service. A real implementation would derive this from on-chain
// transaction history rather than generating a synthetic walk.
import { mockDelay } from "./mockLatency";

export interface BalancePoint {
  label: string;
  balance: number;
}

export async function getBalanceHistory(currentBalance: number): Promise<BalancePoint[]> {
  const points: BalancePoint[] = [];
  let balance = currentBalance * 0.7;
  for (let i = 6; i >= 0; i--) {
    points.push({ label: `Day -${i}`, balance: Math.max(0, Math.round(balance * 100) / 100) });
    balance += (currentBalance - balance) / (i + 1);
  }
  points[points.length - 1] = { label: "Today", balance: currentBalance };
  return mockDelay(points);
}
