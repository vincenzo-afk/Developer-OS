export type WindowBounds = { x: number; y: number; w: number; h: number };
export type PointerPoint = { x: number; y: number };
export type DesktopBounds = { width: number; height: number };

/** Calculates the next bounded window position from a title-bar pointer position. */
export function calculateWindowDragPosition(
  win: WindowBounds,
  offset: PointerPoint,
  pointer: PointerPoint,
  desktop: DesktopBounds,
): PointerPoint {
  const maxX = Math.max(8, desktop.width - win.w - 8);
  const maxY = Math.max(38, desktop.height - win.h - 76);
  return {
    x: Math.min(maxX, Math.max(8, pointer.x - offset.x)),
    y: Math.min(maxY, Math.max(38, pointer.y - offset.y)),
  };
}
