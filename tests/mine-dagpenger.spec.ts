import { test, expect } from "@playwright/test";

test("Has `Mine dagpenger` as page title", async ({ page, baseURL }) => {
  await page.goto(baseURL!);
  await expect(page).toHaveTitle(/Mine dagpenger/);
});
