#!/usr/bin/env npx ts-node
/**
 * Data Verification Script
 *
 * Verifies game data in data/editions/sr5/*.json against reference documentation
 * in docs/archive/web_pages/. Generates both human-readable (markdown) and
 * machine-readable (JSON) reports.
 *
 * Usage:
 *   npx ts-node scripts/verify-data.ts [options]
 *
 * Options:
 *   --sources <codes>      Comma-separated source codes (default: Core)
 *   --categories <cats>    Comma-separated categories (default: all)
 *   --report-only          Generate reports without interactive prompts
 *   --output <dir>         Output directory for reports
 *   --help                 Show help
 */

import * as fs from "fs";
import * as path from "path";

// ============================================================================
// Types
// ============================================================================

interface VerifyConfig {
  edition: string;
  sources: string[];
  categories: string[];
  outputDir: string;
  reportOnly: boolean;
}

interface ReferenceItem {
  name: string;
  source: string;
  fields: Record<string, string | number>;
  rawLine?: string;
}

interface JsonItem {
  id: string;
  name: string;
  [key: string]: unknown;
}

interface Finding {
  type:
    | "missing"
    | "data_mismatch"
    | "duplicate"
    | "invalid_source"
    | "naming_issue";
  priority: number;
  category: string;
  subcategory?: string;
  item: string;
  details: string;
  expected?: unknown;
  actual?: unknown;
  recommendation: string;
}

interface CategoryConfig {
  name: string;
  jsonPath: string[];
  referenceFiles: string[];
  fieldMappings: Record<string, string>;
  parseTable: (content: string, sources: string[]) => ReferenceItem[];
}

interface VerificationReport {
  timestamp: string;
  config: VerifyConfig;
  summary: {
    totalCategories: number;
    totalFindings: number;
    byPriority: Record<number, number>;
    byType: Record<string, number>;
  };
  findings: Finding[];
}

// ============================================================================
// Constants
// ============================================================================

const PROJECT_ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(PROJECT_ROOT, "data/editions/sr5");
const REFERENCE_DIR = path.join(PROJECT_ROOT, "docs/archive/web_pages");
const DEFAULT_OUTPUT_DIR = path.join(
  PROJECT_ROOT,
  "docs/capabilities/plans/verification-reports"
);

const SOURCE_CODES = [
  "Core",
  "SR5:R&G",
  "SR5:CF",
  "SR5:HT",
  "SR5:SG",
  "SR5:DT",
  "SR5:RG",
  "SR5:CA",
  "SR5:SASS",
  "SR5:GH3",
];

// ============================================================================
// Reference File Parsers
// ============================================================================

/**
 * Parse a markdown table from reference file
 * Tables have format: | Col1 | Col2 | ... |
 */
function parseMarkdownTable(
  content: string,
  sources: string[]
): ReferenceItem[] {
  const items: ReferenceItem[] = [];
  const lines = content.split("\n");

  let headers: string[] = [];
  let inTable = false;
  let nameColumnIdx = -1;

  // Known name column headers
  const nameHeaders = [
    "weapon",
    "name",
    "item",
    "accessory",
    "mod",
    "cyberware",
    "bioware",
    "armor",
    "quality",
    "power",
    "augmentation",
    "gear",
    "program",
    "spell",
    "spirit",
    "tradition",
    "vehicle",
    "drone",
  ];

  // Invalid item names (usually stats, headers, or navigation)
  const invalidNames = [
    // Stats/headers that might appear in first column of detail tables
    "acc",
    "dv",
    "ap",
    "mode",
    "rc",
    "ammo",
    "avail",
    "cost",
    "source",
    "essence",
    "capacity",
    "reach",
    // Navigation categories
    "melee",
    "ranged",
    "firearms",
    "large-caliber projectiles",
    "*misc.*",
    "misc.",
    "blades",
    "clubs",
    "pistols",
    "rifles",
    "shotguns",
    "machine guns",
    "tasers",
    "hold-out",
    "light",
    "heavy",
    "machine",
    "assault",
    "sniper",
    "sporting",
    "exotic",
    "implant",
    "improvised",
    "throwing",
    "ballistic projectiles",
    "flamethrowers",
    "lasers",
    "assault cannons",
    "grenades",
    "rockets & missiles",
    "launchers",
    "firearm accessories",
    "weapon consumables",
    "ammunition",
    "weapons",
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Detect table header row (separator line with ---)
    if (line.startsWith("|") && line.includes("---")) {
      // Previous line was headers
      if (i > 0) {
        const headerLine = lines[i - 1].trim();
        headers = headerLine
          .split("|")
          .map((h) => h.trim().toLowerCase())
          .filter((h) => h.length > 0);

        // Find the name column
        nameColumnIdx = headers.findIndex((h) => nameHeaders.includes(h));

        // If no name column found, skip this table (it's likely a stat table)
        if (nameColumnIdx === -1) {
          inTable = false;
          continue;
        }
      }
      inTable = true;
      continue;
    }

    // Parse table data rows
    if (inTable && line.startsWith("|") && !line.includes("---")) {
      const cells = line
        .split("|")
        .map((c) => c.trim())
        .filter((c) => c.length > 0);

      if (cells.length >= 2 && headers.length > 0 && nameColumnIdx >= 0) {
        // Get item name from the correct column
        const rawName = cells[nameColumnIdx] || "";
        const name = rawName.replace(/\*\*/g, "").replace(/\*/g, "").trim();

        // Skip invalid/navigation entries
        if (
          !name ||
          name === "---" ||
          invalidNames.includes(name.toLowerCase()) ||
          /^\d+$/.test(name) // Skip pure numbers
        ) {
          continue;
        }

        // Find source column
        const sourceIdx = headers.findIndex((h) => h === "source");
        const source = sourceIdx >= 0 && cells[sourceIdx] ? cells[sourceIdx] : "Core";

        // Filter by allowed sources
        if (!sources.includes(source) && !sources.includes("*")) {
          continue;
        }

        const fields: Record<string, string | number> = {};

        // Map cells to headers
        headers.forEach((header, idx) => {
          if (idx < cells.length && header) {
            const value = cells[idx];
            // Try to parse numbers (handle currency symbols)
            const cleanValue = value.replace(/[¥,]/g, "").trim();
            const numValue = parseFloat(cleanValue);
            fields[header] = isNaN(numValue) || cleanValue === "" ? value : numValue;
          }
        });

        items.push({
          name,
          source,
          fields,
          rawLine: line,
        });
      }
    }

    // End of table detection (non-table line that isn't empty)
    if (inTable && !line.startsWith("|") && line.length > 0 && !line.startsWith("#")) {
      inTable = false;
      headers = [];
      nameColumnIdx = -1;
    }
  }

  return items;
}

// ============================================================================
// Category Configurations
// ============================================================================

function getCategoryConfigs(): CategoryConfig[] {
  return [
    // Melee Weapons
    {
      name: "weapons.melee",
      jsonPath: ["modules", "gear", "payload", "weapons", "melee"],
      referenceFiles: ["SR5_Weapons_Blades.md", "SR5_Weapons_Clubs.md"],
      fieldMappings: {
        acc: "accuracy",
        dv: "damage",
        ap: "ap",
        avail: "availability",
        cost: "cost",
        reach: "reach",
      },
      parseTable: parseMarkdownTable,
    },

    // Hold-Out Pistols
    {
      name: "weapons.pistols.holdout",
      jsonPath: ["modules", "gear", "payload", "weapons", "pistols"],
      referenceFiles: ["SR5_Weapons_Hold-Out_Pistol.md"],
      fieldMappings: {
        acc: "accuracy",
        dv: "damage",
        ap: "ap",
        mode: "mode",
        rc: "rc",
        ammo: "ammo",
        avail: "availability",
        cost: "cost",
      },
      parseTable: parseMarkdownTable,
    },

    // Light Pistols
    {
      name: "weapons.pistols.light",
      jsonPath: ["modules", "gear", "payload", "weapons", "pistols"],
      referenceFiles: ["SR5_Weapons_Light_Pistol.md"],
      fieldMappings: {
        acc: "accuracy",
        dv: "damage",
        ap: "ap",
        mode: "mode",
        rc: "rc",
        ammo: "ammo",
        avail: "availability",
        cost: "cost",
      },
      parseTable: parseMarkdownTable,
    },

    // Heavy Pistols
    {
      name: "weapons.pistols.heavy",
      jsonPath: ["modules", "gear", "payload", "weapons", "pistols"],
      referenceFiles: ["SR5_Weapons_Heavy_Pistol.md"],
      fieldMappings: {
        acc: "accuracy",
        dv: "damage",
        ap: "ap",
        mode: "mode",
        rc: "rc",
        ammo: "ammo",
        avail: "availability",
        cost: "cost",
      },
      parseTable: parseMarkdownTable,
    },

    // Machine Pistols
    {
      name: "weapons.pistols.machine",
      jsonPath: ["modules", "gear", "payload", "weapons", "pistols"],
      referenceFiles: ["SR5_Weapons_Machine_Pistol.md"],
      fieldMappings: {
        acc: "accuracy",
        dv: "damage",
        ap: "ap",
        mode: "mode",
        rc: "rc",
        ammo: "ammo",
        avail: "availability",
        cost: "cost",
      },
      parseTable: parseMarkdownTable,
    },

    // SMGs
    {
      name: "weapons.smgs",
      jsonPath: ["modules", "gear", "payload", "weapons", "smgs"],
      referenceFiles: ["SR5_Weapons_Submachine_Gun.md"],
      fieldMappings: {
        acc: "accuracy",
        dv: "damage",
        ap: "ap",
        mode: "mode",
        rc: "rc",
        ammo: "ammo",
        avail: "availability",
        cost: "cost",
      },
      parseTable: parseMarkdownTable,
    },

    // Assault Rifles
    {
      name: "weapons.rifles.assault",
      jsonPath: ["modules", "gear", "payload", "weapons", "rifles"],
      referenceFiles: ["SR5_Weapons_Assault_Rifle.md"],
      fieldMappings: {
        acc: "accuracy",
        dv: "damage",
        ap: "ap",
        mode: "mode",
        rc: "rc",
        ammo: "ammo",
        avail: "availability",
        cost: "cost",
      },
      parseTable: parseMarkdownTable,
    },

    // Sniper Rifles
    {
      name: "weapons.sniperRifles",
      jsonPath: ["modules", "gear", "payload", "weapons", "sniperRifles"],
      referenceFiles: ["SR5_Weapons_Sniper_Rifle.md"],
      fieldMappings: {
        acc: "accuracy",
        dv: "damage",
        ap: "ap",
        mode: "mode",
        rc: "rc",
        ammo: "ammo",
        avail: "availability",
        cost: "cost",
      },
      parseTable: parseMarkdownTable,
    },

    // Shotguns
    {
      name: "weapons.shotguns",
      jsonPath: ["modules", "gear", "payload", "weapons", "shotguns"],
      referenceFiles: ["SR5_Weapons_Shotgun.md"],
      fieldMappings: {
        acc: "accuracy",
        dv: "damage",
        ap: "ap",
        mode: "mode",
        rc: "rc",
        ammo: "ammo",
        avail: "availability",
        cost: "cost",
      },
      parseTable: parseMarkdownTable,
    },

    // Weapon Mods
    {
      name: "modifications.weaponMods",
      jsonPath: ["modules", "modifications", "payload", "weaponMods"],
      referenceFiles: ["SR5_Firearm_Accessories.md"],
      fieldMappings: {
        avail: "availability",
        cost: "cost",
        mount: "mount",
        rc: "rc",
      },
      parseTable: parseMarkdownTable,
    },

    // Cyberware
    {
      name: "cyberware",
      jsonPath: ["modules", "cyberware", "payload", "catalog"],
      referenceFiles: [
        "SR5_Cyberware_Head.md",
        "SR5_Cyberware_Eye.md",
        "SR5_Cyberware_Ear.md",
        "SR5_Cyberware_Body.md",
        "SR5_Cyberware_Limb.md",
        "SR5_Cyberware_Weapon.md",
        "SR5_Cyberware_Other.md",
      ],
      fieldMappings: {
        essence: "essence",
        avail: "availability",
        cost: "cost",
        capacity: "capacity",
      },
      parseTable: parseMarkdownTable,
    },

    // Bioware
    {
      name: "bioware",
      jsonPath: ["modules", "bioware", "payload", "catalog"],
      referenceFiles: [
        "SR5_Bioware_Basic.md",
        "SR5_Bioware_Cultured.md",
        "SR5_Bioware_Other.md",
      ],
      fieldMappings: {
        essence: "essence",
        avail: "availability",
        cost: "cost",
      },
      parseTable: parseMarkdownTable,
    },

    // Armor
    {
      name: "armor",
      jsonPath: ["modules", "gear", "payload", "armor"],
      referenceFiles: ["SR5_Armor_Clothing.md"],
      fieldMappings: {
        armor: "armorRating",
        avail: "availability",
        cost: "cost",
        capacity: "capacity",
      },
      parseTable: parseMarkdownTable,
    },

    // Positive Qualities
    {
      name: "qualities.positive",
      jsonPath: ["modules", "qualities", "payload", "positive"],
      referenceFiles: ["SR5_Positive_Qualities.md"],
      fieldMappings: {
        cost: "cost",
      },
      parseTable: parseMarkdownTable,
    },

    // Negative Qualities
    {
      name: "qualities.negative",
      jsonPath: ["modules", "qualities", "payload", "negative"],
      referenceFiles: ["SR5_Negative_Qualities.md"],
      fieldMappings: {
        bonus: "bonus",
      },
      parseTable: parseMarkdownTable,
    },
  ];
}

// ============================================================================
// Verification Logic
// ============================================================================

function loadJsonData(jsonPath: string[]): JsonItem[] {
  const filePath = path.join(DATA_DIR, "core-rulebook.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  let current: unknown = data;
  for (const key of jsonPath) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return [];
    }
  }

  return Array.isArray(current) ? (current as JsonItem[]) : [];
}

function loadReferenceData(
  referenceFiles: string[],
  sources: string[],
  parser: (content: string, sources: string[]) => ReferenceItem[]
): ReferenceItem[] {
  const items: ReferenceItem[] = [];

  for (const file of referenceFiles) {
    const filePath = path.join(REFERENCE_DIR, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      const parsed = parser(content, sources);
      items.push(...parsed);
    }
  }

  return items;
}

function normalizeString(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

function findJsonItem(
  jsonItems: JsonItem[],
  refName: string
): JsonItem | undefined {
  const normalizedRef = normalizeString(refName);

  return jsonItems.find((item) => {
    const normalizedName = normalizeString(item.name);
    const normalizedId = normalizeString(item.id);
    return normalizedName === normalizedRef || normalizedId === normalizedRef;
  });
}

function verifyCategory(
  config: CategoryConfig,
  sources: string[]
): Finding[] {
  const findings: Finding[] = [];

  // Load data
  const jsonItems = loadJsonData(config.jsonPath);
  const refItems = loadReferenceData(
    config.referenceFiles,
    sources,
    config.parseTable
  );

  // Track which JSON items we've matched
  const matchedJsonIds = new Set<string>();

  // Check for missing items and data mismatches
  for (const refItem of refItems) {
    const jsonItem = findJsonItem(jsonItems, refItem.name);

    if (!jsonItem) {
      findings.push({
        type: "missing",
        priority: 1,
        category: config.name,
        item: refItem.name,
        details: `Item from ${refItem.source} not found in JSON`,
        expected: refItem.fields,
        recommendation: `Add "${refItem.name}" to ${config.jsonPath.join(".")}`,
      });
    } else {
      matchedJsonIds.add(jsonItem.id);

      // Check field values
      for (const [refField, jsonField] of Object.entries(config.fieldMappings)) {
        if (refField in refItem.fields && jsonField in jsonItem) {
          const refValue = refItem.fields[refField];
          const jsonValue = jsonItem[jsonField];

          // Normalize for comparison
          const refNorm =
            typeof refValue === "string"
              ? refValue.toLowerCase().replace(/[–—]/g, "-")
              : refValue;
          const jsonNorm =
            typeof jsonValue === "string"
              ? jsonValue.toLowerCase().replace(/[–—]/g, "-")
              : jsonValue;

          // Skip if both are dash/null/zero equivalents
          const isDashEquivalent = (v: unknown) =>
            v === "-" ||
            v === "–" ||
            v === "—" ||
            v === 0 ||
            v === null ||
            v === undefined ||
            v === "";

          if (isDashEquivalent(refNorm) && isDashEquivalent(jsonNorm)) {
            continue;
          }

          // Compare values
          if (String(refNorm) !== String(jsonNorm)) {
            // Check if it's a numeric comparison with tolerance
            const refNum = parseFloat(String(refValue).replace(/[¥,]/g, ""));
            const jsonNum =
              typeof jsonValue === "number"
                ? jsonValue
                : parseFloat(String(jsonValue));

            if (!isNaN(refNum) && !isNaN(jsonNum) && refNum === jsonNum) {
              continue;
            }

            findings.push({
              type: "data_mismatch",
              priority: 2,
              category: config.name,
              item: refItem.name,
              details: `Field "${jsonField}" mismatch`,
              expected: refValue,
              actual: jsonValue,
              recommendation: `Update ${jsonItem.id}.${jsonField} from ${jsonValue} to ${refValue}`,
            });
          }
        }
      }
    }
  }

  // Check for duplicates in JSON
  const nameCount = new Map<string, JsonItem[]>();
  for (const item of jsonItems) {
    const normalized = normalizeString(item.name);
    if (!nameCount.has(normalized)) {
      nameCount.set(normalized, []);
    }
    nameCount.get(normalized)!.push(item);
  }

  for (const [name, items] of nameCount) {
    if (items.length > 1) {
      findings.push({
        type: "duplicate",
        priority: 3,
        category: config.name,
        item: items[0].name,
        details: `${items.length} items with similar names: ${items.map((i) => i.id).join(", ")}`,
        recommendation: `Review and deduplicate: ${items.map((i) => i.id).join(", ")}`,
      });
    }
  }

  // Check for items from non-specified sources
  for (const item of jsonItems) {
    if (!matchedJsonIds.has(item.id)) {
      // Item exists in JSON but not matched to any reference
      // This could mean it's from a different source
      findings.push({
        type: "invalid_source",
        priority: 4,
        category: config.name,
        item: item.name,
        details: `Item "${item.id}" not found in reference files for sources: ${sources.join(", ")}`,
        recommendation: `Verify source of "${item.id}" - may need removal or move to sourcebook`,
      });
    }
  }

  return findings;
}

// ============================================================================
// Report Generation
// ============================================================================

function generateMarkdownReport(report: VerificationReport): string {
  const lines: string[] = [];

  lines.push("# Data Verification Report");
  lines.push("");
  lines.push(`**Generated:** ${report.timestamp}`);
  lines.push(`**Sources:** ${report.config.sources.join(", ")}`);
  lines.push(`**Categories:** ${report.config.categories.join(", ") || "all"}`);
  lines.push("");

  // Summary
  lines.push("## Summary");
  lines.push("");
  lines.push(`- **Total Categories Checked:** ${report.summary.totalCategories}`);
  lines.push(`- **Total Findings:** ${report.summary.totalFindings}`);
  lines.push("");

  lines.push("### By Priority");
  lines.push("");
  lines.push("| Priority | Count | Description |");
  lines.push("|----------|-------|-------------|");
  lines.push(
    `| 1 | ${report.summary.byPriority[1] || 0} | Missing items |`
  );
  lines.push(
    `| 2 | ${report.summary.byPriority[2] || 0} | Data mismatches |`
  );
  lines.push(`| 3 | ${report.summary.byPriority[3] || 0} | Duplicates |`);
  lines.push(
    `| 4 | ${report.summary.byPriority[4] || 0} | Invalid source |`
  );
  lines.push(
    `| 5 | ${report.summary.byPriority[5] || 0} | Naming issues |`
  );
  lines.push("");

  // Findings by priority
  for (let priority = 1; priority <= 5; priority++) {
    const priorityFindings = report.findings.filter(
      (f) => f.priority === priority
    );
    if (priorityFindings.length === 0) continue;

    const priorityNames = [
      "",
      "Missing Items",
      "Data Mismatches",
      "Duplicates",
      "Invalid Source",
      "Naming Issues",
    ];

    lines.push(`## Priority ${priority}: ${priorityNames[priority]}`);
    lines.push("");

    // Group by category
    const byCategory = new Map<string, Finding[]>();
    for (const finding of priorityFindings) {
      if (!byCategory.has(finding.category)) {
        byCategory.set(finding.category, []);
      }
      byCategory.get(finding.category)!.push(finding);
    }

    for (const [category, findings] of byCategory) {
      lines.push(`### ${category}`);
      lines.push("");

      for (const finding of findings) {
        lines.push(`- **${finding.item}**`);
        lines.push(`  - ${finding.details}`);
        if (finding.expected !== undefined) {
          lines.push(`  - Expected: \`${JSON.stringify(finding.expected)}\``);
        }
        if (finding.actual !== undefined) {
          lines.push(`  - Actual: \`${JSON.stringify(finding.actual)}\``);
        }
        lines.push(`  - Recommendation: ${finding.recommendation}`);
        lines.push("");
      }
    }
  }

  return lines.join("\n");
}

function generateJsonReport(report: VerificationReport): string {
  return JSON.stringify(report, null, 2);
}

// ============================================================================
// Main
// ============================================================================

function parseArgs(): VerifyConfig {
  const args = process.argv.slice(2);
  const config: VerifyConfig = {
    edition: "sr5",
    sources: ["Core"],
    categories: [],
    outputDir: DEFAULT_OUTPUT_DIR,
    reportOnly: false,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--sources":
        config.sources = args[++i]?.split(",") || ["Core"];
        break;
      case "--categories":
        config.categories = args[++i]?.split(",") || [];
        break;
      case "--output":
        config.outputDir = args[++i] || DEFAULT_OUTPUT_DIR;
        break;
      case "--report-only":
        config.reportOnly = true;
        break;
      case "--help":
        console.log(`
Data Verification Script

Usage: npx ts-node scripts/verify-data.ts [options]

Options:
  --sources <codes>      Comma-separated source codes (default: Core)
                         Available: ${SOURCE_CODES.join(", ")}
  --categories <cats>    Comma-separated categories (default: all)
  --report-only          Generate reports without interactive prompts
  --output <dir>         Output directory for reports
  --help                 Show this help
        `);
        process.exit(0);
    }
  }

  return config;
}

async function main() {
  const config = parseArgs();

  console.log("Data Verification Script");
  console.log("========================");
  console.log(`Sources: ${config.sources.join(", ")}`);
  console.log(`Categories: ${config.categories.length ? config.categories.join(", ") : "all"}`);
  console.log("");

  // Get category configs
  let categoryConfigs = getCategoryConfigs();

  // Filter by requested categories if specified
  if (config.categories.length > 0) {
    categoryConfigs = categoryConfigs.filter((c) =>
      config.categories.some(
        (cat) => c.name.startsWith(cat) || c.name.includes(cat)
      )
    );
  }

  console.log(`Checking ${categoryConfigs.length} categories...`);
  console.log("");

  // Run verification
  const allFindings: Finding[] = [];

  for (const categoryConfig of categoryConfigs) {
    console.log(`Verifying ${categoryConfig.name}...`);
    const findings = verifyCategory(categoryConfig, config.sources);
    allFindings.push(...findings);
    console.log(`  Found ${findings.length} issues`);
  }

  // Build report
  const report: VerificationReport = {
    timestamp: new Date().toISOString(),
    config,
    summary: {
      totalCategories: categoryConfigs.length,
      totalFindings: allFindings.length,
      byPriority: {},
      byType: {},
    },
    findings: allFindings,
  };

  // Calculate summary stats
  for (const finding of allFindings) {
    report.summary.byPriority[finding.priority] =
      (report.summary.byPriority[finding.priority] || 0) + 1;
    report.summary.byType[finding.type] =
      (report.summary.byType[finding.type] || 0) + 1;
  }

  // Ensure output directory exists
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
  }

  // Generate reports
  const dateStr = new Date().toISOString().split("T")[0];
  const mdPath = path.join(config.outputDir, `verification-report-${dateStr}.md`);
  const jsonPath = path.join(config.outputDir, `verification-report-${dateStr}.json`);

  fs.writeFileSync(mdPath, generateMarkdownReport(report));
  fs.writeFileSync(jsonPath, generateJsonReport(report));

  console.log("");
  console.log("Reports generated:");
  console.log(`  Markdown: ${mdPath}`);
  console.log(`  JSON: ${jsonPath}`);
  console.log("");
  console.log(`Total findings: ${allFindings.length}`);

  // Print summary
  console.log("");
  console.log("Summary by priority:");
  console.log(`  P1 (Missing):      ${report.summary.byPriority[1] || 0}`);
  console.log(`  P2 (Mismatch):     ${report.summary.byPriority[2] || 0}`);
  console.log(`  P3 (Duplicate):    ${report.summary.byPriority[3] || 0}`);
  console.log(`  P4 (Bad Source):   ${report.summary.byPriority[4] || 0}`);
  console.log(`  P5 (Naming):       ${report.summary.byPriority[5] || 0}`);
}

main().catch(console.error);
