export type BrowserBookmark = { url: string; label: string; savedAt: number };

const STORAGE_KEY = "developer-os-browser-bookmarks-v1";

function safeUrl(value: string) {
  try { return new URL(value).toString(); } catch { return null; }
}

export function readBookmarks(storage: Storage | undefined = typeof window === "undefined" ? undefined : window.localStorage): BrowserBookmark[] {
  if (!storage) return [];
  try {
    const value = JSON.parse(storage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(value) ? value.filter((item): item is BrowserBookmark => typeof item?.url === "string" && typeof item?.label === "string" && typeof item?.savedAt === "number" && Boolean(safeUrl(item.url))).slice(0, 24) : [];
  } catch { return []; }
}

export function writeBookmarks(items: BrowserBookmark[], storage: Storage | undefined = typeof window === "undefined" ? undefined : window.localStorage) {
  if (storage) storage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 24)));
  return items.slice(0, 24);
}

export function toggleBookmark(items: BrowserBookmark[], url: string, label: string, savedAt = Date.now()) {
  const normalized = safeUrl(url);
  if (!normalized) return items;
  const existing = items.find((item) => item.url === normalized);
  return existing ? items.filter((item) => item.url !== normalized) : [{ url: normalized, label: label || new URL(normalized).hostname, savedAt }, ...items].slice(0, 24);
}
