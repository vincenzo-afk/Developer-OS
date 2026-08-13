import { describe, expect, it } from "vitest";
import { appendActivity, type WorkstationActivity } from "./activityLog";

const first: WorkstationActivity = { id: "first", message: "Opened Browser", timestamp: 1, kind: "app" };
const second: WorkstationActivity = { id: "second", message: "Snapped Browser left", timestamp: 2, kind: "layout" };

describe("appendActivity", () => {
  it("adds the most recent event first", () => {
    expect(appendActivity([first], second)).toEqual([second, first]);
  });

  it("keeps the most recent bounded event history", () => {
    const third = { ...second, id: "third" };
    expect(appendActivity([second, first], third, 2).map((item) => item.id)).toEqual(["third", "second"]);
  });
});
