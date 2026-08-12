import { describe, expect, it } from "vitest";
import { calculateWindowDragPosition } from "./windowDrag";

describe("calculateWindowDragPosition", () => {
  const win = { x: 142, y: 78, w: 820, h: 560 };
  const desktop = { width: 1280, height: 1000 };

  it("moves a window by the pointer delta from its title-bar origin", () => {
    expect(calculateWindowDragPosition(win, { x: 40, y: 18 }, { x: 340, y: 218 }, desktop)).toEqual({ x: 300, y: 200 });
  });

  it("keeps a dragged window inside the desktop-safe boundaries", () => {
    expect(calculateWindowDragPosition(win, { x: 0, y: 0 }, { x: -100, y: -100 }, desktop)).toEqual({ x: 8, y: 38 });
    expect(calculateWindowDragPosition(win, { x: 0, y: 0 }, { x: 9000, y: 9000 }, desktop)).toEqual({ x: 452, y: 364 });
  });
});
