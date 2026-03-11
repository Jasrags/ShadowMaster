/**
 * Shared E2E file-system fixtures.
 *
 * Provides helpers for copying, reading, writing, and cleaning up
 * character and campaign files used across multiple E2E specs.
 */

import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// Path constants
// ---------------------------------------------------------------------------

export const DATA_DIR = path.resolve("data");
export const CHARACTERS_DIR = path.join(DATA_DIR, "characters");
export const CAMPAIGNS_DIR = path.join(DATA_DIR, "campaigns");

/** The admin/seed user who owns the fixture characters on disk. */
export const ORIGINAL_OWNER = "b7e99950-bbeb-40ee-9139-ae5b2e9a2a0c";

// ---------------------------------------------------------------------------
// Known fixture character IDs
// ---------------------------------------------------------------------------

/** Whisper — Adept, active, Magic 5/6 */
export const WHISPER_ID = "0bd8f72f-b5d9-45b7-a530-0c7f462257a1";

/** Glitch — Technomancer, Resonance with essence hole */
export const GLITCH_ID = "b04cc67c-d31c-4f7e-9b89-54e38f163894";

// ---------------------------------------------------------------------------
// Character file helpers
// ---------------------------------------------------------------------------

/**
 * Copy a fixture character from the original owner's directory into a
 * test user's directory, rewriting `ownerId` so the app treats it as theirs.
 */
export function copyCharacterToUser(characterId: string, userId: string): void {
  const srcFile = path.join(CHARACTERS_DIR, ORIGINAL_OWNER, `${characterId}.json`);
  if (!fs.existsSync(srcFile)) return;

  const destDir = path.join(CHARACTERS_DIR, userId);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const charData = JSON.parse(fs.readFileSync(srcFile, "utf-8"));
  charData.ownerId = userId;
  fs.writeFileSync(path.join(destDir, `${characterId}.json`), JSON.stringify(charData, null, 2));
}

/** Read a character JSON file for a given user. */
export function readCharacterFromUser(
  characterId: string,
  userId: string
): Record<string, unknown> {
  const filePath = path.join(CHARACTERS_DIR, userId, `${characterId}.json`);
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

/** Write (overwrite) a character JSON file for a given user. */
export function writeCharacterForUser(
  characterId: string,
  userId: string,
  data: Record<string, unknown>
): void {
  const filePath = path.join(CHARACTERS_DIR, userId, `${characterId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

/**
 * Delete all character files for a test user and remove the directory.
 * Safe to call even if the directory doesn't exist.
 */
export function cleanupUserCharacters(userId: string): void {
  const destDir = path.join(CHARACTERS_DIR, userId);
  if (!fs.existsSync(destDir)) return;
  for (const file of fs.readdirSync(destDir)) {
    fs.unlinkSync(path.join(destDir, file));
  }
  fs.rmdirSync(destDir);
}

// ---------------------------------------------------------------------------
// Campaign file helpers
// ---------------------------------------------------------------------------

/** Remove a campaign JSON file and its subdirectory (if any). */
export function cleanupCampaign(campaignId: string): void {
  const campaignFile = path.join(CAMPAIGNS_DIR, `${campaignId}.json`);
  if (fs.existsSync(campaignFile)) fs.unlinkSync(campaignFile);

  const campaignDir = path.join(CAMPAIGNS_DIR, campaignId);
  if (fs.existsSync(campaignDir)) {
    fs.rmSync(campaignDir, { recursive: true, force: true });
  }
}
