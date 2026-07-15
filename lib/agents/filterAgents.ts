// Pure filter used by the dashboard — matches agents by name/description search text and
// an optional status, extracted so the matching rules are unit-testable without rendering.
import type { Agent, AgentStatus } from "@/types/domain";

export function filterAgents(
  agents: Agent[],
  searchText: string,
  statusFilter: AgentStatus | "all",
): Agent[] {
  const normalizedSearch = searchText.trim().toLowerCase();

  return agents.filter((agent) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      agent.name.toLowerCase().includes(normalizedSearch) ||
      agent.description.toLowerCase().includes(normalizedSearch);
    const matchesStatus = statusFilter === "all" || agent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
}
