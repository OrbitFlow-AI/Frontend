// Lets an operator apply a preset cap combination to the policy form in one click, instead
// of hand-tuning max-per-transaction and daily-cap values from scratch.
import { policyTemplates } from "@/lib/policy/policyTemplates";

export function PolicyTemplatePicker({
  onApply,
}: {
  onApply: (maxPerTransaction: number, dailyCap: number) => void;
}) {
  return (
    <div>
      <p className="text-xs text-muted">Apply a template</p>
      <div className="mt-1 flex flex-wrap gap-2">
        {policyTemplates.map((template) => (
          <button
            key={template.id}
            type="button"
            title={template.description}
            onClick={() => onApply(template.maxPerTransaction, template.dailyCap)}
            className="rounded-md border border-border px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-800 hover:text-slate-100"
          >
            {template.name}
          </button>
        ))}
      </div>
    </div>
  );
}
