/**
 * E2E: Call Favor Flow (#810)
 *
 * Verifies the three bugs fixed in PR #810:
 * 1. Archetype matching: display names like "Street Doc" now match
 *    kebab-case IDs like "street-doc" in favor service archetypeIds.
 * 2. archetypes field present in favor-costs API response.
 * 3. Services populate in the Call Favor modal (was empty before fix).
 *
 * Strategy:
 * - Sign in as the seeded admin user ONCE via beforeAll (saves session cookies)
 *   to avoid hitting the 5-attempts / 15-min per-account rate limit.
 * - beforeEach restores session cookies onto each test's page context so
 *   no re-login is needed.
 * - The admin already owns the "Mystic" character with 7 contacts on disk.
 * - Hover a contact card, open Call Favor modal, verify services populate.
 * - Submit a favor request and verify the balance updates on disk.
 * - afterEach restores the contact's favor balance to original value.
 *
 * Admin credentials: admin@shadowmaster.test / password123
 *
 * Fixture character: Mystic
 *   id:     6fe7c6f9-1b97-4d64-9009-a18bd5b1008a
 *   owner:  e65a4c60-b735-4654-8409-72526c314ed4 (admin)
 *   edition: sr5
 *
 * Key contacts:
 *   Danny "Switchblade" Ortega — Fixer     Conn 4, Loy 3, Balance +3
 *   "Ghost"                   — Street Doc Conn 2, Loy 1, Balance  0
 */

import * as fs from "fs";
import * as path from "path";
import { test, expect, type Cookie } from "@playwright/test";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ADMIN_EMAIL = "admin@shadowmaster.test";
const ADMIN_PASSWORD = "password123";
const ADMIN_USER_ID = "e65a4c60-b735-4654-8409-72526c314ed4";
const MYSTIC_ID = "6fe7c6f9-1b97-4d64-9009-a18bd5b1008a";
const CONTACTS_URL = `/characters/${MYSTIC_ID}/contacts`;
const CHAR_FILE = path.resolve("data/characters", ADMIN_USER_ID, `${MYSTIC_ID}.json`);
const DANNY_ID = "cnt-001-fixer-chips";

// ---------------------------------------------------------------------------
// File-system helpers
// ---------------------------------------------------------------------------

function readMysticChar(): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(CHAR_FILE, "utf-8"));
}

function writeMysticChar(data: Record<string, unknown>): void {
  fs.writeFileSync(CHAR_FILE, JSON.stringify(data, null, 2));
}

function resetDannyBalance(original: number): void {
  const charData = readMysticChar();
  const contacts = charData.contacts as Array<Record<string, unknown>>;
  const updated = contacts.map((c) => (c.id === DANNY_ID ? { ...c, favorBalance: original } : c));
  writeMysticChar({ ...charData, contacts: updated });
}

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

test.describe("Call Favor flow", () => {
  let sessionCookies: Cookie[] = [];
  let originalDannyBalance: number;

  // Sign in ONCE to capture session cookies, avoiding the 5/15min rate limit
  test.beforeAll(async ({ browser }) => {
    const charData = readMysticChar();
    const contacts = charData.contacts as Array<Record<string, unknown>>;
    const danny = contacts.find((c) => c.id === DANNY_ID);
    originalDannyBalance = (danny?.favorBalance as number) ?? 3;

    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("/signin");
    await page.getByRole("button", { name: "Password" }).click();
    await expect(page.locator("#email")).toBeVisible({ timeout: 5000 });
    await page.locator("#email").fill(ADMIN_EMAIL);
    await page.locator("#password").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page).toHaveURL("/", { timeout: 15000 });

    // Save session cookies to reuse across tests
    sessionCookies = await context.cookies();
    await context.close();
  });

  // Restore session cookies onto each test's page before navigation
  test.beforeEach(async ({ page }) => {
    if (sessionCookies.length > 0) {
      await page.context().addCookies(sessionCookies);
    }
  });

  // Restore Danny's favor balance after each test
  test.afterEach(() => {
    resetDannyBalance(originalDannyBalance);
  });

  // -------------------------------------------------------------------------
  // 1. Contacts page loads and shows contact cards
  // -------------------------------------------------------------------------

  test("contacts page loads and displays contact cards", async ({ page }) => {
    await page.goto(CONTACTS_URL);

    await expect(page.getByRole("heading", { name: /contact network/i })).toBeVisible({
      timeout: 15000,
    });

    // Danny's card name should be visible
    await expect(page.getByRole("link", { name: /Danny/i }).first()).toBeVisible({
      timeout: 10000,
    });
  });

  // -------------------------------------------------------------------------
  // 2. Favor-costs API returns services and archetypes (bug #2)
  // -------------------------------------------------------------------------

  test("favor-costs API returns populated services and archetypes", async ({ page }) => {
    await page.goto(CONTACTS_URL);
    await expect(page.getByRole("heading", { name: /contact network/i })).toBeVisible({
      timeout: 15000,
    });

    const response = await page.request.get("/api/editions/sr5/favor-costs");
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);

    // Bug #3: services must be present and non-empty
    expect(Array.isArray(body.services)).toBe(true);
    expect(body.services.length).toBeGreaterThan(0);

    // Bug #2: archetypes field must be present and non-empty
    expect(Array.isArray(body.archetypes)).toBe(true);
    expect(body.archetypes.length).toBeGreaterThan(0);
  });

  // -------------------------------------------------------------------------
  // 3. Call Favor modal opens and services dropdown is populated (bug #3)
  // -------------------------------------------------------------------------

  test("Call Favor modal opens with populated services dropdown", async ({ page }) => {
    await page.goto(CONTACTS_URL);

    await expect(page.getByRole("heading", { name: /contact network/i })).toBeVisible({
      timeout: 15000,
    });

    // Hover Danny's card (opacity-0 → group-hover:opacity-100 transition)
    const contactCard = page
      .locator(".group")
      .filter({ hasText: /Switchblade/ })
      .first();
    await expect(contactCard).toBeVisible({ timeout: 10000 });
    await contactCard.hover();

    const callFavorBtn = contactCard.getByRole("button", { name: /call favor/i });
    await expect(callFavorBtn).toBeVisible({ timeout: 5000 });
    await callFavorBtn.click();

    // Modal heading and subtitle
    await expect(page.getByRole("heading", { name: /call favor/i })).toBeVisible({
      timeout: 5000,
    });
    await expect(page.getByText(/from Danny/i)).toBeVisible();

    // Services dropdown must have options beyond the placeholder (bug #3)
    const select = page.locator("select").filter({ hasText: /select a service/i });
    await expect(select).toBeVisible();

    const options = await select.locator("option").all();
    expect(options.length).toBeGreaterThan(1);

    // No warning about contact being unable to provide services
    await expect(page.getByText(/cannot provide any services/i)).not.toBeVisible();
  });

  // -------------------------------------------------------------------------
  // 4. Archetype matching: Street Doc shows medical services (bug #1)
  // -------------------------------------------------------------------------

  test("archetype matching: Street Doc contact shows medical services", async ({ page }) => {
    await page.goto(CONTACTS_URL);

    await expect(page.getByRole("heading", { name: /contact network/i })).toBeVisible({
      timeout: 15000,
    });

    // "Ghost" is the Street Doc contact (Conn 2, Loy 1)
    const ghostCard = page
      .locator(".group")
      .filter({ hasText: /"Ghost"/ })
      .first();
    await expect(ghostCard).toBeVisible({ timeout: 10000 });

    await ghostCard.hover();

    const callFavorBtn = ghostCard.getByRole("button", { name: /call favor/i });
    await expect(callFavorBtn).toBeVisible({ timeout: 5000 });
    await callFavorBtn.click();

    await expect(page.getByRole("heading", { name: /call favor/i })).toBeVisible({
      timeout: 5000,
    });

    // Bug #1 fix: "Street Doc" must match "street-doc" archetypeId
    const select = page.locator("select").filter({ hasText: /select a service/i });
    await expect(select).toBeVisible();

    const optionTexts = await select.locator("option").allTextContents();
    const hasMedicalService = optionTexts.some((t) => /basic medical care/i.test(t));
    expect(hasMedicalService).toBe(true);
  });

  // -------------------------------------------------------------------------
  // 5. Full happy-path: select service, submit, favor balance updates
  // -------------------------------------------------------------------------

  test("submitting Call Favor updates contact favor balance", async ({ page }) => {
    await page.goto(CONTACTS_URL);

    await expect(page.getByRole("heading", { name: /contact network/i })).toBeVisible({
      timeout: 15000,
    });

    // Open Call Favor modal for Danny
    const contactCard = page
      .locator(".group")
      .filter({ hasText: /Switchblade/ })
      .first();
    await expect(contactCard).toBeVisible({ timeout: 10000 });
    await contactCard.hover();

    const callFavorBtn = contactCard.getByRole("button", { name: /call favor/i });
    await expect(callFavorBtn).toBeVisible({ timeout: 5000 });
    await callFavorBtn.click();

    await expect(page.getByRole("heading", { name: /call favor/i })).toBeVisible({
      timeout: 5000,
    });

    // Capture screenshot of modal open state
    await page.screenshot({ path: "test-results/call-favor-modal-open.png" });

    // Find "Basic Information" service (generic, minConn 1, minLoy 1, favorCost 1)
    const select = page.locator("select").filter({ hasText: /select a service/i });
    const options = await select.locator("option").all();
    let basicInfoValue = "";
    for (const opt of options) {
      const text = await opt.textContent();
      if (text && /basic information/i.test(text)) {
        basicInfoValue = (await opt.getAttribute("value")) ?? "";
        break;
      }
    }
    expect(basicInfoValue).not.toBe("");
    await select.selectOption(basicInfoValue);

    // Service detail panel appears
    await expect(page.getByText(/basic information/i).last()).toBeVisible();

    // Enter dice roll
    await page.getByPlaceholder(/enter your hits/i).fill("4");

    // Intercept call-favor response before clicking submit
    const callFavorResponsePromise = page.waitForResponse(
      (resp) => resp.url().includes("/call-favor") && resp.request().method() === "POST"
    );

    // Submit — scope to dialog to avoid strict-mode conflict with card buttons
    await page
      .getByRole("dialog")
      .getByRole("button", { name: /^call favor$/i })
      .click();

    const callFavorResponse = await callFavorResponsePromise;
    expect(callFavorResponse.status()).toBe(200);

    const responseBody = await callFavorResponse.json();
    expect(responseBody.success).toBe(true);

    // Modal should close
    await expect(page.getByRole("heading", { name: /call favor/i })).not.toBeVisible({
      timeout: 5000,
    });

    // Capture screenshot of contacts page after favor was called
    await page.screenshot({ path: "test-results/call-favor-after-submission.png" });

    // Verify on-disk persistence: favorCost of Basic Information is 1
    const charAfter = readMysticChar();
    const contactsAfter = charAfter.contacts as Array<Record<string, unknown>>;
    const dannyAfter = contactsAfter.find((c) => c.id === DANNY_ID);
    expect(dannyAfter?.favorBalance).toBe(originalDannyBalance - 1);
  });
});
