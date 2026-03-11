/**
 * E2E: Lifestyle Management During Play (#455 / PR #478)
 *
 * Verifies the LifestylesDisplay component on the character sheet:
 * 1. Card renders on the character sheet
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

import { test, expect, type Page, type Locator } from "@playwright/test";
import { signUpTestUser, setupRateLimitBypass } from "./helpers/auth";
import {
  WHISPER_ID,
  copyCharacterToUser,
  readCharacterFromUser,
  writeCharacterForUser,
  cleanupUserCharacters,
} from "./helpers/fixtures";

// ---------------------------------------------------------------------------
// Page helpers
// ---------------------------------------------------------------------------

async function goToCharacterSheet(page: Page, characterId: string): Promise<void> {
  await page.goto(`/characters/${characterId}`);
  await expect(page.getByRole("heading", { name: "Whisper" })).toBeVisible({ timeout: 20000 });
}

/**
 * Locate the Lifestyles section using data-testid (scoped precisely to that card).
 */
function getLifestylesCard(page: Page): Locator {
  return page.getByTestId("sheet-lifestyles");
}

/**
 * Click the lifestyle row toggle button to expand it.
 * The toggle button contains the cost pill text.
 */
async function expandLifestyleRow(card: Locator): Promise<void> {
  const rowButton = card.locator("button").filter({ hasText: "¥2,000/mo" }).first();
  await rowButton.click();
}

// ---------------------------------------------------------------------------
// Test Suites — run only on chromium (webkit not installed)
// ---------------------------------------------------------------------------

test.describe("Lifestyles Display (#455)", () => {
  // Skip webkit since it's not installed in this environment
  test.skip(({ browserName }) => browserName === "webkit", "WebKit not installed");

  let testUserId: string;

  // Bypass rate limiting on all API calls
  test.beforeEach(async ({ page }) => {
    await setupRateLimitBypass(page);
  });

  test.describe("Section layout", () => {
    test.beforeEach(async ({ page }) => {
      testUserId = await signUpTestUser(page, "e2e-lifestyles");
      copyCharacterToUser(WHISPER_ID, testUserId);
    });

    test.afterEach(() => {
      if (testUserId) cleanupUserCharacters(testUserId);
    });

    test("Lifestyles card is visible on the character sheet", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);
      await expect(getLifestylesCard(page)).toBeVisible();
    });

    test("Lifestyles card renders before Contacts in the right column", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);

      const lifestylesCard = getLifestylesCard(page);
      await expect(lifestylesCard).toBeVisible();

      const lifestylesY = await lifestylesCard.boundingBox().then((b) => b?.y ?? 0);
      const contactsHeading = page.getByRole("heading", { name: "Contacts", level: 3 });
      await expect(contactsHeading).toBeVisible();
      const contactsY = await contactsHeading.boundingBox().then((b) => b?.y ?? 0);

      expect(contactsY).toBeGreaterThan(lifestylesY);
    });

    test("existing Low lifestyle row shows tier badge and cost pill", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);

      const card = getLifestylesCard(page);
      await expect(card.getByText("Low", { exact: true })).toBeVisible();
      await expect(card.getByText("¥2,000/mo").first()).toBeVisible();
    });

    test("prepaid months badge shows 3mo prepaid", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);
      await expect(getLifestylesCard(page).getByText("3mo prepaid")).toBeVisible();
    });

    test("location is shown on the collapsed lifestyle row", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);
      await expect(getLifestylesCard(page).getByText("Puyallup, Seattle")).toBeVisible();
    });
  });

  test.describe("Expanded row and actions", () => {
    test.beforeEach(async ({ page }) => {
      testUserId = await signUpTestUser(page, "e2e-lifestyles");
      copyCharacterToUser(WHISPER_ID, testUserId);
    });

    test.afterEach(() => {
      if (testUserId) cleanupUserCharacters(testUserId);
    });

    test("expanding reveals Edit, Pay Month, and Remove buttons", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);
      const card = getLifestylesCard(page);
      await expandLifestyleRow(card);

      await expect(card.getByRole("button", { name: "Pay Month" })).toBeVisible();
      await expect(card.getByRole("button", { name: "Edit" })).toBeVisible();
      await expect(card.getByRole("button", { name: "Remove" })).toBeVisible();
    });

    test("Notes content appears when row is expanded", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);
      const card = getLifestylesCard(page);
      await expandLifestyleRow(card);

      await expect(card.getByText("Spartan dojo apartment above a noodle shop")).toBeVisible();
    });
  });

  test.describe("Add lifestyle", () => {
    test.beforeEach(async ({ page }) => {
      testUserId = await signUpTestUser(page, "e2e-lifestyles");
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

    test("empty state shows add prompt", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);
      const card = getLifestylesCard(page);
      await expect(card.getByText(/No lifestyles configured/i)).toBeVisible();
    });

    test("clicking Add opens the lifestyle modal", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);
      const card = getLifestylesCard(page);
      await card.getByText("Add", { exact: true }).click();
      await expect(page.getByText("New Lifestyle")).toBeVisible({ timeout: 5000 });
    });

    test("can add a Medium lifestyle via the modal", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);
      const card = getLifestylesCard(page);
      await card.getByText("Add", { exact: true }).click();
      await expect(page.getByText("New Lifestyle")).toBeVisible({ timeout: 5000 });

      // Select lifestyle type
      await page.locator("select").first().selectOption("medium");

      // Set location
      await page
        .getByPlaceholder(/e\.g\., Downtown Seattle/i)
        .fill("Downtown Seattle, Emerald City");

      // Set prepaid months — label isn't linked via htmlFor, use input locator
      await page.locator('input[type="number"][min="0"][max="12"]').fill("2");

      // Save
      await page.getByRole("button", { name: "Save Lifestyle" }).click();

      // Verify
      await expect(page.getByText("New Lifestyle")).not.toBeVisible({ timeout: 5000 });
      await expect(card.getByText("Medium", { exact: true })).toBeVisible();
      await expect(card.getByText("¥5,000/mo").first()).toBeVisible();
      await expect(card.getByText("2mo prepaid")).toBeVisible();
      await expect(card.getByText("Downtown Seattle, Emerald City")).toBeVisible();
    });

    test("Save button disabled when no type selected", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);
      getLifestylesCard(page).getByText("Add", { exact: true }).click();
      await expect(page.getByText("New Lifestyle")).toBeVisible({ timeout: 5000 });
      await expect(page.getByRole("button", { name: "Save Lifestyle" })).toBeDisabled();
    });

    test("Cancel closes modal without adding", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);
      const card = getLifestylesCard(page);
      await card.getByText("Add", { exact: true }).click();
      await expect(page.getByText("New Lifestyle")).toBeVisible({ timeout: 5000 });
      await page.getByRole("button", { name: "Cancel" }).click();
      await expect(page.getByText("New Lifestyle")).not.toBeVisible({ timeout: 5000 });
      await expect(card.getByText(/No lifestyles configured/i)).toBeVisible();
    });
  });

  test.describe("Edit lifestyle", () => {
    test.beforeEach(async ({ page }) => {
      testUserId = await signUpTestUser(page, "e2e-lifestyles");
      copyCharacterToUser(WHISPER_ID, testUserId);
      // Ensure enough nuyen so the modal's Save button is enabled (canAfford check)
      const charData = readCharacterFromUser(WHISPER_ID, testUserId);
      writeCharacterForUser(WHISPER_ID, testUserId, { ...charData, nuyen: 50000 });
    });

    test.afterEach(() => {
      if (testUserId) cleanupUserCharacters(testUserId);
    });

    test("Edit opens modal with pre-populated data", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);
      const card = getLifestylesCard(page);
      await expandLifestyleRow(card);
      await card.getByRole("button", { name: "Edit" }).click();

      await expect(page.getByText("Edit Lifestyle")).toBeVisible({ timeout: 5000 });
      await expect(page.getByPlaceholder(/e\.g\., Downtown Seattle/i)).toHaveValue(
        "Puyallup, Seattle"
      );
    });

    test("can update location and see it reflected", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);
      const card = getLifestylesCard(page);
      await expandLifestyleRow(card);
      await card.getByRole("button", { name: "Edit" }).click();
      await expect(page.getByText("Edit Lifestyle")).toBeVisible({ timeout: 5000 });

      await page.getByPlaceholder(/e\.g\., Downtown Seattle/i).fill("Redmond Barrens");
      await page.getByRole("button", { name: "Save Changes" }).click();
      await expect(page.getByText("Edit Lifestyle")).not.toBeVisible({ timeout: 5000 });

      await expect(card.getByText("Redmond Barrens")).toBeVisible();
    });
  });

  test.describe("Pay Month — prepaid > 0 (local decrement)", () => {
    test.beforeEach(async ({ page }) => {
      testUserId = await signUpTestUser(page, "e2e-lifestyles");
      copyCharacterToUser(WHISPER_ID, testUserId);
    });

    test.afterEach(() => {
      if (testUserId) cleanupUserCharacters(testUserId);
    });

    test("decrements prepaid from 3mo to 2mo without API call", async ({ page }) => {
      let spendNuyenCalled = false;
      await page.route(`**/api/characters/${WHISPER_ID}/gameplay`, async (route) => {
        const body = route.request().postDataJSON() as { action?: string };
        if (body?.action === "spendNuyen") spendNuyenCalled = true;
        const headers = { ...route.request().headers(), "x-e2e-bypass": "true" };
        await route.continue({ headers });
      });

      await goToCharacterSheet(page, WHISPER_ID);
      const card = getLifestylesCard(page);
      await expect(card.getByText("3mo prepaid")).toBeVisible();

      await expandLifestyleRow(card);
      await card.getByRole("button", { name: "Pay Month" }).click();

      await expect(card.getByText("2mo prepaid")).toBeVisible({ timeout: 5000 });
      await expect(card.getByText("3mo prepaid")).not.toBeVisible();
      expect(spendNuyenCalled).toBe(false);
    });

    test("badge disappears after paying last prepaid month", async ({ page }) => {
      const charData = readCharacterFromUser(WHISPER_ID, testUserId);
      const lifestyles = charData.lifestyles as Array<Record<string, unknown>>;
      writeCharacterForUser(WHISPER_ID, testUserId, {
        ...charData,
        lifestyles: lifestyles.map((ls, i) => (i === 0 ? { ...ls, prepaidMonths: 1 } : ls)),
      });

      await goToCharacterSheet(page, WHISPER_ID);
      const card = getLifestylesCard(page);
      await expect(card.getByText("1mo prepaid")).toBeVisible();

      await expandLifestyleRow(card);
      await card.getByRole("button", { name: "Pay Month" }).click();

      await expect(card.getByText(/mo prepaid/)).not.toBeVisible({ timeout: 5000 });
    });
  });

  test.describe("Pay Month — prepaid = 0 (deducts nuyen via API)", () => {
    test.beforeEach(async ({ page }) => {
      testUserId = await signUpTestUser(page, "e2e-lifestyles");
      copyCharacterToUser(WHISPER_ID, testUserId);
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

    test("calls spendNuyen API and updates balance", async ({ page }) => {
      let capturedBody: Record<string, unknown> | null = null;
      await page.route(`**/api/characters/${WHISPER_ID}/gameplay`, async (route) => {
        capturedBody = route.request().postDataJSON() as Record<string, unknown>;
        const headers = { ...route.request().headers(), "x-e2e-bypass": "true" };
        await route.continue({ headers });
      });

      await goToCharacterSheet(page, WHISPER_ID);
      const card = getLifestylesCard(page);

      await expandLifestyleRow(card);
      await card.getByRole("button", { name: "Pay Month" }).click();

      await expect(card.getByText("¥8,000")).toBeVisible({ timeout: 10000 });
      expect(capturedBody).not.toBeNull();
      expect(capturedBody!.action).toBe("spendNuyen");
      expect(capturedBody!.amount).toBe(2000);
      expect(capturedBody!.reason).toMatch(/Lifestyle payment/i);
    });

    test("does nothing when nuyen is insufficient", async ({ page }) => {
      const charData = readCharacterFromUser(WHISPER_ID, testUserId);
      writeCharacterForUser(WHISPER_ID, testUserId, { ...charData, nuyen: 500 });

      let spendNuyenCalled = false;
      await page.route(`**/api/characters/${WHISPER_ID}/gameplay`, async (route) => {
        const body = route.request().postDataJSON() as { action?: string };
        if (body?.action === "spendNuyen") spendNuyenCalled = true;
        const headers = { ...route.request().headers(), "x-e2e-bypass": "true" };
        await route.continue({ headers });
      });

      await goToCharacterSheet(page, WHISPER_ID);
      const card = getLifestylesCard(page);

      await expect(card.getByText(/Insufficient nuyen/i)).toBeVisible();
      await expandLifestyleRow(card);
      await card.getByRole("button", { name: "Pay Month" }).click();

      await expect(card.getByText("¥500", { exact: true })).toBeVisible();
      expect(spendNuyenCalled).toBe(false);
    });
  });

  test.describe("Remove lifestyle", () => {
    test.beforeEach(async ({ page }) => {
      testUserId = await signUpTestUser(page, "e2e-lifestyles");
      copyCharacterToUser(WHISPER_ID, testUserId);
    });

    test.afterEach(() => {
      if (testUserId) cleanupUserCharacters(testUserId);
    });

    test("Remove shows confirm/cancel dialog", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);
      const card = getLifestylesCard(page);
      await expandLifestyleRow(card);
      await card.getByRole("button", { name: "Remove" }).click();

      await expect(card.getByRole("button", { name: "Confirm" })).toBeVisible();
      await expect(card.getByRole("button", { name: "Cancel" })).toBeVisible();
      await expect(card.getByRole("button", { name: "Remove" })).not.toBeVisible();
    });

    test("Cancel restores the Remove button", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);
      const card = getLifestylesCard(page);
      await expandLifestyleRow(card);
      await card.getByRole("button", { name: "Remove" }).click();
      await card.getByRole("button", { name: "Cancel" }).click();

      await expect(card.getByRole("button", { name: "Remove" })).toBeVisible();
      await expect(card.getByRole("button", { name: "Confirm" })).not.toBeVisible();
    });

    test("Confirm removes the lifestyle row", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);
      const card = getLifestylesCard(page);
      await expect(card.getByText("Low", { exact: true })).toBeVisible();

      await expandLifestyleRow(card);
      await card.getByRole("button", { name: "Remove" }).click();
      await card.getByRole("button", { name: "Confirm" }).click();

      await expect(card.getByText(/No lifestyles configured/i)).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe("Nuyen warning banner", () => {
    test.beforeEach(async ({ page }) => {
      testUserId = await signUpTestUser(page, "e2e-lifestyles");
      copyCharacterToUser(WHISPER_ID, testUserId);
    });

    test.afterEach(() => {
      if (testUserId) cleanupUserCharacters(testUserId);
    });

    test("shown when nuyen < total monthly cost", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);
      await expect(getLifestylesCard(page).getByText(/Insufficient nuyen/i)).toBeVisible();
    });

    test("hidden when nuyen >= total monthly cost", async ({ page }) => {
      const charData = readCharacterFromUser(WHISPER_ID, testUserId);
      writeCharacterForUser(WHISPER_ID, testUserId, { ...charData, nuyen: 5000 });

      await goToCharacterSheet(page, WHISPER_ID);
      await expect(getLifestylesCard(page).getByText(/Insufficient nuyen/i)).not.toBeVisible();
    });
  });
});
