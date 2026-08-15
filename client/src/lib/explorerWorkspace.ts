import type { PortfolioRepo } from "./portfolioData";

export type ExplorerSort = "name" | "language" | "status";
export type ProjectWorkspace = { pinnedNames: string[]; recentNames: string[] };

const WORKSPACE_KEY = "developer-os-project-workspace-v1";
const MAX_WORKSPACE_ITEMS = 12;

const statusRank: Record<PortfolioRepo["status"], number> = { live: 0, building: 1, prototype: 2, fork: 3 };

export function sortExplorerItems(items: PortfolioRepo[], sort: ExplorerSort) {
  return [...items].sort((left, right) => {
    if (sort === "language") return left.language.localeCompare(right.language) || left.name.localeCompare(right.name);
    if (sort === "status") return statusRank[left.status] - statusRank[right.status] || left.name.localeCompare(right.name);
    return left.name.localeCompare(right.name);
  });
}

function sanitizeNames(value: unknown, knownNames: Set<string>) {
  return Array.isArray(value)
    ? Array.from(new Set(value.filter((name): name is string => typeof name === "string" && knownNames.has(name)))).slice(0, MAX_WORKSPACE_ITEMS)
    : [];
}

export function defaultProjectWorkspace(): ProjectWorkspace {
  return { pinnedNames: [], recentNames: [] };
}

export function readProjectWorkspace(knownNames: string[], storage: Storage | undefined = typeof window === "undefined" ? undefined : window.localStorage): ProjectWorkspace {
  if (!storage) return defaultProjectWorkspace();
  try {
    const value = JSON.parse(storage.getItem(WORKSPACE_KEY) ?? "{}");
    const known = new Set(knownNames);
    return { pinnedNames: sanitizeNames(value?.pinnedNames, known), recentNames: sanitizeNames(value?.recentNames, known) };
  } catch { return defaultProjectWorkspace(); }
}

export function writeProjectWorkspace(workspace: ProjectWorkspace, knownNames: string[], storage: Storage | undefined = typeof window === "undefined" ? undefined : window.localStorage): ProjectWorkspace {
  const known = new Set(knownNames);
  const next = { pinnedNames: sanitizeNames(workspace.pinnedNames, known), recentNames: sanitizeNames(workspace.recentNames, known) };
  if (storage) storage.setItem(WORKSPACE_KEY, JSON.stringify(next));
  return next;
}

export function togglePinnedProject(workspace: ProjectWorkspace, name: string): ProjectWorkspace {
  const pinnedNames = workspace.pinnedNames.includes(name) ? workspace.pinnedNames.filter((item) => item !== name) : [name, ...workspace.pinnedNames].slice(0, MAX_WORKSPACE_ITEMS);
  return { ...workspace, pinnedNames };
}

export function recordRecentProject(workspace: ProjectWorkspace, name: string): ProjectWorkspace {
  return { ...workspace, recentNames: [name, ...workspace.recentNames.filter((item) => item !== name)].slice(0, MAX_WORKSPACE_ITEMS) };
}
