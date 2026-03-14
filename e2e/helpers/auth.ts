/**
 * Shared E2E auth helpers.
 *
 * Extracted from the per-spec duplicates so every test file can
 * set up a fresh user in one call.
 */

import { expect, type Page } from "@playwright/test";

export const TEST_PASSWORD = "TestPass123!";

/**
 * Generate a unique test user object (email, username, password).
 * @param prefix  Email prefix, e.g. `"e2e-rigging"`. Defaults to `"e2e"`.
 */
export function generateTestUser(prefix = "e2e") {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return {
    email: `${prefix}-${timestamp}-${random}@test.com`,
    username: `${prefix}${timestamp}${random}`.substring(0, 20),
    password: TEST_PASSWORD,
  };
}

/**
 * Add `x-e2e-bypass: true` header to every API request so the
 * server-side rate limiter is skipped during E2E runs.
 */
export async function setupRateLimitBypass(page: Page): Promise<void> {
  await page.route("**/api/**", async (route) => {
    const headers = {
      ...route.request().headers(),
      "x-e2e-bypass": process.env.E2E_BYPASS_SECRET ?? "true",
    };
    await route.continue({ headers });
  });
}

/**
 * Sign up a brand-new test user through the UI and return the user ID.
 *
 * @param page    Playwright page (rate-limit bypass should already be set up)
 * @param prefix  Email prefix for uniqueness, e.g. `"e2e-rigging"`.
 */
export async function signUpTestUser(page: Page, prefix = "e2e"): Promise<string> {
  const user = generateTestUser(prefix);

  await page.goto("/signup");
  await page.locator("#email").fill(user.email);
  await page.locator("#username").fill(user.username);
  await page.locator("#password").fill(user.password);
  await page.locator("#confirmPassword").fill(user.password);
  await page.getByRole("button", { name: "Sign Up" }).click();
  await expect(page).toHaveURL("/", { timeout: 15000 });

  const resp = await page.evaluate(() => fetch("/api/auth/me").then((r) => r.json()));
  if (!resp.success || !resp.user?.id) {
    throw new Error(`Failed to get user ID after signup: ${JSON.stringify(resp)}`);
  }
  return resp.user.id as string;
}
