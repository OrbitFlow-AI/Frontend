// Validated form for provisioning a new agent treasury, used inside the Create Agent modal.
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAgentContext } from "@/lib/context/AgentContext";
import { createAgentSchema } from "@/lib/validation/agentSchema";

export function CreateAgentForm({ onCreated }: { onCreated: () => void }) {
  const { createAgent } = useAgentContext();
  const [values, setValues] = useState({
    name: "",
    description: "",
    network: "testnet" as "testnet" | "mainnet",
    asset: "USDC",
    budget: "100",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = createAgentSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    try {
      await createAgent(parsed.data);
      onCreated();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs text-muted">Name</label>
        <input
          value={values.name}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-100"
        />
        {errors.name ? <p className="mt-1 text-xs text-danger">{errors.name}</p> : null}
      </div>

      <div>
        <label className="block text-xs text-muted">Description</label>
        <input
          value={values.description}
          onChange={(e) => setValues({ ...values, description: e.target.value })}
          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-100"
        />
        {errors.description ? (
          <p className="mt-1 text-xs text-danger">{errors.description}</p>
        ) : null}
      </div>

      <div className="flex gap-3">
        <div>
          <label className="block text-xs text-muted">Network</label>
          <select
            value={values.network}
            onChange={(e) =>
              setValues({ ...values, network: e.target.value as "testnet" | "mainnet" })
            }
            className="mt-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-100"
          >
            <option value="testnet">Testnet</option>
            <option value="mainnet">Mainnet</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-muted">Initial budget</label>
          <input
            type="number"
            min={0}
            value={values.budget}
            onChange={(e) => setValues({ ...values, budget: e.target.value })}
            className="mt-1 w-32 rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-100"
          />
          {errors.budget ? <p className="mt-1 text-xs text-danger">{errors.budget}</p> : null}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Creating…" : "Create Agent"}
      </Button>
    </form>
  );
}
