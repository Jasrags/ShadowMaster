/**
 * Migration script for converting legacy rating format to new unified format
 *
 * Usage:
 *   pnpm tsx scripts/migrate-rating-format.ts <input-file> <output-file> [--dry-run]
 *
 * This script converts items with legacy rating properties (hasRating, costPerRating, etc.)
 * to the new unified CatalogItemRatingSpec format.
 *
 * Note: Since convertLegacyRatingSpec() provides backward compatibility,
 * this migration is optional but recommended for data consistency.
 */

import { readFileSync, writeFileSync } from "fs";
import { convertLegacyRatingSpec } from "../lib/rules/ratings";
import type { CatalogItemRatingSpec } from "../lib/types/ratings";

interface LegacyItem {
  id?: string;
  name?: string;
  hasRating?: boolean;
  maxRating?: number;
  minRating?: number;
  cost?: number;
  costPerRating?: boolean;
  availability?: number;
  availabilityPerRating?: boolean;
  essenceCost?: number;
  essencePerRating?: boolean;
  capacityCost?: number;
  capacityPerRating?: boolean;
  [key: string]: unknown;
}

interface MigratedItem extends LegacyItem {
  ratingSpec?: CatalogItemRatingSpec;
}

/**
 * Check if an item has legacy rating properties
 */
function hasLegacyRatingProperties(item: LegacyItem): boolean {
  return (
    item.hasRating === true ||
    item.maxRating !== undefined ||
    item.minRating !== undefined ||
    item.costPerRating === true ||
    item.availabilityPerRating === true ||
    item.essencePerRating === true ||
    item.capacityPerRating === true
  );
}

/**
 * Migrate a single item from legacy format to new format
 */
function migrateItem(item: LegacyItem): MigratedItem {
  // If item doesn't have legacy rating properties, return as-is
  if (!hasLegacyRatingProperties(item)) {
    return item as MigratedItem;
  }

  const migrated: MigratedItem = { ...item };

  // Convert legacy format to new format
  const ratingSpec = convertLegacyRatingSpec({
    hasRating: item.hasRating,
    maxRating: item.maxRating,
    minRating: item.minRating,
    cost: item.cost,
    costPerRating: item.costPerRating,
    availability: item.availability,
    availabilityPerRating: item.availabilityPerRating,
    essenceCost: item.essenceCost,
    essencePerRating: item.essencePerRating,
    capacityCost: item.capacityCost,
    capacityPerRating: item.capacityPerRating,
  });

  // Only add ratingSpec if it has content
  if (Object.keys(ratingSpec).length > 0) {
    migrated.ratingSpec = ratingSpec;

    // Remove legacy properties (keep cost/availability if not perRating for backward compatibility)
    // We'll keep them commented for now, or remove them if user wants clean migration
    // For a clean migration, uncomment these:
    // delete migrated.hasRating;
    // delete migrated.maxRating;
    // delete migrated.minRating;
    // delete migrated.costPerRating;
    // delete migrated.availabilityPerRating;
    // delete migrated.essencePerRating;
    // delete migrated.capacityPerRating;
  }

  return migrated;
}

/**
 * Recursively migrate items in a data structure
 */
function migrateDataStructure(data: unknown): unknown {
  if (Array.isArray(data)) {
    return data.map((item) => {
      if (typeof item === "object" && item !== null) {
        return migrateItem(item as LegacyItem);
      }
      return item;
    });
  }

  if (typeof data === "object" && data !== null) {
    const obj = data as Record<string, unknown>;
    const migrated: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      // Skip metadata fields
      if (key === "meta" || key === "version" || key === "mergeStrategy") {
        migrated[key] = value;
        continue;
      }

      // If value is an array of objects, migrate each item
      if (Array.isArray(value) && value.length > 0 && typeof value[0] === "object") {
        migrated[key] = migrateDataStructure(value);
      } else if (typeof value === "object" && value !== null) {
        // Recursively process nested objects
        migrated[key] = migrateDataStructure(value);
      } else {
        migrated[key] = value;
      }
    }

    return migrated;
  }

  return data;
}

/**
 * Main migration function
 */
function migrateFile(inputPath: string, outputPath: string, dryRun: boolean): void {
  console.log(`Reading input file: ${inputPath}`);
  const inputContent = readFileSync(inputPath, "utf-8");
  const inputData = JSON.parse(inputContent);

  console.log("Migrating rating format...");
  const migratedData = migrateDataStructure(inputData);

  if (dryRun) {
    console.log("\n=== DRY RUN MODE ===");
    console.log("Migration completed. Output would be written to:", outputPath);
    console.log("Use without --dry-run to write the file.");
  } else {
    console.log(`Writing output file: ${outputPath}`);
    writeFileSync(outputPath, JSON.stringify(migratedData, null, 2), "utf-8");
    console.log("Migration completed successfully!");
  }
}

// CLI
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const inputFile = args.find((arg) => !arg.startsWith("--"));
const outputFile = args.filter((arg) => !arg.startsWith("--"))[1];

if (!inputFile || !outputFile) {
  console.error(
    "Usage: pnpm tsx scripts/migrate-rating-format.ts <input-file> <output-file> [--dry-run]"
  );
  process.exit(1);
}

migrateFile(inputFile, outputFile, dryRun);
