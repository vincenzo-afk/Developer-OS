import { chromium } from "playwright-core";

const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

try {
  await page.goto("http://127.0.0.1:3000/?desktop&app=about", { waitUntil: "networkidle" });
  const aboutWindow = page.getByRole("region", { name: "About Me" });
  const titlebar = aboutWindow.locator(".window-titlebar");
  const titlebarBox = await titlebar.boundingBox();
  if (!titlebarBox) throw new Error("About Me title bar was not measurable.");

  await page.mouse.move(titlebarBox.x + 190, titlebarBox.y + 17);
  await page.mouse.down();
  await page.mouse.move(8, titlebarBox.y + 20, { steps: 10 });
  await page.mouse.up();
  await page.waitForTimeout(180);
  const snapped = await aboutWindow.boundingBox();
  if (!snapped || snapped.x > 20 || snapped.width > 640) {
    throw new Error(`Left edge snap did not apply expected bounds: ${JSON.stringify(snapped)}`);
  }

  await page.keyboard.press("Alt+Tab");
  const taskView = page.getByRole("dialog", { name: "Task view" });
  await taskView.waitFor({ state: "visible" });
  await taskView.getByRole("button", { name: "About Me Active window" }).click();
  await taskView.waitFor({ state: "hidden" });
  const restored = await aboutWindow.boundingBox();
  if (!restored || restored.x > 20 || restored.width > 640) {
    throw new Error("Task view did not restore the snapped application.");
  }

  await aboutWindow.getByRole("button", { name: "Maximize and choose snap layout" }).click();
  await page.getByRole("dialog", { name: "Snap layout choices" }).waitFor({ state: "visible" });
  await page.getByRole("button", { name: "Maximize" }).last().click();
  await page.waitForTimeout(120);
  const maximized = await aboutWindow.boundingBox();
  if (!maximized || maximized.width < 1100) throw new Error("Maximize control did not expose and apply the snap layout.");

  const mobile = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await mobile.goto("http://127.0.0.1:3000/?desktop&app=about", { waitUntil: "networkidle" });
  const mobileWindow = mobile.getByRole("region", { name: "About Me" });
  const mobileBounds = await mobileWindow.boundingBox();
  if (!mobileBounds || Math.round(mobileBounds.width) !== 355) throw new Error(`Mobile window did not use the intended fixed layout: ${JSON.stringify(mobileBounds)}`);
  if (await mobile.getByRole("button", { name: "Open task view" }).isVisible()) throw new Error("Task view control should be intentionally hidden on mobile.");
  await mobile.close();

  await page.screenshot({ path: "/home/ubuntu/snap-taskview-qa.png", fullPage: true });
  console.log(JSON.stringify({ success: true, snapped: { x: snapped.x, width: snapped.width }, taskView: "opened-and-restored", maximizeControl: "layout-applied", mobile: "fixed-window-controls-adapted" }, null, 2));
} finally {
  await browser.close();
}
