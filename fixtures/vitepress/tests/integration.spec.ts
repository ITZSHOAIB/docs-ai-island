import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/guide/getting-started");
});

test("mounts one island through the public package API", async ({ page }) => {
  const island = page.locator("[data-docs-ai-island]");
  await expect(island).toHaveCount(1);
  await expect(island).toHaveAttribute("data-placement", "bottom-center");
  await expect(island).toHaveCSS("--docs-ai-island-accent", "#5b5bd6");
});

test("refreshes page context after client-side navigation without remounting", async ({ page }) => {
  const island = page.locator("[data-docs-ai-island]");
  const initialNode = await island.evaluate((element) => {
    element.dataset.fixtureIdentity = "original";
    return element.dataset.fixtureIdentity;
  });
  expect(initialNode).toBe("original");

  await page.getByRole("link", { name: "Client options" }).first().click();
  await expect(page).toHaveURL(/\/reference\/options$/);
  await expect(island).toHaveCount(1);
  await expect(island).toHaveAttribute("data-fixture-identity", "original");

  await island.getByRole("button", { name: "Ask AI" }).click();
  await expect(island.locator('[data-part="page-title"]')).toHaveText("Client options");
  await island.locator('[data-action-id="capture-route"]').click();
  await expect(island).toHaveAttribute(
    "data-fixture-canonical",
    "https://docs.northstar.example/reference/client-options",
  );
});

test("hands the active canonical page to an AI target", async ({ page }) => {
  await page.addInitScript(() => {
    window.open = (url) => {
      document.documentElement.dataset.fixtureOpenedUrl = String(url);
      return null;
    };
  });
  await page.reload();
  await page.getByRole("link", { name: "Client options" }).first().click();
  await page.getByRole("button", { name: "Ask AI" }).click();
  await page.locator('[data-action-id="chatgpt"]').click();

  const openedUrl = await page.locator("html").getAttribute("data-fixture-opened-url");
  expect(openedUrl).toContain("https%3A%2F%2Fdocs.northstar.example%2Freference%2Fclient-options");
});

test("coexists with VitePress dark mode and another floating control", async ({ page }) => {
  const island = page.locator("[data-docs-ai-island]");
  await expect(island).toHaveAttribute("data-color-scheme", "light");
  await page.getByRole("switch", { name: "Switch to dark theme" }).click();
  await expect(island).toHaveAttribute("data-color-scheme", "dark");
  await island.getByRole("button", { name: "Ask AI" }).click();

  await expect(page.getByRole("button", { name: "Open support" })).toBeVisible();
  await expect(island.locator('[data-part="menu"]')).toBeVisible();
});

test("stays within mobile gutters on a long documentation page", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/guide/long-page");
  await page.getByRole("button", { name: "Ask AI" }).click();

  const bounds = await page.locator("[data-docs-ai-island]").boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds?.x).toBeGreaterThanOrEqual(12);
  expect((bounds?.x ?? 0) + (bounds?.width ?? 0)).toBeLessThanOrEqual(378);
});

test("has no detectable island accessibility violations in VitePress", async ({ page }) => {
  await page.getByRole("button", { name: "Ask AI" }).click();
  const results = await new AxeBuilder({ page }).include("[data-docs-ai-island]").analyze();
  expect(results.violations).toEqual([]);
});
