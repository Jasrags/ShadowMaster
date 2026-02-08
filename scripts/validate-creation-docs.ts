#!/usr/bin/env tsx
/**
 * validate-creation-docs.ts
 *
 * Validates that creation component documentation stays in sync with the codebase.
 * Checks:
 * - Component file counts match documented counts
 * - All subfolders are documented
 * - No missing or extra components
 *
 * Usage:
 *   pnpm validate-creation-docs
 *   pnpm validate-creation-docs --verbose
 */

import * as fs from "fs";
import * as path from "path";

const COMPONENTS_DIR = path.join(process.cwd(), "components/creation");
const DOCS_DIR = path.join(process.cwd(), "docs/architecture/creation-components");

const verbose = process.argv.includes("--verbose");

interface ValidationResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Get all TSX files in a directory (non-recursive)
 */
function getTsxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".tsx"));
}

/**
 * Get all subdirectories
 */
function getSubdirectories(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("__"))
    .map((d) => d.name);
}

/**
 * Count all component files recursively
 */
function countAllComponents(dir: string): { tsx: number; ts: number; total: number } {
  let tsx = 0;
  let ts = 0;

  function walk(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith("__")) {
        walk(path.join(currentDir, entry.name));
      } else if (entry.isFile()) {
        if (entry.name.endsWith(".tsx")) tsx++;
        else if (entry.name.endsWith(".ts") && !entry.name.endsWith(".test.ts")) ts++;
      }
    }
  }

  walk(dir);
  return { tsx, ts, total: tsx + ts };
}

/**
 * Check if documentation exists
 */
function checkDocsExist(): ValidationResult {
  const result: ValidationResult = { passed: true, errors: [], warnings: [] };

  const requiredDocs = [
    "README.md",
    "00-layout-overview.md",
    "01-shared-primitives.md",
    "02-foundation-cards.md",
    "03-skills-system.md",
    "04-qualities-magic.md",
    "05-gear-equipment.md",
    "06-matrix-vehicles.md",
    "07-social-identity.md",
    "08-context-data-flow.md",
  ];

  for (const doc of requiredDocs) {
    const docPath = path.join(DOCS_DIR, doc);
    if (!fs.existsSync(docPath)) {
      result.errors.push(`Missing documentation file: ${doc}`);
      result.passed = false;
    }
  }

  return result;
}

/**
 * Check component structure matches documentation
 */
function checkComponentStructure(): ValidationResult {
  const result: ValidationResult = { passed: true, errors: [], warnings: [] };

  // Expected subfolders based on documentation
  const expectedSubfolders = [
    "armor",
    "augmentations",
    "contacts",
    "foci",
    "gear",
    "identities",
    "knowledge-languages",
    "magic-path",
    "matrix-gear",
    "metatype",
    "qualities",
    "shared",
    "skills",
    "vehicles",
    "weapons",
  ];

  const actualSubfolders = getSubdirectories(COMPONENTS_DIR);

  // Check for missing subfolders
  for (const expected of expectedSubfolders) {
    if (!actualSubfolders.includes(expected)) {
      result.errors.push(`Expected subfolder missing: ${expected}`);
      result.passed = false;
    }
  }

  // Check for undocumented subfolders
  for (const actual of actualSubfolders) {
    if (!expectedSubfolders.includes(actual)) {
      result.warnings.push(`Undocumented subfolder found: ${actual} - update docs if intentional`);
    }
  }

  return result;
}

/**
 * Check component counts are reasonable
 */
function checkComponentCounts(): ValidationResult {
  const result: ValidationResult = { passed: true, errors: [], warnings: [] };

  const counts = countAllComponents(COMPONENTS_DIR);

  // Document the current counts for reference
  if (verbose) {
    console.log(`\nComponent counts:`);
    console.log(`  TSX files: ${counts.tsx}`);
    console.log(`  TS files (non-test): ${counts.ts}`);
    console.log(`  Total: ${counts.total}`);
  }

  // Check each subfolder has expected structure
  const subfolderChecks: Record<string, { minTsx: number; maxTsx: number }> = {
    armor: { minTsx: 3, maxTsx: 6 },
    augmentations: { minTsx: 3, maxTsx: 6 },
    contacts: { minTsx: 2, maxTsx: 5 },
    foci: { minTsx: 2, maxTsx: 4 },
    gear: { minTsx: 3, maxTsx: 6 },
    identities: { minTsx: 4, maxTsx: 8 },
    "knowledge-languages": { minTsx: 4, maxTsx: 7 },
    "magic-path": { minTsx: 2, maxTsx: 4 },
    "matrix-gear": { minTsx: 3, maxTsx: 6 },
    metatype: { minTsx: 2, maxTsx: 4 },
    qualities: { minTsx: 2, maxTsx: 5 },
    shared: { minTsx: 6, maxTsx: 15 },
    skills: { minTsx: 6, maxTsx: 13 },
    vehicles: { minTsx: 3, maxTsx: 6 },
    weapons: { minTsx: 3, maxTsx: 6 },
  };

  for (const [subfolder, bounds] of Object.entries(subfolderChecks)) {
    const subfolderPath = path.join(COMPONENTS_DIR, subfolder);
    const tsxFiles = getTsxFiles(subfolderPath);

    if (tsxFiles.length < bounds.minTsx) {
      result.warnings.push(
        `${subfolder}/ has fewer components than expected (${tsxFiles.length} < ${bounds.minTsx})`
      );
    }
    if (tsxFiles.length > bounds.maxTsx) {
      result.warnings.push(
        `${subfolder}/ has more components than documented (${tsxFiles.length} > ${bounds.maxTsx}) - update docs`
      );
    }

    if (verbose) {
      console.log(`  ${subfolder}/: ${tsxFiles.length} TSX files`);
    }
  }

  // Check root-level components
  const rootTsx = getTsxFiles(COMPONENTS_DIR);
  if (verbose) {
    console.log(`  (root): ${rootTsx.length} TSX files`);
  }

  if (rootTsx.length < 10 || rootTsx.length > 20) {
    result.warnings.push(
      `Root level has unexpected component count (${rootTsx.length}) - verify docs are current`
    );
  }

  return result;
}

/**
 * Check that key components exist
 */
function checkKeyComponents(): ValidationResult {
  const result: ValidationResult = { passed: true, errors: [], warnings: [] };

  const keyComponents = [
    // Root level cards
    "AttributesCard.tsx",
    "SkillsCard.tsx",
    "SpellsCard.tsx",
    "AdeptPowersCard.tsx",
    "ComplexFormsCard.tsx",
    "AugmentationsCard.tsx",
    "VehiclesCard.tsx",
    "WeaponsPanel.tsx",
    "GearCard.tsx",
    "PrioritySelectionCard.tsx",
    "CharacterInfoCard.tsx",
    "DerivedStatsCard.tsx",
    // Shared primitives
    "shared/CreationCard.tsx",
    "shared/ValidationBadge.tsx",
    "shared/BudgetIndicator.tsx",
    "shared/KarmaConversionModal.tsx",
    // Key subfolders
    "metatype/MetatypeCard.tsx",
    "magic-path/MagicPathCard.tsx",
    "qualities/QualitiesCard.tsx",
    "contacts/ContactsCard.tsx",
    "identities/IdentitiesCard.tsx",
    "foci/FociCard.tsx",
  ];

  for (const component of keyComponents) {
    const componentPath = path.join(COMPONENTS_DIR, component);
    if (!fs.existsSync(componentPath)) {
      result.errors.push(`Key component missing: ${component}`);
      result.passed = false;
    }
  }

  return result;
}

/**
 * Main validation runner
 */
function main() {
  console.log("Validating creation component documentation...\n");

  const results: ValidationResult[] = [
    checkDocsExist(),
    checkComponentStructure(),
    checkComponentCounts(),
    checkKeyComponents(),
  ];

  const allErrors: string[] = [];
  const allWarnings: string[] = [];

  for (const result of results) {
    allErrors.push(...result.errors);
    allWarnings.push(...result.warnings);
  }

  // Print warnings
  if (allWarnings.length > 0) {
    console.log("\n⚠️  Warnings:");
    for (const warning of allWarnings) {
      console.log(`   ${warning}`);
    }
  }

  // Print errors
  if (allErrors.length > 0) {
    console.log("\n❌ Errors:");
    for (const error of allErrors) {
      console.log(`   ${error}`);
    }
    console.log("\n💡 Run with --verbose for detailed counts, or update docs at:");
    console.log("   docs/architecture/creation-components/\n");
    process.exit(1);
  }

  if (allWarnings.length === 0) {
    console.log("✅ All checks passed!\n");
  } else {
    console.log("\n✅ Validation passed with warnings.\n");
    console.log("💡 Consider updating docs/architecture/creation-components/\n");
  }
}

main();
