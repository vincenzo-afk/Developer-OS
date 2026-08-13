export type WorkstationActivity = { id: string; message: string; timestamp: number; kind: "app" | "layout" | "system" };

export function appendActivity(items: WorkstationActivity[], activity: WorkstationActivity, limit = 10) {
  return [activity, ...items].slice(0, limit);
}
