import { chromium } from "playwright-core";

const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

try {
  await page.goto("http://127.0.0.1:3000/?desktop&app=explorer", { waitUntil: "networkidle" });
  const explorer = page.getByRole("region", { name: "This PC" });
  await explorer.getByRole("combobox", { name: "Sort Explorer items" }).selectOption("language");
  await explorer.getByRole("button", { name: /List|Grid/ }).click();
  if (!await explorer.locator(".file-list").isVisible()) throw new Error("Explorer list view was not applied.");

  const firstProject = explorer.locator(".file-item").first();
  const projectName = (await firstProject.locator("strong").textContent())?.trim();
  if (!projectName) throw new Error("Explorer rendered no project entry.");
  await firstProject.click();
  await explorer.getByText("SELECTED PROJECT").waitFor({ state: "visible" });
  if (!await explorer.getByRole("heading", { name: projectName }).isVisible()) throw new Error("Explorer details did not reflect the selected project.");

  const sourceButton = explorer.getByRole("button", { name: "Open source" });
  const popup = page.waitForEvent("popup");
  await sourceButton.click();
  const sourcePage = await popup;
  const targetUrl = sourcePage.url();
  if (!targetUrl.includes("github.com/vincenzo-afk/")) throw new Error(`Explorer source action did not open the verified GitHub target: ${targetUrl}`);
  await sourcePage.close();

  await page.screenshot({ path: "/home/ubuntu/explorer-authenticity-qa.png", fullPage: true });
  console.log(JSON.stringify({ success: true, selected: projectName, view: "list", sort: "language", sourceTarget: "verified-github" }, null, 2));
} finally {
  await browser.close();
}
