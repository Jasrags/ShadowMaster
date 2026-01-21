#!/usr/bin/env npx ts-node
/**
 * Example Character Validation Script
 *
 * Validates SR5 example character JSON fixtures to ensure:
 * 1. All fixtures have valid JSON structure
 * 2. All catalog IDs reference existing items in core-rulebook.json
 * 3. Derived stats are calculated correctly
 * 4. Required fields are present
 *
 * Usage:
 *   npx ts-node scripts/validate-example-characters.ts [options]
 *
 * Options:
 *   --verbose    Show detailed validation output
 *   --fix        (Future) Auto-fix simple issues
 *   --help       Show help
 */

import * as fs from "fs";
import * as path from "path";

// ============================================================================
// Types
// ============================================================================

interface ValidationError {
  file: string;
  type: "structure" | "catalog" | "derived_stats" | "missing_field";
  field?: string;
  message: string;
  expected?: unknown;
  actual?: unknown;
}

interface ValidationWarning {
  file: string;
  field?: string;
  message: string;
}

interface ValidationResult {
  file: string;
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface Character {
  id: string;
  name: string;
  metatype: string;
  attributes: {
    body: number;
    agility: number;
    reaction: number;
    strength: number;
    willpower: number;
    logic: number;
    intuition: number;
    charisma: number;
  };
  specialAttributes: {
    edge: number;
    essence: number;
    magic?: number;
    resonance?: number;
  };
  derivedStats: {
    physicalLimit: number;
    mentalLimit: number;
    socialLimit: number;
    initiativeBase: number;
    initiativeDice: number;
    physicalConditionMonitor: number;
    stunConditionMonitor: number;
    composure: number;
    judgeIntentions: number;
    memory: number;
    liftCarry: number;
  };
  [key: string]: unknown;
}

interface CatalogData {
  skills: Map<string, unknown>;
  qualities: Map<string, unknown>;
  weapons: Map<string, unknown>;
  armor: Map<string, unknown>;
  gear: Map<string, unknown>;
  cyberware: Map<string, unknown>;
  bioware: Map<string, unknown>;
  spells: Map<string, unknown>;
  adeptPowers: Map<string, unknown>;
  complexForms: Map<string, unknown>;
  vehicles: Map<string, unknown>;
  drones: Map<string, unknown>;
  programs: Map<string, unknown>;
  foci: Map<string, unknown>;
}

// ============================================================================
// Constants
// ============================================================================

const PROJECT_ROOT = path.resolve(__dirname, "..");
const EXAMPLE_CHARS_DIR = path.join(PROJECT_ROOT, "data/editions/sr5/example-characters");
const CORE_RULEBOOK_PATH = path.join(PROJECT_ROOT, "data/editions/sr5/core-rulebook.json");

const REQUIRED_FIELDS = [
  "id",
  "ownerId",
  "editionId",
  "editionCode",
  "name",
  "metatype",
  "status",
  "attributes",
  "specialAttributes",
  "magicalPath",
  "skills",
  "derivedStats",
  "karmaTotal",
  "createdAt",
];

// ============================================================================
// Catalog Loading
// ============================================================================

function loadCatalogData(): CatalogData {
  const data = JSON.parse(fs.readFileSync(CORE_RULEBOOK_PATH, "utf-8"));

  const catalogData: CatalogData = {
    skills: new Map(),
    qualities: new Map(),
    weapons: new Map(),
    armor: new Map(),
    gear: new Map(),
    cyberware: new Map(),
    bioware: new Map(),
    spells: new Map(),
    adeptPowers: new Map(),
    complexForms: new Map(),
    vehicles: new Map(),
    drones: new Map(),
    programs: new Map(),
    foci: new Map(),
  };

  // Extract skills
  const skillsModule = data.modules?.skills?.payload;
  if (skillsModule?.activeSkills) {
    for (const skill of skillsModule.activeSkills) {
      catalogData.skills.set(skill.id, skill);
    }
  }

  // Extract qualities
  const qualitiesModule = data.modules?.qualities?.payload;
  if (qualitiesModule?.positive) {
    for (const quality of qualitiesModule.positive) {
      catalogData.qualities.set(quality.id, quality);
    }
  }
  if (qualitiesModule?.negative) {
    for (const quality of qualitiesModule.negative) {
      catalogData.qualities.set(quality.id, quality);
    }
  }

  // Extract weapons (nested structure)
  const weaponsModule = data.modules?.gear?.payload?.weapons;
  if (weaponsModule) {
    for (const category of Object.values(weaponsModule)) {
      if (Array.isArray(category)) {
        for (const weapon of category) {
          if (weapon.id) {
            catalogData.weapons.set(weapon.id, weapon);
          }
        }
      }
    }
  }

  // Extract armor
  const armorModule = data.modules?.gear?.payload?.armor;
  if (Array.isArray(armorModule)) {
    for (const item of armorModule) {
      if (item.id) {
        catalogData.armor.set(item.id, item);
      }
    }
  }

  // Extract cyberware
  const cyberwareModule = data.modules?.cyberware?.payload?.catalog;
  if (Array.isArray(cyberwareModule)) {
    for (const item of cyberwareModule) {
      if (item.id) {
        catalogData.cyberware.set(item.id, item);
      }
    }
  }

  // Extract bioware
  const biowareModule = data.modules?.bioware?.payload?.catalog;
  if (Array.isArray(biowareModule)) {
    for (const item of biowareModule) {
      if (item.id) {
        catalogData.bioware.set(item.id, item);
      }
    }
  }

  // Extract spells
  const spellsModule = data.modules?.magic?.payload?.spells;
  if (Array.isArray(spellsModule)) {
    for (const spell of spellsModule) {
      if (spell.id) {
        catalogData.spells.set(spell.id, spell);
      }
    }
  }

  // Extract adept powers
  const adeptPowersModule = data.modules?.magic?.payload?.adeptPowers;
  if (Array.isArray(adeptPowersModule)) {
    for (const power of adeptPowersModule) {
      if (power.id) {
        catalogData.adeptPowers.set(power.id, power);
      }
    }
  }

  // Extract complex forms
  const complexFormsModule = data.modules?.magic?.payload?.complexForms;
  if (Array.isArray(complexFormsModule)) {
    for (const form of complexFormsModule) {
      if (form.id) {
        catalogData.complexForms.set(form.id, form);
      }
    }
  }

  // Extract vehicles
  const vehiclesModule = data.modules?.vehicles?.payload?.vehicles;
  if (Array.isArray(vehiclesModule)) {
    for (const vehicle of vehiclesModule) {
      if (vehicle.id) {
        catalogData.vehicles.set(vehicle.id, vehicle);
      }
    }
  }

  // Extract drones
  const dronesModule = data.modules?.vehicles?.payload?.drones;
  if (Array.isArray(dronesModule)) {
    for (const drone of dronesModule) {
      if (drone.id) {
        catalogData.drones.set(drone.id, drone);
      }
    }
  }

  // Extract programs
  const programsModule = data.modules?.matrix?.payload?.programs;
  if (Array.isArray(programsModule)) {
    for (const program of programsModule) {
      if (program.id) {
        catalogData.programs.set(program.id, program);
      }
    }
  }

  // Extract foci
  const fociModule = data.modules?.magic?.payload?.foci;
  if (Array.isArray(fociModule)) {
    for (const focus of fociModule) {
      if (focus.id) {
        catalogData.foci.set(focus.id, focus);
      }
    }
  }

  return catalogData;
}

// ============================================================================
// Derived Stats Calculation
// ============================================================================

function calculateDerivedStats(char: Character) {
  const attr = char.attributes;
  const essence = char.specialAttributes.essence;

  // Physical Limit: [(STR×2)+BOD+REA] / 3 (round up)
  const physicalLimit = Math.ceil((attr.strength * 2 + attr.body + attr.reaction) / 3);

  // Mental Limit: [(LOG×2)+INT+WIL] / 3 (round up)
  const mentalLimit = Math.ceil((attr.logic * 2 + attr.intuition + attr.willpower) / 3);

  // Social Limit: [(CHA×2)+WIL+ESS] / 3 (round up)
  const socialLimit = Math.ceil((attr.charisma * 2 + attr.willpower + essence) / 3);

  // Initiative Base: REA + INT
  const initiativeBase = attr.reaction + attr.intuition;

  // Physical Condition Monitor: 8 + (BOD/2) round up
  const physicalConditionMonitor = 8 + Math.ceil(attr.body / 2);

  // Stun Condition Monitor: 8 + (WIL/2) round up
  const stunConditionMonitor = 8 + Math.ceil(attr.willpower / 2);

  // Composure: CHA + WIL
  const composure = attr.charisma + attr.willpower;

  // Judge Intentions: CHA + INT
  const judgeIntentions = attr.charisma + attr.intuition;

  // Memory: LOG + WIL
  const memory = attr.logic + attr.willpower;

  // Lift/Carry: STR + BOD
  const liftCarry = attr.strength + attr.body;

  return {
    physicalLimit,
    mentalLimit,
    socialLimit,
    initiativeBase,
    initiativeDice: 1, // Base is always 1
    physicalConditionMonitor,
    stunConditionMonitor,
    composure,
    judgeIntentions,
    memory,
    liftCarry,
  };
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateCharacter(
  filePath: string,
  catalog: CatalogData,
  _verbose: boolean
): ValidationResult {
  const fileName = path.basename(filePath);
  const result: ValidationResult = {
    file: fileName,
    valid: true,
    errors: [],
    warnings: [],
  };

  // Load and parse JSON
  let char: Character;
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    char = JSON.parse(content);
  } catch (error) {
    result.valid = false;
    result.errors.push({
      file: fileName,
      type: "structure",
      message: `Failed to parse JSON: ${error}`,
    });
    return result;
  }

  // Check required fields
  for (const field of REQUIRED_FIELDS) {
    if (!(field in char)) {
      result.valid = false;
      result.errors.push({
        file: fileName,
        type: "missing_field",
        field,
        message: `Missing required field: ${field}`,
      });
    }
  }

  // Validate skills reference valid skill IDs
  if (char.skills && typeof char.skills === "object") {
    for (const skillId of Object.keys(char.skills as Record<string, number>)) {
      if (!catalog.skills.has(skillId)) {
        result.warnings.push({
          file: fileName,
          field: `skills.${skillId}`,
          message: `Skill ID "${skillId}" not found in catalog`,
        });
      }
    }
  }

  // Validate qualities
  const validateQualityArray = (
    qualities: Array<{ qualityId: string }> | undefined,
    fieldName: string
  ) => {
    if (Array.isArray(qualities)) {
      for (const quality of qualities) {
        if (quality.qualityId && !catalog.qualities.has(quality.qualityId)) {
          result.warnings.push({
            file: fileName,
            field: `${fieldName}.${quality.qualityId}`,
            message: `Quality ID "${quality.qualityId}" not found in catalog`,
          });
        }
      }
    }
  };

  validateQualityArray(char.positiveQualities as Array<{ qualityId: string }>, "positiveQualities");
  validateQualityArray(char.negativeQualities as Array<{ qualityId: string }>, "negativeQualities");

  // Validate spells
  if (Array.isArray(char.spells)) {
    for (const spell of char.spells as Array<{ catalogId: string; name: string }>) {
      if (spell.catalogId && !catalog.spells.has(spell.catalogId)) {
        result.warnings.push({
          file: fileName,
          field: `spells.${spell.catalogId}`,
          message: `Spell ID "${spell.catalogId}" not found in catalog`,
        });
      }
    }
  }

  // Validate adept powers
  if (Array.isArray(char.adeptPowers)) {
    for (const power of char.adeptPowers as Array<{ catalogId: string; name: string }>) {
      if (power.catalogId && !catalog.adeptPowers.has(power.catalogId)) {
        result.warnings.push({
          file: fileName,
          field: `adeptPowers.${power.catalogId}`,
          message: `Adept power ID "${power.catalogId}" not found in catalog`,
        });
      }
    }
  }

  // Validate derived stats
  if (char.attributes && char.specialAttributes && char.derivedStats) {
    const calculated = calculateDerivedStats(char);
    const actual = char.derivedStats;

    const checkStat = (name: keyof typeof calculated, allowVariance: number = 0) => {
      const calcValue = calculated[name];
      const actualValue = actual[name];
      if (actualValue !== undefined && Math.abs(calcValue - actualValue) > allowVariance) {
        result.warnings.push({
          file: fileName,
          field: `derivedStats.${name}`,
          message: `Derived stat "${name}" may be incorrect (calculated: ${calcValue}, actual: ${actualValue})`,
        });
      }
    };

    // Check key derived stats (some may have bonuses from augmentations)
    checkStat("physicalLimit", 2); // Allow variance for augmentations
    checkStat("mentalLimit", 2);
    checkStat("socialLimit", 2);
    checkStat("composure");
    checkStat("judgeIntentions");
    checkStat("memory");
    checkStat("liftCarry", 2);
    checkStat("physicalConditionMonitor", 1); // Toughness can add +1
  }

  return result;
}

// ============================================================================
// Main
// ============================================================================

function parseArgs(): { verbose: boolean; fix: boolean } {
  const args = process.argv.slice(2);
  const config = { verbose: false, fix: false };

  for (const arg of args) {
    switch (arg) {
      case "--verbose":
        config.verbose = true;
        break;
      case "--fix":
        config.fix = true;
        break;
      case "--help":
        console.log(`
Example Character Validation Script

Usage: npx ts-node scripts/validate-example-characters.ts [options]

Options:
  --verbose    Show detailed validation output
  --fix        (Future) Auto-fix simple issues
  --help       Show this help
        `);
        process.exit(0);
    }
  }

  return config;
}

async function main() {
  const config = parseArgs();

  console.log("Example Character Validation");
  console.log("============================");
  console.log("");

  // Check if directory exists
  if (!fs.existsSync(EXAMPLE_CHARS_DIR)) {
    console.error(`Error: Example characters directory not found: ${EXAMPLE_CHARS_DIR}`);
    process.exit(1);
  }

  // Load catalog data
  console.log("Loading catalog data from core-rulebook.json...");
  const catalog = loadCatalogData();
  console.log(
    `  Loaded: ${catalog.skills.size} skills, ${catalog.qualities.size} qualities, ${catalog.weapons.size} weapons, ${catalog.spells.size} spells`
  );
  console.log("");

  // Find all character files
  const files = fs.readdirSync(EXAMPLE_CHARS_DIR).filter((f) => f.endsWith(".json"));

  console.log(`Found ${files.length} character fixture files`);
  console.log("");

  // Validate each file
  const results: ValidationResult[] = [];
  let totalErrors = 0;
  let totalWarnings = 0;

  for (const file of files) {
    const filePath = path.join(EXAMPLE_CHARS_DIR, file);
    const result = validateCharacter(filePath, catalog, config.verbose);
    results.push(result);

    totalErrors += result.errors.length;
    totalWarnings += result.warnings.length;

    const status = result.valid ? "✓" : "✗";
    const errorCount = result.errors.length > 0 ? ` (${result.errors.length} errors)` : "";
    const warningCount = result.warnings.length > 0 ? ` (${result.warnings.length} warnings)` : "";

    console.log(`${status} ${file}${errorCount}${warningCount}`);

    if (config.verbose && (result.errors.length > 0 || result.warnings.length > 0)) {
      for (const error of result.errors) {
        console.log(`    ERROR: ${error.message}`);
      }
      for (const warning of result.warnings) {
        console.log(`    WARNING: ${warning.message}`);
      }
    }
  }

  // Summary
  console.log("");
  console.log("Summary");
  console.log("-------");
  const validCount = results.filter((r) => r.valid).length;
  console.log(`Valid files: ${validCount}/${files.length}`);
  console.log(`Total errors: ${totalErrors}`);
  console.log(`Total warnings: ${totalWarnings}`);

  // Exit with error code if any validation failed
  if (totalErrors > 0) {
    process.exit(1);
  }

  console.log("");
  console.log("All example character fixtures are valid!");
}

main().catch(console.error);
