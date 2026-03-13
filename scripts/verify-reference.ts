#!/usr/bin/env npx ts-node
/**
 * Reference Verification Script
 *
 * Compares structured reference JSON (from /extract-rulebook) against
 * edition data files to find missing items, missing fields, and value mismatches.
 *
 * Usage:
 *   pnpm verify-reference                           # Run all mapping configs
 *   pnpm verify-reference --mapping <path>          # Run specific mapping
 *   pnpm verify-reference --output <dir>            # Write report to directory
 *   pnpm verify-reference --json                    # Output JSON instead of text
 */

import * as fs from "fs";
import * as path from "path";

// ============================================================================
// Types
// ============================================================================

interface MappingEntry {
  referenceTable: string;
  dataPath: string[];
  matchField: string;
  referenceMatchField?: string;
  fieldMap: Record<string, string>;
  requiredDataFields: string[];
}

interface MappingConfig {
  referenceFile: string;
  dataFile: string;
  description: string;
  mappings: MappingEntry[];
}

interface ReferenceTable {
  source: string;
  description: string;
  columns: string[];
  rows: Record<string, unknown>[];
}

interface Finding {
  severity: "error" | "warning" | "info";
  type: "missing-item" | "missing-field" | "value-mismatch" | "missing-category" | "extra-item";
  table: string;
  item?: string;
  field?: string;
  expected?: unknown;
  actual?: unknown;
  message: string;
}

interface TableReport {
  table: string;
  source: string;
  referenceCount: number;
  dataCount: number;
  matched: number;
  findings: Finding[];
}

interface VerificationReport {
  timestamp: string;
  mappingFile: string;
  description: string;
  summary: {
    totalTables: number;
    totalFindings: number;
    errors: number;
    warnings: number;
    info: number;
    missingItems: number;
    missingFields: number;
    valueMismatches: number;
    missingCategories: number;
  };
  tables: TableReport[];
}

// ============================================================================
// Constants
// ============================================================================

const PROJECT_ROOT = path.resolve(__dirname, "..");

// ============================================================================
// Helpers
// ============================================================================

function resolvePath(filePath: string): string {
  return path.resolve(PROJECT_ROOT, filePath);
}

function loadJson(filePath: string): unknown {
  const abs = resolvePath(filePath);
  if (!fs.existsSync(abs)) {
    return undefined;
  }
  return JSON.parse(fs.readFileSync(abs, "utf-8"));
}

function getNestedValue(obj: unknown, keys: string[]): unknown {
  let current = obj;
  for (const key of keys) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

/**
 * Normalize a name for fuzzy matching.
 * Strips punctuation, collapses whitespace, lowercases.
 */
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Find the best match for a reference item name in the data array.
 * Returns the matched data item or undefined.
 */
function findMatch(
  refName: string,
  dataItems: Record<string, unknown>[],
  matchField: string
): Record<string, unknown> | undefined {
  const normalizedRef = normalizeName(refName);

  // Exact match first
  const exact = dataItems.find((item) => {
    const dataName = String(item[matchField] ?? "");
    return normalizeName(dataName) === normalizedRef;
  });
  if (exact) return exact;

  // Substring containment — prefer the closest length match to avoid
  // "Fragmentation" matching "Fragmentation Grenade" instead of "Fragmentation Rocket"
  const candidates: { item: Record<string, unknown>; distance: number }[] = [];
  for (const item of dataItems) {
    const dataName = normalizeName(String(item[matchField] ?? ""));
    if (dataName.includes(normalizedRef) || normalizedRef.includes(dataName)) {
      candidates.push({ item, distance: Math.abs(dataName.length - normalizedRef.length) });
    }
  }
  if (candidates.length > 0) {
    candidates.sort((a, b) => a.distance - b.distance);
    return candidates[0].item;
  }

  return undefined;
}

/**
 * Compare a reference value against a data value.
 * Handles type coercion and common format differences.
 */
function valuesMatch(refVal: unknown, dataVal: unknown): boolean {
  if (refVal === dataVal) return true;
  if (refVal == null && dataVal == null) return true;

  // Null reference value means "see parent item" or "N/A" — skip comparison
  if (refVal === null) return true;

  const refStr = String(refVal).trim();
  const dataStr = String(dataVal).trim();

  // Numeric comparison (handles "1,000" vs 1000)
  const refNum = Number(refStr.replace(/[,¥]/g, ""));
  const dataNum = Number(dataStr.replace(/[,¥]/g, ""));
  if (!isNaN(refNum) && !isNaN(dataNum) && refNum === dataNum) return true;

  // Case-insensitive string comparison
  if (refStr.toLowerCase() === dataStr.toLowerCase()) return true;

  // Reference "—" means "included with parent" or "N/A" — skip comparison
  if (refStr === "—") return true;

  // Damage: null/"-"/"—" are all equivalent (no damage)
  if ((refStr === "-" || refStr === "—") && (dataVal === "-" || dataVal === "—" || dataVal == null))
    return true;
  if (refVal == null && (dataStr === "-" || dataStr === "—")) return true;

  // Availability: strip legality suffix for numeric comparison
  // e.g., "12R" in reference, availability=12 + legality="restricted" in data
  const availMatch = refStr.match(/^(\d+)([RF])?$/);
  if (availMatch && Number(availMatch[1]) === dataNum) return true;

  // Mode: reference "SA/BF" should match ["SA","BF"] array
  if (Array.isArray(dataVal) && refStr.includes("/")) {
    const refModes = refStr.split("/").map((m) => m.trim().toUpperCase());
    const dataModes = (dataVal as string[]).map((m) => String(m).toUpperCase());
    if (refModes.length === dataModes.length && refModes.every((m) => dataModes.includes(m)))
      return true;
  }

  // Ammo: reference "15 (c)" should match numeric 15
  // The reload method is checked separately via requiredDataFields
  const ammoMatch = refStr.match(/^(\d+)\s*\([a-z]+\)$/);
  if (ammoMatch && Number(ammoMatch[1]) === dataNum) return true;

  // Ammo: dual-feed "50 (c) or 100 (belt)" — match first value
  const dualAmmoMatch = refStr.match(/^(\d+)\s*\([a-z]+\)\s+or\s+\d+\s*\([a-z]+\)$/);
  if (dualAmmoMatch && Number(dualAmmoMatch[1]) === dataNum) return true;

  // Accuracy: reference "5 (7)" means base 5, smartgun 7 — match base only
  const accMatch = refStr.match(/^(\d+)\s*\(\d+\)$/);
  if (accMatch && Number(accMatch[1]) === dataNum) return true;

  // Accuracy: "Physical" for melee weapons matches special value
  if (refStr === "Physical" && (dataVal === "physical" || dataVal === 0 || dataVal == null))
    return true;

  // RC: reference "(1)" means 0 base + 1 from accessory — match 0 or undefined
  const rcParenMatch = refStr.match(/^\((\d+)\)$/);
  if (rcParenMatch && (dataVal === 0 || dataVal == null || dataVal === undefined)) return true;

  // RC: reference "2 (3)" means 2 base — match the base number
  const rcBaseMatch = refStr.match(/^(\d+)\s*\(\d+\)$/);
  if (rcBaseMatch && Number(rcBaseMatch[1]) === dataNum) return true;

  // Cost/availability formulas: skip comparison for computed values
  // "Rating × 200¥", "Rating x 500¥", "2 + Chemical Availability", "40¥ + Chemical cost"
  if (refStr.includes("×") || refStr.includes("Rating") || /\+\s*\w/.test(refStr)) return true;

  // Cost ranges: "20¥-100,000¥" — skip (variable pricing)
  if (/^\d[\d,]*¥?\s*[-–]\s*\d[\d,]*¥?$/.test(refStr)) return true;

  // Cost/availability modifiers: "+500¥", "+3", "(+2)R" — skip (modifier values for sub-items)
  if (/^\+\d/.test(refStr) || /^\(\+\d+\)[RF]?$/.test(refStr)) return true;

  // Multiple mount options: "Top or Under" — match if data is one of the options
  if (refStr.includes(" or ") && !refStr.match(/^\d/)) {
    const options = refStr.split(/\s+or\s+/i).map((o) => o.trim().toLowerCase());
    if (options.includes(dataStr.toLowerCase())) return true;
  }

  // Dual AP: "-4/-10" — match first value
  const dualApMatch = refStr.match(/^(-?\d+)\s*\/\s*-?\d+$/);
  if (dualApMatch && Number(dualApMatch[1]) === dataNum) return true;

  // Dual AP without minus: "0/−1" — match first value (handles unicode minus)
  const dualApMatch2 = refStr.match(/^(-?\d+)\s*\/\s*[−-]?\d+$/);
  if (dualApMatch2 && Number(dualApMatch2[1]) === dataNum) return true;

  // Damage strings: normalize whitespace inside parentheses — "23P(f)" matches "23P (f)"
  if (refStr.replace(/\s+/g, "") === dataStr.replace(/\s+/g, "")) return true;

  // Capacity: "(Rating)" bracket notation vs "[Rating]"
  if (refStr.replace(/[()[\]]/g, "") === dataStr.replace(/[()[\]]/g, "")) return true;

  // Critter type abbreviation: "P" → "physical", "M" → "mana"
  const typeAbbrevMap: Record<string, string> = {
    p: "physical",
    m: "mana",
    s: "special",
  };
  if (typeAbbrevMap[refStr.toLowerCase()] === dataStr.toLowerCase()) return true;

  // "As spell" → "special" equivalence (Innate Spell fields)
  if (refStr.toLowerCase() === "as spell" && dataStr.toLowerCase() === "special") return true;

  // Condition monitor: "10/10" → {"physical":10,"stun":10}
  if (typeof dataVal === "object" && dataVal !== null && !Array.isArray(dataVal)) {
    const cmMatch = refStr.match(/^(\d+)\/(\d+)$/);
    if (cmMatch) {
      const obj = dataVal as Record<string, unknown>;
      if (Number(cmMatch[1]) === Number(obj.physical) && Number(cmMatch[2]) === Number(obj.stun))
        return true;
    }
    // Armor object: "17H/9H" → {"physical":"17H","mystic":"9H"}
    const armorObjMatch = refStr.match(/^(.+?)\/(.+)$/);
    if (armorObjMatch) {
      const obj = dataVal as Record<string, unknown>;
      if (
        String(armorObjMatch[1]).trim() === String(obj.physical ?? "").trim() &&
        String(armorObjMatch[2]).trim() === String(obj.mystic ?? "").trim()
      )
        return true;
    }
  }

  // Skills array: ["Perception 5","Running 5"] → [{"name":"Perception","rating":5}]
  if (Array.isArray(refVal) && Array.isArray(dataVal)) {
    const refItems = refVal as unknown[];
    const dataItems = dataVal as unknown[];
    if (refItems.length === dataItems.length && refItems.length > 0) {
      // String skills → object skills
      if (typeof refItems[0] === "string" && typeof dataItems[0] === "object") {
        const allMatch = refItems.every((refItem) => {
          const refSkillStr = String(refItem);
          // Parse "Perception 5" or "Athletics skill group 3"
          const match = refSkillStr.match(/^(.+?)\s+(\d+)$/);
          if (!match) return false;
          const [, skillName, rating] = match;
          return dataItems.some((dataItem) => {
            const obj = dataItem as Record<string, unknown>;
            return (
              normalizeName(String(obj.name ?? "")) === normalizeName(skillName) &&
              Number(obj.rating) === Number(rating)
            );
          });
        });
        if (allMatch) return true;
      }
      // String powers → object powers: ["Armor 7","Petrification"] → [{"id":"armor","rating":7}]
      if (typeof refItems[0] === "string" && typeof dataItems[0] === "object") {
        const allMatch = refItems.every((refItem) => {
          const refPowerStr = String(refItem);
          // Parse "Armor 7" (with optional rating) or "Petrification" (no rating)
          // Also handles complex: "Natural Weapon (Bite, Reach -, DV 8P, AP -2)"
          const simpleMatch = refPowerStr.match(/^([A-Za-z][A-Za-z ]+?)(?:\s+(\d+))?$/);
          if (simpleMatch) {
            const [, powerName, rating] = simpleMatch;
            return dataItems.some((dataItem) => {
              const obj = dataItem as Record<string, unknown>;
              const nameMatch =
                normalizeName(String(obj.id ?? "").replace(/-/g, " ")) ===
                  normalizeName(powerName) ||
                normalizeName(String(obj.name ?? "")) === normalizeName(powerName);
              if (rating !== undefined) {
                return nameMatch && Number(obj.rating) === Number(rating);
              }
              return nameMatch;
            });
          }
          // Complex powers with details in parens: "Natural Weapon (Claws: DV (STR)P, AP -1)"
          const complexMatch = refPowerStr.match(/^([A-Za-z][A-Za-z ]+?)\s*\((.+)\)$/);
          if (complexMatch) {
            const [, powerName] = complexMatch;
            return dataItems.some((dataItem) => {
              const obj = dataItem as Record<string, unknown>;
              return (
                normalizeName(String(obj.id ?? "").replace(/-/g, " ")) ===
                  normalizeName(powerName) ||
                normalizeName(String(obj.name ?? "")) === normalizeName(powerName)
              );
            });
          }
          return false;
        });
        if (allMatch) return true;
      }
    }
  }

  // String arrays with kebab-case normalization: ["Stun Damage"] vs ["stun-damage"]
  if (Array.isArray(refVal) && Array.isArray(dataVal)) {
    const refItems = (refVal as unknown[]).map((v) => normalizeName(String(v)));
    const dataItems = (dataVal as unknown[]).map((v) =>
      normalizeName(String(v).replace(/-/g, " "))
    );
    if (refItems.length === dataItems.length && refItems.every((r) => dataItems.includes(r)))
      return true;
  }

  // Kebab-case to Title Case normalization: "close-combat" matches "Close Combat"
  if (normalizeName(refStr) === normalizeName(dataStr.replace(/-/g, " "))) return true;

  // Drone/vehicle size: "microdrone" contains "micro", "minidrone" contains "mini"
  if (
    refStr.toLowerCase().includes(dataStr.toLowerCase()) ||
    dataStr.toLowerCase().includes(refStr.toLowerCase())
  ) {
    return true;
  }

  return false;
}

// ============================================================================
// Core Verification
// ============================================================================

function verifyMapping(config: MappingConfig): VerificationReport {
  const refData = loadJson(config.referenceFile) as
    | { tables: Record<string, ReferenceTable> }
    | undefined;
  const editionData = loadJson(config.dataFile);

  if (!refData) {
    return {
      timestamp: new Date().toISOString(),
      mappingFile: config.referenceFile,
      description: config.description,
      summary: {
        totalTables: 0,
        totalFindings: 1,
        errors: 1,
        warnings: 0,
        info: 0,
        missingItems: 0,
        missingFields: 0,
        valueMismatches: 0,
        missingCategories: 0,
      },
      tables: [
        {
          table: "(all)",
          source: "",
          referenceCount: 0,
          dataCount: 0,
          matched: 0,
          findings: [
            {
              severity: "error",
              type: "missing-category",
              table: "(all)",
              message: `Reference file not found: ${config.referenceFile}`,
            },
          ],
        },
      ],
    };
  }

  const tableReports: TableReport[] = [];

  for (const mapping of config.mappings) {
    const refTable = refData.tables[mapping.referenceTable];
    if (!refTable) {
      tableReports.push({
        table: mapping.referenceTable,
        source: "",
        referenceCount: 0,
        dataCount: 0,
        matched: 0,
        findings: [
          {
            severity: "warning",
            type: "missing-category",
            table: mapping.referenceTable,
            message: `Reference table "${mapping.referenceTable}" not found in ${config.referenceFile}`,
          },
        ],
      });
      continue;
    }

    const dataArray = getNestedValue(editionData, mapping.dataPath);
    const findings: Finding[] = [];

    // Check if the data path exists at all
    if (dataArray === undefined) {
      findings.push({
        severity: "error",
        type: "missing-category",
        table: mapping.referenceTable,
        message: `Data path ${mapping.dataPath.join(".")} does not exist in ${config.dataFile}`,
      });
      tableReports.push({
        table: mapping.referenceTable,
        source: refTable.source,
        referenceCount: refTable.rows.length,
        dataCount: 0,
        matched: 0,
        findings,
      });
      continue;
    }

    const dataItems = Array.isArray(dataArray) ? (dataArray as Record<string, unknown>[]) : [];

    let matchedCount = 0;

    // Check each reference item
    for (const refRow of refTable.rows) {
      const refMatchField = mapping.referenceMatchField ?? mapping.matchField;
      const refName = String(refRow[refMatchField] ?? refRow.name ?? "");
      if (!refName) continue;

      const dataItem = findMatch(refName, dataItems, mapping.matchField);

      if (!dataItem) {
        findings.push({
          severity: "error",
          type: "missing-item",
          table: mapping.referenceTable,
          item: refName,
          message: `"${refName}" exists in reference but not in data`,
        });
        continue;
      }

      matchedCount++;

      // Check field value matches
      for (const [refField, dataField] of Object.entries(mapping.fieldMap)) {
        const refVal = refRow[refField];
        const dataVal = dataItem[dataField];

        if (refVal !== undefined && !valuesMatch(refVal, dataVal)) {
          // If data value is undefined, reclassify as missing-field (warning) not value-mismatch
          if (dataVal === undefined) {
            findings.push({
              severity: "warning",
              type: "missing-field",
              table: mapping.referenceTable,
              item: refName,
              field: dataField,
              message: `"${refName}" is missing required field "${dataField}" (reference has ${JSON.stringify(refVal)})`,
            });
          } else {
            findings.push({
              severity: "error",
              type: "value-mismatch",
              table: mapping.referenceTable,
              item: refName,
              field: `${refField} → ${dataField}`,
              expected: refVal,
              actual: dataVal,
              message: `"${refName}".${dataField}: expected ${JSON.stringify(refVal)}, got ${JSON.stringify(dataVal)}`,
            });
          }
        }
      }

      // Check required fields exist
      for (const reqField of mapping.requiredDataFields) {
        if (dataItem[reqField] === undefined) {
          findings.push({
            severity: "warning",
            type: "missing-field",
            table: mapping.referenceTable,
            item: refName,
            field: reqField,
            message: `"${refName}" is missing required field "${reqField}"`,
          });
        }
      }
    }

    tableReports.push({
      table: mapping.referenceTable,
      source: refTable.source,
      referenceCount: refTable.rows.length,
      dataCount: dataItems.length,
      matched: matchedCount,
      findings,
    });
  }

  // Build summary
  const allFindings = tableReports.flatMap((t) => t.findings);
  const summary = {
    totalTables: tableReports.length,
    totalFindings: allFindings.length,
    errors: allFindings.filter((f) => f.severity === "error").length,
    warnings: allFindings.filter((f) => f.severity === "warning").length,
    info: allFindings.filter((f) => f.severity === "info").length,
    missingItems: allFindings.filter((f) => f.type === "missing-item").length,
    missingFields: allFindings.filter((f) => f.type === "missing-field").length,
    valueMismatches: allFindings.filter((f) => f.type === "value-mismatch").length,
    missingCategories: allFindings.filter((f) => f.type === "missing-category").length,
  };

  return {
    timestamp: new Date().toISOString(),
    mappingFile: config.referenceFile,
    description: config.description,
    summary,
    tables: tableReports,
  };
}

// ============================================================================
// Output Formatting
// ============================================================================

function formatReport(report: VerificationReport): string {
  const lines: string[] = [];

  lines.push("═".repeat(72));
  lines.push(`  Reference Verification Report`);
  lines.push(`  ${report.description}`);
  lines.push(`  ${report.timestamp}`);
  lines.push("═".repeat(72));
  lines.push("");

  // Summary
  lines.push("## Summary");
  lines.push(`  Tables checked:      ${report.summary.totalTables}`);
  lines.push(`  Total findings:      ${report.summary.totalFindings}`);
  lines.push(
    `    Errors:            ${report.summary.errors} (missing items, value mismatches, missing categories)`
  );
  lines.push(`    Warnings:          ${report.summary.warnings} (missing fields)`);
  lines.push("");
  lines.push(`  Missing items:       ${report.summary.missingItems}`);
  lines.push(`  Missing fields:      ${report.summary.missingFields}`);
  lines.push(`  Value mismatches:    ${report.summary.valueMismatches}`);
  lines.push(`  Missing categories:  ${report.summary.missingCategories}`);
  lines.push("");

  // Per-table details
  for (const table of report.tables) {
    if (table.findings.length === 0) {
      lines.push(`✓ ${table.table} — ${table.matched}/${table.referenceCount} matched, 0 findings`);
      continue;
    }

    lines.push("─".repeat(72));
    lines.push(
      `✗ ${table.table} (${table.source}) — ${table.matched}/${table.referenceCount} matched, ${table.findings.length} findings`
    );
    lines.push("");

    const grouped: Record<string, Finding[]> = {};
    for (const f of table.findings) {
      const key = `${f.severity}:${f.type}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(f);
    }

    // Errors first, then warnings
    const order = [
      "error:missing-category",
      "error:missing-item",
      "error:value-mismatch",
      "warning:missing-field",
      "info:extra-item",
    ];

    for (const key of order) {
      const findings = grouped[key];
      if (!findings) continue;

      const [severity, type] = key.split(":");
      const icon = severity === "error" ? "✗" : severity === "warning" ? "△" : "·";
      lines.push(`  ${icon} ${type} (${findings.length})`);
      for (const f of findings) {
        lines.push(`    ${f.message}`);
      }
      lines.push("");
    }
  }

  // Exit status
  lines.push("═".repeat(72));
  if (report.summary.errors > 0) {
    lines.push(`FAIL: ${report.summary.errors} errors, ${report.summary.warnings} warnings`);
  } else if (report.summary.warnings > 0) {
    lines.push(`WARN: ${report.summary.warnings} warnings, 0 errors`);
  } else {
    lines.push("PASS: No findings");
  }
  lines.push("");

  return lines.join("\n");
}

// ============================================================================
// CLI
// ============================================================================

function findAllMappings(): string[] {
  const mappingFiles: string[] = [];
  const refsDir = path.join(PROJECT_ROOT, "docs/references");

  if (!fs.existsSync(refsDir)) return mappingFiles;

  const books = fs.readdirSync(refsDir);
  for (const book of books) {
    const mappingsDir = path.join(refsDir, book, "mappings");
    if (!fs.existsSync(mappingsDir)) continue;

    const files = fs.readdirSync(mappingsDir);
    for (const file of files) {
      if (file.endsWith(".json")) {
        mappingFiles.push(path.relative(PROJECT_ROOT, path.join(mappingsDir, file)));
      }
    }
  }

  return mappingFiles;
}

function main(): void {
  const args = process.argv.slice(2);
  const jsonOutput = args.includes("--json");
  const mappingIdx = args.indexOf("--mapping");
  const outputIdx = args.indexOf("--output");

  let mappingFiles: string[];

  if (mappingIdx !== -1 && args[mappingIdx + 1]) {
    mappingFiles = [args[mappingIdx + 1]];
  } else {
    mappingFiles = findAllMappings();
  }

  if (mappingFiles.length === 0) {
    console.error("No mapping configs found in docs/references/*/mappings/");
    process.exit(1);
  }

  const reports: VerificationReport[] = [];
  let totalErrors = 0;

  for (const mappingFile of mappingFiles) {
    const config = loadJson(mappingFile) as MappingConfig | undefined;
    if (!config) {
      console.error(`Failed to load mapping: ${mappingFile}`);
      continue;
    }

    const report = verifyMapping(config);
    reports.push(report);
    totalErrors += report.summary.errors;

    if (jsonOutput) {
      // JSON mode: collect all reports
      continue;
    }

    console.log(formatReport(report));
  }

  if (jsonOutput) {
    console.log(JSON.stringify(reports, null, 2));
  }

  // Write to output directory if specified
  if (outputIdx !== -1 && args[outputIdx + 1]) {
    const outDir = resolvePath(args[outputIdx + 1]);
    fs.mkdirSync(outDir, { recursive: true });
    for (const report of reports) {
      const slug = path.basename(report.mappingFile, ".json");
      fs.writeFileSync(path.join(outDir, `${slug}.json`), JSON.stringify(report, null, 2));
      fs.writeFileSync(path.join(outDir, `${slug}.txt`), formatReport(report));
    }
  }

  process.exit(totalErrors > 0 ? 1 : 0);
}

main();
