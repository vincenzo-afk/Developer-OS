import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearCustomization, defaultCustomization, readCustomization, writeCustomization } from "./customizationManager";

const storageKey = "bharani-desktop-customization-v1";
let entries: Record<string, string>;

beforeEach(() => {
  entries = {};
  vi.stubGlobal("window", {
    localStorage: {
      getItem: (key: string) => entries[key] ?? null,
      setItem: (key: string, value: string) => { entries[key] = value; },
      removeItem: (key: string) => { delete entries[key]; },
    },
  });
});

afterEach(() => vi.unstubAllGlobals());

describe("desktop customization defaults", () => {
  it("starts with the documented graphite-and-ember workstation defaults", () => {
    expect(defaultCustomization).toMatchObject({
      accent: "ember",
      iconScale: "standard",
      taskbarAlignment: "center",
      taskbarSize: "standard",
      textScale: "standard",
      reducedMotion: false,
      lightMode: false,
      soundEnabled: true,
    });
  });

  it("persists the selected customization values for the next desktop session", () => {
    const selected = { ...defaultCustomization, accent: "sage" as const, iconScale: "large" as const, taskbarAlignment: "left" as const, reducedMotion: true, soundEnabled: false };
    writeCustomization(selected);
    expect(readCustomization()).toEqual(selected);
  });

  it("sanitizes stale storage values and clears back to defaults", () => {
    entries[storageKey] = JSON.stringify({ accent: "invalid", iconScale: "huge", taskbarAlignment: "left", reducedMotion: "yes" });
    expect(readCustomization()).toMatchObject({ ...defaultCustomization, taskbarAlignment: "left" });
    clearCustomization();
    expect(readCustomization()).toEqual(defaultCustomization);
  });
});
