export type WallpaperKind = "image" | "video";
export type WallpaperSource = "default" | "upload" | "url";

export type WallpaperAsset = {
  kind: WallpaperKind;
  source: WallpaperSource;
  src: string;
  name: string;
  storageKey?: string;
};

type StoredWallpaper = {
  key: string;
  kind: WallpaperKind;
  name: string;
  blob: Blob;
};

const DB_NAME = "bharani-workstation";
const STORE_NAME = "wallpapers";
const SETTINGS_KEY = "bharani-wallpaper-settings";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) request.result.createObjectStore(STORE_NAME, { keyPath: "key" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function withStore<T>(mode: IDBTransactionMode, work: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDatabase().then((db) => new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode);
    const request = work(transaction.objectStore(STORE_NAME));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
  }));
}

function saveSettings(settings: Omit<WallpaperAsset, "src">) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function readSettings(): Omit<WallpaperAsset, "src"> | null {
  try {
    const value = localStorage.getItem(SETTINGS_KEY);
    return value ? JSON.parse(value) as Omit<WallpaperAsset, "src"> : null;
  } catch {
    return null;
  }
}

export async function restoreWallpaper(): Promise<WallpaperAsset | null> {
  const settings = readSettings();
  if (!settings || settings.source === "default") return null;
  if (settings.source === "url") return { ...settings, src: settings.name };
  if (!settings.storageKey) return null;
  try {
    const record = await withStore<StoredWallpaper | undefined>("readonly", (store) => store.get(settings.storageKey!));
    return record ? { kind: record.kind, source: "upload", src: URL.createObjectURL(record.blob), name: record.name, storageKey: record.key } : null;
  } catch {
    return null;
  }
}

export async function saveUploadedWallpaper(file: File): Promise<WallpaperAsset> {
  const key = `upload-${crypto.randomUUID()}`;
  const record: StoredWallpaper = { key, kind: file.type.startsWith("video/") ? "video" : "image", name: file.name, blob: file };
  await withStore<IDBValidKey>("readwrite", (store) => store.put(record));
  const asset: WallpaperAsset = { kind: record.kind, source: "upload", src: URL.createObjectURL(file), name: file.name, storageKey: key };
  saveSettings({ kind: asset.kind, source: asset.source, name: asset.name, storageKey: asset.storageKey });
  return asset;
}

export function saveWallpaperUrl(url: string): WallpaperAsset {
  const value = url.trim();
  const kind: WallpaperKind = /\.(mp4|webm|ogg)(\?.*)?$/i.test(value) ? "video" : "image";
  const asset: WallpaperAsset = { kind, source: "url", src: value, name: value };
  saveSettings({ kind, source: "url", name: value });
  return asset;
}

export async function clearSavedWallpaper() {
  const settings = readSettings();
  localStorage.removeItem(SETTINGS_KEY);
  if (settings?.storageKey) {
    try { await withStore<undefined>("readwrite", (store) => store.delete(settings.storageKey!)); } catch { /* best effort cleanup */ }
  }
}
