// Search text + status filter controls for the agent treasury dashboard.
import type { AgentStatus } from "@/types/domain";

const statusOptions: Array<AgentStatus | "all"> = ["all", "active", "paused", "over_limit"];

const statusLabel: Record<AgentStatus | "all", string> = {
  all: "All statuses",
  active: "Active",
  paused: "Paused",
  over_limit: "Over limit",
};

export function AgentSearchBar({
  searchText,
  statusFilter,
  onSearchTextChange,
  onStatusFilterChange,
}: {
  searchText: string;
  statusFilter: AgentStatus | "all";
  onSearchTextChange: (value: string) => void;
  onStatusFilterChange: (value: AgentStatus | "all") => void;
}) {
  return (
    <div className="mb-4 flex flex-wrap gap-3">
      <input
        type="search"
        value={searchText}
        onChange={(e) => onSearchTextChange(e.target.value)}
        placeholder="Search agents by name or description…"
        className="w-full max-w-xs rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-100"
      />
      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value as AgentStatus | "all")}
        className="rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-100"
      >
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {statusLabel[status]}
          </option>
        ))}
      </select>
    </div>
  );
}
