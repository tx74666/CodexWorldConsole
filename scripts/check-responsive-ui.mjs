import { createRequire } from "node:module";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gunzipSync } from "node:zlib";


const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const baseUrl = process.argv[2] || "http://127.0.0.1:8797/";
const repositoryRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const now = new Date();
const nowIso = now.toISOString();
const marketBootstrap = JSON.parse(gunzipSync(
  readFileSync(join(repositoryRoot, "bootstrap", "markets.json.gz"))
).toString("utf8"));
const marketFixture = {
  ...marketBootstrap,
  source: "responsive-fixture",
  updated: nowIso,
  servedAt: nowIso,
  stale: false
};
const marketSummaryFixture = {
  ...marketFixture,
  currencyHistoryLazy: true,
  currencies: {
    ...marketFixture.currencies,
    quotes: marketFixture.currencies.quotes.map((quote) => {
      const {
        history: _history,
        denseHistory: _denseHistory,
        shortHistory: _shortHistory,
        historySource: _historySource,
        denseHistorySource: _denseHistorySource,
        shortHistorySource: _shortHistorySource,
        ...summary
      } = quote;
      return summary;
    })
  }
};
const fixedHistory = Array.from({ length: 40 }, (_, index) => ({
  time: new Date(now.getTime() - (39 - index) * 24 * 60 * 60 * 1000).toISOString(),
  value: 100 + index * 1.8 + Math.sin(index / 2) * 4
}));


function assert(condition, message) {
  if (!condition) throw new Error(message);
}


function withTimeout(promise, label, timeoutMs = 5_000) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms`)), timeoutMs);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}


function marketHistoryFixture(requestUrl) {
  const range = new URL(requestUrl).searchParams.get("range") || "1m";
  return {
    source: "responsive-fixture",
    denseHistory: fixedHistory,
    shortHistory: fixedHistory,
    range,
    rangeUpdatedAt: nowIso,
    stale: false,
    refreshing: false,
    servedAt: nowIso
  };
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
  page.on("console", message => {
    const text = message.text();
    if (/content security policy|refused to (connect|apply|execute)/i.test(text)) {
      errors.push(text);
    }
  });
  let releaseRuntimeConfig;
  const runtimeConfigGate = new Promise(resolve => {
    releaseRuntimeConfig = resolve;
  });
  const runtimeConfigRequest = page.waitForRequest("**/api/config", { timeout: 5_000 });
  await page.route("**/api/config", async route => {
    await withTimeout(runtimeConfigGate, "runtime config release", 30_000);
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        features: { earning: false },
        ask: {
          configured: true,
          baseUrl: "https://configured.example/v1",
          model: "configured-model",
          protocol: "responses",
          webSearch: false,
          hasApiKey: true,
          managedByEnvironment: false
        }
      })
    });
  });
  await page.route("**/api/markets", route => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify(marketSummaryFixture)
  }));
  await page.route("**/api/currency-history?**", route => {
    const code = new URL(route.request().url()).searchParams.get("code") || "";
    const quote = marketFixture.currencies.quotes.find(item => item.code === code);
    return route.fulfill({
      status: quote ? 200 : 404,
      contentType: "application/json",
      body: JSON.stringify(quote ? { quote } : { error: "unknown currency" })
    });
  });
  await page.route("**/api/market-history?**", route => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify(marketHistoryFixture(route.request().url()))
  }));
  let eventRequestCount = 0;
  let eventScenario = "normal";
  let resolveFreshEventRequest;
  const freshEventRequest = new Promise(resolve => {
    resolveFreshEventRequest = resolve;
  });
  await page.route("**/api/events", route => {
    eventRequestCount += 1;
    if (eventScenario === "failure") return route.fulfill({ status: 503, body: "unavailable" });
    const refreshing = eventRequestCount === 1;
    if (!refreshing) resolveFreshEventRequest();
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        refreshing,
        updated: refreshing || eventScenario === "cold-failure" ? null : nowIso,
        servedAt: new Date().toISOString(),
        stale: refreshing || ["stale", "unavailable", "cold-failure"].includes(eventScenario),
        sourceStatus: refreshing || ["unavailable", "cold-failure"].includes(eventScenario) ? "unavailable"
          : eventScenario === "partial" ? "partial" : "ok",
        failedSources: eventScenario === "partial" || eventScenario === "unavailable" ? ["Fixture source"] : [],
        events: [{
        id: "responsive-long-event",
        title: "Earthquake kills 20 people after an exceptionally long emergency response headline reaches international newsrooms",
        statement: "Earthquake kills 20 people after an exceptionally long emergency response headline reaches international newsrooms",
        summary: "A deterministic responsive-layout fixture with a deliberately long headline.",
        source: refreshing || eventScenario === "cold-failure" ? "Fallback brief" : "Responsive fixture",
        url: "https://example.com/report",
        published: nowIso,
        location: "Test City",
        country: "Test Country",
        lat: 35.6,
        lon: 139.6,
        category: "security",
        severity: 5
        }]
      })
    });
  });
  await page.route("https://api.open-meteo.com/**", route => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: "[]"
  }));
  let translationRequestCount = 0;
  let legacyTranslationRequestCount = 0;
  page.on("request", request => {
    if (new URL(request.url()).pathname === "/api/translate-selection") legacyTranslationRequestCount += 1;
  });
  const languageRaceSentinel = "A delayed language-switch translation 93482.";
  const languageRaceRequests = [];
  await page.route("**/api/translate", async route => {
    translationRequestCount += 1;
    const body = route.request().postDataJSON() || {};
    if (body.text === languageRaceSentinel) {
      languageRaceRequests.push(body.ui);
      if (languageRaceRequests.length === 1) {
        await new Promise(resolve => setTimeout(resolve, 900));
      }
      try {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            translation: `language-${body.ui}`,
            explanation: `explanation-${body.ui}`
          })
        });
      } catch {
        // Changing the UI language intentionally aborts the older request.
      }
      return;
    }
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        translation: "fixture translation",
        explanation: "fixture explanation"
      })
    });
  });
  await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 30_000 });
  await withTimeout(freshEventRequest, "fresh event retry", 5_000);
  assert(eventRequestCount >= 2, "event SWR response did not trigger an automatic retry");
  await page.waitForSelector("#worldMap", { state: "visible" });
  await page.waitForFunction(() => {
    const canvas = document.querySelector("#worldMap");
    return canvas?.width > 100 && canvas?.height > 100;
  });
  await page.waitForSelector("#eventPins .event-pin");
  await page.waitForFunction(() => eventSourceKey === "liveRssReports");
  const successfulEventTime = await page.evaluate(() => eventFreshness.updated);
  for (const [scenario, expectedKey] of [["stale", "cachedReports"], ["unavailable", "failedRssReports"],
    ["partial", "partialRssReports"], ["failure", "failedRssReports"]]) {
    eventScenario = scenario;
    await page.evaluate(() => fetchEvents({ announce: false }));
    const status = await page.evaluate(() => ({
      key: eventSourceKey,
      updated: eventFreshness.updated,
      visible: document.querySelector("#eventSource").textContent,
      detail: document.querySelector("#eventSource").title
    }));
    assert(status.key === expectedKey && status.updated === successfulEventTime,
      `news ${scenario} lost freshness or marked cached data live: ${JSON.stringify(status)}`);
    assert(/Last successful update|上次成功更新/.test(status.visible), `news update time is not visible: ${JSON.stringify(status)}`);
    if (scenario === "partial") assert(status.detail.includes("Fixture source"), "partial RSS failures are not exposed");
  }
  eventScenario = "cold-failure";
  const coldFailure = await page.evaluate(async () => {
    eventFailedRefreshAttempts = 0;
    await fetchEvents({ announce: false });
    return { interval: automaticRefreshInterval("events"), updated: eventFreshness.updated, key: eventSourceKey };
  });
  assert(coldFailure.interval === 60_000 && coldFailure.updated === null && coldFailure.key === "unavailableRssReports",
    `cold RSS failure has no prompt retry or reports fallback as live: ${JSON.stringify(coldFailure)}`);
  await page.evaluate(() => fetchEvents({ announce: false }));
  const beforeBackoff = eventRequestCount;
  const failureBackoff = await page.evaluate(() => {
    const recent = Date.now() - 61_000;
    Object.assign(datasetRefreshState.events, { attemptedAt: recent, completedAt: recent, succeededAt: 0 });
    refreshVisibleDatasets();
    return automaticRefreshInterval("events");
  });
  assert(failureBackoff === 120_000 && eventRequestCount === beforeBackoff, "repeated RSS failure did not back off");
  eventScenario = "normal";
  await page.evaluate(() => {
    const old = Date.now() - 121_000;
    Object.assign(datasetRefreshState.events, { attemptedAt: old, completedAt: old, succeededAt: 0 });
    refreshVisibleDatasets();
  });
  await page.waitForFunction(() => eventSourceKey === "liveRssReports" && eventFailedRefreshAttempts === 0);

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1024, height: 768 },
    { width: 1366, height: 768 },
    { width: 1920, height: 1080 },
    { width: 2560, height: 1440 }
  ]) {
    await page.setViewportSize(viewport);
    await page.waitForFunction(expectedWidth => {
      if (document.documentElement.clientWidth !== expectedWidth) return false;
      return Array.from(document.querySelectorAll("#eventPins .event-pin")).every(element => {
        const rect = element.getBoundingClientRect();
        return rect.left >= -1 && rect.right <= expectedWidth + 1;
      });
    }, viewport.width, { timeout: 5_000 });
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
        overflowElements: Array.from(document.querySelectorAll("body *"))
          .filter(element => {
            const rect = element.getBoundingClientRect();
            return element.offsetParent && (rect.left < -1 || rect.right > document.documentElement.clientWidth + 1);
          })
          .map(element => ({
            tag: element.tagName,
            id: element.id,
            className: String(element.className || "").slice(0, 120),
            text: (element.textContent || "").trim().slice(0, 80),
            left: Math.round(element.getBoundingClientRect().left),
            right: Math.round(element.getBoundingClientRect().right)
          }))
          .slice(0, 12),
        clippedControls: Array.from(document.querySelectorAll("button, .status-unit"))
          .filter(element => (
            element.offsetParent
            && !element.matches(".feed-line, .place-report, .event-pin")
            && element.scrollWidth > element.clientWidth + 1
          ))
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
  await page.locator("#mapMenuToggle").focus();
  await page.locator("#mapMenuToggle").press("Enter");
  await page.waitForSelector("#mapActionMenu", { state: "visible" });
  await page.waitForFunction(() => document.querySelector("#mapActionMenu")?.contains(document.activeElement));
  await page.keyboard.press("Escape");
  await page.waitForSelector("#mapActionMenu", { state: "hidden" });
  assert(await page.locator("#mapMenuToggle").evaluate(node => node === document.activeElement), "Escape did not restore menu-toggle focus");

  const translationToggleBeforeClick = await page.locator("#translationToggle").getAttribute("aria-pressed");
  await page.locator("#translationToggle").evaluate(button => button.click());
  assert(
    await page.locator("#translationToggle").getAttribute("aria-pressed") !== translationToggleBeforeClick,
    "programmatic click did not toggle selection translation"
  );
  await page.locator("#translationToggle").evaluate(button => button.click());
  assert(
    await page.locator("#translationToggle").getAttribute("aria-pressed") === translationToggleBeforeClick,
    "second programmatic click did not restore selection translation"
  );

  await page.locator('[data-map-mode="stats"]').click();
  await page.waitForSelector("#cityGrid .city-card");
  await page.waitForSelector("#eventPins .climate-details");
  const temperatureState = await page.evaluate(() => ({
    cityCards: Array.from(document.querySelectorAll("#cityGrid .city-card .weather-row span:first-child strong"), node => node.textContent.trim()),
    mapLabels: Array.from(document.querySelectorAll("#eventPins .climate-details > span:first-child"), node => node.textContent.trim()),
    inspect: [document.querySelector("#placeReports .weather-inspect-metric:last-child strong")?.textContent.trim() || ""],
    source: [document.querySelector("#eventSource")?.textContent.trim() || ""],
    pinTitles: Array.from(document.querySelectorAll("#eventPins .event-pin[title]"), node => node.title)
  }));
  const directTemperatures = [
    ...temperatureState.cityCards,
    ...temperatureState.mapLabels,
    ...temperatureState.inspect
  ].filter(Boolean);
  assert(temperatureState.cityCards.length === 8, `City Stats temperature count is wrong: ${JSON.stringify(temperatureState)}`);
  assert(temperatureState.mapLabels.length === 8, `City Data Map temperature count is wrong: ${JSON.stringify(temperatureState)}`);
  assert(directTemperatures.length >= 17, `temperature coverage is incomplete: ${JSON.stringify(temperatureState)}`);
  assert(
    directTemperatures.every(value => /^-?\d+\s*°C$/.test(value)),
    `temperature readings do not use °C: ${JSON.stringify(temperatureState)}`
  );
  assert(
    [...temperatureState.source, ...temperatureState.pinTitles].every(value => !/-?\d+(?:\.\d+)?\s+C\b/.test(value)),
    `a standalone C temperature remains: ${JSON.stringify(temperatureState)}`
  );
  assert(
    await page.evaluate(() => [null, undefined, "", "  ", Number.NaN].every(value => formatCelsius(value) === "--")),
    "missing temperatures are rendered as real Celsius values"
  );
  const touchLabelTap = await page.evaluate(() => {
    const pin = document.querySelector("#eventPins .event-pin.weather-marker:not(.active)");
    const label = pin?.querySelector(".pin-label");
    const expectedTitle = pin?.title || "";
    if (!pin || !label || !expectedTitle) return { expectedTitle, activeTitle: "", touchAction: "" };
    const touchAction = getComputedStyle(label).touchAction;
    label.dispatchEvent(new PointerEvent("pointerdown", {
      bubbles: true,
      pointerId: 41,
      pointerType: "touch",
      button: 0,
      clientX: 20,
      clientY: 20
    }));
    label.dispatchEvent(new PointerEvent("pointerup", {
      bubbles: true,
      pointerId: 41,
      pointerType: "touch",
      button: 0,
      clientX: 20,
      clientY: 20
    }));
    label.click();
    return {
      expectedTitle,
      activeTitle: document.querySelector("#eventPins .event-pin.weather-marker.active")?.title || "",
      touchAction
    };
  });
  assert(
    touchLabelTap.activeTitle === touchLabelTap.expectedTitle && touchLabelTap.touchAction === "pan-y",
    `touch tap or vertical scrolling is blocked by a city label: ${JSON.stringify(touchLabelTap)}`
  );

  await page.locator('[data-map-mode="events"]').click();
  await page.waitForSelector(".translation-card");
  const translationSentinel = "A deliberately unique translation selection 84271.";
  const translationRequest = page.waitForRequest(request => (
    request.url().endsWith("/api/translate")
    && request.method() === "POST"
    && request.postDataJSON()?.text === translationSentinel
  ), { timeout: 5_000 });
  await page.evaluate(text => {
    const source = document.createElement("span");
    source.id = "translationTestSource";
    source.textContent = text;
    document.querySelector("#placeReports")?.appendChild(source);
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(source);
    selection.removeAllRanges();
    selection.addRange(range);
    document.dispatchEvent(new Event("selectionchange"));
  }, translationSentinel);
  await translationRequest;
  await page.waitForFunction(() => (
    document.querySelector(".translation-result-text")?.textContent.trim() === "fixture translation"
  ));
  const translationPanelBefore = await page.locator(".translation-card").innerText();
  const translationCountBeforePanelSelection = translationRequestCount;
  for (const selector of [".translation-source-text", ".translation-result-text", ".translation-explanation-text",
    ".translation-label", ".translation-speak-button", "#feedTitle"]) {
    const expectedSelection = await page.evaluate(targetSelector => {
      const target = document.querySelector(targetSelector);
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(target);
      selection.removeAllRanges();
      selection.addRange(range);
      document.dispatchEvent(new Event("selectionchange"));
      return selection.toString().trim();
    }, selector);
    await page.waitForTimeout(150);
    assert(
      translationRequestCount === translationCountBeforePanelSelection,
      `Translation panel selection triggered another request for ${selector}`
    );
    assert(
      await page.locator(".translation-card").innerText() === translationPanelBefore,
      `Translation panel selection changed its own content for ${selector}`
    );
    assert(
      await page.evaluate(() => window.getSelection()?.toString().trim() || "") === expectedSelection,
      `Translation panel selection was not preserved for ${selector}`
    );
  }
  for (const kind of ["panel-partial", "panel-enclosed", "panel-cross-boundary", "editable", "input"]) {
    const selectionBefore = await page.evaluate(selectionKind => {
      const card = document.querySelector(".translation-card");
      const panel = card.closest(".feed-panel");
      const selection = window.getSelection();
      const range = document.createRange();
      const before = document.createElement("span");
      before.className = "translation-exclusion-fixture";
      before.textContent = "Before translation panel, sentinel 81593.";
      const after = before.cloneNode(true);
      after.textContent = "After translation panel, sentinel 71834.";
      panel.before(before);
      panel.after(after);
      if (selectionKind === "panel-partial") {
        const source = card.querySelector(".translation-source-text").firstChild;
        range.setStart(source, 1);
        range.setEnd(source, Math.min(5, source.length));
      } else if (selectionKind === "panel-enclosed") {
        range.setStart(before.firstChild, 0);
        range.setEnd(after.firstChild, after.textContent.length);
      } else if (selectionKind === "panel-cross-boundary") {
        range.setStart(before.firstChild, 0);
        range.setEnd(card.querySelector(".translation-explanation-text").firstChild, 5);
      } else if (selectionKind === "editable") {
        before.contentEditable = "true";
        before.focus();
        range.selectNodeContents(before);
      } else {
        const input = document.createElement("input");
        input.className = "translation-exclusion-fixture";
        input.value = "Input selection should stay editable 34871.";
        before.before(input);
        input.focus();
        input.select();
        range.selectNodeContents(before);
      }
      selection.removeAllRanges();
      selection.addRange(range);
      document.dispatchEvent(new Event("selectionchange"));
      return selection.toString();
    }, kind);
    await page.waitForTimeout(150);
    assert(translationRequestCount === translationCountBeforePanelSelection && legacyTranslationRequestCount === 0,
      `${kind} selection recursively requested translation`);
    assert(await page.locator(".translation-card").innerText() === translationPanelBefore,
      `${kind} selection replaced the translation panel`);
    const selectionAfter = await page.evaluate(() => window.getSelection().toString());
    assert(selectionAfter.replace(/\b\d{2}:\d{2}:\d{2}\b/g, "<clock>") === selectionBefore.replace(/\b\d{2}:\d{2}:\d{2}\b/g, "<clock>"),
      `${kind} selection was cleared instead of remaining available to copy`);
    await page.evaluate(() => {
      document.activeElement?.blur();
      window.getSelection().removeAllRanges();
      document.querySelectorAll(".translation-exclusion-fixture").forEach(node => node.remove());
    });
  }
  const preservedTranslationSelection = await page.evaluate(async () => {
    const card = document.querySelector(".translation-card");
    const target = document.querySelector(".translation-result-text");
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(target);
    selection.removeAllRanges();
    selection.addRange(range);
    const selectedText = selection.toString();
    await fetchEvents({ announce: false });
    return {
      sameCard: card === document.querySelector(".translation-card"),
      selectedText,
      selectionAfter: selection.toString()
    };
  });
  assert(
    preservedTranslationSelection.sameCard
      && preservedTranslationSelection.selectionAfter === preservedTranslationSelection.selectedText,
    `event refresh rebuilt the selected Translation panel: ${JSON.stringify(preservedTranslationSelection)}`
  );

  const firstLanguageRequest = page.waitForRequest(request => (
    request.url().endsWith("/api/translate")
    && request.postDataJSON()?.text === languageRaceSentinel
  ), { timeout: 5_000 });
  await page.evaluate(text => {
    let source = document.querySelector("#translationTestSource");
    if (!source) {
      source = document.createElement("span");
      source.id = "translationTestSource";
      document.querySelector("#placeReports")?.appendChild(source);
    }
    source.textContent = text;
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(source);
    selection.removeAllRanges();
    selection.addRange(range);
    document.dispatchEvent(new Event("selectionchange"));
  }, languageRaceSentinel);
  const initialLanguageRequest = await firstLanguageRequest;
  const initialUiLanguage = initialLanguageRequest.postDataJSON().ui;
  const refreshedLanguageRequest = page.waitForRequest(request => (
    request.url().endsWith("/api/translate")
    && request.postDataJSON()?.text === languageRaceSentinel
    && request.postDataJSON()?.ui !== initialUiLanguage
  ), { timeout: 5_000 });
  await page.locator("#languageToggle").evaluate(button => button.click());
  const refreshedUiLanguage = (await refreshedLanguageRequest).postDataJSON().ui;
  await page.waitForFunction(expected => (
    document.querySelector(".translation-result-text")?.textContent.trim() === `language-${expected}`
  ), refreshedUiLanguage);
  await page.waitForTimeout(1000);
  assert(
    await page.locator(".translation-result-text").innerText() === `language-${refreshedUiLanguage}`,
    "an obsolete translation response overwrote the new UI-language result"
  );
  assert(
    languageRaceRequests.includes(initialUiLanguage) && languageRaceRequests.includes(refreshedUiLanguage),
    `language switch did not issue both translation requests: ${JSON.stringify(languageRaceRequests)}`
  );
  await page.evaluate(() => {
    document.querySelector("#translationTestSource")?.remove();
    window.getSelection()?.removeAllRanges();
  });

  const lazyCurrencyRequest = page.waitForRequest("**/api/currency-history?**", { timeout: 5_000 });
  await page.locator('[data-map-mode="markets"]').click();
  await page.waitForSelector("#marketBoard .market-leaders", { timeout: 15_000 });
  const currencyRequest = await lazyCurrencyRequest;
  assert(new URL(currencyRequest.url()).searchParams.get("code") === "CNY", "selected currency history was not loaded lazily");
  const marketRows = await page.locator("#marketBoard [data-asset-id]").count();
  assert(marketRows > 0, "market bootstrap did not render any assets");
  await page.locator(".market-ask-config-button").click();
  await page.waitForSelector("#marketAskApiConfig");
  await runtimeConfigRequest;
  releaseRuntimeConfig();
  await page.waitForFunction(() => (
    document.querySelector('#marketAskApiConfig input[type="url"]')?.value === "https://configured.example/v1"
  ));
  const translationRequestCountBeforeMarketSelection = translationRequestCount;
  await page.evaluate(() => {
    const node = document.querySelector("#reportTitle");
    const selection = window.getSelection();
    if (!node || !selection) return;
    const range = document.createRange();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
    document.dispatchEvent(new Event("selectionchange"));
  });
  await page.waitForTimeout(120);
  assert(
    translationRequestCount === translationRequestCountBeforeMarketSelection,
    "market text selection triggered a hidden translation request"
  );

  await page.locator('.market-leader-row[data-asset-id="btc"]').click();
  await page.locator('[data-market-group-filter="crypto"]').click();
  const filteredSelection = await page.evaluate(() => ({
    activeId: document.querySelector(".market-leader-row.active")?.getAttribute("data-asset-id") || "",
    reportTitle: document.querySelector("#reportTitle")?.textContent?.trim() || ""
  }));
  assert(filteredSelection.activeId && filteredSelection.activeId !== "btc", `crypto filter kept BTC active: ${JSON.stringify(filteredSelection)}`);
  assert(!/bitcoin/i.test(filteredSelection.reportTitle), `crypto filter left stale BTC inspector text: ${JSON.stringify(filteredSelection)}`);
  await page.locator('[data-market-group-filter="crypto"]').click();
  await page.waitForSelector('#marketBoard .market-chart svg[role="img"]', { timeout: 30_000 });
  await page.waitForSelector('#marketBoard .market-chart svg[role="img"]:not([data-provisional="true"])', { timeout: 30_000 });
  const chartState = await page.evaluate(() => {
    const chart = document.querySelector('#marketBoard .market-chart svg[role="img"]');
    const paths = Array.from(chart?.querySelectorAll("path") || []);
    return {
      labels: Array.from(chart?.querySelectorAll("text") || []).map(node => node.textContent).filter(Boolean),
      pathLengths: paths.map(path => (path.getAttribute("d") || "").length)
    };
  });
  assert(chartState.labels.length >= 7, `market chart labels are incomplete: ${JSON.stringify(chartState)}`);
  assert(chartState.pathLengths.some(length => length > 100), `market chart path is empty: ${JSON.stringify(chartState)}`);

  const draftBaseUrl = "https://draft.example/v1";
  const draftApiKey = "draft-secret";
  await page.locator('#marketAskApiConfig input[type="url"]').fill(draftBaseUrl);
  await page.locator('#marketAskApiConfig input[type="password"]').fill(draftApiKey);
  const navigationBeforeInput = await page.evaluate(() => ({
    asset: document.querySelector("#marketBoard [data-asset-id].active")?.getAttribute("data-asset-id") || "",
    range: document.querySelector("#marketBoard [data-market-range].active")?.getAttribute("data-market-range") || ""
  }));
  await page.locator(".market-ask-input").focus();
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowDown");
  const navigationAfterInput = await page.evaluate(() => ({
    asset: document.querySelector("#marketBoard [data-asset-id].active")?.getAttribute("data-asset-id") || "",
    range: document.querySelector("#marketBoard [data-market-range].active")?.getAttribute("data-market-range") || ""
  }));
  assert(
    JSON.stringify(navigationAfterInput) === JSON.stringify(navigationBeforeInput),
    `arrow keys in Ask input changed market navigation: ${JSON.stringify({ navigationBeforeInput, navigationAfterInput })}`
  );
  await page.locator('#marketBoard [data-market-range="5d"]').click();
  await page.waitForSelector("#marketAskApiConfig");
  assert(
    await page.locator('#marketAskApiConfig input[type="url"]').inputValue() === draftBaseUrl,
    "API configuration draft was lost during a market rerender"
  );
  assert(
    await page.locator('#marketAskApiConfig input[type="password"]').inputValue() === draftApiKey,
    "API key draft was lost during a market rerender"
  );
  const configCheckboxes = page.locator('#marketAskApiConfig input[type="checkbox"]');
  const clearKeyCheckbox = configCheckboxes.first();
  await clearKeyCheckbox.check();
  assert(await page.locator('#marketAskApiConfig input[type="password"]').inputValue() === "", "clearing a saved key did not clear the replacement key draft");
  assert(await page.locator('#marketAskApiConfig input[type="password"]').isDisabled(), "key input remains enabled while clear-key is selected");
  await clearKeyCheckbox.uncheck();
  await page.locator('#marketAskApiConfig input[type="password"]').fill(draftApiKey);
  assert(!(await clearKeyCheckbox.isChecked()), "entering a replacement key left clear-key selected");

  let releaseConfigSave;
  const configSaveGate = new Promise(resolve => {
    releaseConfigSave = resolve;
  });
  await page.route("**/api/ask-config", async route => {
    await withTimeout(configSaveGate, "model config save release");
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        configured: true,
        baseUrl: draftBaseUrl,
        model: "configured-model",
        protocol: "responses",
        webSearch: false,
        hasApiKey: true,
        managedByEnvironment: false
      })
    });
  });
  const configSaveStarted = page.waitForRequest("**/api/ask-config", { timeout: 5_000 });
  await page.locator("#marketAskApiConfig .market-ask-config-footer button").click();
  await configSaveStarted;
  await page.locator(".market-leader-row").nth(1).click();
  releaseConfigSave();
  await page.waitForFunction(() => {
    const button = document.querySelector("#marketAskApiConfig .market-ask-config-footer button");
    return button && !button.disabled && !/saving/i.test(button.textContent || "");
  });
  await page.unroute("**/api/ask-config");

  let releaseAskRequest;
  const askRequestGate = new Promise(resolve => {
    releaseAskRequest = resolve;
  });
  await page.route("**/api/market-ask", async route => {
    await withTimeout(askRequestGate, "market Ask release");
    try {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ answer: "Delayed market answer" })
      });
    } catch {
      // Switching modes intentionally aborts the in-flight browser request.
    }
  });
  const askRequestStarted = page.waitForRequest("**/api/market-ask", { timeout: 5_000 });
  await page.locator(".market-ask-input").fill("Explain this asset");
  await page.locator(".market-ask-input").press("Enter");
  await page.waitForSelector(".market-ask-answer.loading");
  await askRequestStarted;
  await page.locator('[data-map-mode="stats"]').click();
  releaseAskRequest();
  await page.waitForTimeout(250);
  assert(await page.locator("body").evaluate(body => body.classList.contains("stats-mode")), "delayed Ask response changed the active mode");
  assert(await page.locator(".market-ask-panel").count() === 0, "delayed Ask response overwrote the Stats inspector");
  await page.unroute("**/api/market-ask");
  await page.locator('[data-map-mode="markets"]').click();
  await page.waitForSelector("#marketBoard .market-leaders");

  for (const viewport of [{ width: 390, height: 844 }, { width: 1280, height: 800 }]) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(150);
    const marketLayout = await page.evaluate(() => {
      const chart = document.querySelector("#marketBoard .market-chart");
      const board = document.querySelector("#marketBoard");
      const chartRect = chart?.getBoundingClientRect();
      const boardRect = board?.getBoundingClientRect();
      const config = document.querySelector("#marketAskApiConfig");
      const configRect = config?.getBoundingClientRect();
      return {
        viewportWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        chartRight: Math.round(chartRect?.right || 0),
        boardRight: Math.round(boardRect?.right || 0),
        configRight: Math.round(configRect?.right || 0),
        configOverflow: config ? Math.max(0, config.scrollWidth - config.clientWidth) : 0,
        clippedControls: Array.from(board?.querySelectorAll("button") || [])
          .filter(element => element.offsetParent && element.scrollWidth > element.clientWidth + 1)
          .map(element => element.textContent?.trim() || element.tagName)
          .slice(0, 12)
      };
    });
    assert(marketLayout.scrollWidth <= marketLayout.viewportWidth, `market page overflows at ${viewport.width}px: ${JSON.stringify(marketLayout)}`);
    assert(marketLayout.chartRight <= marketLayout.viewportWidth + 1, `market chart escapes at ${viewport.width}px: ${JSON.stringify(marketLayout)}`);
    assert(marketLayout.boardRight <= marketLayout.viewportWidth + 1, `market board escapes at ${viewport.width}px: ${JSON.stringify(marketLayout)}`);
    assert(marketLayout.configRight <= marketLayout.viewportWidth + 1, `market API settings escape at ${viewport.width}px: ${JSON.stringify(marketLayout)}`);
    assert(marketLayout.configOverflow === 0, `market API settings overflow internally at ${viewport.width}px: ${JSON.stringify(marketLayout)}`);
    assert(marketLayout.clippedControls.length === 0, `market controls are clipped at ${viewport.width}px: ${JSON.stringify(marketLayout)}`);
  }

  let releaseHistoryRequest;
  const historyRequestGate = new Promise(resolve => {
    releaseHistoryRequest = resolve;
  });
  await page.route("**/api/market-history?**", async route => {
    await withTimeout(historyRequestGate, "market history release");
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(marketHistoryFixture(route.request().url()))
    });
  });
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.locator('[data-map-mode="markets"]').click();
  await page.waitForSelector("#marketBoard .market-leaders", { timeout: 15_000 });
  await page.waitForSelector('#marketBoard .market-chart svg[data-provisional="true"]', { timeout: 2_000 });
  const initialAssetId = await page.locator(".market-leader-row.active").getAttribute("data-asset-id");
  const secondRow = page.locator(".market-leader-row:not(.active)").first();
  const secondAssetId = await secondRow.getAttribute("data-asset-id");
  const secondHistoryRequest = page.waitForRequest(request => {
    if (!request.url().includes("/api/market-history?")) return false;
    return new URL(request.url()).searchParams.get("id") === secondAssetId;
  }, { timeout: 5_000 });
  await secondRow.click();
  await secondHistoryRequest;
  await page.locator(`.market-leader-row[data-asset-id="${initialAssetId}"]`).click();
  assert(
    await page.locator(".market-leader-row.active").getAttribute("data-asset-id") === initialAssetId,
    "A-B-A navigation did not restore the original asset before history completion"
  );
  const provisionalState = await page.evaluate(() => {
    const chart = document.querySelector('#marketBoard .market-chart svg[data-provisional="true"]');
    const linePath = Array.from(chart?.querySelectorAll("path") || [])
      .find(path => path.getAttribute("stroke")?.includes("--green") || path.getAttribute("stroke")?.includes("--red"));
    const coordinates = Array.from((linePath?.getAttribute("d") || "").matchAll(/[ML]\s+[\d.]+\s+([\d.]+)/g))
      .map(match => Number(match[1]));
    return {
      hasLoadingPlaceholder: Array.from(document.querySelectorAll(".market-chart-empty"))
        .some(element => element.textContent.includes("Loading historical chart")),
      pathLength: (linePath?.getAttribute("d") || "").length,
      yValues: Array.from(new Set(coordinates.map(value => value.toFixed(1))))
    };
  });
  assert(!provisionalState.hasLoadingPlaceholder, `delayed history showed a blocking placeholder: ${JSON.stringify(provisionalState)}`);
  assert(provisionalState.pathLength > 20, `provisional history line is empty: ${JSON.stringify(provisionalState)}`);
  assert(provisionalState.yValues.length === 1, `provisional history is not horizontal: ${JSON.stringify(provisionalState)}`);
  releaseHistoryRequest();
  await page.waitForSelector('#marketBoard .market-chart svg[role="img"]:not([data-provisional="true"])', { timeout: 15_000 });
  await page.unroute("**/api/market-history?**");

  await page.route("**/api/market-history?**", route => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify(marketHistoryFixture(route.request().url()))
  }));
  const selectedBeforeSearch = await page.evaluate(() => selectedMarketId);
  for (const query of ["AAPL", "Apple", "苹果"]) {
    await page.locator("#marketAssetSearch").fill(query);
    const searchState = await page.evaluate(() => ({
      ids: marketNavigationAssets().map(asset => asset.symbol),
      selected: selectedMarketId,
      focused: document.activeElement?.id
    }));
    assert(searchState.ids.includes("AAPL") && searchState.selected === selectedBeforeSearch,
      `search ${query} lost Apple or changed selection: ${JSON.stringify(searchState)}`);
    assert(searchState.focused === "marketAssetSearch", `search ${query} lost keyboard focus`);
  }
  await page.locator("#marketAssetSearch").fill("no-such-asset-976431");
  assert(await page.locator(".market-leader-row").count() === 0, "empty search still shows unrelated assets");
  assert(await page.locator(".market-search-empty").isVisible(), "empty search has no recovery message");
  await page.locator(".market-search-empty button").click();
  const favoriteAsset = await page.evaluate(() => {
    const asset = rankedVisibleMarketAssets()[65];
    return { id: asset.id, symbol: asset.symbol, rank: marketDisplayRank(asset) };
  });
  await page.locator("#marketAssetSearch").fill(favoriteAsset.symbol);
  const favoriteButton = page.locator(`[data-favorite-asset-id="${favoriteAsset.id}"]`);
  await favoriteButton.focus();
  await favoriteButton.press("Space");
  assert(await page.evaluate(() => selectedMarketId) === selectedBeforeSearch, "Space on a favorite button selected its parent row");
  assert(await favoriteButton.getAttribute("aria-pressed") === "true", "Space did not add an asset to the watchlist");
  await page.locator("#marketAssetSearch").fill("");
  assert(await page.locator(".market-leader-row").first().getAttribute("data-asset-id") === favoriteAsset.id,
    "favorite outside the top 50 was not pinned to the top");
  assert((await page.locator(".market-leader-row").first().locator(".market-rank-badge").textContent()) === `#${favoriteAsset.rank}`,
    "watchlist pinning changed the original market rank");
  await page.locator("#marketFavoritesFilter").click();
  assert(await page.locator(".market-leader-row").count() === 1, "watchlist filter shows nonfavorite assets");
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForSelector(`[data-favorite-asset-id="${favoriteAsset.id}"]`);
  assert(await page.locator("#marketFavoritesFilter").getAttribute("aria-pressed") === "true", "watchlist filter was not restored after reload");
  assert(await page.locator(`[data-favorite-asset-id="${favoriteAsset.id}"]`).getAttribute("aria-pressed") === "true",
    "favorite was not restored after reload");
  await page.locator(`[data-favorite-asset-id="${favoriteAsset.id}"]`).press("Enter");
  assert(await page.locator(".market-search-empty").isVisible(), "removing the last favorite did not show the empty watchlist");
  await page.locator(".market-search-empty button").click();

  for (const viewport of [{ width: 390, height: 844 }, { width: 1280, height: 800 }]) {
    await page.setViewportSize(viewport);
    const controls = await page.locator(".market-search-controls").evaluate(element => ({
      left: element.getBoundingClientRect().left,
      right: element.getBoundingClientRect().right,
      width: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      clipped: Array.from(element.querySelectorAll("button")).some(button => button.scrollWidth > button.clientWidth + 1)
    }));
    assert(controls.left >= 0 && controls.right <= controls.width + 1 && controls.scrollWidth <= controls.width && !controls.clipped,
      `search/watchlist controls overflow at ${viewport.width}px: ${JSON.stringify(controls)}`);
    if (process.env.CODEX_WORLD_SCREENSHOT_DIR) {
      mkdirSync(process.env.CODEX_WORLD_SCREENSHOT_DIR, { recursive: true });
      await page.screenshot({ path: join(process.env.CODEX_WORLD_SCREENSHOT_DIR, `market-upgrade-${viewport.width}.png`), fullPage: true });
    }
  }

  await page.waitForFunction(() => !marketFetchAbortController && !eventFetchAbortController && !weatherFetchAbortController);
  const hiddenPolling = await page.evaluate(() => {
    const before = [weatherFetchRequestId, eventFetchRequestId, marketFetchRequestId];
    const old = Date.now() - 15 * 60 * 1000;
    Object.values(datasetRefreshState).forEach(state => Object.assign(state, { attemptedAt: old, completedAt: old, succeededAt: old }));
    Object.defineProperty(document, "hidden", { configurable: true, value: true });
    document.dispatchEvent(new Event("visibilitychange"));
    refreshVisibleDatasets();
    return { before, after: [weatherFetchRequestId, eventFetchRequestId, marketFetchRequestId] };
  });
  assert(JSON.stringify(hiddenPolling.before) === JSON.stringify(hiddenPolling.after), `hidden page started automatic requests: ${JSON.stringify(hiddenPolling)}`);
  const visiblePolling = await page.evaluate(() => {
    const before = [weatherFetchRequestId, eventFetchRequestId, marketFetchRequestId];
    Object.defineProperty(document, "hidden", { configurable: true, value: false });
    document.dispatchEvent(new Event("visibilitychange"));
    refreshVisibleDatasets();
    return { before, after: [weatherFetchRequestId, eventFetchRequestId, marketFetchRequestId] };
  });
  assert(visiblePolling.after[0] === visiblePolling.before[0] && visiblePolling.after[1] === visiblePolling.before[1]
    && visiblePolling.after[2] === visiblePolling.before[2] + 1,
  `foreground refresh ignored active mode or duplicated a request: ${JSON.stringify(visiblePolling)}`);
  const modePolling = await page.evaluate(() => {
    const before = weatherFetchRequestId;
    setMapMode("stats");
    setMapMode("markets");
    setMapMode("stats");
    delete document.hidden;
    return { before, after: weatherFetchRequestId };
  });
  assert(modePolling.after === modePolling.before + 1, `returning to weather did not refresh once: ${JSON.stringify(modePolling)}`);

  assert(errors.length === 0, `page errors: ${errors.join("; ")}`);

  console.log("PASS Codex World responsive UI, watchlist/search, RSS freshness, visibility polling and non-blocking market history (390-2560 px)");
} finally {
  try {
    await withTimeout(browser.close(), "browser close", 5_000);
  } catch (error) {
    console.warn(`WARN ${error.message}`);
  }
}

// Edge can leave inherited Windows handles alive after a successful close.
// Reaching this line means every assertion passed and cleanup was attempted.
process.exit(0);
