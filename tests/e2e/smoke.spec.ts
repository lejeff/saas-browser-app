import { expect, test } from "@playwright/test";

test("homepage renders starter title", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Commercial SaaS Starter")).toBeVisible();
});
