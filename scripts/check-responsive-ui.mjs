import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import { join } from "node:path";


const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const baseUrl = process.argv[2] || "http://127.0.0.1:8797/";


function assert(condition, message) {
  if (!condition) throw new Error(message);
}


function edgeExecutable() {
  return [
    process.env.EDGE_PATH,
    join(process.env["ProgramFiles(x86)"] || "", "Microsoft", "Edge", "Application", "msedge.exe"),
    join(process.env.ProgramFiles || "", "Microsoft", "Edge", "Application", "msedge.exe"),
    join(process.env.LOCALAPPDATA || "", "Microsoft", "Edge", "Application", "msedge.exe")
  ].filter(Boolean).find(existsSync);
}


const browser = await chromium.launch({
  executablePath: edgeExecutable(),
  headless: true
});

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 30_000 });
  await page.waitForSelector("#worldMap", { state: "visible" });
  await page.waitForFunction(() => {
    const canvas = document.querySelector("#worldMap");
    return canvas?.width > 100 && canvas?.height > 100;
  });

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1024, height: 768 },
    { width: 1366, height: 768 },
    { width: 1920, height: 1080 },
    { width: 2560, height: 1440 }
  ]) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(120);
    const state = await page.evaluate(() => {
      const visible = selector => {
        const element = document.querySelector(selector);
        if (!element) return null;
        const rect = element.getBoundingClientRect();
        return {
          selector,
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width)
        };
      };
      return {
        viewportWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        regions: [".console-shell", ".topbar", ".main-grid", ".map-panel", ".right-column"].map(visible),
        clippedControls: Array.from(document.querySelectorAll("button, .status-unit"))
          .filter(element => element.offsetParent && element.scrollWidth > element.clientWidth + 1)
          .map(element => element.id || element.textContent?.trim() || element.tagName)
          .slice(0, 12)
      };
    });
    assert(state.scrollWidth <= state.viewportWidth, `horizontal overflow at ${viewport.width}x${viewport.height}: ${JSON.stringify(state)}`);
    assert(
      state.regions.every(region => region && region.left >= -1 && region.right <= state.viewportWidth + 1),
      `panel escapes the viewport at ${viewport.width}x${viewport.height}: ${JSON.stringify(state)}`
    );
    assert(state.clippedControls.length === 0, `controls are clipped at ${viewport.width}x${viewport.height}: ${JSON.stringify(state)}`);
  }

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.locator('[data-map-mode="markets"]').click();
  await page.waitForSelector("#marketBoard .market-leaders", { timeout: 15_000 });
  const marketRows = await page.locator("#marketBoard [data-asset-id]").count();
  assert(marketRows > 0, "market bootstrap did not render any assets");
  assert(errors.length === 0, `page errors: ${errors.join("; ")}`);

  console.log("PASS Codex World responsive UI (390-2560 px)");
} finally {
  await browser.close();
}
