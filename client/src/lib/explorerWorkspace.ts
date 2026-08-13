import type { PortfolioRepo } from "./portfolioData";

export type ExplorerSort = "name" | "language" | "status";

const statusRank: Record<PortfolioRepo["status"], number> = { live: 0, building: 1, prototype: 2, fork: 3 };

export function sortExplorerItems(items: PortfolioRepo[], sort: ExplorerSort) {
  return [...items].sort((left, right) => {
    if (sort === "language") return left.language.localeCompare(right.language) || left.name.localeCompare(right.name);
    if (sort === "status") return statusRank[left.status] - statusRank[right.status] || left.name.localeCompare(right.name);
    return left.name.localeCompare(right.name);
  });
}
