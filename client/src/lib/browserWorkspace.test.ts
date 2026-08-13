import { describe, expect, it } from "vitest";
import { readBookmarks, toggleBookmark, writeBookmarks } from "./browserWorkspace";

function memoryStorage() {
  const values = new Map<string, string>();
  return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) } as Storage;
}

describe("browser workspace bookmarks", () => {
  it("adds, removes, and persists only valid bookmarks", () => {
    const storage = memoryStorage();
    const added = toggleBookmark([], "https://github.com/vincenzo-afk", "GitHub", 10);
    expect(added).toHaveLength(1);
    expect(toggleBookmark(added, "https://github.com/vincenzo-afk", "GitHub", 20)).toEqual([]);
    writeBookmarks(added, storage);
    expect(readBookmarks(storage)).toEqual(added);
    storage.setItem("developer-os-browser-bookmarks-v1", JSON.stringify([{ url: "not a URL", label: "bad", savedAt: 1 }]));
    expect(readBookmarks(storage)).toEqual([]);
  });
});
