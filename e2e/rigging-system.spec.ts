/**
 * E2E: Rigging/Drone System UI (#407, #408, #409, #410)
 *
 * Verifies the five rigging panels on the character sheet:
 * 1. RiggingSummaryDisplay - VCR, RCC info, session controls
 * 2. DroneNetworkDisplay - Drone slaving, commands, capacity
 * 3. JumpInControlDisplay - Jump-in/out, VR mode, biofeedback
 * 4. VehicleActionsDisplay - Dice pools with VCR bonus
 * 5. AutosoftManagerDisplay - Share/unshare, effective resolution
 *
 * Strategy: sign up a fresh test user each suite, copy the known
 * "Whisper" fixture character, inject rigging fields (VCR, RCC,
 * drones, vehicle, autosofts), then run assertions and clean up.
 *
 * Whisper fixture:
 *   id:      0bd8f72f-b5d9-45b7-a530-0c7f462257a1
 *   status:  active
 *   attributes: body 4, agility 7, reaction 5, strength 4,
 *              willpower 4, logic 3, intuition 5, charisma 3
 */

import { test, expect, type Page } from "@playwright/test";
import { signUpTestUser, setupRateLimitBypass } from "./helpers/auth";
import {
  WHISPER_ID,
  copyCharacterToUser,
  readCharacterFromUser,
  writeCharacterForUser,
  cleanupUserCharacters,
} from "./helpers/fixtures";

// ---------------------------------------------------------------------------
// Rigging data injection
// ---------------------------------------------------------------------------

/**
 * Inject rigging equipment into the Whisper character:
 * - VCR cyberware (rating 2)
 * - RCC (device rating 4, data processing 4, firewall 3)
 * - 2 drones: MCT Fly-Spy and GM-Nissan Doberman
 * - 1 vehicle: Dodge Scoot
 * - 3 autosofts: Clearsight, Targeting, Maneuvering
 * - Skills: pilot-ground-craft 4 and gunnery 3
 */
function injectRiggingFields(userId: string): void {
  const charData = readCharacterFromUser(WHISPER_ID, userId);

  // Add VCR cyberware
  const existingCyberware = (charData.cyberware as Array<Record<string, unknown>>) ?? [];
  existingCyberware.push({
    id: "vcr-2",
    catalogId: "vehicle-control-rig-2",
    name: "Vehicle Control Rig Rating 2",
    category: "bodyware",
    grade: "standard",
    rating: 2,
    baseEssenceCost: 2,
    essenceCost: 2,
    cost: 86000,
    availability: 16,
  });

  // Add RCC
  const rccs = [
    {
      id: "rcc-1",
      catalogId: "mct-drone-web",
      name: "MCT Drone Web",
      deviceRating: 4,
      dataProcessing: 4,
      firewall: 3,
      cost: 23000,
      availability: 8,
      runningAutosofts: [],
    },
  ];

  // Add drones
  const drones = [
    {
      id: "drone-1",
      catalogId: "mct-fly-spy",
      name: "MCT Fly-Spy",
      size: "mini",
      body: 1,
      handling: 4,
      pilot: 3,
      sensor: 3,
      speed: 3,
      acceleration: 2,
      armor: 0,
      cost: 2000,
      availability: 6,
      installedAutosofts: [],
    },
    {
      id: "drone-2",
      catalogId: "gm-nissan-doberman",
      name: "GM-Nissan Doberman",
      customName: "Rex",
      size: "medium",
      body: 4,
      handling: 5,
      pilot: 3,
      sensor: 3,
      speed: 3,
      acceleration: 1,
      armor: 4,
      cost: 5000,
      availability: 4,
      installedAutosofts: ["Clearsight R3", "Targeting R3"],
    },
  ];

  // Add vehicle
  const vehicles = [
    {
      catalogId: "dodge-scoot",
      name: "Dodge Scoot",
      type: "ground",
      handling: 4,
      speed: 3,
      acceleration: 1,
      body: 4,
      armor: 4,
      pilot: 1,
      sensor: 1,
      seats: 1,
      cost: 3000,
      availability: 0,
    },
  ];

  // Add autosofts
  const autosofts = [
    {
      id: "auto-1",
      catalogId: "clearsight-3",
      name: "Clearsight",
      category: "perception",
      rating: 3,
      cost: 1500,
      availability: 6,
    },
    {
      id: "auto-2",
      catalogId: "targeting-3",
      name: "Targeting",
      category: "combat",
      rating: 3,
      cost: 1500,
      availability: 6,
    },
    {
      id: "auto-3",
      catalogId: "maneuvering-3",
      name: "Maneuvering",
      category: "movement",
      rating: 3,
      cost: 1500,
      availability: 6,
    },
  ];

  // Merge skills (add rigging skills to existing)
  const existingSkills = (charData.skills as Record<string, number>) ?? {};
  const skills = {
    ...existingSkills,
    "pilot-ground-craft": 4,
    gunnery: 3,
  };

  writeCharacterForUser(WHISPER_ID, userId, {
    ...charData,
    cyberware: existingCyberware,
    rccs,
    drones,
    vehicles,
    autosofts,
    skills,
  });
}

// ---------------------------------------------------------------------------
// Page helpers
// ---------------------------------------------------------------------------

async function goToCharacterSheet(page: Page, characterId: string): Promise<void> {
  await page.goto(`/characters/${characterId}`);
  await expect(page.getByRole("heading", { name: "Whisper" })).toBeVisible({ timeout: 20000 });
}

async function startRiggingSession(page: Page): Promise<void> {
  await page.getByTestId("start-session-button").click();
  await expect(page.getByTestId("end-session-button")).toBeVisible({ timeout: 5000 });
}

/**
 * Expand a collapsed DisplayCard by clicking its header area.
 * BaseCard uses a div[role="button"][aria-expanded] for the collapsible header.
 * Only clicks if the panel is currently collapsed (aria-expanded="false").
 */
async function expandPanel(page: Page, panelId: string): Promise<void> {
  const panel = page.locator(`#${panelId}`);
  const header = panel.locator("[role='button'][aria-expanded]");
  const isExpanded = await header.getAttribute("aria-expanded");
  if (isExpanded === "false") {
    await header.click();
    // Wait for the content area to become visible (max-h animation)
    await page.waitForTimeout(300);
  }
}

// ---------------------------------------------------------------------------
// Test Suites
// ---------------------------------------------------------------------------

test.describe("Rigging System E2E (#407-410)", () => {
  // Skip webkit since it's not installed in this environment
  test.skip(({ browserName }) => browserName === "webkit", "WebKit not installed");

  // Bypass rate limiting on all API calls
  test.beforeEach(async ({ page }) => {
    await setupRateLimitBypass(page);
  });

  // ---------------------------------------------------------------------------
  // 1. Panel visibility (Step 1)
  // ---------------------------------------------------------------------------

  test.describe("Panel visibility", () => {
    let testUserId: string;

    test.beforeEach(async ({ page }) => {
      testUserId = await signUpTestUser(page, "e2e-rigging");
      copyCharacterToUser(WHISPER_ID, testUserId);
      injectRiggingFields(testUserId);
    });

    test.afterEach(() => {
      if (testUserId) cleanupUserCharacters(testUserId);
    });

    test("rigger character shows all five rigging panels", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);

      // All five DisplayCards should exist
      await expect(page.locator("#sheet-rigging-summary")).toBeVisible();
      await expect(page.locator("#sheet-drone-network")).toBeVisible();
      await expect(page.locator("#sheet-jump-in")).toBeVisible();
      await expect(page.locator("#sheet-vehicle-actions")).toBeVisible();
      await expect(page.locator("#sheet-autosofts")).toBeVisible();

      // VCR rating badge
      await expect(page.getByTestId("vcr-rating")).toContainText("R2");

      // RCC data processing visible
      await expect(page.getByTestId("rcc-dp")).toBeVisible();

      // Equipment counts
      const equipCounts = page.getByTestId("equipment-counts");
      await expect(equipCounts).toContainText("1 Vehicle");
      await expect(equipCounts).toContainText("2 Drone");
      await expect(equipCounts).toContainText("3 Autosoft");
    });
  });

  // ---------------------------------------------------------------------------
  // 2. Session lifecycle (Steps 2, 15)
  // ---------------------------------------------------------------------------

  test.describe("Session lifecycle", () => {
    let testUserId: string;

    test.beforeEach(async ({ page }) => {
      testUserId = await signUpTestUser(page, "e2e-rigging");
      copyCharacterToUser(WHISPER_ID, testUserId);
      injectRiggingFields(testUserId);
    });

    test.afterEach(() => {
      if (testUserId) cleanupUserCharacters(testUserId);
    });

    test("start rigging session shows active indicator", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);

      // Start button should be visible before session starts
      await expect(page.getByTestId("start-session-button")).toBeVisible();

      // Start session
      await page.getByTestId("start-session-button").click();

      // End button should appear, session is active
      await expect(page.getByTestId("end-session-button")).toBeVisible({ timeout: 5000 });
    });

    test("end session clears all ephemeral state", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);
      await startRiggingSession(page);

      // Slave a drone
      const flySpy = page.getByTestId("drone-row").filter({ hasText: "MCT Fly-Spy" });
      await flySpy.getByTestId("expand-button").click();
      await flySpy.getByTestId("slave-button").click();
      await expect(page.getByTestId("capacity-badge")).toContainText("1");

      // Jump into vehicle (expand vehicle-actions first since it's collapsed)
      await expandPanel(page, "sheet-jump-in");
      const scootTarget = page.getByTestId("jump-in-dodge-scoot");
      await scootTarget.click();
      await expect(page.getByTestId("jumped-in-status")).toBeVisible({ timeout: 5000 });

      // End session
      await page.getByTestId("end-session-button").click();

      // Should be back to initial state
      await expect(page.getByTestId("start-session-button")).toBeVisible({ timeout: 5000 });
      await expect(page.getByTestId("capacity-badge")).toContainText("0");
      await expect(page.getByTestId("jumped-in-status")).not.toBeVisible();
    });
  });

  // ---------------------------------------------------------------------------
  // 3. Drone network (Steps 3, 4, 5, 6)
  // ---------------------------------------------------------------------------

  test.describe("Drone network", () => {
    let testUserId: string;

    test.beforeEach(async ({ page }) => {
      testUserId = await signUpTestUser(page, "e2e-rigging");
      copyCharacterToUser(WHISPER_ID, testUserId);
      injectRiggingFields(testUserId);
    });

    test.afterEach(() => {
      if (testUserId) cleanupUserCharacters(testUserId);
    });

    test("slave two drones updates capacity badge", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);
      await startRiggingSession(page);

      // Slave Fly-Spy
      const flySpy = page.getByTestId("drone-row").filter({ hasText: "MCT Fly-Spy" });
      await flySpy.getByTestId("expand-button").click();
      await flySpy.getByTestId("slave-button").click();
      await expect(page.getByTestId("capacity-badge")).toContainText("1 / 12");

      // Slave Rex (Doberman)
      const rex = page.getByTestId("drone-row").filter({ hasText: "Rex" });
      await rex.getByTestId("expand-button").click();
      await rex.getByTestId("slave-button").click();
      await expect(page.getByTestId("capacity-badge")).toContainText("2 / 12");
    });

    test("issue command to individual drone", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);
      await startRiggingSession(page);

      // Slave drone-1
      const flySpy = page.getByTestId("drone-row").filter({ hasText: "MCT Fly-Spy" });
      await flySpy.getByTestId("expand-button").click();
      await flySpy.getByTestId("slave-button").click();

      // Issue Watch command
      await flySpy.getByTestId("command-button").click();
      await flySpy.getByTestId("command-watch").click();

      // Verify command badge shows Watch
      await expect(flySpy.getByTestId("command-badge")).toContainText("Watch");
    });

    test("network-wide command updates all slaved drones", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);
      await startRiggingSession(page);

      // Slave both drones
      const flySpy = page.getByTestId("drone-row").filter({ hasText: "MCT Fly-Spy" });
      await flySpy.getByTestId("expand-button").click();
      await flySpy.getByTestId("slave-button").click();
      await expect(page.getByTestId("capacity-badge")).toContainText("1");

      const rex = page.getByTestId("drone-row").filter({ hasText: "Rex" });
      await rex.getByTestId("expand-button").click();
      await rex.getByTestId("slave-button").click();
      await expect(page.getByTestId("capacity-badge")).toContainText("2");

      // Issue network-wide Defend command
      await page.getByTestId("network-cmd-defend").click();

      // Both drones should show Defend badge
      const commandBadges = page.getByTestId("command-badge");
      await expect(commandBadges).toHaveCount(2, { timeout: 5000 });
      await expect(commandBadges.first()).toContainText("Defend");
      await expect(commandBadges.last()).toContainText("Defend");
    });

    test("release drone decrements count", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);
      await startRiggingSession(page);

      // Slave both drones
      const flySpy = page.getByTestId("drone-row").filter({ hasText: "MCT Fly-Spy" });
      await flySpy.getByTestId("expand-button").click();
      await flySpy.getByTestId("slave-button").click();

      const rex = page.getByTestId("drone-row").filter({ hasText: "Rex" });
      await rex.getByTestId("expand-button").click();
      await rex.getByTestId("slave-button").click();
      await expect(page.getByTestId("capacity-badge")).toContainText("2 / 12");

      // Release Fly-Spy
      await flySpy.getByTestId("release-button").click();

      // Capacity should drop to 1
      await expect(page.getByTestId("capacity-badge")).toContainText("1 / 12");

      // Fly-Spy should show slave-button again
      await expect(flySpy.getByTestId("slave-button")).toBeVisible();
    });
  });

  // ---------------------------------------------------------------------------
  // 4. Jump-in controls (Steps 7, 8, 9, 10)
  // ---------------------------------------------------------------------------

  test.describe("Jump-in controls", () => {
    let testUserId: string;

    test.beforeEach(async ({ page }) => {
      testUserId = await signUpTestUser(page, "e2e-rigging");
      copyCharacterToUser(WHISPER_ID, testUserId);
      injectRiggingFields(testUserId);
    });

    test.afterEach(() => {
      if (testUserId) cleanupUserCharacters(testUserId);
    });

    test("jump into vehicle shows body vulnerable warning", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);
      await startRiggingSession(page);

      // Jump-in panel may need expanding
      await expandPanel(page, "sheet-jump-in");

      // Jump into the Dodge Scoot
      await page.getByTestId("jump-in-dodge-scoot").click();

      // Verify jumped-in status
      await expect(page.getByTestId("jumped-in-status")).toBeVisible({ timeout: 5000 });
      await expect(page.getByTestId("jumped-in-status")).toContainText("Dodge Scoot");

      // Verify body vulnerable warning
      await expect(page.getByTestId("body-vulnerable-warning")).toBeVisible();
    });

    test("switch VR mode to hot-sim", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);
      await startRiggingSession(page);
      await expandPanel(page, "sheet-jump-in");

      // Jump into vehicle (defaults to cold-sim)
      await page.getByTestId("jump-in-dodge-scoot").click();
      await expect(page.getByTestId("jumped-in-status")).toBeVisible({ timeout: 5000 });

      // Toggle VR mode
      await page.getByTestId("toggle-vr-mode").click();

      // Verify VR mode switched to Hot-Sim
      await expect(page.getByTestId("toggle-vr-mode")).toContainText("Hot-Sim");
    });

    test("biofeedback tracker shows safe level initially", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);
      await startRiggingSession(page);
      await expandPanel(page, "sheet-jump-in");

      // Jump into vehicle
      await page.getByTestId("jump-in-dodge-scoot").click();
      await expect(page.getByTestId("jumped-in-status")).toBeVisible({ timeout: 5000 });

      // Biofeedback tracker should show Safe
      await expect(page.getByTestId("biofeedback-tracker")).toBeVisible();
      await expect(page.getByTestId("biofeedback-tracker")).toContainText("Safe");
    });

    test("force ejection displays dumpshock result", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);
      await startRiggingSession(page);
      await expandPanel(page, "sheet-jump-in");

      // Jump into vehicle
      await page.getByTestId("jump-in-dodge-scoot").click();
      await expect(page.getByTestId("jumped-in-status")).toBeVisible({ timeout: 5000 });

      // Force eject
      await page.getByTestId("force-eject-button").click();

      // Dumpshock result should appear with damage amount and type (e.g. "6S" or "6P")
      await expect(page.getByTestId("dumpshock-result")).toBeVisible({ timeout: 5000 });
      await expect(page.getByTestId("dumpshock-result")).toContainText(/\d+[SP]/);

      // Should no longer be jumped in
      await expect(page.getByTestId("jumped-in-status")).not.toBeVisible();

      // Jump targets should reappear
      await expect(page.getByTestId("jump-targets")).toBeVisible();
    });
  });

  // ---------------------------------------------------------------------------
  // 5. Autosoft management (Steps 11, 12, 13)
  // ---------------------------------------------------------------------------

  test.describe("Autosoft management", () => {
    let testUserId: string;

    test.beforeEach(async ({ page }) => {
      testUserId = await signUpTestUser(page, "e2e-rigging");
      copyCharacterToUser(WHISPER_ID, testUserId);
      injectRiggingFields(testUserId);
    });

    test.afterEach(() => {
      if (testUserId) cleanupUserCharacters(testUserId);
    });

    test("load autosoft to RCC appears in shared section", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);
      await startRiggingSession(page);

      // Expand autosofts panel (defaultCollapsed)
      await expandPanel(page, "sheet-autosofts");

      // Show owned autosofts
      await page.getByTestId("available-toggle").click();

      // Share Clearsight to RCC
      const clearsightRow = page
        .getByTestId("available-section")
        .locator("[data-testid='autosoft-row']")
        .filter({ hasText: "Clearsight" });
      await clearsightRow.getByTestId("share-button").click();

      // Verify shared section appears with Clearsight
      await expect(page.getByTestId("rcc-shared-section")).toBeVisible({ timeout: 5000 });
      await expect(page.getByTestId("rcc-shared-section")).toContainText("Clearsight");
    });

    test("effective autosofts resolve per drone", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);
      await startRiggingSession(page);

      // Slave Rex (has installed autosofts)
      const rex = page.getByTestId("drone-row").filter({ hasText: "Rex" });
      await rex.getByTestId("expand-button").click();
      await rex.getByTestId("slave-button").click();

      // Expand autosofts panel
      await expandPanel(page, "sheet-autosofts");

      // Share Clearsight to RCC
      await page.getByTestId("available-toggle").click();
      const clearsightRow = page
        .getByTestId("available-section")
        .locator("[data-testid='autosoft-row']")
        .filter({ hasText: "Clearsight" });
      await clearsightRow.getByTestId("share-button").click();

      // Toggle effective autosofts view
      await page.getByTestId("effective-toggle").click();

      // Should show effective section for Rex
      await expect(page.getByTestId("drone-effective-section")).toBeVisible({ timeout: 5000 });
    });

    test("unload autosoft removes from shared pool", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);
      await startRiggingSession(page);

      // Expand autosofts panel
      await expandPanel(page, "sheet-autosofts");

      // Share Clearsight
      await page.getByTestId("available-toggle").click();
      const clearsightRow = page
        .getByTestId("available-section")
        .locator("[data-testid='autosoft-row']")
        .filter({ hasText: "Clearsight" });
      await clearsightRow.getByTestId("share-button").click();
      await expect(page.getByTestId("rcc-shared-section")).toBeVisible({ timeout: 5000 });

      // Unshare it
      await page.getByTestId("unshare-shared-button").click();

      // Shared section should disappear
      await expect(page.getByTestId("rcc-shared-section")).not.toBeVisible({ timeout: 5000 });
    });
  });

  // ---------------------------------------------------------------------------
  // 6. Vehicle actions (Step 14)
  // ---------------------------------------------------------------------------

  test.describe("Vehicle actions", () => {
    let testUserId: string;

    test.beforeEach(async ({ page }) => {
      testUserId = await signUpTestUser(page, "e2e-rigging");
      copyCharacterToUser(WHISPER_ID, testUserId);
      injectRiggingFields(testUserId);
    });

    test.afterEach(() => {
      if (testUserId) cleanupUserCharacters(testUserId);
    });

    test("dice pools update with VCR bonus when jumped in", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);

      // Expand vehicle-actions panel (defaultCollapsed)
      await expandPanel(page, "sheet-vehicle-actions");

      // Before jump-in: Accelerate pool = reaction(5) + pilot-ground-craft(4) = 9d6
      const accelerateRow = page
        .getByTestId("action-row")
        .filter({ hasText: "Accelerate" })
        .first();
      await expect(accelerateRow.getByTestId("pool-pill")).toContainText("9d6");

      // Start session and jump into vehicle
      await startRiggingSession(page);
      await expandPanel(page, "sheet-jump-in");
      await page.getByTestId("jump-in-dodge-scoot").click();
      await expect(page.getByTestId("jumped-in-status")).toBeVisible({ timeout: 5000 });

      // Re-expand vehicle-actions (may have re-rendered)
      await expandPanel(page, "sheet-vehicle-actions");

      // Control mode badge should show Jumped-In
      await expect(page.getByTestId("control-mode-badge")).toContainText("Jumped-In");

      // VCR bonus badge should be visible
      const accelerateRowAfter = page
        .getByTestId("action-row")
        .filter({ hasText: "Accelerate" })
        .first();
      await expect(accelerateRowAfter.getByTestId("vcr-bonus-badge")).toBeVisible();
      await expect(accelerateRowAfter.getByTestId("vcr-bonus-badge")).toContainText("+2 VCR");

      // Pool should now be 9 + 2 = 11d6
      await expect(accelerateRowAfter.getByTestId("pool-pill")).toContainText("11d6");
    });
  });

  // ---------------------------------------------------------------------------
  // 7. Non-rigger character (Step 16)
  // ---------------------------------------------------------------------------

  test.describe("Non-rigger character", () => {
    let testUserId: string;

    test.beforeEach(async ({ page }) => {
      testUserId = await signUpTestUser(page, "e2e-rigging");
      // Copy Whisper WITHOUT injecting rigging fields
      copyCharacterToUser(WHISPER_ID, testUserId);
    });

    test.afterEach(() => {
      if (testUserId) cleanupUserCharacters(testUserId);
    });

    test("non-rigger character shows no rigging panels", async ({ page }) => {
      await goToCharacterSheet(page, WHISPER_ID);

      // None of the rigging panels should be visible
      await expect(page.locator("#sheet-rigging-summary")).not.toBeVisible();
      await expect(page.locator("#sheet-drone-network")).not.toBeVisible();
      await expect(page.locator("#sheet-jump-in")).not.toBeVisible();
      await expect(page.locator("#sheet-vehicle-actions")).not.toBeVisible();
      await expect(page.locator("#sheet-autosofts")).not.toBeVisible();
    });
  });
});
