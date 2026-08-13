export type SnapPosition = "left" | "right" | "top-left" | "top-right" | "full";

export type SnapBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
  maximized: boolean;
};

const OUTER_GUTTER = 12;
const WINDOW_GAP = 10;
const TASKBAR_ALLOWANCE = 74;

export function getSnapBounds(viewport: { width: number; height: number }, position: SnapPosition): SnapBounds {
  const availableWidth = Math.max(520, viewport.width - OUTER_GUTTER * 2);
  const availableHeight = Math.max(320, viewport.height - TASKBAR_ALLOWANCE - OUTER_GUTTER);
  const halfWidth = Math.floor((availableWidth - WINDOW_GAP) / 2);
  const halfHeight = Math.floor((availableHeight - WINDOW_GAP) / 2);
  const left = OUTER_GUTTER;
  const top = OUTER_GUTTER;

  if (position === "full") {
    return { x: left, y: top, width: availableWidth, height: availableHeight, maximized: true };
  }
  if (position === "left") {
    return { x: left, y: top, width: halfWidth, height: availableHeight, maximized: false };
  }
  if (position === "right") {
    return { x: left + halfWidth + WINDOW_GAP, y: top, width: halfWidth, height: availableHeight, maximized: false };
  }
  if (position === "top-left") {
    return { x: left, y: top, width: halfWidth, height: halfHeight, maximized: false };
  }
  return { x: left + halfWidth + WINDOW_GAP, y: top, width: halfWidth, height: halfHeight, maximized: false };
}

export function getEdgeSnapPosition(point: { x: number; y: number }, viewport: { width: number; height: number }): SnapPosition | null {
  const threshold = 28;
  if (point.y <= threshold) return "full";
  if (point.x <= threshold) return "left";
  if (point.x >= viewport.width - threshold) return "right";
  return null;
}
