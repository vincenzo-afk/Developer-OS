import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import { clearSavedWallpaper, restoreWallpaper, saveUploadedWallpaper, saveWallpaperUrl } from "./wallpaperManager";

const values = new Map<string, string>();

Object.defineProperty(globalThis, "localStorage", {
  value: {
    clear: () => values.clear(),
    getItem: (key: string) => values.get(key) ?? null,
    removeItem: (key: string) => values.delete(key),
    setItem: (key: string, value: string) => values.set(key, value),
  },
  configurable: true,
});

function deleteWallpaperDatabase() {
  return new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase("bharani-workstation");
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    request.onblocked = () => resolve();
  });
}

describe("wallpaperManager", () => {
  beforeEach(async () => {
    localStorage.clear();
    await deleteWallpaperDatabase();
  });

  it("persists, restores, and clears an uploaded video wallpaper", async () => {
    const file = new File(["video-bytes"], "studio-loop.webm", { type: "video/webm" });
    const saved = await saveUploadedWallpaper(file);
    const restored = await restoreWallpaper();

    expect(saved.source).toBe("upload");
    expect(saved.kind).toBe("video");
    expect(restored).toMatchObject({ source: "upload", kind: "video", name: "studio-loop.webm", storageKey: saved.storageKey });

    await clearSavedWallpaper();
    await expect(restoreWallpaper()).resolves.toBeNull();
  });

  it("persists URL wallpapers and infers the video kind without IndexedDB", async () => {
    const saved = saveWallpaperUrl("https://example.com/ambient-loop.mp4?quality=high");

    expect(saved).toMatchObject({ source: "url", kind: "video" });
    await expect(restoreWallpaper()).resolves.toEqual(saved);
  });
});
