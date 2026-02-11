/**
 * One-off migration: Backfill weight from catalog data onto character weapons and gear.
 *
 * During character creation, ArmorPanel correctly copies `weight` from catalog data,
 * but WeaponsPanel and GearPanel were missing this step. This script retroactively
 * populates weight on existing character items by looking up their catalogId in the
 * edition catalog.
 *
 * Usage:
 *   npx tsx data/migrations/backfill-item-weights.ts [--dry-run]
 */

import path from "path";
import fs from "fs/promises";

// ---------------------------------------------------------------------------
// Types (inline to avoid import path issues in a standalone script)
// ---------------------------------------------------------------------------

interface GearItem {
  id: string;
  catalogId?: string;
  name: string;
  category?: string;
  weight?: number;
  [key: string]: unknown;
}

interface Weapon extends GearItem {
  damage: string;
  ap: number;
}

interface Character {
  id: string;
  ownerId: string;
  name: string;
  editionCode?: string;
  weapons?: Weapon[];
  gear?: GearItem[];
  [key: string]: unknown;
}

interface CatalogItem {
  id: string;
  name: string;
  weight?: number;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DATA_DIR = path.join(process.cwd(), "data");
const CHARACTERS_DIR = path.join(DATA_DIR, "characters");
const EDITIONS_DIR = path.join(DATA_DIR, "editions");

async function readJson<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

async function writeJson<T>(filePath: string, data: T): Promise<void> {
  const tempPath = `${filePath}.tmp`;
  await fs.writeFile(tempPath, JSON.stringify(data, null, 2), "utf-8");
  await fs.rename(tempPath, filePath);
}

async function listSubdirectories(dir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name);
  } catch {
    return [];
  }
}

async function listJsonFiles(dir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir);
    return entries.filter((e) => e.endsWith(".json"));
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Load catalog weapon/gear data for an edition
// ---------------------------------------------------------------------------

async function loadCatalogWeightMap(editionCode: string): Promise<Map<string, number>> {
  const weightMap = new Map<string, number>();

  // Load core-rulebook.json for the edition
  const bookPath = path.join(EDITIONS_DIR, editionCode, "core-rulebook.json");

  let bookPayload: Record<string, unknown>;
  try {
    bookPayload = await readJson<Record<string, unknown>>(bookPath);
  } catch {
    console.warn(`  Could not load catalog for edition '${editionCode}'`);
    return weightMap;
  }

  // Extract gear module: modules is an object keyed by module name
  const modules = bookPayload.modules as
    | Record<string, { mergeStrategy: string; payload: Record<string, unknown> }>
    | undefined;

  if (!modules?.gear) return weightMap;

  const data = modules.gear.payload;

  {
    // Weapons are nested: data.weapons.{subcategory}[]
    const weapons = data.weapons as Record<string, CatalogItem[]> | undefined;
    if (weapons) {
      for (const subcatItems of Object.values(weapons)) {
        if (!Array.isArray(subcatItems)) continue;
        for (const item of subcatItems) {
          if (item.id && item.weight != null) {
            weightMap.set(item.id, item.weight);
          }
        }
      }
    }

    // Gear categories are flat arrays
    const gearCategories = [
      "electronics",
      "tools",
      "survival",
      "medical",
      "security",
      "miscellaneous",
      "rfidTags",
      "commlinks",
      "cyberdecks",
      "industrialChemicals",
      "visionEnhancements",
      "audioEnhancements",
    ];

    for (const cat of gearCategories) {
      const items = data[cat] as CatalogItem[] | undefined;
      if (!Array.isArray(items)) continue;
      for (const item of items) {
        if (item.id && item.weight != null) {
          weightMap.set(item.id, item.weight);
        }
      }
    }
  }

  return weightMap;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const dryRun = process.argv.includes("--dry-run");

  if (dryRun) {
    console.log("=== DRY RUN — no files will be modified ===\n");
  }

  console.log("Backfill item weights from catalog data\n");

  // Cache catalog weight maps by edition
  const catalogCache = new Map<string, Map<string, number>>();

  const userDirs = await listSubdirectories(CHARACTERS_DIR);
  let totalCharacters = 0;
  let totalUpdated = 0;
  let totalWeaponsFixed = 0;
  let totalGearFixed = 0;

  for (const userId of userDirs) {
    const userDir = path.join(CHARACTERS_DIR, userId);
    const files = await listJsonFiles(userDir);

    for (const file of files) {
      const filePath = path.join(userDir, file);
      const character = await readJson<Character>(filePath);
      totalCharacters++;

      const editionCode = character.editionCode || "sr5";

      // Load catalog if not cached
      if (!catalogCache.has(editionCode)) {
        console.log(`Loading catalog for edition '${editionCode}'...`);
        catalogCache.set(editionCode, await loadCatalogWeightMap(editionCode));
      }
      const weightMap = catalogCache.get(editionCode)!;

      let changed = false;
      let weaponsFixed = 0;
      let gearFixed = 0;

      // Backfill weapons
      if (character.weapons) {
        for (const weapon of character.weapons) {
          if (weapon.weight != null) continue; // already has weight
          const catalogId = weapon.catalogId || weapon.id?.split("-")[0];
          if (!catalogId) continue;
          const weight = weightMap.get(catalogId);
          if (weight != null) {
            weapon.weight = weight;
            changed = true;
            weaponsFixed++;
          }
        }
      }

      // Backfill gear
      if (character.gear) {
        for (const gear of character.gear) {
          if (gear.weight != null) continue; // already has weight
          // catalogId may not exist on older gear items; try to extract from id
          const catalogId = gear.catalogId || gear.id?.replace(/-\d+$/, "");
          if (!catalogId) continue;
          const weight = weightMap.get(catalogId);
          if (weight != null) {
            gear.weight = weight;
            changed = true;
            gearFixed++;
          }
        }
      }

      if (changed) {
        totalUpdated++;
        totalWeaponsFixed += weaponsFixed;
        totalGearFixed += gearFixed;

        console.log(
          `  ${character.name}: ${weaponsFixed} weapon(s), ${gearFixed} gear item(s) updated`
        );

        if (!dryRun) {
          await writeJson(filePath, character);
        }
      }
    }
  }

  console.log("\n--- Summary ---");
  console.log(`Characters scanned: ${totalCharacters}`);
  console.log(`Characters updated: ${totalUpdated}`);
  console.log(`Weapons fixed:      ${totalWeaponsFixed}`);
  console.log(`Gear items fixed:   ${totalGearFixed}`);

  if (dryRun) {
    console.log("\n(Dry run — no files were modified)");
  }
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
