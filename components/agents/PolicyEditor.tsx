// Lets an operator view and edit the spend policy that governs one agent's outgoing payments.
"use client";

import { useEffect, useState } from "react";
import type { Policy } from "@/types/domain";
import { Button } from "@/components/ui/Button";
import { getPolicyForAgent, savePolicyForAgent } from "@/lib/services/policyService";
import { policySchema } from "@/lib/validation/policySchema";
import { useToast } from "@/lib/context/ToastContext";
import { PolicyTemplatePicker } from "@/components/agents/PolicyTemplatePicker";

export function PolicyEditor({ agentId }: { agentId: string }) {
  const { notify } = useToast();
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let isMounted = true;
    getPolicyForAgent(agentId).then((existing) => {
      if (!isMounted) return;
      setPolicy(
        existing ?? {
          id: "",
          agentId,
          active: true,
          maxPerTransaction: 50,
          dailyCap: 200,
          allowedCounterpartyIds: null,
        },
      );
      setIsLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, [agentId]);

  if (isLoading || !policy) {
    return <p className="text-sm text-muted">Loading policy…</p>;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!policy) return;

    const parsed = policySchema.safeParse(policy);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    setIsSaving(true);
    try {
      const saved = await savePolicyForAgent({
        agentId,
        active: policy.active,
        maxPerTransaction: policy.maxPerTransaction,
        dailyCap: policy.dailyCap,
        allowedCounterpartyIds: policy.allowedCounterpartyIds,
      });
      setPolicy(saved);
      setSavedAt(Date.now());
      notify("Spend policy saved.", "success");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-3">
      <PolicyTemplatePicker
        onApply={(maxPerTransaction, dailyCap) =>
          setPolicy({ ...policy, maxPerTransaction, dailyCap })
        }
      />

      <label className="flex items-center gap-2 text-sm text-slate-200">
        <input
          type="checkbox"
          checked={policy.active}
          onChange={(e) => setPolicy({ ...policy, active: e.target.checked })}
        />
        Policy active
      </label>

      <div className="flex flex-wrap gap-4">
        <div>
          <label className="block text-xs text-muted">Max per transaction</label>
          <input
            type="number"
            min={0}
            value={policy.maxPerTransaction}
            onChange={(e) => setPolicy({ ...policy, maxPerTransaction: Number(e.target.value) })}
            className="mt-1 w-36 rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-100"
          />
          {errors.maxPerTransaction ? (
            <p className="mt-1 text-xs text-danger">{errors.maxPerTransaction}</p>
          ) : null}
        </div>
        <div>
          <label className="block text-xs text-muted">Daily cap</label>
          <input
            type="number"
            min={0}
            value={policy.dailyCap}
            onChange={(e) => setPolicy({ ...policy, dailyCap: Number(e.target.value) })}
            className="mt-1 w-36 rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-100"
          />
          {errors.dailyCap ? <p className="mt-1 text-xs text-danger">{errors.dailyCap}</p> : null}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" variant="secondary" disabled={isSaving}>
          {isSaving ? "Saving…" : "Save Policy"}
        </Button>
        {savedAt ? <span className="text-xs text-success">Saved</span> : null}
      </div>
    </form>
  );
}
