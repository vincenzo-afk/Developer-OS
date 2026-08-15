import { describe, expect, it } from "vitest";
import { createBrowserTab, defaultBrowserSession, navigateBrowserTab, readBrowserSession, writeBrowserSession } from "./browserWorkspace";

function memoryStorage() {
  const values = new Map<string, string>();
  return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) } as Storage;
}

describe("browser session workspace", () => {
  it("restores valid tabs and protects the current-history branch", () => {
    const initial = defaultBrowserSession();
    const session = navigateBrowserTab(initial, initial.activeTabId, "https://github.com/vincenzo-afk", "GitHub");
    expect(session.tabs[0].history).toEqual(["https://github.com/vincenzo-afk"]);
    expect(session.tabs[0].title).toBe("GitHub");
  });

  it("sanitizes persisted tabs and provides a usable default tab", () => {
    const storage = memoryStorage();
    const tab = createBrowserTab("safe", "https://example.com", "Example");
    writeBrowserSession({ tabs: [tab], activeTabId: tab.id }, storage);
    expect(readBrowserSession(storage).activeTabId).toBe("safe");
  });
});

