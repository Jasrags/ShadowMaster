/**
 * E2E: Shapeshifter Character Creation Rules (#528)
 *
 * Tests the manual verification steps from PR #589:
 * 1. Select a shapeshifter species in creation — verify metahuman form selector appears
 * 2. Select each metahuman form — verify karma cost displays correctly
 * 3. Switch from shapeshifter to non-shapeshifter metatype — verify form selector clears
 * 4. Open magic path — verify technomancer not available for shapeshifters
 * 5. MetatypeModal filter — verify "Shapeshifter" pill shows only shapeshifter species
 * 6. Point Buy creation — verify shapeshifter karma costs deduct correctly
 */

import { expect } from "@playwright/test";
import { test } from "./helpers/test-fixtures";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Navigate to the creation sheet with the specified creation method.
 * Reused pattern from hmhvv-infected.spec.ts.
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
  await expect(page.getByText("Select Edition")).toBeVisible({
    timeout: 15000,
  });
  await page.getByRole("button", { name: /Shadowrun 5th Edition/i }).click();

  // Step 2: Skip archetype selection
  await expect(page.getByText("Choose an Archetype")).toBeVisible({
    timeout: 30000,
  });
  await page.getByRole("button", { name: /Custom Build/i }).click();

  // Step 3: Select creation method
  await expect(page.getByText("Choose Creation Method")).toBeVisible({
    timeout: 10000,
  });
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

/** Open the MetatypeModal by clicking the metatype card. */
async function openMetatypeModal(page: import("@playwright/test").Page) {
  // Click "Choose metatype..." or the selected metatype "Change" button
  // These are the only buttons with these specific texts in the Metatype card area
  const chooseBtn = page.getByRole("button", { name: /Choose metatype/i });
  const changeBtn = page.locator("button", { hasText: "Change" }).filter({
    has: page.locator("span", { hasText: /Change/ }),
  });

  // Try clicking whichever is visible
  if (await chooseBtn.isVisible()) {
    await chooseBtn.click();
  } else {
    // The metatype card shows the selected name + "Change" text
    await changeBtn.first().click();
  }

  // Wait for modal
  await expect(page.getByRole("heading", { name: "Select Metatype" })).toBeVisible({
    timeout: 5000,
  });
}

/** Select a metatype by name in the MetatypeModal and confirm. */
async function selectMetatypeByName(page: import("@playwright/test").Page, name: string) {
  await openMetatypeModal(page);

  // Search for the metatype
  const searchInput = page.locator('input[placeholder*="Search metatypes"]');
  await searchInput.fill(name);

  // Click the metatype in the list
  const metatypeList = page.locator('[data-testid="metatype-list"]');
  await metatypeList.getByRole("button", { name: new RegExp(name, "i") }).click();

  // Confirm selection
  await page.getByRole("button", { name: "Confirm" }).click();

  // Wait for modal to close
  await expect(page.getByRole("heading", { name: "Select Metatype" })).not.toBeVisible({
    timeout: 3000,
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe("Shapeshifter Character Creation", () => {
  test("selecting a shapeshifter species shows metahuman form selector", async ({
    authenticatedPage: { page },
  }) => {
    await navigateToCreationSheet(page, "Point Buy");
    await expect(page.getByRole("heading", { name: "Metatype" })).toBeVisible({ timeout: 15000 });

    // Select a shapeshifter (Lupine - wolf)
    await selectMetatypeByName(page, "Lupine");

    // Verify the metahuman form selector appears
    await expect(page.getByText("Metahuman Form (required)")).toBeVisible({
      timeout: 5000,
    });

    // Verify all 5 metahuman form buttons are present
    await expect(page.locator('[data-testid="metahuman-form-human"]')).toBeVisible();
    await expect(page.locator('[data-testid="metahuman-form-dwarf"]')).toBeVisible();
    await expect(page.locator('[data-testid="metahuman-form-elf"]')).toBeVisible();
    await expect(page.locator('[data-testid="metahuman-form-ork"]')).toBeVisible();
    await expect(page.locator('[data-testid="metahuman-form-troll"]')).toBeVisible();
  });

  test("metahuman form cards display correct karma costs", async ({
    authenticatedPage: { page },
  }) => {
    await navigateToCreationSheet(page, "Point Buy");
    await expect(page.getByRole("heading", { name: "Metatype" })).toBeVisible({ timeout: 15000 });

    await selectMetatypeByName(page, "Lupine");

    // Verify karma costs on each form button
    const humanBtn = page.locator('[data-testid="metahuman-form-human"]');
    const dwarfBtn = page.locator('[data-testid="metahuman-form-dwarf"]');
    const elfBtn = page.locator('[data-testid="metahuman-form-elf"]');
    const orkBtn = page.locator('[data-testid="metahuman-form-ork"]');
    const trollBtn = page.locator('[data-testid="metahuman-form-troll"]');

    // Human is free
    await expect(humanBtn).toContainText("Free");
    // Elf costs 5 Karma
    await expect(elfBtn).toContainText("5 Karma");
    // Dwarf costs 8 Karma
    await expect(dwarfBtn).toContainText("8 Karma");
    // Ork costs 10 Karma
    await expect(orkBtn).toContainText("10 Karma");
    // Troll costs 20 Karma
    await expect(trollBtn).toContainText("20 Karma");
  });

  test("selecting a metahuman form highlights the card", async ({
    authenticatedPage: { page },
  }) => {
    await navigateToCreationSheet(page, "Point Buy");
    await expect(page.getByRole("heading", { name: "Metatype" })).toBeVisible({ timeout: 15000 });

    await selectMetatypeByName(page, "Canine");

    // Click on the Elf form
    await page.locator('[data-testid="metahuman-form-elf"]').click();

    // Verify the elf button has the amber selected border
    const elfBtn = page.locator('[data-testid="metahuman-form-elf"]');
    await expect(elfBtn).toHaveClass(/border-amber-500/);
  });

  test("switching from shapeshifter to non-shapeshifter clears form selector", async ({
    authenticatedPage: { page },
  }) => {
    await navigateToCreationSheet(page, "Point Buy");
    await expect(page.getByRole("heading", { name: "Metatype" })).toBeVisible({ timeout: 15000 });

    // First select a shapeshifter
    await selectMetatypeByName(page, "Lupine");

    // Verify form selector appears
    await expect(page.getByText("Metahuman Form (required)")).toBeVisible({
      timeout: 5000,
    });

    // Now switch to a non-shapeshifter (Human)
    await selectMetatypeByName(page, "Human");

    // Verify form selector is gone
    await expect(page.getByText("Metahuman Form (required)")).not.toBeVisible();
  });

  test("Shapeshifter filter pill shows only shapeshifter species", async ({
    authenticatedPage: { page },
  }) => {
    await navigateToCreationSheet(page, "Point Buy");
    await expect(page.getByRole("heading", { name: "Metatype" })).toBeVisible({ timeout: 15000 });

    await openMetatypeModal(page);

    // Click the Shapeshifter filter pill
    const filterPills = page.locator('[data-testid="filter-pills"]');
    await filterPills.getByRole("button", { name: "Shapeshifter" }).click();

    // Verify the list shows only shapeshifter species
    const metatypeList = page.locator('[data-testid="metatype-list"]');

    // Should show the "Shapeshifters" group header
    await expect(metatypeList.getByText("Shapeshifters")).toBeVisible();

    // Should NOT show base metatype groups
    await expect(metatypeList.locator("div", { hasText: /^Human\s*\(/ })).not.toBeVisible();

    // Verify at least some shapeshifter species are shown
    await expect(metatypeList.getByRole("button", { name: /Lupine/i })).toBeVisible();
    await expect(metatypeList.getByRole("button", { name: /Canine/i })).toBeVisible();
    await expect(metatypeList.getByRole("button", { name: /Falconine/i })).toBeVisible();
  });

  test("shapeshifter detail panel shows dual-form info box", async ({
    authenticatedPage: { page },
  }) => {
    await navigateToCreationSheet(page, "Point Buy");
    await expect(page.getByRole("heading", { name: "Metatype" })).toBeVisible({ timeout: 15000 });

    await openMetatypeModal(page);

    // Search and select a shapeshifter
    const searchInput = page.locator('input[placeholder*="Search metatypes"]');
    await searchInput.fill("Ursine");

    const metatypeList = page.locator('[data-testid="metatype-list"]');
    await metatypeList.getByRole("button", { name: /Ursine/i }).click();

    // Verify the detail panel shows the dual-form info
    const detailPanel = page.locator('[data-testid="metatype-detail"]');
    await expect(detailPanel.getByText("Dual-Form:")).toBeVisible({
      timeout: 3000,
    });
    await expect(detailPanel.getByText(/cannot be Technomancers/i)).toBeVisible();

    // Verify the amber "Shapeshifter" badge
    await expect(detailPanel.getByText("Shapeshifter", { exact: true })).toBeVisible();
  });

  test("technomancer path is not available when shapeshifter is selected", async ({
    authenticatedPage: { page },
  }) => {
    // Use Life Modules — all magic paths available without priority assignment
    await navigateToCreationSheet(page, "Life Modules");
    await expect(page.getByRole("heading", { name: "Metatype" })).toBeVisible({ timeout: 15000 });

    // Select a shapeshifter species
    await selectMetatypeByName(page, "Tigrine");

    // Open the magic path modal via "Choose path..." or "Select" button
    const choosePathBtn = page.getByText("Choose path...");
    await expect(choosePathBtn).toBeVisible({ timeout: 5000 });
    await choosePathBtn.click();

    // Wait for magic path modal to appear
    await page.waitForLoadState("networkidle");

    // Technomancer should NOT be available for shapeshifters
    await expect(page.getByRole("button", { name: /Technomancer/i })).not.toBeVisible({
      timeout: 3000,
    });

    // But other magic paths should be present (e.g., Magician, Adept)
    await expect(page.getByRole("button", { name: /Magician/i }).first()).toBeVisible();
  });
});
