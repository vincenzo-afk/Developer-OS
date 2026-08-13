import { describe, expect, it } from "vitest";
import { sortExplorerItems } from "./explorerWorkspace";

const rows = [
  { name: "Zeta", language: "TypeScript", status: "building", description: "", stars: 0, category: "Product" },
  { name: "Alpha", language: "Python", status: "live", description: "", stars: 0, category: "AI Systems" },
  { name: "Beta", language: "JavaScript", status: "prototype", description: "", stars: 0, category: "Design" },
] as const;

describe("Explorer workspace ordering", () => {
  it("sorts the verified portfolio records deterministically", () => {
    expect(sortExplorerItems([...rows], "name").map((item) => item.name)).toEqual(["Alpha", "Beta", "Zeta"]);
    expect(sortExplorerItems([...rows], "language").map((item) => item.name)).toEqual(["Beta", "Alpha", "Zeta"]);
    expect(sortExplorerItems([...rows], "status").map((item) => item.name)).toEqual(["Alpha", "Zeta", "Beta"]);
  });
});
