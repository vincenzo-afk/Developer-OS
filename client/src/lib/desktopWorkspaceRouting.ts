export const BROWSER_REQUEST_KEY = "developer-os-browser-request-v1";
export const EXPLORER_SELECTION_KEY = "developer-os-explorer-selection-v1";

export type TerminalProjectAction = "open" | "explore";
export type TerminalProjectRequest = { action: TerminalProjectAction; projectName: string } | null;
export type TerminalProjectExecutor = { openProject?: (name: string) => void; exploreProject?: (name: string) => void };

export function parseTerminalProjectRequest(command: string, projectNames: string[]): TerminalProjectRequest {
  const match = command.trim().match(/^(open|explore)\s+(.+)$/i);
  if (!match) return null;
  const projectName = projectNames.find((name) => name.toLowerCase() === match[2].trim().toLowerCase());
  return projectName ? { action: match[1].toLowerCase() as TerminalProjectAction, projectName } : null;
}

export function executeTerminalProjectRequest(request: Exclude<TerminalProjectRequest, null>, executor: TerminalProjectExecutor) {
  if (request.action === "explore") executor.exploreProject?.(request.projectName);
  else executor.openProject?.(request.projectName);
}

export function writePendingBrowserRequest(url: string, storage: Storage | undefined = typeof window === "undefined" ? undefined : window.sessionStorage) {
  if (storage) storage.setItem(BROWSER_REQUEST_KEY, url);
  if (typeof window !== "undefined" && storage === window.sessionStorage) window.dispatchEvent(new CustomEvent("developer-os-browser-request", { detail: url }));
  return url;
}

export function takePendingBrowserRequest(storage: Storage | undefined = typeof window === "undefined" ? undefined : window.sessionStorage) {
  if (!storage) return null;
  const value = storage.getItem(BROWSER_REQUEST_KEY);
  storage.removeItem(BROWSER_REQUEST_KEY);
  return value;
}

export function writePendingExplorerSelection(name: string, storage: Storage | undefined = typeof window === "undefined" ? undefined : window.sessionStorage) {
  if (storage) storage.setItem(EXPLORER_SELECTION_KEY, name);
  if (typeof window !== "undefined" && storage === window.sessionStorage) window.dispatchEvent(new CustomEvent("developer-os-explorer-selection", { detail: name }));
  return name;
}

export function takePendingExplorerSelection(storage: Storage | undefined = typeof window === "undefined" ? undefined : window.sessionStorage) {
  if (!storage) return null;
  const value = storage.getItem(EXPLORER_SELECTION_KEY);
  storage.removeItem(EXPLORER_SELECTION_KEY);
  return value;
}
