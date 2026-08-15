import { describe, expect, it } from "vitest";
import { executeTerminalProjectRequest, parseTerminalProjectRequest, takePendingBrowserRequest, takePendingExplorerSelection, writePendingBrowserRequest, writePendingExplorerSelection } from "./desktopWorkspaceRouting";

function memoryStorage() {
  const values = new Map<string, string>();
  return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value), removeItem: (key: string) => values.delete(key) } as Storage;
}

describe("desktop workspace routing", () => {
  it("recognizes distinct verified terminal open and explore actions", () => {
    expect(parseTerminalProjectRequest("open nova", ["NOVA", "IRIS"])).toEqual({ action: "open", projectName: "NOVA" });
    expect(parseTerminalProjectRequest("explore IRIS", ["NOVA", "IRIS"])).toEqual({ action: "explore", projectName: "IRIS" });
    expect(parseTerminalProjectRequest("open unknown", ["NOVA"])).toBeNull();
  });

  it("sends terminal open and explore requests to distinct app-shell actions", () => {
    const browser: string[] = []; const explorer: string[] = [];
    executeTerminalProjectRequest({ action: "open", projectName: "NOVA" }, { openProject: (name) => browser.push(name), exploreProject: (name) => explorer.push(name) });
    executeTerminalProjectRequest({ action: "explore", projectName: "IRIS" }, { openProject: (name) => browser.push(name), exploreProject: (name) => explorer.push(name) });
    expect(browser).toEqual(["NOVA"]); expect(explorer).toEqual(["IRIS"]);
  });

  it("consumes one-time browser and Explorer navigation requests", () => {
    const storage = memoryStorage();
    writePendingBrowserRequest("https://example.com", storage); writePendingExplorerSelection("NOVA", storage);
    expect(takePendingBrowserRequest(storage)).toBe("https://example.com");
    expect(takePendingBrowserRequest(storage)).toBeNull();
    expect(takePendingExplorerSelection(storage)).toBe("NOVA");
  });
});
