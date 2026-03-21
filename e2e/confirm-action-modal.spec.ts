/**
 * E2E: ConfirmActionModal — Delete, Burn, Mark Deceased (#799)
 *
 * Verifies that native browser confirm()/prompt() dialogs have been replaced
 * with styled ConfirmActionModal components on the contact detail page.
 *
 * Manual test items from PR #812:
 * 1. Delete confirmation modal appears and deletes on confirm
 * 2. Burn modal collects reason and transitions contact state
 * 3. Deceased modal collects cause of death and transitions contact state
 * 4. Cancel and backdrop dismiss close modals without action
 *
 * Strategy:
 * - Sign in as seeded admin user ONCE (session cookie reuse)
 * - Use Aunt Sera (active, Conn 3, Loy 4) as expendable contact for burn/deceased
 * - Restore contact state after each test via file-system writes
 * - Use Danny for delete-cancel test (non-destructive)
 *
 * Admin credentials: admin@shadowmaster.test / password123
 *
 * Fixture character: Mystic
 *   id:     6fe7c6f9-1b97-4d64-9009-a18bd5b1008a
 *   owner:  e65a4c60-b735-4654-8409-72526c314ed4 (admin)
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
const CHAR_FILE = path.resolve("data/characters", ADMIN_USER_ID, `${MYSTIC_ID}.json`);

// Aunt Sera — expendable active contact for destructive tests
const AUNT_SERA_ID = "cnt-003-family";
const AUNT_SERA_DETAIL_URL = `/characters/${MYSTIC_ID}/contacts/${AUNT_SERA_ID}`;

// Danny — active contact for non-destructive modal tests
const DANNY_ID = "cnt-001-fixer-chips";
const DANNY_DETAIL_URL = `/characters/${MYSTIC_ID}/contacts/${DANNY_ID}`;

// ---------------------------------------------------------------------------
// File-system helpers
// ---------------------------------------------------------------------------

function readMysticChar(): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(CHAR_FILE, "utf-8"));
}

function writeMysticChar(data: Record<string, unknown>): void {
  fs.writeFileSync(CHAR_FILE, JSON.stringify(data, null, 2));
}

/** Snapshot and restore the full contacts array to undo any state transitions. */
let originalContacts: Array<Record<string, unknown>>;

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

test.describe("ConfirmActionModal — contact detail page", () => {
  let sessionCookies: Cookie[] = [];

  test.beforeAll(async ({ browser }) => {
    // Snapshot contacts before any tests
    const charData = readMysticChar();
    originalContacts = structuredClone(charData.contacts as Array<Record<string, unknown>>);

    // Sign in once
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("/signin");
    await page.getByRole("button", { name: "Password" }).click();
    await expect(page.locator("#email")).toBeVisible({ timeout: 5000 });
    await page.locator("#email").fill(ADMIN_EMAIL);
    await page.locator("#password").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page).toHaveURL("/", { timeout: 15000 });

    sessionCookies = await context.cookies();
    await context.close();
  });

  test.beforeEach(async ({ page }) => {
    if (sessionCookies.length > 0) {
      await page.context().addCookies(sessionCookies);
    }
  });

  // Restore contacts to original state after each test
  test.afterEach(() => {
    const charData = readMysticChar();
    writeMysticChar({ ...charData, contacts: structuredClone(originalContacts) });
  });

  // -------------------------------------------------------------------------
  // Helper: navigate to contact detail and wait for load
  // -------------------------------------------------------------------------

  async function navigateToContact(
    page: import("@playwright/test").Page,
    url: string,
    contactName: RegExp
  ) {
    await page.goto(url);
    await expect(page.getByRole("heading", { name: contactName })).toBeVisible({
      timeout: 15000,
    });
  }

  // -------------------------------------------------------------------------
  // 1. Delete confirmation modal appears and deletes on confirm
  // -------------------------------------------------------------------------

  test("delete modal appears and redirects to contacts list on confirm", async ({ page }) => {
    await navigateToContact(page, AUNT_SERA_DETAIL_URL, /Aunt Sera/i);

    // Click Delete button
    await page.getByRole("button", { name: /delete/i }).click();

    // Modal should appear with title and description
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 5000 });
    await expect(dialog.getByRole("heading", { name: /delete contact/i })).toBeVisible();
    await expect(dialog.getByText(/cannot be undone/i)).toBeVisible();

    await page.screenshot({ path: "test-results/delete-modal-open.png" });

    // Intercept DELETE response
    const deleteResponse = page.waitForResponse(
      (resp) =>
        resp.url().includes(`/contacts/${AUNT_SERA_ID}`) && resp.request().method() === "DELETE"
    );

    // Confirm deletion
    await dialog.getByRole("button", { name: /delete contact/i }).click();

    const resp = await deleteResponse;
    expect(resp.status()).toBe(200);

    // Should redirect to contacts list
    await expect(page).toHaveURL(new RegExp(`/characters/${MYSTIC_ID}/contacts$`), {
      timeout: 10000,
    });

    await page.screenshot({ path: "test-results/delete-after-redirect.png" });
  });

  // -------------------------------------------------------------------------
  // 2. Burn modal collects reason and transitions contact state
  // -------------------------------------------------------------------------

  test("burn modal collects reason and transitions contact to burned state", async ({ page }) => {
    await navigateToContact(page, AUNT_SERA_DETAIL_URL, /Aunt Sera/i);

    // Click Burn Contact button
    await page.getByRole("button", { name: /burn contact/i }).click();

    // Modal should appear
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 5000 });
    await expect(dialog.getByText(/burn contact/i).first()).toBeVisible();
    await expect(dialog.getByText(/permanently sever/i)).toBeVisible();

    // Reason field should be present
    const reasonField = dialog.getByPlaceholder(/why are you burning/i);
    await expect(reasonField).toBeVisible();

    // Fill in reason
    await reasonField.fill("Betrayed the team during a run");

    await page.screenshot({ path: "test-results/burn-modal-filled.png" });

    // Intercept state transition response
    const stateResponse = page.waitForResponse(
      (resp) =>
        resp.url().includes(`/contacts/${AUNT_SERA_ID}/state`) && resp.request().method() === "POST"
    );

    // Submit
    await dialog.getByRole("button", { name: /^burn contact$/i }).click();

    const resp = await stateResponse;
    expect(resp.status()).toBe(200);
    const body = await resp.json();
    expect(body.success).toBe(true);
    expect(body.contact.status).toBe("burned");

    // Modal should close
    await expect(dialog).not.toBeVisible({ timeout: 5000 });

    // Page should now show "burned" status
    await expect(page.getByText(/burned/i).first()).toBeVisible();

    await page.screenshot({ path: "test-results/burn-after-transition.png" });

    // Verify on-disk state
    const charAfter = readMysticChar();
    const contacts = charAfter.contacts as Array<Record<string, unknown>>;
    const sera = contacts.find((c) => c.id === AUNT_SERA_ID);
    expect(sera?.status).toBe("burned");
    expect(sera?.burnedReason).toBe("Betrayed the team during a run");
  });

  // -------------------------------------------------------------------------
  // 3. Deceased modal collects cause of death and transitions contact state
  // -------------------------------------------------------------------------

  test("deceased modal collects cause of death and transitions contact", async ({ page }) => {
    await navigateToContact(page, AUNT_SERA_DETAIL_URL, /Aunt Sera/i);

    // Click Mark Deceased button
    await page.getByRole("button", { name: /mark deceased/i }).click();

    // Modal should appear
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 5000 });
    await expect(dialog.getByText(/mark deceased/i).first()).toBeVisible();

    // Reason field should be present
    const reasonField = dialog.getByPlaceholder(/how did this contact die/i);
    await expect(reasonField).toBeVisible();

    // Fill in cause of death
    await reasonField.fill("Killed in a corp raid on the shop");

    await page.screenshot({ path: "test-results/deceased-modal-filled.png" });

    // Intercept state transition response
    const stateResponse = page.waitForResponse(
      (resp) =>
        resp.url().includes(`/contacts/${AUNT_SERA_ID}/state`) && resp.request().method() === "POST"
    );

    // Submit
    await dialog.getByRole("button", { name: /^mark deceased$/i }).click();

    const resp = await stateResponse;
    expect(resp.status()).toBe(200);
    const body = await resp.json();
    expect(body.success).toBe(true);
    expect(body.contact.status).toBe("deceased");

    // Modal should close
    await expect(dialog).not.toBeVisible({ timeout: 5000 });

    // Page should now show "deceased" status
    await expect(page.getByText(/deceased/i).first()).toBeVisible();

    await page.screenshot({ path: "test-results/deceased-after-transition.png" });
  });

  // -------------------------------------------------------------------------
  // 4. Cancel and backdrop dismiss close modals without action
  // -------------------------------------------------------------------------

  test("cancel button closes delete modal without deleting", async ({ page }) => {
    await navigateToContact(page, DANNY_DETAIL_URL, /Danny/i);

    // Open delete modal
    await page.getByRole("button", { name: /delete/i }).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Click Cancel
    await dialog.getByRole("button", { name: /cancel/i }).click();

    // Modal should close
    await expect(dialog).not.toBeVisible({ timeout: 5000 });

    // Should still be on the contact detail page (not redirected)
    await expect(page.getByRole("heading", { name: /Danny/i })).toBeVisible();

    await page.screenshot({ path: "test-results/delete-cancel-still-on-page.png" });
  });

  test("cancel button closes burn modal without burning", async ({ page }) => {
    await navigateToContact(page, AUNT_SERA_DETAIL_URL, /Aunt Sera/i);

    // Open burn modal
    await page.getByRole("button", { name: /burn contact/i }).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Fill reason but then cancel
    await dialog.getByPlaceholder(/why are you burning/i).fill("Changed my mind");
    await dialog.getByRole("button", { name: /cancel/i }).click();

    // Modal should close
    await expect(dialog).not.toBeVisible({ timeout: 5000 });

    // Contact should still be active
    await expect(page.getByText(/active/i).first()).toBeVisible();

    // Verify on-disk state is unchanged
    const charAfter = readMysticChar();
    const contacts = charAfter.contacts as Array<Record<string, unknown>>;
    const sera = contacts.find((c) => c.id === AUNT_SERA_ID);
    expect(sera?.status).toBe("active");
  });

  test("Escape key closes deceased modal without action", async ({ page }) => {
    await navigateToContact(page, AUNT_SERA_DETAIL_URL, /Aunt Sera/i);

    // Open deceased modal
    await page.getByRole("button", { name: /mark deceased/i }).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Press Escape
    await page.keyboard.press("Escape");

    // Modal should close
    await expect(dialog).not.toBeVisible({ timeout: 5000 });

    // Contact should still be active
    await expect(page.getByText(/active/i).first()).toBeVisible();
  });
});
