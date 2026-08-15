import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
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
