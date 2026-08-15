import { describe, expect, it } from "vitest";
import { searchDesktop } from "./desktopSearch";
import type { PortfolioRepo } from "./portfolioData";

const apps = [{ id: "browser", title: "Microsoft Edge", short: "Live Demos" }, { id: "projects", title: "Project Hub", short: "Projects" }];
const repos: PortfolioRepo[] = [{ name: "NOVA", description: "Autonomous multi-agent execution system", language: "Python", stars: 0, status: "building", category: "AI Systems" }];

describe("searchDesktop", () => {
  it("matches both installed apps and verified repository records", () => {
    expect(searchDesktop("pro", apps, repos).map((result) => result.id)).toEqual(["projects"]);
    expect(searchDesktop("agent python", apps, repos).map((result) => result.id)).toEqual(["NOVA"]);
  });

  it("returns a bounded app launcher list for an empty query", () => {
    expect(searchDesktop("", apps, repos, 1)).toEqual([{ kind: "app", id: "browser", title: "Microsoft Edge", subtitle: "Live Demos" }]);
  });
});
