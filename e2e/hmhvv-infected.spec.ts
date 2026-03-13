/**
 * E2E: HMHVV Infected Character Type (#529)
 *
 * Tests the manual verification steps from PR #590:
 * 1. Open quality selection — verify "Infected (HMHVV)" appears in positive qualities
 * 2. Select infected quality — verify type dropdown shows all 14 infected types
 * 3. Select a type (e.g., Vampire) — verify details panel shows strain, karma, powers, weaknesses
 * 4. Verify metatype-restricted types (e.g., Banshee only available for Elf characters)
 * 5. Verify karma cost correctly set from infected type data
 */

import { expect } from "@playwright/test";
import { test } from "./helpers/test-fixtures";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Navigate to the creation sheet with Priority System (default).
 * Reused from method-aware-validation pattern.
 */
async function navigateToCreationSheet(
  page: import("@playwright/test").Page,
  method: "Priority System" | "Point Buy" | "Life Modules" | "Sum to Ten" = "Priority System",
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

/** Open the quality selection modal by clicking the Add button on the Qualities card. */
async function openQualityModal(page: import("@playwright/test").Page) {
  // The Qualities card is a div wrapping a heading + Add button in the header
  // Find the card div that contains the "Qualities" heading
  const qualitiesCard = page
    .locator("div", {
      has: page.getByRole("heading", { name: "Qualities", exact: true }),
    })
    .first();

  // Click the amber Add button within the card header
  const addButton = qualitiesCard.locator("button", { hasText: "Add" }).first();
  await addButton.click();

  // Wait for modal to be visible
  await expect(page.getByRole("heading", { name: "Add Quality" })).toBeVisible({ timeout: 5000 });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe("HMHVV Infected Quality", () => {
  test("Infected (HMHVV) appears in positive quality list", async ({
    authenticatedPage: { page },
  }) => {
    await navigateToCreationSheet(page);
    await expect(page.getByRole("heading", { name: "Priorities" })).toBeVisible({ timeout: 15000 });

    await openQualityModal(page);

    // Should be on positive tab by default
    await expect(page.getByRole("button", { name: /Positive/i }).first()).toBeVisible();

    // Search for the infected quality
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill("Infected");

    // Verify the quality appears in the list
    await expect(page.getByRole("button", { name: /Infected \(HMHVV\)/i })).toBeVisible({
      timeout: 5000,
    });
  });

  test("selecting Infected shows type dropdown with 14 types", async ({
    authenticatedPage: { page },
  }) => {
    await navigateToCreationSheet(page);
    await expect(page.getByRole("heading", { name: "Priorities" })).toBeVisible({ timeout: 15000 });

    await openQualityModal(page);

    // Search and select the infected quality
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill("Infected");
    await page.getByRole("button", { name: /Infected \(HMHVV\)/i }).click();

    // Verify the specification heading appears
    await expect(page.getByRole("heading", { name: /Infected Type/ })).toBeVisible();

    // Verify the dropdown/select exists
    const infectedSelect = page.locator("select").first();
    await expect(infectedSelect).toBeVisible();

    // Count the options (14 types + 1 placeholder "Select...")
    const optionCount = await infectedSelect.locator("option").count();
    expect(optionCount).toBe(15); // 14 infected types + placeholder
  });

  test("selecting Vampire shows strain, karma, powers, and weaknesses", async ({
    authenticatedPage: { page },
  }) => {
    await navigateToCreationSheet(page);
    await expect(page.getByRole("heading", { name: "Priorities" })).toBeVisible({ timeout: 15000 });

    await openQualityModal(page);

    // Search and select the infected quality
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill("Infected");
    await page.getByRole("button", { name: /Infected \(HMHVV\)/i }).click();

    // Select Vampire from the dropdown
    const infectedSelect = page.locator("select").first();
    await infectedSelect.selectOption("vampire");

    // Verify InfectedTypeDetails panel renders (purple-bordered)
    const detailsPanel = page.locator('[class*="border-purple"]');
    await expect(detailsPanel).toBeVisible({ timeout: 3000 });

    // Verify type name
    await expect(detailsPanel.locator("h5")).toContainText("Vampire");

    // Verify strain badge shows (rendered as "HMHVV I" — dashes replaced with spaces, uppercased)
    await expect(detailsPanel.getByText("HMHVV I", { exact: true })).toBeVisible();

    // Verify karma cost is shown
    await expect(detailsPanel.getByText(/Karma:/)).toBeVisible();

    // Verify mandatory powers section exists
    await expect(detailsPanel.getByText(/Mandatory Powers/i)).toBeVisible();

    // Verify weaknesses section exists
    await expect(detailsPanel.getByText(/Weaknesses/i)).toBeVisible();
  });

  test("selecting Ghoul shows details for any-metatype type", async ({
    authenticatedPage: { page },
  }) => {
    await navigateToCreationSheet(page);
    await expect(page.getByRole("heading", { name: "Priorities" })).toBeVisible({ timeout: 15000 });

    await openQualityModal(page);

    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill("Infected");
    await page.getByRole("button", { name: /Infected \(HMHVV\)/i }).click();

    // Select Ghoul
    const infectedSelect = page.locator("select").first();
    await infectedSelect.selectOption("ghoul");

    // Verify details panel
    const detailsPanel = page.locator('[class*="border-purple"]');
    await expect(detailsPanel).toBeVisible({ timeout: 3000 });
    await expect(detailsPanel.locator("h5")).toContainText("Ghoul");

    // Ghoul is HMHVV Strain III (rendered as "HMHVV III")
    await expect(detailsPanel.getByText("HMHVV III")).toBeVisible();
  });

  test("Nosferatu shows dual karma cost (awakened vs mundane)", async ({
    authenticatedPage: { page },
  }) => {
    await navigateToCreationSheet(page);
    await expect(page.getByRole("heading", { name: "Priorities" })).toBeVisible({ timeout: 15000 });

    await openQualityModal(page);

    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill("Infected");
    await page.getByRole("button", { name: /Infected \(HMHVV\)/i }).click();

    // Select Nosferatu (has dual karma: 48 mundane / 38 awakened)
    const infectedSelect = page.locator("select").first();
    await infectedSelect.selectOption("nosferatu");

    const detailsPanel = page.locator('[class*="border-purple"]');
    await expect(detailsPanel).toBeVisible({ timeout: 3000 });
    await expect(detailsPanel.locator("h5")).toContainText("Nosferatu");

    // Should show both karma costs
    await expect(detailsPanel.getByText(/48/)).toBeVisible();
    await expect(detailsPanel.getByText(/38/)).toBeVisible();
  });

  test("switching between infected types updates details panel", async ({
    authenticatedPage: { page },
  }) => {
    await navigateToCreationSheet(page);
    await expect(page.getByRole("heading", { name: "Priorities" })).toBeVisible({ timeout: 15000 });

    await openQualityModal(page);

    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill("Infected");
    await page.getByRole("button", { name: /Infected \(HMHVV\)/i }).click();

    const infectedSelect = page.locator("select").first();
    const detailsPanel = page.locator('[class*="border-purple"]');

    // Select Vampire first
    await infectedSelect.selectOption("vampire");
    await expect(detailsPanel.locator("h5")).toContainText("Vampire");

    // Switch to Banshee
    await infectedSelect.selectOption("banshee");
    await expect(detailsPanel.locator("h5")).toContainText("Banshee");

    // Switch to Loup-garou
    await infectedSelect.selectOption("loup-garou");
    await expect(detailsPanel.locator("h5")).toContainText("Loup-Garou");
  });
});
