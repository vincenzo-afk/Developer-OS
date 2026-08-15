export type BrowserBookmark = { url: string; label: string; savedAt: number };
export type BrowserTab = { id: string; history: string[]; historyIndex: number; title: string; createdAt: number };
export type BrowserSession = { tabs: BrowserTab[]; activeTabId: string };

const STORAGE_KEY = "developer-os-browser-bookmarks-v1";
const SESSION_STORAGE_KEY = "developer-os-browser-session-v1";
const MAX_TABS = 8;
const MAX_HISTORY = 30;

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

export function createBrowserTab(seed = `${Date.now()}-${Math.random().toString(36).slice(2)}`, url = "", title = "New tab"): BrowserTab {
  const normalized = url ? safeUrl(url) : null;
  return { id: seed, history: normalized ? [normalized] : [], historyIndex: normalized ? 0 : -1, title: title || "New tab", createdAt: Date.now() };
}

export function defaultBrowserSession(): BrowserSession {
  const tab = createBrowserTab("home");
  return { tabs: [tab], activeTabId: tab.id };
}

function sanitizeTab(value: unknown): BrowserTab | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<BrowserTab>;
  if (typeof candidate.id !== "string" || typeof candidate.title !== "string" || typeof candidate.createdAt !== "number") return null;
  const history = Array.isArray(candidate.history) ? candidate.history.filter((url): url is string => typeof url === "string" && Boolean(safeUrl(url))).slice(-MAX_HISTORY) : [];
  const historyIndex = typeof candidate.historyIndex === "number" && candidate.historyIndex >= 0 && candidate.historyIndex < history.length ? candidate.historyIndex : history.length - 1;
  return { id: candidate.id, history, historyIndex, title: candidate.title.slice(0, 96) || "New tab", createdAt: candidate.createdAt };
}

function sanitizeBrowserSession(value: unknown): BrowserSession {
  const candidate = value as { tabs?: unknown; activeTabId?: unknown } | null;
  const rawTabs: unknown[] = Array.isArray(candidate?.tabs) ? candidate.tabs : [];
  const tabs = rawTabs.map(sanitizeTab).filter((tab): tab is BrowserTab => Boolean(tab)).slice(0, MAX_TABS);
  const usableTabs = tabs.length ? tabs : defaultBrowserSession().tabs;
  const activeTabId = typeof candidate?.activeTabId === "string" && usableTabs.some((tab: BrowserTab) => tab.id === candidate.activeTabId) ? candidate.activeTabId : usableTabs[0].id;
  return { tabs: usableTabs, activeTabId };
}

export function readBrowserSession(storage: Storage | undefined = typeof window === "undefined" ? undefined : window.localStorage): BrowserSession {
  if (!storage) return defaultBrowserSession();
  try {
    return sanitizeBrowserSession(JSON.parse(storage.getItem(SESSION_STORAGE_KEY) ?? "{}"));
  } catch { return defaultBrowserSession(); }
}

export function writeBrowserSession(session: BrowserSession, storage: Storage | undefined = typeof window === "undefined" ? undefined : window.localStorage): BrowserSession {
  const sanitized = sanitizeBrowserSession(session);
  if (storage) storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sanitized));
  return sanitized;
}

export function navigateBrowserTab(session: BrowserSession, tabId: string, url: string, title: string): BrowserSession {
  const normalized = safeUrl(url);
  if (!normalized) return session;
  return {
    ...session,
    tabs: session.tabs.map((tab) => tab.id === tabId ? { ...tab, history: [...tab.history.slice(0, tab.historyIndex + 1), normalized].slice(-MAX_HISTORY), historyIndex: Math.min(tab.historyIndex + 1, MAX_HISTORY - 1), title: title || browserTitle(normalized) } : tab),
  };
}

export function browserTitle(url: string) {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return "New tab"; }
}
