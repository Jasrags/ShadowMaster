#!/usr/bin/env npx tsx

/**
 * Character synchronization utility for Shadow Master
 *
 * Synchronizes character items (weapons, armor, gear) with the core rulebook,
 * ensuring character data matches current ruleset definitions.
 *
 * Usage:
 *   npx tsx scripts/sync-character.ts <character-id> [--dry-run]
 *   npx tsx scripts/sync-character.ts --help
 *
 * Examples:
 *   npx tsx scripts/sync-character.ts a1b2c3d4-e5f6-7890-abcd-ef1234567890
 *   npx tsx scripts/sync-character.ts a1b2c3d4-e5f6-7890 --dry-run
 */

import fs from "fs";
import path from "path";

const CORE_RULEBOOK_PATH = path.join(process.cwd(), "data/editions/sr5/core-rulebook.json");
const CHARACTERS_BASE_DIR = path.join(process.cwd(), "data/characters");

const USAGE = `
Shadow Master Character Sync Utility

Synchronizes character items with the core rulebook, ensuring equipment
stats match current ruleset definitions.

Usage:
  npx tsx scripts/sync-character.ts <character-id> [options]

Options:
  --dry-run           Preview changes without saving
  --verbose, -v       Show detailed sync information
  --help, -h          Show this help message

Examples:
  npx tsx scripts/sync-character.ts a1b2c3d4-e5f6-7890-abcd-ef1234567890
  npx tsx scripts/sync-character.ts a1b2c3d4-e5f6-7890 --dry-run
  npx tsx scripts/sync-character.ts a1b2c3d4-e5f6-7890 --dry-run --verbose

What gets synchronized:
  - Weapons (damage, accuracy, AP, etc.)
  - Armor (ratings, capacity, etc.)
  - Gear (availability, cost, etc.)
  - Vehicles (stats, handling, etc.)
  - Qualities (verified against rulebook)

What is preserved:
  - Character-specific data (quantity, equipped status)
  - Custom modifications
  - Character ownership and ID
`;

interface QualityData {
  id: string;
  name?: string;
}

interface RulesetData {
  modules: {
    qualities: { payload: { positive: QualityData[]; negative: QualityData[]; racial?: QualityData[] } };
    gear: { payload: Record<string, unknown> };
  };
}

interface SyncResult {
  itemsSynced: number;
  qualitiesVerified: number;
  qualitiesMissing: string[];
  changes: { item: string; field: string; oldValue: unknown; newValue: unknown }[];
}

/**
 * Find character file by ID
 */
function findCharacterFile(dir: string, characterId: string): string | null {
  if (!fs.existsSync(dir)) return null;

  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      const found = findCharacterFile(fullPath, characterId);
      if (found) return found;
    } else if (file === `${characterId}.json`) {
      return fullPath;
    }
  }
  return null;
}

/**
 * Sync character with rulebook
 */
async function syncCharacter(
  characterId: string,
  dryRun: boolean,
  verbose: boolean
): Promise<void> {
  console.log(`\nShadow Master Character Sync`);
  console.log("=".repeat(50));
  console.log(`Character ID: ${characterId}`);

  if (dryRun) {
    console.log("\n[DRY RUN] No changes will be saved\n");
  }

  // Load rulebook
  if (!fs.existsSync(CORE_RULEBOOK_PATH)) {
    console.error(`Error: Core rulebook not found at ${CORE_RULEBOOK_PATH}`);
    process.exit(1);
  }

  const rulebook: RulesetData = JSON.parse(fs.readFileSync(CORE_RULEBOOK_PATH, "utf-8"));

  // Find character file
  const characterPath = findCharacterFile(CHARACTERS_BASE_DIR, characterId);
  if (!characterPath) {
    console.error(`Error: Character file ${characterId}.json not found`);
    process.exit(1);
  }

  console.log(`Found: ${characterPath}`);

  // Load character
  const character = JSON.parse(fs.readFileSync(characterPath, "utf-8"));
  const charData = character.creationState?.data || character;

  const result: SyncResult = {
    itemsSynced: 0,
    qualitiesVerified: 0,
    qualitiesMissing: [],
    changes: [],
  };

  // Flatten all catalog items from gear payload
  const gearPayload = rulebook.modules.gear.payload;
  const allCatalogItems: Record<string, unknown>[] = [];

  Object.keys(gearPayload).forEach((key) => {
    if (key === "categories") return;
    const payloadValue = gearPayload[key];
    if (key === "weapons" && payloadValue && typeof payloadValue === "object") {
      const weapons = payloadValue as Record<string, unknown>;
      Object.values(weapons).forEach((weaponList) => {
        if (Array.isArray(weaponList)) {
          allCatalogItems.push(...(weaponList as Record<string, unknown>[]));
        }
      });
    } else if (Array.isArray(payloadValue)) {
      allCatalogItems.push(...(payloadValue as Record<string, unknown>[]));
    }
  });

  // Sync items function
  const syncItems = (items: Record<string, unknown>[] | undefined, category: string) => {
    if (!items) return;

    items.forEach((item) => {
      const itemId = (item.catalogId || item.id || item.name) as string | undefined;
      if (!itemId) return;

      const rulebookItem = allCatalogItems.find((ri) => {
        const riId = ri.id as string | undefined;
        const riName = ri.name as string | undefined;
        return (
          riId === itemId ||
          riName === itemId ||
          riId === (item.id as string) ||
          riName === (item.name as string)
        );
      });

      if (rulebookItem) {
        const itemName = (item.name || item.id) as string;
        let itemChanged = false;

        Object.keys(rulebookItem).forEach((key) => {
          // Preserve character-specific fields
          if (key === "id" || key === "name" || key === "quantity" || key === "equipped") {
            return;
          }

          const oldValue = item[key];
          const newValue = rulebookItem[key];

          if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
            if (verbose) {
              result.changes.push({
                item: itemName,
                field: key,
                oldValue,
                newValue,
              });
            }
            item[key] = newValue;
            itemChanged = true;
          }
        });

        if (itemChanged) {
          result.itemsSynced++;
          if (verbose) {
            console.log(`  Synced: ${itemName} (${category})`);
          }
        }
      }
    });
  };

  // Sync qualities function
  const syncQualities = (
    charQuals: (string | { id: string })[] | undefined,
    rulebookQuals: QualityData[],
    category: string
  ) => {
    if (!charQuals) return;

    charQuals.forEach((q) => {
      const qId = typeof q === "string" ? q : q.id;
      const rbQ = rulebookQuals.find((rq) => rq.id === qId || rq.name === qId);
      if (rbQ) {
        result.qualitiesVerified++;
        if (verbose) {
          console.log(`  Verified: ${qId} (${category})`);
        }
      } else {
        result.qualitiesMissing.push(`${qId} (${category})`);
        console.warn(`  Warning: Quality not found in rulebook: ${qId}`);
      }
    });
  };

  console.log("\nSyncing items...");

  // Sync all item categories
  syncItems(charData.weapons as Record<string, unknown>[] | undefined, "weapons");
  syncItems(charData.armor as Record<string, unknown>[] | undefined, "armor");
  syncItems(charData.gear as Record<string, unknown>[] | undefined, "gear");
  syncItems(charData.vehicles as Record<string, unknown>[] | undefined, "vehicles");

  // Also sync top-level arrays (for finalized characters)
  if (character.weapons) syncItems(character.weapons as Record<string, unknown>[], "weapons");
  if (character.armor) syncItems(character.armor as Record<string, unknown>[], "armor");
  if (character.gear) syncItems(character.gear as Record<string, unknown>[], "gear");
  if (character.vehicles) syncItems(character.vehicles as Record<string, unknown>[], "vehicles");

  console.log("\nVerifying qualities...");

  // Sync qualities
  const posQuals = rulebook.modules.qualities.payload.positive;
  const negQuals = rulebook.modules.qualities.payload.negative;

  syncQualities(charData.positiveQualities, posQuals, "positive");
  syncQualities(charData.negativeQualities, negQuals, "negative");
  if (character.positiveQualities) {
    syncQualities(character.positiveQualities, posQuals, "positive");
  }
  if (character.negativeQualities) {
    syncQualities(character.negativeQualities, negQuals, "negative");
  }

  // Show detailed changes if verbose
  if (verbose && result.changes.length > 0) {
    console.log("\nDetailed changes:");
    for (const change of result.changes) {
      console.log(`  ${change.item}.${change.field}:`);
      console.log(`    Old: ${JSON.stringify(change.oldValue)}`);
      console.log(`    New: ${JSON.stringify(change.newValue)}`);
    }
  }

  // Summary
  console.log("\n--- Summary ---");
  console.log(`  Items synced:       ${result.itemsSynced}`);
  console.log(`  Qualities verified: ${result.qualitiesVerified}`);
  console.log(`  Qualities missing:  ${result.qualitiesMissing.length}`);

  if (result.qualitiesMissing.length > 0) {
    console.log("\n  Missing qualities:");
    for (const q of result.qualitiesMissing) {
      console.log(`    - ${q}`);
    }
  }

  // Save if not dry run
  if (!dryRun) {
    fs.writeFileSync(characterPath, JSON.stringify(character, null, 2));
    console.log(`\nCharacter saved to: ${characterPath}`);
  } else {
    console.log("\n[DRY RUN] No changes were saved");
  }

  console.log();
}

/**
 * Parse command line arguments
 */
function parseArgs(args: string[]): {
  characterId: string;
  dryRun: boolean;
  verbose: boolean;
  help: boolean;
} {
  const result = {
    characterId: "",
    dryRun: false,
    verbose: false,
    help: false,
  };

  for (const arg of args) {
    if (arg === "--help" || arg === "-h") {
      result.help = true;
    } else if (arg === "--dry-run") {
      result.dryRun = true;
    } else if (arg === "--verbose" || arg === "-v") {
      result.verbose = true;
    } else if (!arg.startsWith("-")) {
      result.characterId = arg;
    }
  }

  return result;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const { characterId, dryRun, verbose, help } = parseArgs(args);

  if (help) {
    console.log(USAGE);
    process.exit(0);
  }

  if (!characterId) {
    console.error("Error: Character ID is required");
    console.log("\nUsage: npx tsx scripts/sync-character.ts <character-id> [--dry-run]");
    process.exit(1);
  }

  try {
    await syncCharacter(characterId, dryRun, verbose);
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
