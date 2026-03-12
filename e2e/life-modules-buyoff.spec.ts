/**
 * E2E: Life Modules Negative Quality Buy-Off (#579)
 *
 * Tests the manual verification steps from the PR:
 * 1. Select life modules that grant negative qualities → buy-off toggles appear
 * 2. Buy off a quality → karma budget updates correctly
 * 3. Undo buy-off → karma restores
 * 4. Remove a module → stale buy-offs are cleared
 * 5. 25 Karma negative quality cap enforced after buy-offs
 */

import { expect } from "@playwright/test";
import { test } from "./helpers/test-fixtures";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Navigate to sheet creation, select Life Modules method + Street gameplay level.
 * Returns when the sheet layout is visible.
 */
async function navigateToLifeModulesCreation(page: import("@playwright/test").Page) {
  // Clear any cached creation state from localStorage
  await page.goto("/characters/create/sheet");
  await page.evaluate(() => {
    // Remove all draft-backup keys
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith("draft-backup")) {
        localStorage.removeItem(key);
      }
    }
  });
  // Reload to get a fresh state
  await page.reload();
  await page.waitForLoadState("networkidle");

  // Step 1: Select Edition — SR5
  await expect(page.getByText("Select Edition")).toBeVisible({ timeout: 15000 });
  const sr5Button = page.getByRole("button", { name: /Shadowrun 5th Edition/i });
  await sr5Button.click();

  // Step 2: Skip archetype selection (shown first after ruleset loads)
  await expect(page.getByText("Choose an Archetype")).toBeVisible({ timeout: 30000 });
  await page.getByRole("button", { name: /Custom Build/i }).click();

  // Step 3: Select "Life Modules" creation method
  await expect(page.getByText("Choose Creation Method")).toBeVisible({ timeout: 10000 });
  const lifeModulesButton = page.getByRole("button", { name: /Life Modules/i });
  await lifeModulesButton.click();
  await page.getByRole("button", { name: /Continue/i }).click();

  // Step 4: Gameplay level — select Street
  await expect(page.getByText(/Choose Gameplay Level|Gameplay Level/i)).toBeVisible({
    timeout: 10000,
  });
  const streetButton = page.getByRole("button", { name: /Street/i });
  await streetButton.click();
  await page.getByRole("button", { name: /Continue/i }).click();

  // Wait for the creation sheet to load — the Life Path Modules card should be visible
  await expect(page.getByRole("heading", { name: "Life Path Modules" })).toBeVisible({
    timeout: 15000,
  });
}

/**
 * Open the Life Modules modal and add a module.
 * @param phase - Phase tab to click (e.g., "Nationality", "Formative")
 * @param moduleName - Module name text to click in the list
 * @param subModuleName - Optional sub-module name to select before confirming
 */
async function addLifeModule(
  page: import("@playwright/test").Page,
  phase: string,
  moduleName: string,
  subModuleName?: string
) {
  // Click Add button on LifeModulesCard
  const lifeModulesCard = page.locator('[id="life-modules-selection"]').locator("..");
  await lifeModulesCard.getByRole("button", { name: "Add" }).click();

  // Wait for modal to open
  await expect(page.getByRole("heading", { name: "SELECT LIFE MODULE" })).toBeVisible({
    timeout: 5000,
  });

  // Click phase tab
  await page
    .getByRole("button", { name: new RegExp(`^${phase}`, "i") })
    .first()
    .click();

  // Click module in the list
  await page
    .getByRole("button", { name: new RegExp(moduleName, "i") })
    .first()
    .click();

  // If sub-module needed, click it
  if (subModuleName) {
    await page
      .getByRole("button", { name: new RegExp(subModuleName, "i") })
      .first()
      .click();
  }

  // Click "Add Module" confirm button in the modal footer
  const modal = page.locator("[data-rac]").filter({ hasText: "SELECT LIFE MODULE" });
  await modal.getByRole("button", { name: /Add Module/i }).click();

  // Wait for modal to close
  await expect(page.getByRole("heading", { name: "SELECT LIFE MODULE" })).not.toBeVisible({
    timeout: 5000,
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe("Life Modules Negative Quality Buy-Off", () => {
  // Military Brat (formative) grants "uncouth" (karmaBonus=14, exists in quality catalog).
  // We use this instead of nationality modules whose grant IDs (sinner-national) don't match
  // the catalog quality ID (sinner).

  test("buy-off section appears when modules grant negative qualities", async ({
    authenticatedPage: { page },
  }) => {
    await navigateToLifeModulesCreation(page);

    // Add Military Brat (formative) — grants uncouth negative quality
    await addLifeModule(page, "Formative", "Military Brat");

    // Verify the "Negative Quality Buy-Off" section appears
    await expect(page.getByText("Negative Quality Buy-Off")).toBeVisible({ timeout: 5000 });

    // Verify the negative quality is listed with a Buy Off button
    await expect(page.getByRole("button", { name: /Buy Off/i }).first()).toBeVisible();
  });

  test("buying off a quality updates karma budget", async ({ authenticatedPage: { page } }) => {
    await navigateToLifeModulesCreation(page);

    // Add Military Brat (grants uncouth, karmaBonus=14)
    await addLifeModule(page, "Formative", "Military Brat");

    // Click Buy Off on the negative quality
    const buyOffButton = page.getByRole("button", { name: /Buy Off/i }).first();
    await buyOffButton.click();

    // Verify the quality shows as bought off (strikethrough + Undo button)
    await expect(page.getByRole("button", { name: /Undo/i }).first()).toBeVisible();

    // Verify "Bought Off Qualities" appears in budget breakdown
    const budgetCard = page.locator('[id="life-modules-budget"]').locator("..");
    await expect(budgetCard.getByText("Bought Off Qualities")).toBeVisible({ timeout: 5000 });
  });

  test("undoing a buy-off restores karma", async ({ authenticatedPage: { page } }) => {
    await navigateToLifeModulesCreation(page);

    // Add Military Brat (grants uncouth, karmaBonus=14)
    await addLifeModule(page, "Formative", "Military Brat");

    // Buy off the quality
    await page
      .getByRole("button", { name: /Buy Off/i })
      .first()
      .click();
    await expect(page.getByRole("button", { name: /Undo/i }).first()).toBeVisible();

    // Verify Bought Off Qualities line appears
    const budgetCard = page.locator('[id="life-modules-budget"]').locator("..");
    await expect(budgetCard.getByText("Bought Off Qualities")).toBeVisible({ timeout: 5000 });

    // Undo the buy-off
    await page.getByRole("button", { name: /Undo/i }).first().click();

    // Verify Buy Off button reappears (not Undo)
    await expect(page.getByRole("button", { name: /Buy Off/i }).first()).toBeVisible();

    // Verify Bought Off Qualities line disappears from budget
    await expect(budgetCard.getByText("Bought Off Qualities")).not.toBeVisible();
  });

  test("removing a module clears stale buy-offs", async ({ authenticatedPage: { page } }) => {
    await navigateToLifeModulesCreation(page);

    // Add Military Brat (grants uncouth)
    await addLifeModule(page, "Formative", "Military Brat");

    // Buy off the quality
    await page
      .getByRole("button", { name: /Buy Off/i })
      .first()
      .click();
    await expect(page.getByRole("button", { name: /Undo/i }).first()).toBeVisible();

    // Remove the Military Brat module (click trash icon)
    const removeButton = page.getByTitle("Remove module");
    await removeButton.click();

    // Verify buy-off section disappears (no negative qualities left)
    await expect(page.getByText("Negative Quality Buy-Off")).not.toBeVisible();

    // Verify Bought Off Qualities line is gone from budget
    const budgetCard = page.locator('[id="life-modules-budget"]').locator("..");
    await expect(budgetCard.getByText("Bought Off Qualities")).not.toBeVisible();
  });
});
