export const accentOptions = {
  ember: { label: "Ember brass", value: "#D49A5C" },
  sage: { label: "Sage signal", value: "#72A48E" },
  violet: { label: "Amethyst", value: "#A99AD1" },
  steel: { label: "Steel blue", value: "#8AA9C2" },
} as const;

export type AccentId = keyof typeof accentOptions;
export type IconScale = "compact" | "standard" | "large";
export type TaskbarAlignment = "center" | "left";
export type TaskbarSize = "compact" | "standard";
export type TextScale = "standard" | "large";

export type DesktopCustomization = {
  accent: AccentId;
  iconScale: IconScale;
  taskbarAlignment: TaskbarAlignment;
  taskbarSize: TaskbarSize;
  textScale: TextScale;
  reducedMotion: boolean;
  lightMode: boolean;
  soundEnabled: boolean;
};

export const defaultCustomization: DesktopCustomization = {
  accent: "ember",
  iconScale: "standard",
  taskbarAlignment: "center",
  taskbarSize: "standard",
  textScale: "standard",
  reducedMotion: false,
  lightMode: false,
  soundEnabled: true,
};

const storageKey = "bharani-desktop-customization-v1";
const iconScales: IconScale[] = ["compact", "standard", "large"];
const taskbarAlignments: TaskbarAlignment[] = ["center", "left"];
const taskbarSizes: TaskbarSize[] = ["compact", "standard"];
const textScales: TextScale[] = ["standard", "large"];

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function readCustomization(): DesktopCustomization {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return defaultCustomization;
    const value: unknown = JSON.parse(raw);
    if (!isObject(value)) return defaultCustomization;
    return {
      accent: typeof value.accent === "string" && value.accent in accentOptions ? value.accent as AccentId : defaultCustomization.accent,
      iconScale: typeof value.iconScale === "string" && iconScales.includes(value.iconScale as IconScale) ? value.iconScale as IconScale : defaultCustomization.iconScale,
      taskbarAlignment: typeof value.taskbarAlignment === "string" && taskbarAlignments.includes(value.taskbarAlignment as TaskbarAlignment) ? value.taskbarAlignment as TaskbarAlignment : defaultCustomization.taskbarAlignment,
      taskbarSize: typeof value.taskbarSize === "string" && taskbarSizes.includes(value.taskbarSize as TaskbarSize) ? value.taskbarSize as TaskbarSize : defaultCustomization.taskbarSize,
      textScale: typeof value.textScale === "string" && textScales.includes(value.textScale as TextScale) ? value.textScale as TextScale : defaultCustomization.textScale,
      reducedMotion: typeof value.reducedMotion === "boolean" ? value.reducedMotion : defaultCustomization.reducedMotion,
      lightMode: typeof value.lightMode === "boolean" ? value.lightMode : defaultCustomization.lightMode,
      soundEnabled: typeof value.soundEnabled === "boolean" ? value.soundEnabled : defaultCustomization.soundEnabled,
    };
  } catch {
    return defaultCustomization;
  }
}

export function writeCustomization(value: DesktopCustomization) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(value));
  } catch {
    // Personalization remains available for the current session when browser storage is unavailable.
  }
}

export function clearCustomization() {
  try {
    window.localStorage.removeItem(storageKey);
  } catch {
    // No-op when browser storage is unavailable.
  }
}
