/**
 * E2E: GM Character Approval Workflow (#445 / PR #507)
 *
 * Verifies the full character approval lifecycle:
 * 1. Campaign character -> finalize -> pending-review (requiresApproval: true)
 * 2. GM sees character in Approvals tab with badge count
 * 3. GM approves -> character becomes active
 * 4. GM rejects with feedback -> draft + "Revision Requested" banner
 * 5. Player re-submits after rejection -> pending-review again
 * 6. Non-campaign character -> finalize directly to active
 *
 * Strategy: Two browser contexts (GM + Player) with API-driven setup.
 * File injection provides minimal valid character fields to pass validation.
 */

import { test, expect, type Page, type BrowserContext } from "@playwright/test";
import { signUpTestUser, setupRateLimitBypass } from "./helpers/auth";
import {
  readCharacterFromUser,
  writeCharacterForUser,
  cleanupUserCharacters,
  cleanupCampaign,
} from "./helpers/fixtures";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const EDITION_CODE = "sr5";
const EDITION_ID = "sr5";
const BOOK_ID = "core-rulebook";
const CREATION_METHOD_ID = "priority";

// ---------------------------------------------------------------------------
// Minimal valid character fields (passes validateCharacterComplete)
// ---------------------------------------------------------------------------

const MINIMAL_VALID_FIELDS = {
  name: "TestRunner",
  metatype: "Human",
  magicalPath: "mundane" as const,
  attributes: {
    body: 3,
    agility: 3,
    reaction: 3,
    strength: 3,
    willpower: 3,
    logic: 3,
    intuition: 3,
    charisma: 3,
  },
  specialAttributes: { edge: 2, essence: 6 },
  identities: [
    {
      name: "TestRunner",
      sin: { type: "fake", rating: 4 },
      licenses: [],
    },
  ],
  lifestyles: [{ type: "low", monthlyCost: 2000 }],
  positiveQualities: [],
  negativeQualities: [],
  skills: {},
  gear: [],
  contacts: [],
  nuyen: 5000,
  startingNuyen: 5000,
  derivedStats: {},
  condition: { physicalDamage: 0, stunDamage: 0 },
  karmaTotal: 0,
  karmaCurrent: 0,
  karmaSpentAtCreation: 0,
};

// ---------------------------------------------------------------------------
// API helpers (called via page.evaluate to inherit auth cookies)
// ---------------------------------------------------------------------------

async function createCampaignViaAPI(page: Page): Promise<{ id: string; title: string }> {
  const title = `E2E Approval Test ${Date.now()}`;
  const result = await page.evaluate(
    async (args: { title: string; editionCode: string; bookId: string; methodId: string }) => {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: args.title,
          description: "E2E test campaign for approval workflow",
          editionCode: args.editionCode,
          enabledBookIds: [args.bookId],
          enabledCreationMethodIds: [args.methodId],
          gameplayLevel: "street",
          visibility: "public",
        }),
      });
      return res.json();
    },
    { title, editionCode: EDITION_CODE, bookId: BOOK_ID, methodId: CREATION_METHOD_ID }
  );
  if (!result.success) throw new Error(`Failed to create campaign: ${JSON.stringify(result)}`);
  return { id: result.campaign.id, title };
}

async function joinCampaignViaAPI(page: Page, campaignId: string): Promise<void> {
  const result = await page.evaluate(async (id: string) => {
    const res = await fetch(`/api/campaigns/${id}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    return res.json();
  }, campaignId);
  if (!result.success) throw new Error(`Failed to join campaign: ${JSON.stringify(result)}`);
}

async function createCharacterViaAPI(
  page: Page,
  campaignId?: string
): Promise<{ id: string; ownerId: string }> {
  const result = await page.evaluate(
    async (args: {
      editionId: string;
      editionCode: string;
      methodId: string;
      campaignId?: string;
    }) => {
      const res = await fetch("/api/characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          editionId: args.editionId,
          editionCode: args.editionCode,
          creationMethodId: args.methodId,
          name: "TestRunner",
          campaignId: args.campaignId,
          gameplayLevel: "street",
        }),
      });
      return res.json();
    },
    {
      editionId: EDITION_ID,
      editionCode: EDITION_CODE,
      methodId: CREATION_METHOD_ID,
      campaignId,
    }
  );
  if (!result.success) throw new Error(`Failed to create character: ${JSON.stringify(result)}`);
  return { id: result.character.id, ownerId: result.character.ownerId };
}

async function finalizeCharacterViaAPI(
  page: Page,
  characterId: string
): Promise<Record<string, unknown>> {
  const result = await page.evaluate(async (id: string) => {
    const res = await fetch(`/api/characters/${id}/finalize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    return res.json();
  }, characterId);
  if (!result.success) throw new Error(`Failed to finalize character: ${JSON.stringify(result)}`);
  return result as Record<string, unknown>;
}

/**
 * Inject minimal valid character data into the character file on disk.
 * This bypasses creation UI and makes the character pass validateCharacterComplete.
 */
function injectValidCharacterFields(characterId: string, userId: string): void {
  const charData = readCharacterFromUser(characterId, userId);
  const updated = { ...charData, ...MINIMAL_VALID_FIELDS };
  writeCharacterForUser(characterId, userId, updated);
}

// ---------------------------------------------------------------------------
// Test Suite
// ---------------------------------------------------------------------------

test.describe("GM Character Approval Workflow (#445)", () => {
  test.skip(({ browserName }) => browserName === "webkit", "WebKit not installed");

  let gmContext: BrowserContext;
  let playerContext: BrowserContext;
  let gmPage: Page;
  let playerPage: Page;
  let gmUserId: string;
  let playerUserId: string;
  let campaignId: string;

  test.beforeAll(async ({ browser }) => {
    // Create two separate browser contexts for GM and Player
    gmContext = await browser.newContext();
    playerContext = await browser.newContext();
    gmPage = await gmContext.newPage();
    playerPage = await playerContext.newPage();

    // Set up rate limit bypass for both pages
    await setupRateLimitBypass(gmPage);
    await setupRateLimitBypass(playerPage);

    // Sign up GM user
    gmUserId = await signUpTestUser(gmPage, "e2e-approval-gm");

    // Sign up Player user
    playerUserId = await signUpTestUser(playerPage, "e2e-approval-plyr");

    // GM creates a campaign
    const campaign = await createCampaignViaAPI(gmPage);
    campaignId = campaign.id;

    // Player joins the campaign
    await joinCampaignViaAPI(playerPage, campaignId);
  });

  test.afterAll(async () => {
    // Clean up test data
    if (playerUserId) cleanupUserCharacters(playerUserId);
    if (gmUserId) cleanupUserCharacters(gmUserId);
    if (campaignId) cleanupCampaign(campaignId);

    await gmContext?.close();
    await playerContext?.close();
  });

  // Track character IDs created by each test for cross-test cleanup
  let test1CharId: string;

  test("1. Campaign character finalize -> pending-review with requiresApproval", async () => {
    // Player creates a character linked to the campaign
    const char = await createCharacterViaAPI(playerPage, campaignId);
    test1CharId = char.id;

    // Inject valid character fields to pass validation
    injectValidCharacterFields(char.id, playerUserId);

    // Finalize the character
    const result = await finalizeCharacterViaAPI(playerPage, char.id);

    // Verify the finalize response
    expect(result.requiresApproval).toBe(true);
    expect((result.character as Record<string, unknown>).status).toBe("pending-review");

    // Verify on disk
    const charData = readCharacterFromUser(char.id, playerUserId);
    expect(charData.status).toBe("pending-review");
  });

  test("2. GM sees character in Approvals tab with badge", async () => {
    // Navigate GM to campaign page
    await gmPage.goto(`/campaigns/${campaignId}`);

    // Look for the Approvals tab — it should have a badge
    const approvalsButton = gmPage.getByRole("button", { name: /Approvals/ });
    await expect(approvalsButton).toBeVisible({ timeout: 15000 });

    // Check badge shows a count > 0
    const badge = approvalsButton.locator("span.rounded-full");
    await expect(badge).toBeVisible();
    const badgeText = await badge.textContent();
    expect(parseInt(badgeText || "0", 10)).toBeGreaterThan(0);

    // Click the Approvals tab
    await approvalsButton.click();

    // Should see the pending character card with name and metatype
    await expect(gmPage.getByText("TestRunner")).toBeVisible({ timeout: 10000 });
    await expect(gmPage.getByText("Human")).toBeVisible();

    // Should see Approve and Reject buttons
    await expect(gmPage.getByRole("button", { name: "Approve" })).toBeVisible();
    await expect(gmPage.getByRole("button", { name: "Reject" })).toBeVisible();
  });

  test("3. GM approves -> character becomes active", async () => {
    // Create and finalize a new character for the approve test
    const char = await createCharacterViaAPI(playerPage, campaignId);
    injectValidCharacterFields(char.id, playerUserId);
    await finalizeCharacterViaAPI(playerPage, char.id);

    // Approve it directly via API (cleaner than UI, avoids ambiguity with multiple cards)
    const approveResult = await gmPage.evaluate(
      async (args: { campaignId: string; characterId: string }) => {
        const res = await fetch(
          `/api/campaigns/${args.campaignId}/characters/${args.characterId}/approve`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "approve" }),
          }
        );
        return res.json();
      },
      { campaignId, characterId: char.id }
    );
    expect(approveResult.success).toBe(true);

    // Verify on disk: character should now be active
    const charData = readCharacterFromUser(char.id, playerUserId);
    expect(charData.status).toBe("active");

    // Player navigates to character page and sees active status (no pending-review banner)
    await playerPage.goto(`/characters/${char.id}`);
    await expect(playerPage.getByRole("heading", { name: "TestRunner" })).toBeVisible({
      timeout: 15000,
    });
    await expect(playerPage.getByText("Pending GM Review")).not.toBeVisible();

    // Also clean up the leftover pending character from test 1
    if (test1CharId) {
      await gmPage.evaluate(
        async (args: { campaignId: string; characterId: string }) => {
          await fetch(`/api/campaigns/${args.campaignId}/characters/${args.characterId}/approve`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "approve" }),
          });
        },
        { campaignId, characterId: test1CharId }
      );
    }
  });

  test("4. GM rejects with feedback -> draft + feedback banner", async () => {
    const feedbackText = "Please adjust your attributes to match the priority table.";

    // Create and finalize a new character for the reject test
    const char = await createCharacterViaAPI(playerPage, campaignId);
    injectValidCharacterFields(char.id, playerUserId);
    await finalizeCharacterViaAPI(playerPage, char.id);

    // GM navigates to campaign Approvals tab
    await gmPage.goto(`/campaigns/${campaignId}`);
    const approvalsButton = gmPage.getByRole("button", { name: /Approvals/ });
    await expect(approvalsButton).toBeVisible({ timeout: 15000 });
    await approvalsButton.click();

    // Wait for the pending character card
    await expect(gmPage.getByRole("button", { name: "Reject" }).first()).toBeVisible({
      timeout: 10000,
    });

    // Click Reject — should open feedback dialog
    await gmPage.getByRole("button", { name: "Reject" }).first().click();

    // The reject dialog should appear (use heading to avoid matching the button too)
    await expect(gmPage.getByRole("heading", { name: "Reject Character" })).toBeVisible({
      timeout: 5000,
    });

    // Fill in feedback
    await gmPage.locator("textarea").fill(feedbackText);

    // Submit rejection
    await gmPage.locator("form").getByRole("button", { name: "Reject Character" }).click();

    // Wait for the rejection to process — Reject button should disappear
    await expect(gmPage.getByRole("heading", { name: "Reject Character" })).not.toBeVisible({
      timeout: 10000,
    });

    // Verify on disk: character should be back to draft
    const charData = readCharacterFromUser(char.id, playerUserId);
    expect(charData.status).toBe("draft");
    expect(charData.approvalStatus).toBe("rejected");
    expect(charData.approvalFeedback).toBe(feedbackText);

    // Player navigates to character page and sees the feedback banner
    await playerPage.goto(`/characters/${char.id}`);
    await expect(playerPage.getByText("Revision Requested")).toBeVisible({ timeout: 15000 });
    await expect(playerPage.getByText(feedbackText)).toBeVisible();
  });

  test("5. Player re-submits after rejection -> pending-review again", async () => {
    // Create, finalize, then reject a character
    const char = await createCharacterViaAPI(playerPage, campaignId);
    injectValidCharacterFields(char.id, playerUserId);
    await finalizeCharacterViaAPI(playerPage, char.id);

    // Reject via API (faster than UI for setup)
    await gmPage.evaluate(
      async (args: { campaignId: string; characterId: string }) => {
        const res = await fetch(
          `/api/campaigns/${args.campaignId}/characters/${args.characterId}/approve`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "reject",
              feedback: "Needs revision for re-submit test",
            }),
          }
        );
        return res.json();
      },
      { campaignId, characterId: char.id }
    );

    // Verify character is now draft
    let charData = readCharacterFromUser(char.id, playerUserId);
    expect(charData.status).toBe("draft");

    // Player re-finalizes the character
    const result = await finalizeCharacterViaAPI(playerPage, char.id);
    expect(result.requiresApproval).toBe(true);
    expect((result.character as Record<string, unknown>).status).toBe("pending-review");

    // Verify on disk
    charData = readCharacterFromUser(char.id, playerUserId);
    expect(charData.status).toBe("pending-review");
  });

  test("6. Non-campaign character -> finalize directly to active", async () => {
    // Create a character WITHOUT a campaign
    const char = await createCharacterViaAPI(playerPage);

    // Inject valid fields
    injectValidCharacterFields(char.id, playerUserId);

    // Finalize — should go straight to active (no approval flow)
    const result = await finalizeCharacterViaAPI(playerPage, char.id);
    expect(result.requiresApproval).toBeUndefined();
    expect((result.character as Record<string, unknown>).status).toBe("active");

    // Verify on disk
    const charData = readCharacterFromUser(char.id, playerUserId);
    expect(charData.status).toBe("active");
  });
});
