import { chromium } from "playwright-core";

const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const page = await browser.newPage({ viewport: { width: 375, height: 812 } });

try {
  await page.goto("http://127.0.0.1:3000/?desktop&app=settings", { waitUntil: "networkidle" });
  const settings = page.getByRole("region", { name: "Settings" });
  const sections = ["About this OS", "Personalization", "Taskbar", "Accessibility", "Sound", "Wallpaper", "Reset controls"];
  const navigationButtons = settings.locator("button.settings-nav");
  const navigationCount = await navigationButtons.count();
  if (navigationCount === 0) {
    throw new Error("Mobile Settings rendered no functional section navigation controls.");
  }
  for (let index = 0; index < navigationCount; index += 1) {
    await navigationButtons.nth(index).click();
  }
  const resetCard = settings.locator(".settings-reset");
  if (!await resetCard.evaluate((element) => document.activeElement === element)) {
    throw new Error("Mobile Settings navigation did not focus its final real control area.");
  }

  await page.goto("http://127.0.0.1:3000/?desktop&app=explorer", { waitUntil: "networkidle" });
  const explorer = page.getByRole("region", { name: "This PC" });
  await explorer.getByRole("combobox", { name: "Sort Explorer items" }).selectOption("language");
  const firstProject = explorer.locator(".file-item").first();
  const projectName = (await firstProject.locator("strong").textContent())?.trim();
  if (!projectName) throw new Error("Mobile Explorer rendered no project entry.");
  await firstProject.click();
  if (!await explorer.getByRole("heading", { name: projectName }).isVisible()) {
    throw new Error("Mobile Explorer details did not reflect the selected verified project.");
  }

  console.log(JSON.stringify({ success: true, viewport: "375x812", settingsSections: navigationCount, expectedSettingsSections: sections.length, explorerSelection: projectName }, null, 2));
} finally {
  await browser.close();
}
