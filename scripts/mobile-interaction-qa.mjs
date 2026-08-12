import { chromium } from "playwright-core";

const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const page = await browser.newPage({ viewport: { width: 375, height: 812 }, isMobile: true });
const baseUrl = "http://127.0.0.1:3000";
const checks = [];

async function verify(label, action) {
  await action();
  checks.push(label);
}

try {
  await page.goto(`${baseUrl}/?desktop&start`, { waitUntil: "networkidle" });
  await verify("Start menu opens at mobile viewport", async () => {
    await page.getByPlaceholder("Search apps, projects, files...").waitFor();
    await page.getByRole("button", { name: "Terminal", exact: true }).waitFor();
  });

  await verify("Start menu launches Terminal", async () => {
    await page.locator(".start-menu .pinned-grid button").filter({ hasText: "Terminal" }).click();
    await page.getByRole("textbox", { name: "Terminal command" }).waitFor();
  });

  await verify("Terminal accepts the safe projects command", async () => {
    const terminalInput = page.getByRole("textbox", { name: "Terminal command" });
    await terminalInput.fill("projects");
    await terminalInput.press("Enter");
    await page.getByText("65 curated profile entries.").waitFor();
  });

  await verify("Start menu restores the minimized terminal", async () => {
    await page.getByRole("region", { name: "vanta-code — Terminal" }).getByRole("button", { name: "Minimize" }).click();
    await page.getByRole("button", { name: "Start" }).click();
    await page.locator(".start-menu .pinned-grid button").filter({ hasText: "Terminal" }).click();
    await page.getByRole("textbox", { name: "Terminal command" }).waitFor();
  });

  await verify("Taskbar opens the grounded assistant", async () => {
    await page.getByRole("button", { name: "Portfolio Assistant" }).click();
    await page.getByText("Ask about Bharani").waitFor();
  });

  await verify("Start search opens Contact without sending a message", async () => {
    await page.getByRole("button", { name: "Start" }).click();
    await page.getByPlaceholder("Search apps, projects, files...").fill("Contact");
    await page.locator(".start-menu .pinned-grid button").filter({ hasText: "Contact" }).click();
    await page.getByPlaceholder("you@example.com").waitFor();
  });

  await verify("Start search opens Browser and its safe search handoff", async () => {
    await page.getByRole("button", { name: "Start" }).click();
    await page.getByPlaceholder("Search apps, projects, files...").fill("Live Demos");
    await page.locator(".start-menu .pinned-grid button").filter({ hasText: "Live Demos" }).click();
    const browserSearch = page.getByRole("textbox", { name: "Search Google or type a URL" });
    await browserSearch.fill("Bharani Kumar GitHub");
    await browserSearch.press("Enter");
    await page.getByText("Web search").waitFor();
  });

  await verify("Start search opens Settings and applies a personalization control", async () => {
    await page.getByRole("button", { name: "Start" }).click();
    await page.getByPlaceholder("Search apps, projects, files...").fill("Settings");
    await page.locator(".start-menu .pinned-grid button").filter({ hasText: "Settings" }).click();
    const settingsWindow = page.getByRole("region", { name: "Settings" });
    await settingsWindow.getByText("Make the machine yours.").waitFor();
    await settingsWindow.locator(".accent-options button").nth(1).click();
    await settingsWindow.locator(".accent-options button[aria-pressed='true']").waitFor();
  });

  await verify("Mobile window controls remain available while drag is intentionally fixed", async () => {
    const settingsWindow = page.getByRole("region", { name: "Settings" });
    const titlebar = settingsWindow.locator(".window-titlebar");
    const before = await settingsWindow.boundingBox();
    const titlebarBox = await titlebar.boundingBox();
    if (!before || !titlebarBox) throw new Error("Settings window was not measurable at the mobile viewport.");
    await page.mouse.move(titlebarBox.x + 100, titlebarBox.y + 15);
    await page.mouse.down();
    await page.mouse.move(titlebarBox.x + 160, titlebarBox.y + 15, { steps: 4 });
    await page.mouse.up();
    const afterDrag = await settingsWindow.boundingBox();
    if (!afterDrag || Math.abs(afterDrag.x - before.x) > 1 || Math.abs(afterDrag.y - before.y) > 1) throw new Error("Mobile window unexpectedly moved despite fixed responsive layout.");
    await settingsWindow.getByRole("button", { name: "Maximize" }).click();
    await settingsWindow.evaluate((node) => { if (!node.classList.contains("window-maximized")) throw new Error("Maximize control did not update window state."); });
    await settingsWindow.getByRole("button", { name: "Minimize" }).click();
    await page.getByRole("button", { name: "Start" }).click();
    await page.getByPlaceholder("Search apps, projects, files...").fill("Settings");
    await page.locator(".start-menu .pinned-grid button").filter({ hasText: "Settings" }).click();
    await page.getByRole("region", { name: "Settings" }).waitFor();
  });

  await verify("Start search opens permission-aware weather without location submission", async () => {
    await page.getByRole("button", { name: "Start" }).click();
    await page.getByPlaceholder("Search apps, projects, files...").fill("Weather");
    await page.locator(".start-menu .pinned-grid button").filter({ hasText: "Weather" }).click();
    await page.getByText("Use my location").waitFor();
  });

  await page.screenshot({ path: "/home/ubuntu/mobile-interaction-qa.png", fullPage: true });
  console.log(JSON.stringify({ success: true, checks }, null, 2));
} catch (error) {
  await page.screenshot({ path: "/home/ubuntu/mobile-interaction-qa-failure.png", fullPage: true });
  console.error(JSON.stringify({ success: false, checks, url: page.url() }, null, 2));
  throw error;
} finally {
  await browser.close();
}
