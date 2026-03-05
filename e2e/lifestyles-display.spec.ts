/**
 * E2E: Lifestyle Management During Play (#455 / PR #478)
 *
 * Verifies the LifestylesDisplay component on the character sheet:
 * 1. Card renders between Drugs and Contacts sections
 * 2. Add/edit/remove lifestyle on an active character
 * 3. Pay Month with prepaid > 0 (local decrement, no API call)
 * 4. Pay Month with prepaid = 0 (deducts nuyen via gameplay API)
 *
 * Strategy: sign up a fresh test user each suite, copy the known
 * "Whisper" fixture character (active, has lifestyles + nuyen) into
 * that user's directory, run assertions, then clean up.
 *
 * Whisper fixture:
 *   id:      0bd8f72f-b5d9-45b7-a530-0c7f462257a1
 *   status:  active
 *   nuyen:   1,680
 *   lifestyles: [{ type: "low", monthlyCost: 2000, prepaidMonths: 3,
 *                  location: "Puyallup, Seattle" }]
 */

import { test, expect, type Page } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const WHISPER_ID = "0bd8f72f-b5d9-45b7-a530-0c7f462257a1";
const ORIGINAL_OWNER = "b7e99950-bbeb-40ee-9139-ae5b2e9a2a0c";
const DATA_DIR = path.resolve("data");

// ---------------------------------------------------------------------------
// File-system helpers (same pattern as magic-resonance-reduction.spec.ts)
// ---------------------------------------------------------------------------

function copyCharacterToUser(characterId: string, userId: string): void {
  const srcFile = path.join(DATA_DIR, "characters", ORIGINAL_OWNER, `${characterId}.json`);
  if (!fs.existsSync(srcFile)) return;

  const destDir = path.join(DATA_DIR, "characters", userId);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const charData = JSON.parse(fs.readFileSync(srcFile, "utf-8"));
  charData.ownerId = userId;
  fs.writeFileSync(path.join(destDir, `${characterId}.json`), JSON.stringify(charData, null, 2));
}

function readCharacterFromUser(characterId: string, userId: string): Record<string, unknown> {
  const filePath = path.join(DATA_DIR, "characters", userId, `${characterId}.json`);
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeCharacterForUser(
  characterId: string,
  userId: string,
  data: Record<string, unknown>
): void {
  const filePath = path.join(DATA_DIR, "characters", userId, `${characterId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function cleanupUserCharacters(userId: string): void {
  const destDir = path.join(DATA_DIR, "characters", userId);
  if (!fs.existsSync(destDir)) return;
  for (const file of fs.readdirSync(destDir)) {
    fs.unlinkSync(path.join(destDir, file));
  }
  fs.rmdirSync(destDir);
}

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------

async function signUpTestUser(page: Page): Promise<string> {
  const ts = Date.now();
  const rnd = Math.random().toString(36).substring(7);

  await page.goto("/signup");
  await page.locator("#email").fill(`e2e-lifestyles-${ts}-${rnd}@test.com`);
  await page.locator("#username").fill(`lstyle${ts}`.substring(0, 20));
  await page.locator("#password").fill("TestPass123!");
  await page.locator("#confirmPassword").fill("TestPass123!");
  await page.getByRole("button", { name: "Sign Up" }).click();
  await expect(page).toHaveURL("/", { timeout: 15000 });

  const resp = await page.evaluate(() => fetch("/api/auth/me").then((r) => r.json()));
  if (!resp.success || !resp.user?.id) {
    throw new Error(`Failed to get user ID after signup: ${JSON.stringify(resp)}`);
  }
  return resp.user.id as string;
}

// ---------------------------------------------------------------------------
// Page helpers
// ---------------------------------------------------------------------------

/**
 * Navigate to the character sheet and wait until the character name heading
 * is visible, confirming the page fully loaded.
 */
async function goToCharacterSheet(page: Page, characterId: string): Promise<void> {
  await page.goto(`/characters/${characterId}`);
  await expect(page.getByRole("heading", { name: "Whisper" })).toBeVisible({ timeout: 20000 });
}

/**
 * Locate the Lifestyles DisplayCard by its "Lifestyles" heading.
 * Returns the outermost card container.
 */
function getLifestylesCard(page: Page) {
  return page
    .locator("div")
    .filter({ has: page.getByRole("heading", { name: "Lifestyles", level: 3 }) })
    .first();
}

/**
 * Locate the Drugs DisplayCard.
 */
function getDrugsCard(page: Page) {
  return page
    .locator("div")
    .filter({ has: page.getByRole("heading", { name: "Drugs", level: 3 }) })
    .first();
}

/**
 * Locate the Contacts DisplayCard.
 */
function getContactsCard(page: Page) {
  return page
    .locator("div")
    .filter({ has: page.getByRole("heading", { name: "Contacts", level: 3 }) })
    .first();
}

// ---------------------------------------------------------------------------
// Test Suites
// ---------------------------------------------------------------------------

test.describe("Lifestyles Display (#455)", () => {
  let testUserId: string;

  // Bypass rate limiting on all API calls
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/**", async (route) => {
      const headers = { ...route.request().headers(), "x-e2e-bypass": "true" };
      await route.continue({ headers });
    });
  });

  test.describe("Section layout", () => {
    test.beforeEach(async ({ page }) => {
      testUserId = await signUpTestUser(page);
      copyCharacterToUser(WHISPER_ID, testUserId);
    });

    test.afterEach(() => {
      if (testUserId) cleanupUserCharacters(testUserId);
    });

    test("Lifestyles card is visible on the character sheet", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);

      const card = getLifestylesCard(page);
      await expect(card).toBeVisible();
    });

    test("Lifestyles card appears after Drugs and before Contacts in the DOM", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);

      // Collect the vertical positions of each section heading
      const drugsY = await getDrugsCard(page)
        .boundingBox()
        .then((b) => b?.y ?? 0);
      const lifestylesY = await getLifestylesCard(page)
        .boundingBox()
        .then((b) => b?.y ?? 0);
      const contactsY = await getContactsCard(page)
        .boundingBox()
        .then((b) => b?.y ?? 0);

      expect(lifestylesY).toBeGreaterThan(drugsY);
      expect(contactsY).toBeGreaterThan(lifestylesY);
    });

    test("existing Low lifestyle row is visible with cost pill", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);

      const card = getLifestylesCard(page);
      // The fixture has a "Low" tier lifestyle
      await expect(card.getByText("Low")).toBeVisible();
      // Cost pill: ¥2,000/mo (base cost for Low)
      await expect(card.getByText("¥2,000/mo")).toBeVisible();
    });

    test("prepaid months badge shows 3mo prepaid for fixture character", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);

      const card = getLifestylesCard(page);
      await expect(card.getByText("3mo prepaid")).toBeVisible();
    });

    test("location is shown on the collapsed lifestyle row", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);

      const card = getLifestylesCard(page);
      await expect(card.getByText("Puyallup, Seattle")).toBeVisible();
    });
  });

  test.describe("Expanded row and actions", () => {
    test.beforeEach(async ({ page }) => {
      testUserId = await signUpTestUser(page);
      copyCharacterToUser(WHISPER_ID, testUserId);
    });

    test.afterEach(() => {
      if (testUserId) cleanupUserCharacters(testUserId);
    });

    test("expanding a lifestyle row reveals Edit, Pay Month, and Remove buttons", async ({
      page,
    }) => {
      await goToCharacterSheet(page, WHISPER_ID);

      const card = getLifestylesCard(page);

      // Click the collapsed lifestyle row toggle button to expand it
      await card.getByRole("button", { name: /Low/i }).first().click();

      // Action buttons appear in expanded state
      await expect(card.getByRole("button", { name: "Pay Month" })).toBeVisible();
      await expect(card.getByRole("button", { name: "Edit" })).toBeVisible();
      await expect(card.getByRole("button", { name: "Remove" })).toBeVisible();
    });

    test("Notes content appears when lifestyle row is expanded", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);

      const card = getLifestylesCard(page);
      await card.getByRole("button", { name: /Low/i }).first().click();

      // Fixture notes field
      await expect(card.getByText("Spartan dojo apartment above a noodle shop")).toBeVisible();
    });
  });

  test.describe("Add lifestyle", () => {
    test.beforeEach(async ({ page }) => {
      testUserId = await signUpTestUser(page);
      // Use a copy of Whisper but strip existing lifestyles so the empty state is tested too
      copyCharacterToUser(WHISPER_ID, testUserId);
      const charData = readCharacterFromUser(WHISPER_ID, testUserId);
      writeCharacterForUser(WHISPER_ID, testUserId, {
        ...charData,
        lifestyles: [],
        nuyen: 50000,
      });
    });

    test.afterEach(() => {
      if (testUserId) cleanupUserCharacters(testUserId);
    });

    test("empty state shows add prompt when character is active", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);

      const card = getLifestylesCard(page);
      await expect(card.getByText(/No lifestyles configured/i)).toBeVisible();
      await expect(card.getByText(/Click "Add" to add a lifestyle/i)).toBeVisible();
    });

    test("clicking Add opens the lifestyle modal", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);

      const card = getLifestylesCard(page);
      await card.getByRole("button", { name: "Add" }).click();

      // Modal title
      await expect(page.getByText("New Lifestyle")).toBeVisible({ timeout: 5000 });
    });

    test("can add a Medium lifestyle via the modal", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);

      // Open modal
      const card = getLifestylesCard(page);
      await card.getByRole("button", { name: "Add" }).click();
      await expect(page.getByText("New Lifestyle")).toBeVisible({ timeout: 5000 });

      // Select lifestyle type
      await page.getByRole("combobox").first().selectOption("medium");

      // Set location
      await page
        .getByPlaceholder(/e\.g\., Downtown Seattle/i)
        .fill("Downtown Seattle, Emerald City");

      // Set prepaid months
      await page.getByLabel(/Prepaid Months/i).fill("2");

      // Save
      await page.getByRole("button", { name: "Save Lifestyle" }).click();

      // Modal closes and new lifestyle appears in the card
      await expect(page.getByText("New Lifestyle")).not.toBeVisible({ timeout: 5000 });
      await expect(card.getByText("Medium")).toBeVisible();
      await expect(card.getByText("¥5,000/mo")).toBeVisible();
      await expect(card.getByText("2mo prepaid")).toBeVisible();
      await expect(card.getByText("Downtown Seattle, Emerald City")).toBeVisible();
    });

    test("Save Lifestyle button is disabled when no type is selected", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);

      const card = getLifestylesCard(page);
      await card.getByRole("button", { name: "Add" }).click();
      await expect(page.getByText("New Lifestyle")).toBeVisible({ timeout: 5000 });

      // No type selected — button should be disabled (cursor-not-allowed class)
      const saveBtn = page.getByRole("button", { name: "Save Lifestyle" });
      await expect(saveBtn).toBeDisabled();
    });

    test("Cancel button closes the modal without adding a lifestyle", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);

      const card = getLifestylesCard(page);
      await card.getByRole("button", { name: "Add" }).click();
      await expect(page.getByText("New Lifestyle")).toBeVisible({ timeout: 5000 });

      await page.getByRole("button", { name: "Cancel" }).click();

      await expect(page.getByText("New Lifestyle")).not.toBeVisible({ timeout: 5000 });
      // Empty state is still shown
      await expect(card.getByText(/No lifestyles configured/i)).toBeVisible();
    });
  });

  test.describe("Edit lifestyle", () => {
    test.beforeEach(async ({ page }) => {
      testUserId = await signUpTestUser(page);
      copyCharacterToUser(WHISPER_ID, testUserId);
    });

    test.afterEach(() => {
      if (testUserId) cleanupUserCharacters(testUserId);
    });

    test("clicking Edit opens the modal in edit mode with existing data pre-populated", async ({
      page,
    }) => {
      await goToCharacterSheet(page, WHISPER_ID);

      const card = getLifestylesCard(page);

      // Expand the lifestyle row
      await card.getByRole("button", { name: /Low/i }).first().click();
      await card.getByRole("button", { name: "Edit" }).click();

      // Modal title indicates edit mode
      await expect(page.getByText("Edit Lifestyle")).toBeVisible({ timeout: 5000 });

      // Location field pre-populated from fixture
      const locationInput = page.getByPlaceholder(/e\.g\., Downtown Seattle/i);
      await expect(locationInput).toHaveValue("Puyallup, Seattle");
    });

    test("can update the location in edit mode and see it reflected", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);

      const card = getLifestylesCard(page);

      // Expand and click Edit
      await card.getByRole("button", { name: /Low/i }).first().click();
      await card.getByRole("button", { name: "Edit" }).click();
      await expect(page.getByText("Edit Lifestyle")).toBeVisible({ timeout: 5000 });

      // Clear and update location
      const locationInput = page.getByPlaceholder(/e\.g\., Downtown Seattle/i);
      await locationInput.fill("Redmond Barrens");

      // Save changes
      await page.getByRole("button", { name: "Save Changes" }).click();
      await expect(page.getByText("Edit Lifestyle")).not.toBeVisible({ timeout: 5000 });

      // Updated location appears in the collapsed row
      await expect(card.getByText("Redmond Barrens")).toBeVisible();
    });
  });

  test.describe("Pay Month — prepaid > 0 (local decrement)", () => {
    test.beforeEach(async ({ page }) => {
      testUserId = await signUpTestUser(page);
      copyCharacterToUser(WHISPER_ID, testUserId);
      // Fixture already has prepaidMonths: 3
    });

    test.afterEach(() => {
      if (testUserId) cleanupUserCharacters(testUserId);
    });

    test("Pay Month decrements prepaid months badge from 3mo to 2mo without API call", async ({
      page,
    }) => {
      // Track whether spendNuyen was called on the gameplay API
      let spendNuyenCalled = false;
      await page.route(`**/api/characters/${WHISPER_ID}/gameplay`, async (route) => {
        const body = route.request().postDataJSON() as { action?: string };
        if (body?.action === "spendNuyen") {
          spendNuyenCalled = true;
        }
        const headers = { ...route.request().headers(), "x-e2e-bypass": "true" };
        await route.continue({ headers });
      });

      await goToCharacterSheet(page, WHISPER_ID);

      const card = getLifestylesCard(page);

      // Expand the lifestyle row
      await card.getByRole("button", { name: /Low/i }).first().click();
      await expect(card.getByRole("button", { name: "Pay Month" })).toBeVisible();

      // Prepaid is 3 before
      await expect(card.getByText("3mo prepaid")).toBeVisible();

      // Click Pay Month
      await card.getByRole("button", { name: "Pay Month" }).click();

      // Badge should decrement to 2mo prepaid
      await expect(card.getByText("2mo prepaid")).toBeVisible({ timeout: 5000 });
      await expect(card.getByText("3mo prepaid")).not.toBeVisible();

      // No API call to spendNuyen should have been made
      expect(spendNuyenCalled).toBe(false);
    });

    test("badge disappears after paying all prepaid months", async ({ page }) => {
      // Set prepaid to 1 so one Pay Month click removes it
      const charData = readCharacterFromUser(WHISPER_ID, testUserId);
      const lifestyles = charData.lifestyles as Array<Record<string, unknown>>;
      writeCharacterForUser(WHISPER_ID, testUserId, {
        ...charData,
        lifestyles: lifestyles.map((ls, i) => (i === 0 ? { ...ls, prepaidMonths: 1 } : ls)),
      });

      await goToCharacterSheet(page, WHISPER_ID);

      const card = getLifestylesCard(page);
      await card.getByRole("button", { name: /Low/i }).first().click();

      await expect(card.getByText("1mo prepaid")).toBeVisible();
      await card.getByRole("button", { name: "Pay Month" }).click();

      // Badge should be gone (prepaidMonths becomes 0)
      await expect(card.getByText(/mo prepaid/)).not.toBeVisible({ timeout: 5000 });
    });
  });

  test.describe("Pay Month — prepaid = 0 (deducts nuyen via API)", () => {
    test.beforeEach(async ({ page }) => {
      testUserId = await signUpTestUser(page);
      copyCharacterToUser(WHISPER_ID, testUserId);
      // Set prepaid to 0, nuyen to 10,000 so the character can afford Low (¥2,000/mo)
      const charData = readCharacterFromUser(WHISPER_ID, testUserId);
      const lifestyles = charData.lifestyles as Array<Record<string, unknown>>;
      writeCharacterForUser(WHISPER_ID, testUserId, {
        ...charData,
        nuyen: 10000,
        lifestyles: lifestyles.map((ls, i) => (i === 0 ? { ...ls, prepaidMonths: 0 } : ls)),
      });
    });

    test.afterEach(() => {
      if (testUserId) cleanupUserCharacters(testUserId);
    });

    test("Pay Month with prepaid=0 calls spendNuyen gameplay API and updates nuyen balance", async ({
      page,
    }) => {
      let capturedBody: Record<string, unknown> | null = null;

      // Intercept the gameplay API to capture the request body
      await page.route(`**/api/characters/${WHISPER_ID}/gameplay`, async (route) => {
        capturedBody = route.request().postDataJSON() as Record<string, unknown>;
        const headers = { ...route.request().headers(), "x-e2e-bypass": "true" };
        await route.continue({ headers });
      });

      await goToCharacterSheet(page, WHISPER_ID);

      const card = getLifestylesCard(page);

      // Confirm initial balance displayed (10,000)
      await expect(card.getByText("¥10,000")).toBeVisible();

      // Expand and pay
      await card.getByRole("button", { name: /Low/i }).first().click();
      await card.getByRole("button", { name: "Pay Month" }).click();

      // Wait for the balance to update after API response
      await expect(card.getByText("¥8,000")).toBeVisible({ timeout: 10000 });

      // Verify the API was called with the correct action and amount
      expect(capturedBody).not.toBeNull();
      expect(capturedBody!.action).toBe("spendNuyen");
      expect(capturedBody!.amount).toBe(2000);
      expect(capturedBody!.reason).toMatch(/Lifestyle payment/i);
    });

    test("Pay Month button does nothing when nuyen is insufficient", async ({ page }) => {
      // Set nuyen below the Low lifestyle cost (¥2,000/mo)
      const charData = readCharacterFromUser(WHISPER_ID, testUserId);
      writeCharacterForUser(WHISPER_ID, testUserId, {
        ...charData,
        nuyen: 500,
      });

      let spendNuyenCalled = false;
      await page.route(`**/api/characters/${WHISPER_ID}/gameplay`, async (route) => {
        const body = route.request().postDataJSON() as { action?: string };
        if (body?.action === "spendNuyen") spendNuyenCalled = true;
        const headers = { ...route.request().headers(), "x-e2e-bypass": "true" };
        await route.continue({ headers });
      });

      await goToCharacterSheet(page, WHISPER_ID);

      const card = getLifestylesCard(page);
      await card.getByRole("button", { name: /Low/i }).first().click();

      // Low-funds warning banner should appear
      await expect(card.getByText(/Insufficient nuyen/i)).toBeVisible();

      // Pay Month still rendered but clicking it should silently fail
      await card.getByRole("button", { name: "Pay Month" }).click();

      // Balance stays unchanged and no API call made
      await expect(card.getByText("¥500")).toBeVisible();
      expect(spendNuyenCalled).toBe(false);
    });
  });

  test.describe("Remove lifestyle", () => {
    test.beforeEach(async ({ page }) => {
      testUserId = await signUpTestUser(page);
      copyCharacterToUser(WHISPER_ID, testUserId);
    });

    test.afterEach(() => {
      if (testUserId) cleanupUserCharacters(testUserId);
    });

    test("clicking Remove shows a confirm/cancel dialog", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);

      const card = getLifestylesCard(page);
      await card.getByRole("button", { name: /Low/i }).first().click();
      await card.getByRole("button", { name: "Remove" }).click();

      // Confirm and Cancel buttons appear
      await expect(card.getByRole("button", { name: "Confirm" })).toBeVisible();
      await expect(card.getByRole("button", { name: "Cancel" })).toBeVisible();

      // Original Remove button is replaced by the confirm dialog
      await expect(card.getByRole("button", { name: "Remove" })).not.toBeVisible();
    });

    test("Cancel on confirm dialog restores the Remove button", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);

      const card = getLifestylesCard(page);
      await card.getByRole("button", { name: /Low/i }).first().click();
      await card.getByRole("button", { name: "Remove" }).click();
      await card.getByRole("button", { name: "Cancel" }).click();

      // Back to normal state
      await expect(card.getByRole("button", { name: "Remove" })).toBeVisible();
      await expect(card.getByRole("button", { name: "Confirm" })).not.toBeVisible();
    });

    test("Confirming removal removes the lifestyle row from the card", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);

      const card = getLifestylesCard(page);

      // Confirm the lifestyle exists first
      await expect(card.getByText("Low")).toBeVisible();

      // Expand, Remove, Confirm
      await card.getByRole("button", { name: /Low/i }).first().click();
      await card.getByRole("button", { name: "Remove" }).click();
      await card.getByRole("button", { name: "Confirm" }).click();

      // Lifestyle row gone — empty state shown
      await expect(card.getByText(/No lifestyles configured/i)).toBeVisible({ timeout: 5000 });
      await expect(card.getByText("Low")).not.toBeVisible();
    });
  });

  test.describe("Nuyen warning banner", () => {
    test.beforeEach(async ({ page }) => {
      testUserId = await signUpTestUser(page);
      copyCharacterToUser(WHISPER_ID, testUserId);
    });

    test.afterEach(() => {
      if (testUserId) cleanupUserCharacters(testUserId);
    });

    test("warning banner shown when nuyen < total monthly cost", async ({ page }) => {
      // Whisper has nuyen=1,680 and Low lifestyle costs ¥2,000/mo — already insufficient
      await goToCharacterSheet(page, WHISPER_ID);

      const card = getLifestylesCard(page);
      await expect(card.getByText(/Insufficient nuyen for monthly lifestyle costs/i)).toBeVisible();
    });

    test("no warning banner when nuyen >= total monthly cost", async ({ page }) => {
      // Give enough nuyen to cover the lifestyle
      const charData = readCharacterFromUser(WHISPER_ID, testUserId);
      writeCharacterForUser(WHISPER_ID, testUserId, {
        ...charData,
        nuyen: 5000,
      });

      await goToCharacterSheet(page, WHISPER_ID);

      const card = getLifestylesCard(page);
      await expect(card.getByText(/Insufficient nuyen/i)).not.toBeVisible();
    });
  });
});
