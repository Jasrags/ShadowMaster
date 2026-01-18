#!/usr/bin/env npx tsx
/**
 * Validates CLAUDE.md against the actual codebase structure.
 * Run with: pnpm validate-docs
 *
 * Checks:
 * - Component counts match reality
 * - API endpoint counts are accurate
 * - Storage module counts are correct
 * - Test file counts are accurate
 * - All documented directories exist
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const CLAUDE_MD = path.join(ROOT, "CLAUDE.md");

interface ValidationResult {
  check: string;
  expected: string | number;
  actual: string | number;
  status: "pass" | "fail" | "warn";
  message?: string;
}

const results: ValidationResult[] = [];

function countFiles(pattern: string, excludePattern?: string): number {
  try {
    let cmd = `find ${ROOT} -path "${pattern}" -type f`;
    if (excludePattern) {
      cmd += ` | grep -v "${excludePattern}"`;
    }
    cmd += " | wc -l";
    return parseInt(execSync(cmd, { encoding: "utf-8" }).trim(), 10);
  } catch {
    return 0;
  }
}

function countDirectories(basePath: string): number {
  try {
    const fullPath = path.join(ROOT, basePath);
    if (!fs.existsSync(fullPath)) return 0;
    return fs.readdirSync(fullPath, { withFileTypes: true }).filter((d) => d.isDirectory()).length;
  } catch {
    return 0;
  }
}

function extractNumberFromClaudeMd(pattern: RegExp): number | null {
  const content = fs.readFileSync(CLAUDE_MD, "utf-8");
  const match = content.match(pattern);
  if (match) {
    const num = match[1].replace(/[~,]/g, "");
    return parseInt(num, 10);
  }
  return null;
}

// Check 1: Creation component count
const creationComponents = countFiles(`${ROOT}/components/creation/**/*.tsx`, "node_modules");
// Look for patterns like "(89 components" or "89 total components"
const documentedComponents =
  extractNumberFromClaudeMd(/\((\d+)\s*(?:total\s*)?components/i) ??
  extractNumberFromClaudeMd(/(\d+)\s*components\)/i);
results.push({
  check: "Creation components",
  expected: documentedComponents ?? "unknown",
  actual: creationComponents,
  status:
    documentedComponents && Math.abs(creationComponents - documentedComponents) <= 30
      ? "pass"
      : "warn",
  message:
    Math.abs(creationComponents - (documentedComponents ?? 0)) > 30
      ? "Component count significantly differs from documentation"
      : undefined,
});

// Check 2: API route count
const apiRoutes = countFiles(`${ROOT}/app/api/**/route.ts`, "node_modules");
const documentedRoutes = extractNumberFromClaudeMd(/~?(\d+)\s*route\s*files/i);
results.push({
  check: "API route files",
  expected: documentedRoutes ?? "unknown",
  actual: apiRoutes,
  status: documentedRoutes && Math.abs(apiRoutes - documentedRoutes) <= 10 ? "pass" : "warn",
  message:
    Math.abs(apiRoutes - (documentedRoutes ?? 0)) > 20
      ? "API route count significantly differs from documentation"
      : undefined,
});

// Check 3: Test file count
const testFiles = countFiles(`${ROOT}/**/*.test.ts`, "node_modules");
const documentedTests = extractNumberFromClaudeMd(/~?(\d+)\s*test\s*files/i);
results.push({
  check: "Test files",
  expected: documentedTests ?? "unknown",
  actual: testFiles,
  status: documentedTests && Math.abs(testFiles - documentedTests) <= 10 ? "pass" : "warn",
  message:
    Math.abs(testFiles - (documentedTests ?? 0)) > 15
      ? "Test file count differs from documentation"
      : undefined,
});

// Check 4: Storage module count
const storageModules = countFiles(`${ROOT}/lib/storage/*.ts`, "__tests__|node_modules");
// Look for patterns like "~25 modules" or "(~25 modules)"
const documentedStorage =
  extractNumberFromClaudeMd(/~(\d+)\s*modules/i) ??
  extractNumberFromClaudeMd(/\(~?(\d+)\s*modules/i);
results.push({
  check: "Storage modules",
  expected: documentedStorage ?? "unknown",
  actual: storageModules,
  status: documentedStorage && Math.abs(storageModules - documentedStorage) <= 5 ? "pass" : "warn",
});

// Check 5: Creation subfolders
const creationSubfolders = countDirectories("components/creation");
results.push({
  check: "Creation subfolders",
  expected: 15,
  actual: creationSubfolders,
  status: creationSubfolders >= 14 && creationSubfolders <= 16 ? "pass" : "warn",
});

// Check 6: Key directories exist
const keyDirectories = [
  "lib/rules/matrix",
  "lib/rules/rigging",
  "lib/rules/inventory",
  "lib/rules/character",
  "lib/rules/sync",
  "lib/rules/advancement",
  "lib/rules/augmentations",
  "lib/rules/qualities",
  "components/creation",
  "app/api/characters",
  "app/api/campaigns",
];

for (const dir of keyDirectories) {
  const exists = fs.existsSync(path.join(ROOT, dir));
  results.push({
    check: `Directory: ${dir}`,
    expected: "exists",
    actual: exists ? "exists" : "missing",
    status: exists ? "pass" : "fail",
  });
}

// Output results
console.log("\n📋 CLAUDE.md Validation Results\n");
console.log("=".repeat(70));

let hasFailures = false;
let hasWarnings = false;

for (const result of results) {
  const icon = result.status === "pass" ? "✅" : result.status === "warn" ? "⚠️" : "❌";
  console.log(`${icon} ${result.check}`);
  console.log(`   Expected: ${result.expected} | Actual: ${result.actual}`);
  if (result.message) {
    console.log(`   Note: ${result.message}`);
  }

  if (result.status === "fail") hasFailures = true;
  if (result.status === "warn") hasWarnings = true;
}

console.log("\n" + "=".repeat(70));

if (hasFailures) {
  console.log("\n❌ Validation FAILED - CLAUDE.md needs updates");
  process.exit(1);
} else if (hasWarnings) {
  console.log("\n⚠️  Validation passed with WARNINGS - consider updating CLAUDE.md");
  process.exit(0);
} else {
  console.log("\n✅ All checks passed - CLAUDE.md is up to date");
  process.exit(0);
}
