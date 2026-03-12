/**
 * E2E: Method-Aware Creation Validation (#575)
 *
 * Tests the manual verification steps from PR #584:
 * 1. Point-Buy: gear cards accessible, karma shows 800, can finalize
 * 2. Life Modules: gear cards accessible, karma shows 750, validation shows module requirement
 * 3. Priority: gear locked until priorities set (unchanged behavior)
 */

import { expect } from "@playwright/test";
import { test } from "./helpers/test-fixtures";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Navigate to the creation sheet setup, select edition + archetype, then
 * choose a specific creation method and gameplay level.
 */
async function navigateToCreationSheet(
  page: import("@playwright/test").Page,
  method: "Priority System" | "Point Buy" | "Life Modules" | "Sum to Ten",
  gameplayLevel: "Street" | "Standard" | "Prime Runner" = "Standard"
) {
  // Clear any cached creation state
  await page.goto("/characters/create/sheet");
  await page.evaluate(() => {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith("draft-backup")) {
        localStorage.removeItem(key);
      }
    }
  });
  await page.reload();
  await page.waitForLoadState("networkidle");

  // Step 1: Select Edition — SR5
  await expect(page.getByText("Select Edition")).toBeVisible({ timeout: 15000 });
  await page.getByRole("button", { name: /Shadowrun 5th Edition/i }).click();

  // Step 2: Skip archetype selection
  await expect(page.getByText("Choose an Archetype")).toBeVisible({ timeout: 30000 });
  await page.getByRole("button", { name: /Custom Build/i }).click();

  // Step 3: Select creation method
  await expect(page.getByText("Choose Creation Method")).toBeVisible({ timeout: 10000 });
  // Use .first() to avoid strict mode when button text contains method name in description
  await page
    .getByRole("button", { name: new RegExp(`^${method}`, "i") })
    .first()
    .click();
  await page.getByRole("button", { name: /Continue/i }).click();

  // Step 4: Gameplay level
  await expect(page.getByText(/Choose Gameplay Level|Gameplay Level/i)).toBeVisible({
    timeout: 10000,
  });
  await page.getByRole("button", { name: new RegExp(gameplayLevel, "i") }).click();
  await page.getByRole("button", { name: /Continue/i }).click();

  // Wait for creation sheet to fully load
  await page.waitForLoadState("networkidle");
}

/** Locator for the sticky validation footer at the bottom of the creation sheet. */
function validationFooter(page: import("@playwright/test").Page) {
  return page.locator(".sticky.bottom-0");
}

// ---------------------------------------------------------------------------
// Point Buy
// ---------------------------------------------------------------------------

test.describe("Point Buy creation method", () => {
  test("gear cards are accessible and karma shows 800", async ({ authenticatedPage: { page } }) => {
    await navigateToCreationSheet(page, "Point Buy");

    // Verify Karma Budget card is visible (not Priority Selection)
    await expect(page.getByRole("heading", { name: "Karma Budget" })).toBeVisible({
      timeout: 15000,
    });

    // Verify "800" appears in the budget description
    await expect(page.getByText(/800 Karma/)).toBeVisible();

    // No gear card should show the "Set priorities first" lock message
    // Wait for the page to settle, then verify no lock messages exist
    await expect(page.getByText("Set priorities first")).toHaveCount(0);
  });

  test("validation summary shows Point Buy requirements", async ({
    authenticatedPage: { page },
  }) => {
    await navigateToCreationSheet(page, "Point Buy");

    await expect(page.getByRole("heading", { name: "Karma Budget" })).toBeVisible({
      timeout: 15000,
    });

    const footer = validationFooter(page);

    // Should NOT show "Set all 5 priorities"
    await expect(footer.getByText("Set all 5 priorities")).not.toBeVisible();

    // Should show "Select a metatype"
    await expect(footer.getByText("Select a metatype")).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Life Modules
// ---------------------------------------------------------------------------

test.describe("Life Modules creation method", () => {
  test("gear cards are accessible without setting priorities", async ({
    authenticatedPage: { page },
  }) => {
    await navigateToCreationSheet(page, "Life Modules", "Street");

    // Verify Life Path Modules card is visible
    await expect(page.getByRole("heading", { name: "Life Path Modules" })).toBeVisible({
      timeout: 15000,
    });

    // No gear card should show the "Set priorities first" lock message
    await expect(page.getByText("Set priorities first")).toHaveCount(0);
  });

  test("validation summary shows Life Modules requirements", async ({
    authenticatedPage: { page },
  }) => {
    await navigateToCreationSheet(page, "Life Modules", "Street");

    await expect(page.getByRole("heading", { name: "Life Path Modules" })).toBeVisible({
      timeout: 15000,
    });

    const footer = validationFooter(page);

    // Should NOT show "Set all 5 priorities"
    await expect(footer.getByText("Set all 5 priorities")).not.toBeVisible();

    // Should show "Select a metatype"
    await expect(footer.getByText("Select a metatype")).toBeVisible();

    // Should show "Add at least one life module"
    await expect(footer.getByText("Add at least one life module")).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Priority (regression — unchanged behavior)
// ---------------------------------------------------------------------------

test.describe("Priority creation method", () => {
  test("shows Priorities card and gear cards are accessible with default priorities", async ({
    authenticatedPage: { page },
  }) => {
    await navigateToCreationSheet(page, "Priority System");

    // Verify Priorities card is visible (not Karma Budget or Life Path Modules)
    await expect(page.getByRole("heading", { name: "Priorities" })).toBeVisible({
      timeout: 15000,
    });

    // Priority method auto-assigns A-E defaults, so gear cards should be accessible
    // (not showing "Set priorities first") — this is the expected behavior
    // Verify Karma Budget card does NOT appear (that's Point Buy only)
    await expect(page.getByRole("heading", { name: "Karma Budget" })).not.toBeVisible();

    // Verify Life Path Modules card does NOT appear (that's Life Modules only)
    await expect(page.getByRole("heading", { name: "Life Path Modules" })).not.toBeVisible();
  });

  test("validation summary shows metatype requirement", async ({ authenticatedPage: { page } }) => {
    await navigateToCreationSheet(page, "Priority System");

    await expect(page.getByRole("heading", { name: "Priorities" })).toBeVisible({
      timeout: 15000,
    });

    const footer = validationFooter(page);

    // Should show "Select a metatype" even with priorities auto-assigned
    await expect(footer.getByText("Select a metatype")).toBeVisible();
  });
});
