/**
 * Migration script for converting to unified ratings tables format
 *
 * This script transforms existing data structures to use the unified ratings table approach:
 * 1. Cyberware/Bioware: Consolidates duplicate "(Rating X)" entries into single items with ratings tables
 * 2. Gear: Converts ratingSpec formulas to explicit ratings tables
 * 3. Qualities: Converts levels[] arrays to ratings tables
 * 4. Adept Powers: Converts costType: "perLevel" + maxLevel to ratings tables
 *
 * Usage:
 *   pnpm tsx scripts/migrate-to-unified-ratings.ts <edition-code> [--dry-run]
 *
 * Example:
 *   pnpm tsx scripts/migrate-to-unified-ratings.ts sr5 --dry-run
 *   pnpm tsx scripts/migrate-to-unified-ratings.ts sr5
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { RatingTable, RatingTableValue } from "../lib/types/ratings";

// =============================================================================
// TYPES
// =============================================================================

interface AugmentationEntry {
  id: string;
  name: string;
  category?: string;
  essenceCost?: number;
  cost: number;
  availability: number;
  availabilitySuffix?: "R" | "F";
  capacity?: number;
  capacityCost?: number;
  description?: string;
  wirelessBonus?: string;
  page?: number;
  [key: string]: unknown;
}

interface GearEntry {
  id: string;
  name: string;
  category?: string;
  cost?: number;
  availability?: number;
  hasRating?: boolean;
  maxRating?: number;
  minRating?: number;
  costPerRating?: boolean;
  ratingSpec?: {
    rating?: {
      hasRating?: boolean;
      minRating?: number;
      maxRating?: number;
    };
    costScaling?: {
      baseValue: number;
      perRating: boolean;
      scalingType?: string;
    };
    availabilityScaling?: {
      baseValue: number;
      perRating: boolean;
    };
  };
  [key: string]: unknown;
}

interface QualityEntry {
  id: string;
  name: string;
  karmaCost?: number;
  karmaBonus?: number;
  levels?: Array<{
    level: number;
    name: string;
    karma: number;
    effects?: unknown[];
  }>;
  [key: string]: unknown;
}

interface AdeptPowerEntry {
  id: string;
  name: string;
  cost: number | null;
  costType: "fixed" | "perLevel" | "table";
  maxLevel?: number;
  [key: string]: unknown;
}

interface MigratedAugmentation extends Omit<
  AugmentationEntry,
  "essenceCost" | "cost" | "availability" | "availabilitySuffix" | "capacity"
> {
  hasRating?: boolean;
  minRating?: number;
  maxRating?: number;
  ratings?: RatingTable;
  // Base values for non-rated items or single-rating display
  essenceCost?: number;
  cost?: number;
  availability?: number;
  availabilitySuffix?: "R" | "F";
  capacity?: number;
}

interface MigratedGear extends Omit<GearEntry, "ratingSpec" | "costPerRating"> {
  ratings?: RatingTable;
}

interface MigratedQuality extends Omit<QualityEntry, "levels" | "karmaCost"> {
  hasRating?: boolean;
  minRating?: number;
  maxRating?: number;
  ratings?: RatingTable;
  karmaCost?: number; // Keep for non-leveled qualities
}

interface MigratedAdeptPower extends Omit<AdeptPowerEntry, "costType" | "maxLevel"> {
  hasRating?: boolean;
  minRating?: number;
  maxRating?: number;
  ratings?: RatingTable;
  powerPointCost?: number; // For fixed cost powers
}

interface MigrationStats {
  cyberware: { before: number; after: number; consolidated: number };
  bioware: { before: number; after: number; consolidated: number };
  gear: { converted: number };
  qualities: { converted: number };
  adeptPowers: { converted: number };
}

// =============================================================================
// AUGMENTATION MIGRATION (Cyberware/Bioware)
// =============================================================================

/**
 * Extract rating from augmentation name like "Cybereyes (Rating 2)"
 * Returns null if no rating found
 */
function extractRatingFromName(name: string): { baseName: string; rating: number } | null {
  const match = name.match(/^(.+?)\s*\(Rating\s+(\d+)\)$/i);
  if (match) {
    return {
      baseName: match[1].trim(),
      rating: parseInt(match[2], 10),
    };
  }
  return null;
}

/**
 * Consolidate augmentation entries with "(Rating X)" pattern into single items with ratings tables
 */
function migrateAugmentationCatalog(catalog: AugmentationEntry[]): {
  items: MigratedAugmentation[];
  stats: { before: number; after: number; consolidated: number };
} {
  const grouped = new Map<string, AugmentationEntry[]>();
  const nonRatedItems: AugmentationEntry[] = [];

  // Group items by base name
  for (const item of catalog) {
    const parsed = extractRatingFromName(item.name);
    if (parsed) {
      const existing = grouped.get(parsed.baseName) || [];
      existing.push(item);
      grouped.set(parsed.baseName, existing);
    } else {
      nonRatedItems.push(item);
    }
  }

  const migratedItems: MigratedAugmentation[] = [];
  let consolidatedCount = 0;

  // Process grouped items into unified ratings tables
  for (const [baseName, items] of grouped) {
    // Sort by rating
    items.sort((a, b) => {
      const ratingA = extractRatingFromName(a.name)?.rating || 0;
      const ratingB = extractRatingFromName(b.name)?.rating || 0;
      return ratingA - ratingB;
    });

    // Use first item as template for non-rating properties
    const template = items[0];
    const ratings: RatingTable = {};
    let minRating = Infinity;
    let maxRating = -Infinity;

    for (const item of items) {
      const parsed = extractRatingFromName(item.name);
      if (!parsed) continue;

      const rating = parsed.rating;
      minRating = Math.min(minRating, rating);
      maxRating = Math.max(maxRating, rating);

      const ratingValue: RatingTableValue = {
        cost: item.cost,
        availability: item.availability,
      };

      if (item.availabilitySuffix) {
        ratingValue.availabilitySuffix = item.availabilitySuffix;
      }
      if (item.essenceCost !== undefined) {
        ratingValue.essenceCost = item.essenceCost;
      }
      if (item.capacity !== undefined) {
        ratingValue.capacity = item.capacity;
      }
      if (item.capacityCost !== undefined) {
        ratingValue.capacityCost = item.capacityCost;
      }

      ratings[rating] = ratingValue;
    }

    // Create consolidated item
    const baseId = template.id.replace(/-\d+$/, ""); // Remove trailing -1, -2, etc.
    const migrated: MigratedAugmentation = {
      id: baseId,
      name: baseName,
      hasRating: true,
      minRating: minRating === Infinity ? 1 : minRating,
      maxRating: maxRating === -Infinity ? 1 : maxRating,
      ratings,
    };

    // Copy non-rating properties from template
    if (template.category) migrated.category = template.category;
    if (template.description) migrated.description = template.description;
    if (template.wirelessBonus) migrated.wirelessBonus = template.wirelessBonus;
    if (template.page) migrated.page = template.page;

    // Copy any other properties that aren't rating-specific
    for (const [key, value] of Object.entries(template)) {
      if (
        ![
          "id",
          "name",
          "category",
          "description",
          "wirelessBonus",
          "page",
          "essenceCost",
          "cost",
          "availability",
          "availabilitySuffix",
          "capacity",
          "capacityCost",
        ].includes(key)
      ) {
        (migrated as Record<string, unknown>)[key] = value;
      }
    }

    migratedItems.push(migrated);
    consolidatedCount += items.length - 1; // -1 because one item remains
  }

  // Add non-rated items as-is
  for (const item of nonRatedItems) {
    migratedItems.push(item as MigratedAugmentation);
  }

  return {
    items: migratedItems,
    stats: {
      before: catalog.length,
      after: migratedItems.length,
      consolidated: consolidatedCount,
    },
  };
}

// =============================================================================
// GEAR MIGRATION
// =============================================================================

/**
 * Convert gear ratingSpec to explicit ratings table
 */
function migrateGearItem(item: GearEntry): { item: MigratedGear; converted: boolean } {
  if (!item.hasRating || !item.ratingSpec) {
    // Remove legacy ratingSpec if present but not needed
    const { ratingSpec, costPerRating, ...rest } = item;
    return { item: rest as MigratedGear, converted: false };
  }

  const { ratingSpec, costPerRating, ...rest } = item;
  const migrated: MigratedGear = { ...rest };

  const minRating = ratingSpec.rating?.minRating ?? item.minRating ?? 1;
  const maxRating = ratingSpec.rating?.maxRating ?? item.maxRating ?? 6;

  migrated.minRating = minRating;
  migrated.maxRating = maxRating;

  // Build ratings table from scaling formulas
  const ratings: RatingTable = {};
  const baseCost = ratingSpec.costScaling?.baseValue ?? item.cost ?? 0;
  const costPerRatingFlag = ratingSpec.costScaling?.perRating ?? costPerRating ?? false;
  const baseAvail = ratingSpec.availabilityScaling?.baseValue ?? item.availability ?? 0;
  const availPerRating = ratingSpec.availabilityScaling?.perRating ?? false;

  for (let rating = minRating; rating <= maxRating; rating++) {
    const ratingValue: RatingTableValue = {
      cost: costPerRatingFlag ? baseCost * rating : baseCost,
      availability: availPerRating ? baseAvail * rating : baseAvail,
    };
    ratings[rating] = ratingValue;
  }

  migrated.ratings = ratings;

  // Remove the base cost/availability since they're now in the ratings table
  delete migrated.cost;
  delete migrated.availability;

  return { item: migrated, converted: true };
}

/**
 * Migrate all gear in a category
 */
function migrateGearCategory(items: GearEntry[]): { items: MigratedGear[]; converted: number } {
  const migrated: MigratedGear[] = [];
  let converted = 0;

  for (const item of items) {
    const result = migrateGearItem(item);
    migrated.push(result.item);
    if (result.converted) converted++;
  }

  return { items: migrated, converted };
}

// =============================================================================
// QUALITY MIGRATION
// =============================================================================

/**
 * Convert quality with levels array to ratings table
 */
function migrateQuality(quality: QualityEntry): { quality: MigratedQuality; converted: boolean } {
  if (!quality.levels || quality.levels.length === 0) {
    return { quality: quality as MigratedQuality, converted: false };
  }

  const { levels, karmaCost, ...rest } = quality;
  const migrated: MigratedQuality = { ...rest };

  // Build ratings table from levels
  const ratings: RatingTable = {};
  let minRating = Infinity;
  let maxRating = -Infinity;

  for (const level of levels) {
    const rating = level.level;
    minRating = Math.min(minRating, rating);
    maxRating = Math.max(maxRating, rating);

    const ratingValue: RatingTableValue = {
      cost: 0, // Qualities use karma, not nuyen
      availability: 0,
      karmaCost: level.karma,
    };

    // Preserve level-specific effects if present
    if (level.effects && level.effects.length > 0) {
      ratingValue.effects = { levelEffects: level.effects };
    }

    ratings[rating] = ratingValue;
  }

  migrated.hasRating = true;
  migrated.minRating = minRating === Infinity ? 1 : minRating;
  migrated.maxRating = maxRating === -Infinity ? 1 : maxRating;
  migrated.ratings = ratings;

  return { quality: migrated, converted: true };
}

/**
 * Migrate all qualities
 */
function migrateQualities(qualities: QualityEntry[]): {
  qualities: MigratedQuality[];
  converted: number;
} {
  const migrated: MigratedQuality[] = [];
  let converted = 0;

  for (const quality of qualities) {
    const result = migrateQuality(quality);
    migrated.push(result.quality);
    if (result.converted) converted++;
  }

  return { qualities: migrated, converted };
}

// =============================================================================
// ADEPT POWER MIGRATION
// =============================================================================

/**
 * Convert adept power with perLevel cost to ratings table
 */
function migrateAdeptPower(power: AdeptPowerEntry): {
  power: MigratedAdeptPower;
  converted: boolean;
} {
  if (power.costType !== "perLevel" || !power.maxLevel || power.maxLevel <= 1) {
    // Keep fixed cost powers as-is, just rename cost to powerPointCost
    const { costType, maxLevel, cost, ...rest } = power;
    const migrated: MigratedAdeptPower = { ...rest };
    if (cost !== null) {
      migrated.powerPointCost = cost;
    }
    return { power: migrated, converted: false };
  }

  const { costType, maxLevel, cost, ...rest } = power;
  const migrated: MigratedAdeptPower = { ...rest };

  // Build ratings table
  const ratings: RatingTable = {};
  const costPerLevel = cost ?? 0;

  for (let level = 1; level <= maxLevel; level++) {
    ratings[level] = {
      cost: 0, // Adept powers use PP, not nuyen
      availability: 0,
      powerPointCost: costPerLevel * level,
    };
  }

  migrated.hasRating = true;
  migrated.minRating = 1;
  migrated.maxRating = maxLevel;
  migrated.ratings = ratings;

  return { power: migrated, converted: true };
}

/**
 * Migrate all adept powers
 */
function migrateAdeptPowers(powers: AdeptPowerEntry[]): {
  powers: MigratedAdeptPower[];
  converted: number;
} {
  const migrated: MigratedAdeptPower[] = [];
  let converted = 0;

  for (const power of powers) {
    const result = migrateAdeptPower(power);
    migrated.push(result.power);
    if (result.converted) converted++;
  }

  return { powers: migrated, converted };
}

// =============================================================================
// MAIN MIGRATION
// =============================================================================

/**
 * Migrate an entire edition's core rulebook
 */
function migrateEditionData(
  data: Record<string, unknown>,
  dryRun: boolean
): { data: Record<string, unknown>; stats: MigrationStats } {
  const stats: MigrationStats = {
    cyberware: { before: 0, after: 0, consolidated: 0 },
    bioware: { before: 0, after: 0, consolidated: 0 },
    gear: { converted: 0 },
    qualities: { converted: 0 },
    adeptPowers: { converted: 0 },
  };

  const modules = data.modules as Record<string, unknown>;
  if (!modules) {
    console.error("No modules found in data");
    return { data, stats };
  }

  // Migrate cyberware
  const cyberwareModule = modules.cyberware as { payload?: { catalog?: AugmentationEntry[] } };
  if (cyberwareModule?.payload?.catalog) {
    console.log(`  Migrating cyberware (${cyberwareModule.payload.catalog.length} items)...`);
    const result = migrateAugmentationCatalog(cyberwareModule.payload.catalog);
    stats.cyberware = result.stats;
    if (!dryRun) {
      cyberwareModule.payload.catalog = result.items as AugmentationEntry[];
    }
    console.log(
      `    Consolidated ${stats.cyberware.consolidated} entries: ${stats.cyberware.before} -> ${stats.cyberware.after}`
    );
  }

  // Migrate bioware
  const biowareModule = modules.bioware as { payload?: { catalog?: AugmentationEntry[] } };
  if (biowareModule?.payload?.catalog) {
    console.log(`  Migrating bioware (${biowareModule.payload.catalog.length} items)...`);
    const result = migrateAugmentationCatalog(biowareModule.payload.catalog);
    stats.bioware = result.stats;
    if (!dryRun) {
      biowareModule.payload.catalog = result.items as AugmentationEntry[];
    }
    console.log(
      `    Consolidated ${stats.bioware.consolidated} entries: ${stats.bioware.before} -> ${stats.bioware.after}`
    );
  }

  // Migrate gear (multiple categories)
  const gearModule = modules.gear as { payload?: Record<string, GearEntry[]> };
  if (gearModule?.payload) {
    console.log("  Migrating gear...");
    const gearPayload = gearModule.payload;
    for (const [category, items] of Object.entries(gearPayload)) {
      if (Array.isArray(items) && items.length > 0) {
        const result = migrateGearCategory(items);
        stats.gear.converted += result.converted;
        if (!dryRun) {
          gearPayload[category] = result.items as GearEntry[];
        }
        if (result.converted > 0) {
          console.log(`    ${category}: ${result.converted} items converted`);
        }
      }
    }
  }

  // Migrate qualities
  const qualitiesModule = modules.qualities as {
    payload?: { positive?: QualityEntry[]; negative?: QualityEntry[] };
  };
  if (qualitiesModule?.payload) {
    console.log("  Migrating qualities...");
    if (qualitiesModule.payload.positive) {
      const result = migrateQualities(qualitiesModule.payload.positive);
      stats.qualities.converted += result.converted;
      if (!dryRun) {
        qualitiesModule.payload.positive = result.qualities as QualityEntry[];
      }
      if (result.converted > 0) {
        console.log(`    positive: ${result.converted} qualities converted`);
      }
    }
    if (qualitiesModule.payload.negative) {
      const result = migrateQualities(qualitiesModule.payload.negative);
      stats.qualities.converted += result.converted;
      if (!dryRun) {
        qualitiesModule.payload.negative = result.qualities as QualityEntry[];
      }
      if (result.converted > 0) {
        console.log(`    negative: ${result.converted} qualities converted`);
      }
    }
  }

  // Migrate adept powers
  const adeptPowersModule = modules.adeptPowers as { payload?: { powers?: AdeptPowerEntry[] } };
  if (adeptPowersModule?.payload?.powers) {
    console.log(`  Migrating adept powers (${adeptPowersModule.payload.powers.length} powers)...`);
    const result = migrateAdeptPowers(adeptPowersModule.payload.powers);
    stats.adeptPowers.converted = result.converted;
    if (!dryRun) {
      adeptPowersModule.payload.powers = result.powers as AdeptPowerEntry[];
    }
    console.log(`    ${result.converted} powers converted`);
  }

  return { data, stats };
}

// =============================================================================
// CLI
// =============================================================================

function main(): void {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const editionCode = args.find((arg) => !arg.startsWith("--"));

  if (!editionCode) {
    console.error(
      "Usage: pnpm tsx scripts/migrate-to-unified-ratings.ts <edition-code> [--dry-run]"
    );
    console.error("Example: pnpm tsx scripts/migrate-to-unified-ratings.ts sr5 --dry-run");
    process.exit(1);
  }

  const dataDir = join(__dirname, "..", "data", "editions", editionCode);
  const coreRulebookPath = join(dataDir, "core-rulebook.json");

  console.log(`\nMigrating ${editionCode} to unified ratings tables...`);
  console.log(`Input: ${coreRulebookPath}`);
  if (dryRun) {
    console.log("\n=== DRY RUN MODE - No files will be modified ===\n");
  }

  try {
    const inputContent = readFileSync(coreRulebookPath, "utf-8");
    const inputData = JSON.parse(inputContent);

    const { data: migratedData, stats } = migrateEditionData(inputData, dryRun);

    console.log("\n=== Migration Summary ===");
    console.log(
      `Cyberware: ${stats.cyberware.before} -> ${stats.cyberware.after} (consolidated ${stats.cyberware.consolidated})`
    );
    console.log(
      `Bioware: ${stats.bioware.before} -> ${stats.bioware.after} (consolidated ${stats.bioware.consolidated})`
    );
    console.log(`Gear: ${stats.gear.converted} items converted to ratings tables`);
    console.log(`Qualities: ${stats.qualities.converted} qualities converted`);
    console.log(`Adept Powers: ${stats.adeptPowers.converted} powers converted`);

    if (!dryRun) {
      writeFileSync(coreRulebookPath, JSON.stringify(migratedData, null, 2), "utf-8");
      console.log(`\nOutput written to: ${coreRulebookPath}`);
    } else {
      console.log("\nRun without --dry-run to apply changes.");
    }
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

main();
