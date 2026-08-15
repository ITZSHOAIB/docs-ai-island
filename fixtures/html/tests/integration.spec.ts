import { expect, test } from "@playwright/test";

test("mounts the Island from public package exports", async ({ page }) => {
  await page.goto("/");

  const island = page.locator("[data-docs-ai-island]");
  await expect(island).toHaveCount(1);
  await expect(island.getByRole("button", { name: "Ask AI" })).toBeVisible();
});

test("refreshes the same Island after framework-free history navigation", async ({ page }) => {
  await page.goto("/");
  const island = page.locator("[data-docs-ai-island]");
  await island.evaluate((element) => {
    element.dataset.fixtureIdentity = "original";
  });

  await page.getByRole("button", { name: "Navigate without reloading" }).click();
  await expect(page).toHaveURL(/\/guide$/);
  await expect(island).toHaveAttribute("data-fixture-identity", "original");

  await island.getByRole("button", { name: "Ask AI" }).click();
  await expect(island.locator('[data-part="page-title"]')).toHaveText("Guide route");
});
