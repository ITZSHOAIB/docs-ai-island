import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText(value: string) {
          document.documentElement.dataset.fixtureClipboard = value;
          return Promise.resolve();
        },
      },
    });
    Object.defineProperty(window, "open", {
      configurable: true,
      value(url: string | URL, target: string, features: string) {
        document.documentElement.dataset.fixtureOpenedUrl = String(url);
        document.documentElement.dataset.fixtureOpenedTarget = target;
        document.documentElement.dataset.fixtureOpenedFeatures = features;
        return null;
      },
    });
  });
  await page.goto("/");
});

test("opens the Option A menu and exposes stable parts", async ({ page }) => {
  const island = page.locator("[data-docs-ai-island]");
  const trigger = island.getByRole("button", { name: "Ask AI" });

  await expect(island).toHaveAttribute("data-state", "closed");
  await trigger.click();

  await expect(island).toHaveAttribute("data-state", "open");
  await expect(island.locator('[data-part="title"]')).toHaveText("Ask about this page");
  await expect(island.locator('[data-part="page-title"]')).toHaveText("Create your first client");
  await expect(island.locator('[data-part="action"]')).toHaveCount(2);
  await expect(island.locator('[data-part="utility"]')).toHaveCount(3);
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
});

test("supports menu keyboard navigation and restores trigger focus", async ({ page }) => {
  const island = page.locator("[data-docs-ai-island]");
  const trigger = island.getByRole("button", { name: "Ask AI" });
  await trigger.click();

  await expect(island.locator('[data-action-id="chatgpt"]')).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(island.locator('[data-action-id="claude"]')).toBeFocused();
  await page.keyboard.press("End");
  await expect(island.locator('[data-action-id="mcp"]')).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(island).toHaveAttribute("data-state", "closed");
});

test("applies runtime appearance and theme updates", async ({ page }) => {
  await page.locator('[data-control="placement"]').selectOption("bottom-right");
  await page.locator("[data-accent]").fill("#d25580");

  const island = page.locator("[data-docs-ai-island]");
  await expect(island).toHaveAttribute("data-placement", "bottom-right");
  await expect(island).toHaveCSS("--docs-ai-island-accent", "#d25580");
});

test("copies exact configured Markdown and keeps the menu open", async ({ page }) => {
  const island = page.locator("[data-docs-ai-island]");
  await island.getByRole("button", { name: "Ask AI" }).click();
  await island.getByRole("button", { name: "Copy page for AI" }).click();

  await expect(page.locator("html")).toHaveAttribute(
    "data-fixture-clipboard",
    "# Exact source\n\nKeep **formatting**.",
  );
  await expect(island.locator('[data-part="live-region"]')).toHaveText("Markdown copied");
  await expect(island).toHaveAttribute("data-state", "open");
});

test("does not read page content until the reader invokes the Action", async ({ page }) => {
  const island = page.locator("[data-docs-ai-island]");
  await expect(page.locator("html")).toHaveAttribute("data-fixture-content-reads", "0");

  await island.getByRole("button", { name: "Ask AI" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-fixture-content-reads", "0");

  await island.getByRole("button", { name: "Copy page for AI" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-fixture-content-reads", "1");
});

test("copies Markdown fetched from the configured source URL", async ({ page }) => {
  await page.route("**/content/getting-started.md", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/markdown",
      body: "# URL source\n\nFetched on demand.",
    });
  });
  await page.goto("/?remote-content");

  const island = page.locator("[data-docs-ai-island]");
  await island.getByRole("button", { name: "Ask AI" }).click();
  await island.getByRole("button", { name: "Copy page for AI" }).click();

  await expect(page.locator("html")).toHaveAttribute(
    "data-fixture-clipboard",
    "# URL source\n\nFetched on demand.",
  );
  await expect(island.locator('[data-part="live-region"]')).toHaveText("Markdown copied");
});

test("reports an unavailable Markdown response without copying it", async ({ page }) => {
  await page.route("**/content/getting-started.md", async (route) => {
    await route.fulfill({ status: 404, contentType: "text/plain", body: "Not found" });
  });
  await page.goto("/?remote-content");

  const island = page.locator("[data-docs-ai-island]");
  await island.getByRole("button", { name: "Ask AI" }).click();
  await island.getByRole("button", { name: "Copy page for AI" }).click();

  await expect(page.locator("html")).not.toHaveAttribute("data-fixture-clipboard", /.+/);
  await expect(page.locator("html")).toHaveAttribute("data-fixture-event", "action-error");
  await expect(island.locator('[data-part="live-region"]')).toHaveText(
    "Copy page for AI could not be opened",
  );
});

test("reports a Markdown network failure without copying content", async ({ page }) => {
  await page.route("**/content/getting-started.md", async (route) => {
    await route.abort("failed");
  });
  await page.goto("/?remote-content");

  const island = page.locator("[data-docs-ai-island]");
  await island.getByRole("button", { name: "Ask AI" }).click();
  await island.getByRole("button", { name: "Copy page for AI" }).click();

  await expect(page.locator("html")).not.toHaveAttribute("data-fixture-clipboard", /.+/);
  await expect(page.locator("html")).toHaveAttribute("data-fixture-event", "action-error");
});

test("copies the canonical URL only when its fallback is configured", async ({ page }) => {
  await page.route("**/content/getting-started.md", async (route) => {
    await route.fulfill({ status: 503, contentType: "text/plain", body: "Unavailable" });
  });
  await page.goto("/?remote-content&copy-url-fallback");

  const island = page.locator("[data-docs-ai-island]");
  await island.getByRole("button", { name: "Ask AI" }).click();
  await island.getByRole("button", { name: "Copy page for AI" }).click();

  await expect(page.locator("html")).toHaveAttribute(
    "data-fixture-clipboard",
    "http://127.0.0.1:4173/getting-started/client",
  );
  await expect(island.locator('[data-part="live-region"]')).toHaveText("Page link copied");
});

test("treats an empty successful Markdown response as exact content", async ({ page }) => {
  await page.route("**/content/getting-started.md", async (route) => {
    await route.fulfill({ status: 200, contentType: "text/markdown", body: "" });
  });
  await page.goto("/?remote-content");

  const island = page.locator("[data-docs-ai-island]");
  await island.getByRole("button", { name: "Ask AI" }).click();
  await island.getByRole("button", { name: "Copy page for AI" }).click();

  await expect(page.locator("html")).toHaveAttribute("data-fixture-clipboard", "");
  await expect(island.locator('[data-part="live-region"]')).toHaveText("Markdown copied");
});

test("opens the configured Markdown URL in an independent safe window", async ({ page }) => {
  await page.goto("/?remote-content");

  const island = page.locator("[data-docs-ai-island]");
  await island.getByRole("button", { name: "Ask AI" }).click();
  await island.getByRole("button", { name: "View as Markdown" }).click();

  await expect(page.locator("html")).toHaveAttribute(
    "data-fixture-opened-url",
    "http://127.0.0.1:4173/content/getting-started.md",
  );
  await expect(page.locator("html")).toHaveAttribute("data-fixture-opened-target", "_blank");
  await expect(page.locator("html")).toHaveAttribute(
    "data-fixture-opened-features",
    "noopener,noreferrer",
  );
});

test("resolves the Markdown URL from current SPA page context", async ({ page }) => {
  await page.goto("/?contextual-content");
  await page.evaluate(() => {
    history.pushState({}, "", "/guides/routing");
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = "http://127.0.0.1:4173/guides/routing";
  });

  const island = page.locator("[data-docs-ai-island]");
  await island.getByRole("button", { name: "Ask AI" }).click();
  await island.getByRole("button", { name: "View as Markdown" }).click();

  await expect(page.locator("html")).toHaveAttribute(
    "data-fixture-opened-url",
    "http://127.0.0.1:4173/content/guides/routing.md",
  );
});

test("copies a literal resource with specific feedback", async ({ page }) => {
  const island = page.locator("[data-docs-ai-island]");
  await island.getByRole("button", { name: "Ask AI" }).click();
  await island.getByRole("button", { name: "MCP" }).click();

  await expect(page.locator("html")).toHaveAttribute(
    "data-fixture-clipboard",
    "https://docs.luma.dev/api/mcp",
  );
  await expect(island.locator('[data-part="live-region"]')).toHaveText("MCP copied");
  await expect(island).toHaveAttribute("data-state", "open");
});

test("resolves a dynamic resource from current SPA page context", async ({ page }) => {
  await page.goto("/?dynamic-resource");
  await page.evaluate(() => {
    history.pushState({}, "", "/guides/routing");
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = "http://127.0.0.1:4173/guides/routing";
  });

  const island = page.locator("[data-docs-ai-island]");
  await island.getByRole("button", { name: "Ask AI" }).click();
  await island.getByRole("button", { name: "MCP" }).click();

  await expect(page.locator("html")).toHaveAttribute(
    "data-fixture-clipboard",
    "http://127.0.0.1:4173/api/mcp?from=%2Fguides%2Frouting",
  );
});

test("rejects non-HTTP resource protocols before navigation", async ({ page }) => {
  await page.goto("/?unsafe-resource");

  const island = page.locator("[data-docs-ai-island]");
  await island.getByRole("button", { name: "Ask AI" }).click();
  await island.getByRole("button", { name: "Unsafe" }).click();

  await expect(page.locator("html")).not.toHaveAttribute("data-fixture-opened-url", /.+/);
  await expect(page.locator("html")).toHaveAttribute("data-fixture-event", "action-error");
});

test("preserves ordinary Action customization on URL resources", async ({ page }) => {
  await page.goto("/?custom-open");

  const island = page.locator("[data-docs-ai-island]");
  await island.getByRole("button", { name: "Ask AI" }).click();
  const action = island.locator('[data-action-id="source-link"]');
  await expect(action.locator('[data-part="action-label"]')).toHaveText("Source repository");
  await expect(action.locator('[data-part="action-description"]')).toHaveText(
    "Inspect the implementation",
  );
  await expect(action.locator('[data-part="icon-frame"]')).toHaveCount(0);

  await action.click();
  await expect(page.locator("html")).toHaveAttribute(
    "data-fixture-opened-url",
    "https://github.com/ITZSHOAIB/docs-ai-island",
  );
  await expect(island).toHaveAttribute("data-state", "open");
});

test("has no automatically detectable accessibility violations", async ({ page }) => {
  await page.getByRole("button", { name: "Ask AI" }).click();
  const results = await new AxeBuilder({ page }).include("[data-docs-ai-island]").analyze();
  expect(results.violations).toEqual([]);
});

test("matches the approved quiet-glass composition", async ({ page }) => {
  await page.getByRole("button", { name: "Ask AI" }).click();
  await expect(page.locator("[data-docs-ai-island]")).toHaveScreenshot("quiet-glass.png");
});

test("fits the mobile viewport and safe gutters", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await page.getByRole("button", { name: "Ask AI" }).click();

  const bounds = await page.locator("[data-docs-ai-island]").boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds?.x).toBeGreaterThanOrEqual(12);
  expect((bounds?.x ?? 0) + (bounds?.width ?? 0)).toBeLessThanOrEqual(378);
  await expect(page.locator("[data-docs-ai-island]")).toHaveScreenshot("quiet-glass-mobile.png");
});
