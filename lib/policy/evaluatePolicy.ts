// Pure policy evaluation logic: given an agent's active policy and its transactions so far
// today, decide whether a proposed payment is allowed. Mirrors what a contract would enforce
// on-chain; kept pure and side-effect-free so it is independently unit-testable.
import type { Policy, PolicyRuleType, Transaction } from "@/types/domain";

export interface PolicyCheckResult {
  allowed: boolean;
  violatedRule?: PolicyRuleType;
}

function isSameDay(a: string, b: string): boolean {
  return new Date(a).toDateString() === new Date(b).toDateString();
}

export function evaluatePolicy(
  policy: Policy | undefined,
  amount: number,
  toAgentId: string,
  todaysOutgoingTransactions: Transaction[],
  now: string = new Date().toISOString(),
): PolicyCheckResult {
  if (!policy || !policy.active) {
    return { allowed: true };
  }

  if (amount > policy.maxPerTransaction) {
    return { allowed: false, violatedRule: "max_per_transaction" };
  }

  if (policy.allowedCounterpartyIds && !policy.allowedCounterpartyIds.includes(toAgentId)) {
    return { allowed: false, violatedRule: "allowed_counterparties" };
  }

  const spentToday = todaysOutgoingTransactions
    .filter((tx) => tx.status === "settled" && isSameDay(tx.createdAt, now))
    .reduce((sum, tx) => sum + tx.amount, 0);

  if (spentToday + amount > policy.dailyCap) {
    return { allowed: false, violatedRule: "daily_cap" };
  }

  return { allowed: true };
}
