import { chromium } from "playwright-core";

const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

try {
  await page.goto("http://127.0.0.1:3000/?desktop&app=browser", { waitUntil: "networkidle" });
  const edge = page.getByRole("region", { name: "Microsoft Edge" });
  const address = edge.getByRole("textbox", { name: "Address and search" });
  await address.fill("github.com/vincenzo-afk/Developer-OS");
  await address.press("Enter");
  await edge.getByRole("button", { name: "Bookmark current page" }).click();
  await edge.getByRole("button", { name: "Browser bookmarks" }).click();
  await edge.getByRole("region", { name: "Saved bookmarks" }).getByRole("button", { name: /github\.com/ }).first().waitFor({ state: "visible" });

  await edge.getByRole("button", { name: "Browser history" }).click();
  const history = edge.getByRole("region", { name: "Current browser history" });
  await history.getByRole("button", { name: /github\.com/ }).waitFor({ state: "visible" });
  await history.getByRole("button", { name: "Clear session" }).click();
  await edge.getByText("No navigation in this session yet.").waitFor({ state: "visible" });

  console.log(JSON.stringify({ success: true, bookmark: "saved-local", history: "listed-and-cleared" }, null, 2));
} finally {
  await browser.close();
}
