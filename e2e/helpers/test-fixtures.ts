/**
 * Extended Playwright `test` with custom E2E fixtures.
 *
 * Usage:
 *   import { test, expect } from "./helpers/test-fixtures";
 *
 *   test("my test", async ({ authenticatedPage: { page, userId } }) => {
 *     // page already has rate-limit bypass + a logged-in user
 *   });
 */

/* eslint-disable react-hooks/rules-of-hooks -- Playwright fixture `use` is not a React hook */
import { test as base, type Page } from "@playwright/test";
import { signUpTestUser, setupRateLimitBypass } from "./auth";

type E2EFixtures = {
  /** Page with rate-limit bypass already configured. */
  e2ePage: Page;
  /** Authenticated page + userId (creates a fresh user and logs in). */
  authenticatedPage: { page: Page; userId: string };
};

export const test = base.extend<E2EFixtures>({
  e2ePage: async ({ page }, use) => {
    await setupRateLimitBypass(page);
    await use(page);
  },
  authenticatedPage: async ({ page }, use) => {
    await setupRateLimitBypass(page);
    const userId = await signUpTestUser(page);
    await use({ page, userId });
  },
});

export { expect } from "@playwright/test";
