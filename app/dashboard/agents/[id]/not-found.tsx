// Scoped 404 shown when an agent id in the URL doesn't match any provisioned agent.
import Link from "next/link";

export default function AgentNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-12 text-center">
      <h1 className="text-lg font-semibold text-slate-100">Agent not found</h1>
      <p className="max-w-md text-sm text-muted">
        This agent may have been removed, or belongs to a different network than the one
        currently selected.
      </p>
      <Link href="/dashboard" className="text-sm text-primary hover:underline">
        Back to all agents
      </Link>
    </div>
  );
}
