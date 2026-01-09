#!/usr/bin/env npx tsx
/**
 * Delete Wizard Draft Characters Migration Script
 *
 * This script finds and deletes draft characters that were created with the wizard
 * (metadata.creationMode === undefined). Sheet-created characters have
 * metadata.creationMode === "sheet" and are preserved.
 *
 * Usage:
 *   npx tsx scripts/delete-wizard-drafts.ts         # Dry run (default)
 *   npx tsx scripts/delete-wizard-drafts.ts --execute  # Actually delete files
 */

import fs from "fs";
import path from "path";

const CHARACTERS_DIR = path.join(process.cwd(), "data", "characters");

interface CharacterMetadata {
  creationState?: unknown;
  creationMode?: "sheet";
}

interface Character {
  id: string;
  name: string;
  status: "draft" | "active" | "retired" | "deleted";
  ownerId: string;
  createdAt: string;
  metadata?: CharacterMetadata;
}

interface DraftInfo {
  filePath: string;
  character: Character;
  userId: string;
}

function findWizardDrafts(): DraftInfo[] {
  const wizardDrafts: DraftInfo[] = [];

  if (!fs.existsSync(CHARACTERS_DIR)) {
    console.log("No characters directory found at:", CHARACTERS_DIR);
    return wizardDrafts;
  }

  // List all user directories
  const userDirs = fs.readdirSync(CHARACTERS_DIR);

  for (const userId of userDirs) {
    const userDir = path.join(CHARACTERS_DIR, userId);

    // Skip if not a directory
    if (!fs.statSync(userDir).isDirectory()) {
      continue;
    }

    // List all character files
    const characterFiles = fs.readdirSync(userDir).filter((f) => f.endsWith(".json"));

    for (const charFile of characterFiles) {
      const filePath = path.join(userDir, charFile);

      try {
        const content = fs.readFileSync(filePath, "utf-8");
        const character: Character = JSON.parse(content);

        // Check if this is a wizard draft (status=draft AND no creationMode set)
        if (
          character.status === "draft" &&
          (!character.metadata?.creationMode || character.metadata.creationMode !== "sheet")
        ) {
          wizardDrafts.push({
            filePath,
            character,
            userId,
          });
        }
      } catch (err) {
        console.error(`Error reading ${filePath}:`, err);
      }
    }
  }

  return wizardDrafts;
}

function main() {
  const args = process.argv.slice(2);
  const executeMode = args.includes("--execute");

  console.log("=".repeat(60));
  console.log("Delete Wizard Draft Characters Migration");
  console.log("=".repeat(60));
  console.log("");

  if (executeMode) {
    console.log("MODE: EXECUTE (files will be deleted)");
  } else {
    console.log("MODE: DRY RUN (no changes will be made)");
    console.log("Run with --execute to actually delete files");
  }

  console.log("");
  console.log("Scanning for wizard draft characters...");
  console.log("");

  const wizardDrafts = findWizardDrafts();

  if (wizardDrafts.length === 0) {
    console.log("No wizard draft characters found. Nothing to do.");
    return;
  }

  console.log(`Found ${wizardDrafts.length} wizard draft character(s):`);
  console.log("");

  for (const draft of wizardDrafts) {
    console.log(`  - ${draft.character.name || "(Unnamed)"}`);
    console.log(`    ID: ${draft.character.id}`);
    console.log(`    User: ${draft.userId}`);
    console.log(`    Created: ${draft.character.createdAt}`);
    console.log(`    File: ${draft.filePath}`);
    console.log("");
  }

  if (executeMode) {
    console.log("Deleting files...");
    console.log("");

    let deleted = 0;
    let errors = 0;

    for (const draft of wizardDrafts) {
      try {
        fs.unlinkSync(draft.filePath);
        console.log(`  ✓ Deleted: ${draft.filePath}`);
        deleted++;
      } catch (err) {
        console.error(`  ✗ Failed to delete ${draft.filePath}:`, err);
        errors++;
      }
    }

    console.log("");
    console.log("=".repeat(60));
    console.log(`Summary: ${deleted} deleted, ${errors} errors`);
    console.log("=".repeat(60));
  } else {
    console.log("=".repeat(60));
    console.log("DRY RUN COMPLETE - No files were modified");
    console.log("Run with --execute to delete these files");
    console.log("=".repeat(60));
  }
}

main();
