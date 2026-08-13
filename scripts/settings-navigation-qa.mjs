import { chromium } from "playwright-core";

const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

try {
  await page.goto("http://127.0.0.1:3000/?desktop&app=settings", { waitUntil: "networkidle" });
  const settings = page.getByRole("region", { name: "Settings" });
  const expectedSections = ["About this OS", "Personalization", "Taskbar", "Accessibility", "Sound", "Wallpaper", "Reset controls"];
  for (const section of expectedSections) {
    await settings.getByRole("button", { name: `Open ${section} settings` }).click();
  }
  const resetCard = settings.locator(".settings-reset");
  if (!await resetCard.evaluate((element) => document.activeElement === element)) throw new Error("Settings section navigation did not focus the selected real control area.");
  console.log(JSON.stringify({ success: true, sections: expectedSections.length, navigation: "focuses-real-settings-cards" }, null, 2));
} finally {
  await browser.close();
}
