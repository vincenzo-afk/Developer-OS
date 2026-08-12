import { chromium } from "playwright-core";

const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

try {
  await page.goto("http://127.0.0.1:3000/?desktop&app=about", { waitUntil: "networkidle" });
  const aboutWindow = page.getByRole("region", { name: "About Me" });
  const titlebar = aboutWindow.locator(".window-titlebar");
  const before = await aboutWindow.boundingBox();
  const titlebarBox = await titlebar.boundingBox();
  if (!before || !titlebarBox) throw new Error("About Me window or its title bar was not measurable.");

  await page.mouse.move(titlebarBox.x + 220, titlebarBox.y + 16);
  await page.mouse.down();
  await page.mouse.move(titlebarBox.x + 320, titlebarBox.y + 16, { steps: 8 });
  await page.mouse.up();
  await page.waitForTimeout(120);

  const after = await aboutWindow.boundingBox();
  if (!after || after.x - before.x < 60) throw new Error(`Window did not move far enough: ${before.x} → ${after?.x ?? "unmeasured"}`);
  await page.screenshot({ path: "/home/ubuntu/desktop-drag-qa.png", fullPage: true });
  console.log(JSON.stringify({ success: true, before: { x: before.x, y: before.y }, after: { x: after.x, y: after.y }, horizontalDelta: after.x - before.x }, null, 2));
} finally {
  await browser.close();
}
