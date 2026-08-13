import { describe, expect, it } from "vitest";
import { getEdgeSnapPosition, getSnapBounds } from "./windowSnap";

describe("Windows-style snap layout helpers", () => {
  const desktop = { width: 1280, height: 720 };

  it("creates adjacent half-screen bounds above the taskbar", () => {
    const left = getSnapBounds(desktop, "left");
    const right = getSnapBounds(desktop, "right");
    expect(left.maximized).toBe(false);
    expect(left.y).toBe(12);
    expect(left.height).toBeLessThan(desktop.height);
    expect(left.x + left.width).toBeLessThan(right.x);
    expect(right.x + right.width).toBeLessThanOrEqual(desktop.width - 12);
  });

  it("maps edge drops to left, right, or full-screen placement", () => {
    expect(getEdgeSnapPosition({ x: 10, y: 400 }, desktop)).toBe("left");
    expect(getEdgeSnapPosition({ x: 1275, y: 400 }, desktop)).toBe("right");
    expect(getEdgeSnapPosition({ x: 600, y: 8 }, desktop)).toBe("full");
    expect(getEdgeSnapPosition({ x: 600, y: 400 }, desktop)).toBeNull();
  });
});
