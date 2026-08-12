import { describe, expect, it } from "vitest";
import { weatherLabel } from "./liveData";

describe("weatherLabel", () => {
  it("maps supported Open-Meteo condition codes to human-readable labels", () => {
    expect(weatherLabel(0)).toBe("Clear sky");
    expect(weatherLabel(63)).toBe("Rain");
    expect(weatherLabel(95)).toBe("Thunderstorms");
  });

  it("keeps unsupported codes explicitly unavailable", () => {
    expect(weatherLabel(999)).toBe("Conditions unavailable");
  });
});
