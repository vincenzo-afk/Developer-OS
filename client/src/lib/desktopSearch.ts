import type { PortfolioRepo } from "./portfolioData";

export type SearchableApp = { id: string; title: string; short: string };
export type DesktopSearchResult =
  | { kind: "app"; id: string; title: string; subtitle: string }
  | { kind: "repo"; id: string; title: string; subtitle: string };

function includesTerms(value: string, terms: string[]) {
  const haystack = value.toLowerCase();
  return terms.every((term) => haystack.includes(term));
}

export function searchDesktop(query: string, apps: SearchableApp[], repositories: PortfolioRepo[], limit = 12): DesktopSearchResult[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return apps.slice(0, limit).map((app) => ({ kind: "app", id: app.id, title: app.title, subtitle: app.short }));
  const appResults = apps
    .filter((app) => includesTerms(`${app.title} ${app.short}`, terms))
    .map((app) => ({ kind: "app" as const, id: app.id, title: app.title, subtitle: app.short }));
  const repoResults = repositories
    .filter((repo) => includesTerms(`${repo.name} ${repo.description} ${repo.language} ${repo.category} ${repo.status}`, terms))
    .map((repo) => ({ kind: "repo" as const, id: repo.name, title: repo.name, subtitle: `${repo.language} · ${repo.category} · ${repo.status}` }));
  return [...appResults, ...repoResults].slice(0, Math.max(1, limit));
}
