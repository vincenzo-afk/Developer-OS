import { describe, expect, it } from "vitest";
import { readProjectWorkspace, recordRecentProject, togglePinnedProject, writeProjectWorkspace } from "./explorerWorkspace";

function memoryStorage() {
  const values = new Map<string, string>();
  return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) } as Storage;
}

describe("project workspace persistence", () => {
  it("records newest project activity first and toggles pinned projects", () => {
    const recent = recordRecentProject(recordRecentProject({ pinnedNames: [], recentNames: [] }, "NOVA"), "IRIS");
    expect(recent.recentNames).toEqual(["IRIS", "NOVA"]);
    expect(togglePinnedProject(togglePinnedProject(recent, "NOVA"), "NOVA").pinnedNames).toEqual([]);
  });

  it("filters stale stored project names", () => {
    const storage = memoryStorage();
    writeProjectWorkspace({ pinnedNames: ["NOVA", "missing"], recentNames: ["missing", "IRIS"] }, ["NOVA", "IRIS"], storage);
    expect(readProjectWorkspace(["NOVA", "IRIS"], storage)).toEqual({ pinnedNames: ["NOVA"], recentNames: ["IRIS"] });
  });
});
