import { expect, test } from "@playwright/test";

test("homepage renders app shell and planner", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Financial Planner/i);
  await expect(page.getByRole("link", { name: /Financial Planner/i })).toBeVisible();
});
