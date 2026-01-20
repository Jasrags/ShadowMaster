#!/usr/bin/env npx ts-node
/**
 * Naming Convention Verification Script
 *
 * Validates that all IDs, categories, and subcategories in JSON data files
 * follow the kebab-case convention: /^[a-z0-9]+(-[a-z0-9]+)*$/
 *
 * Usage:
 *   pnpm verify-naming [options]
 *
 * Options:
 *   --fix         Show suggested fixes for each violation
 *   --strict      Exit with error code if violations found
 *   --help        Show help
 */

import * as fs from "fs";
import * as path from "path";

// ============================================================================
// Types
// ============================================================================

interface Violation {
  file: string;
  path: string;
  field: string;
  currentValue: string;
  suggestedFix: string;
  lineNumber?: number;
}

interface VerifyConfig {
  fix: boolean;
  strict: boolean;
}

// ============================================================================
// Constants
// ============================================================================

const PROJECT_ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(PROJECT_ROOT, "data/editions");

// Kebab-case regex: lowercase letters/numbers with hyphens separating words
const KEBAB_CASE_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// Fields that should be validated for kebab-case
const VALIDATED_FIELDS = ["id", "category", "subcategory"];

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Convert any string to kebab-case
 */
function toKebabCase(str: string): string {
  return (
    str
      // Handle camelCase: insert hyphen before uppercase letters
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      // Handle underscores: replace with hyphens
      .replace(/_/g, "-")
      // Handle spaces: replace with hyphens
      .replace(/\s+/g, "-")
      // Convert to lowercase
      .toLowerCase()
      // Remove any characters that aren't alphanumeric or hyphens
      .replace(/[^a-z0-9-]/g, "")
      // Collapse multiple hyphens
      .replace(/-+/g, "-")
      // Remove leading/trailing hyphens
      .replace(/^-|-$/g, "")
  );
}

/**
 * Check if a string is valid kebab-case
 */
function isKebabCase(str: string): boolean {
  return KEBAB_CASE_REGEX.test(str);
}

/**
 * Find approximate line number for a JSON path in file content
 */
function findLineNumber(content: string, searchPath: string[], value: string): number | undefined {
  const lines = content.split("\n");
  const lastKey = searchPath[searchPath.length - 1];

  // Simple heuristic: find lines containing both the key and the value
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes(`"${lastKey}"`) && line.includes(`"${value}"`)) {
      return i + 1;
    }
  }

  // Fallback: just search for the value
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`"${value}"`)) {
      return i + 1;
    }
  }

  return undefined;
}

// ============================================================================
// Validation Logic
// ============================================================================

/**
 * Recursively validate an object for naming convention violations
 */
function validateObject(
  obj: unknown,
  filePath: string,
  fileContent: string,
  currentPath: string[] = [],
  violations: Violation[] = []
): Violation[] {
  if (obj === null || obj === undefined) {
    return violations;
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      validateObject(item, filePath, fileContent, [...currentPath, `[${index}]`], violations);
    });
  } else if (typeof obj === "object") {
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      const newPath = [...currentPath, key];

      // Check if this field should be validated
      if (VALIDATED_FIELDS.includes(key) && typeof value === "string") {
        if (!isKebabCase(value)) {
          violations.push({
            file: filePath,
            path: newPath.join("."),
            field: key,
            currentValue: value,
            suggestedFix: toKebabCase(value),
            lineNumber: findLineNumber(fileContent, newPath, value),
          });
        }
      }

      // Recurse into nested objects
      validateObject(value, filePath, fileContent, newPath, violations);
    }
  }

  return violations;
}

/**
 * Validate a single JSON file
 */
function validateFile(filePath: string): Violation[] {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(content);
    return validateObject(data, filePath, content);
  } catch (error) {
    console.error(`Error reading ${filePath}: ${error}`);
    return [];
  }
}

/**
 * Find all JSON files in the data directory
 */
function findJsonFiles(dir: string): string[] {
  const files: string[] = [];

  function walk(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".json")) {
        files.push(fullPath);
      }
    }
  }

  walk(dir);
  return files;
}

// ============================================================================
// Reporting
// ============================================================================

function printViolation(violation: Violation, showFix: boolean): void {
  const relativePath = path.relative(PROJECT_ROOT, violation.file);
  const location = violation.lineNumber ? `:${violation.lineNumber}` : "";

  console.log(`\n  ${relativePath}${location}`);
  console.log(`    Path:    ${violation.path}`);
  console.log(`    Field:   ${violation.field}`);
  console.log(`    Current: "${violation.currentValue}"`);

  if (showFix) {
    console.log(`    Fix:     "${violation.suggestedFix}"`);
  }
}

function printSummary(violations: Violation[]): void {
  console.log("\n" + "=".repeat(60));
  console.log("SUMMARY");
  console.log("=".repeat(60));

  if (violations.length === 0) {
    console.log("\n✓ All naming conventions are valid (kebab-case)");
    return;
  }

  // Group by field type
  const byField: Record<string, number> = {};
  for (const v of violations) {
    byField[v.field] = (byField[v.field] || 0) + 1;
  }

  console.log(`\nTotal violations: ${violations.length}`);
  console.log("\nBy field type:");
  for (const [field, count] of Object.entries(byField)) {
    console.log(`  ${field}: ${count}`);
  }

  // Group by file
  const byFile: Record<string, number> = {};
  for (const v of violations) {
    const relativePath = path.relative(PROJECT_ROOT, v.file);
    byFile[relativePath] = (byFile[relativePath] || 0) + 1;
  }

  console.log("\nBy file:");
  for (const [file, count] of Object.entries(byFile)) {
    console.log(`  ${file}: ${count}`);
  }
}

// ============================================================================
// Main
// ============================================================================

function parseArgs(): VerifyConfig {
  const args = process.argv.slice(2);
  const config: VerifyConfig = {
    fix: false,
    strict: false,
  };

  for (const arg of args) {
    switch (arg) {
      case "--fix":
        config.fix = true;
        break;
      case "--strict":
        config.strict = true;
        break;
      case "--help":
        console.log(`
Naming Convention Verification Script

Validates that all IDs, categories, and subcategories in JSON data files
follow the kebab-case convention: /^[a-z0-9]+(-[a-z0-9]+)*$/

Usage:
  pnpm verify-naming [options]

Options:
  --fix         Show suggested fixes for each violation
  --strict      Exit with error code if violations found
  --help        Show this help

Examples:
  pnpm verify-naming              # Check all data files
  pnpm verify-naming --fix        # Show suggested fixes
  pnpm verify-naming --strict     # Fail CI if violations found
        `);
        process.exit(0);
    }
  }

  return config;
}

async function main() {
  const config = parseArgs();

  console.log("Naming Convention Verification");
  console.log("==============================");
  console.log(`Convention: kebab-case (${KEBAB_CASE_REGEX.source})`);
  console.log(`Validated fields: ${VALIDATED_FIELDS.join(", ")}`);
  console.log(`Data directory: ${path.relative(PROJECT_ROOT, DATA_DIR)}`);
  console.log("");

  // Find all JSON files
  const jsonFiles = findJsonFiles(DATA_DIR);
  console.log(`Found ${jsonFiles.length} JSON files to check`);

  // Validate all files
  const allViolations: Violation[] = [];

  for (const file of jsonFiles) {
    const violations = validateFile(file);
    allViolations.push(...violations);
  }

  // Print violations
  if (allViolations.length > 0) {
    console.log("\nVIOLATIONS FOUND:");
    for (const violation of allViolations) {
      printViolation(violation, config.fix);
    }
  }

  // Print summary
  printSummary(allViolations);

  // Exit with error code if strict mode and violations found
  if (config.strict && allViolations.length > 0) {
    process.exit(1);
  }
}

main().catch(console.error);
