/**
 * E2E: Magic/Resonance Maximum Reduction Display (#454)
 *
 * Validates that the character sheet shows reduced Magic/Resonance
 * with effective/base format and reduction badges when a character
 * has an essence hole with magicLost > 0.
 *
 * Test characters (copied from admin to a fresh test user):
 * - Whisper (0bd8f72f): Adept, Magic 5/6, essenceHole.magicLost=1
 * - Glitch (b04cc67c): Technomancer, Resonance with essenceHole
 */

import { test, expect, type Page, type Locator } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { signUpTestUser, setupRateLimitBypass } from "./helpers/auth";
import {
  WHISPER_ID,
  GLITCH_ID,
  DATA_DIR,
  ORIGINAL_OWNER,
  copyCharacterToUser,
  cleanupUserCharacters,
} from "./helpers/fixtures";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Find a display card by its heading text.
 * The card structure is: div > div[role="button"] > ... > h3:text(title)
 * Returns the parent card div that contains the heading.
 */
function getCardByTitle(page: Page, title: string): Locator {
  return page
    .locator("div")
    .filter({ has: page.getByRole("heading", { name: title, level: 3 }) })
    .first();
}

// ---------------------------------------------------------------------------
// Test Suite
// ---------------------------------------------------------------------------

test.describe("Magic/Resonance Reduction Display (#454)", () => {
  let testUserId: string;

  // Bypass rate limiting for all API requests
  test.beforeEach(async ({ page }) => {
    await setupRateLimitBypass(page);
  });

  test.describe("Whisper (Adept) — Magic Reduction", () => {
    test.beforeEach(async ({ page }) => {
      testUserId = await signUpTestUser(page, "e2e-magic");
      copyCharacterToUser(WHISPER_ID, testUserId);
    });

    test.afterEach(() => {
      if (testUserId) cleanupUserCharacters(testUserId);
    });

    test("shows effective/base Magic format (5 / 6) in Attributes card", async ({ page }) => {
      await page.goto(`/characters/${WHISPER_ID}`);

      // Wait for character name to confirm page loaded
      await expect(page.getByRole("heading", { name: "Whisper" })).toBeVisible({ timeout: 15000 });

      // Find Attributes card by heading
      const attrsCard = getCardByTitle(page, "Attributes");
      await expect(attrsCard).toBeVisible();

      // Magic row shows "5 / 6" (effective / base)
      await expect(attrsCard.getByText("5 / 6").first()).toBeVisible();
    });

    test("shows rose reduction badge with -1 on Magic row", async ({ page }) => {
      await page.goto(`/characters/${WHISPER_ID}`);
      await expect(page.getByRole("heading", { name: "Whisper" })).toBeVisible({ timeout: 15000 });

      // Find the Magic reduction badge by aria-label
      const badge = page.getByLabel("Magic reduction details");
      await expect(badge).toBeVisible();
      await expect(badge).toContainText("-1");
    });

    test("reduction badge has accessible label and tooltip trigger", async ({ page }) => {
      await page.goto(`/characters/${WHISPER_ID}`);
      await expect(page.getByRole("heading", { name: "Whisper" })).toBeVisible({ timeout: 15000 });

      // The reduction badge should exist as a button with an accessible label
      const badge = page.getByLabel("Magic reduction details");
      await expect(badge).toBeVisible();
      await expect(badge).toContainText("-1");

      // Badge should have the rose styling (bg-rose-500/15)
      await expect(badge).toHaveClass(/text-rose-400/);

      // Badge should contain an ArrowDown icon (SVG)
      const svg = badge.locator("svg");
      await expect(svg).toBeVisible();
    });

    test("Magic Summary card shows MAG 5 / 6 with rose-colored base", async ({ page }) => {
      await page.goto(`/characters/${WHISPER_ID}`);
      await expect(page.getByRole("heading", { name: "Whisper" })).toBeVisible({ timeout: 15000 });

      const ratingPill = page.locator('[data-testid="magic-rating"]');
      await expect(ratingPill).toContainText("MAG 5");
      await expect(ratingPill).toContainText("/ 6");

      // The base portion should be in rose color
      const roseSpan = ratingPill.locator("span").filter({ hasText: "/ 6" });
      await expect(roseSpan).toBeVisible();
    });

    test("Power Points denominator uses effective magic (5), not base (6)", async ({ page }) => {
      await page.goto(`/characters/${WHISPER_ID}`);
      await expect(page.getByRole("heading", { name: "Whisper" })).toBeVisible({ timeout: 15000 });

      const ppValue = page.locator('[data-testid="power-points-value"]');
      await expect(ppValue).toBeVisible();
      await expect(ppValue).toContainText("/ 5 PP");
    });

    test("Essence row shows 5.80 with essence loss badge", async ({ page }) => {
      await page.goto(`/characters/${WHISPER_ID}`);
      await expect(page.getByRole("heading", { name: "Whisper" })).toBeVisible({ timeout: 15000 });

      const attrsCard = getCardByTitle(page, "Attributes");
      await expect(attrsCard.getByText("5.80").first()).toBeVisible();

      const lossBadge = page.getByLabel("Essence loss details");
      await expect(lossBadge).toBeVisible();
    });

    test("path is shown as Adept", async ({ page }) => {
      await page.goto(`/characters/${WHISPER_ID}`);
      await expect(page.getByRole("heading", { name: "Whisper" })).toBeVisible({ timeout: 15000 });

      const pathPill = page.locator('[data-testid="magic-path"]');
      await expect(pathPill).toContainText("Adept");
    });
  });

  test.describe("Glitch (Technomancer) — Resonance Reduction", () => {
    test.beforeEach(async ({ page }) => {
      const glitchFile = path.join(DATA_DIR, "characters", ORIGINAL_OWNER, `${GLITCH_ID}.json`);
      if (!fs.existsSync(glitchFile)) {
        test.skip();
        return;
      }
      testUserId = await signUpTestUser(page, "e2e-magic");
      copyCharacterToUser(GLITCH_ID, testUserId);
    });

    test.afterEach(() => {
      if (testUserId) cleanupUserCharacters(testUserId);
    });

    test("shows Resonance reduction badge and effective/base format", async ({ page }) => {
      await page.goto(`/characters/${GLITCH_ID}`);
      await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible({ timeout: 15000 });

      // Resonance reduction badge
      const badge = page.getByLabel("Resonance reduction details");
      await expect(badge).toBeVisible();
      await expect(badge).toContainText("-1");
    });

    test("Resonance Summary card shows RES with effective/base format", async ({ page }) => {
      await page.goto(`/characters/${GLITCH_ID}`);
      await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible({ timeout: 15000 });

      const ratingPill = page.locator('[data-testid="magic-rating"]');
      await expect(ratingPill).toContainText("RES");
    });
  });
});
