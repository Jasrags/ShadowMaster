#!/usr/bin/env npx tsx
// Checks that new/modified source files have corresponding test files.
// Run with: pnpm check-tests
//
// Checks staged files (for pre-commit) or all files (for CI).
//
// Rules:
// - Files in lib/rules subdirectories should have __tests__ folders
// - Files in lib/storage should have __tests__ folders
// - Files in app/api routes should have __tests__ folders
// - Exceptions: index.ts, types.ts, constants.ts, hooks.ts (optional tests)

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const args = process.argv.slice(2);
const checkAll = args.includes("--all");
const strict = args.includes("--strict");

// Files that don't require tests
const EXEMPT_PATTERNS = [
  /index\.ts$/,
  /types\.ts$/,
  /constants\.ts$/,
  /\.d\.ts$/,
  /__tests__\//,
  /\.test\.ts$/,
  /\.spec\.ts$/,
];

// Directories that require tests
const ENFORCED_PATHS = [
  { pattern: /^lib\/rules\/[^/]+\/[^/]+\.ts$/, testDir: "__tests__" },
  { pattern: /^lib\/storage\/[^/]+\.ts$/, testDir: "__tests__" },
  { pattern: /^lib\/auth\/[^/]+\.ts$/, testDir: "__tests__" },
  { pattern: /^lib\/security\/[^/]+\.ts$/, testDir: "__tests__" },
  { pattern: /^app\/api\/.*\/route\.ts$/, testDir: "__tests__" },
];

interface MissingTest {
  sourceFile: string;
  expectedTestFile: string;
  reason: string;
}

function getChangedFiles(): string[] {
  if (checkAll) {
    // Get all TypeScript files in enforced directories
    const files: string[] = [];
    const patterns = ["lib/rules", "lib/storage", "lib/auth", "lib/security", "app/api"];
    for (const p of patterns) {
      try {
        const found = execSync(
          `find ${path.join(ROOT, p)} -name "*.ts" -type f 2>/dev/null || true`,
          { encoding: "utf-8" }
        )
          .trim()
          .split("\n")
          .filter(Boolean);
        files.push(...found);
      } catch {
        // Directory might not exist
      }
    }
    return files.map((f) => path.relative(ROOT, f));
  }

  // Get staged files
  try {
    const staged = execSync("git diff --cached --name-only --diff-filter=ACM", {
      encoding: "utf-8",
      cwd: ROOT,
    });
    return staged
      .trim()
      .split("\n")
      .filter((f) => f.endsWith(".ts") || f.endsWith(".tsx"));
  } catch {
    return [];
  }
}

function isExempt(filePath: string): boolean {
  return EXEMPT_PATTERNS.some((pattern) => pattern.test(filePath));
}

function getExpectedTestPath(filePath: string): string | null {
  for (const { pattern, testDir } of ENFORCED_PATHS) {
    if (pattern.test(filePath)) {
      const dir = path.dirname(filePath);
      const basename = path.basename(filePath, ".ts");

      // For route.ts files, test is in same dir under __tests__/route.test.ts
      if (filePath.endsWith("route.ts")) {
        return path.join(dir, testDir, "route.test.ts");
      }

      // For lib files, test is in __tests__ subdir
      return path.join(dir, testDir, `${basename}.test.ts`);
    }
  }
  return null;
}

function checkTests(): MissingTest[] {
  const files = getChangedFiles();
  const missing: MissingTest[] = [];

  for (const file of files) {
    if (isExempt(file)) continue;

    const expectedTest = getExpectedTestPath(file);
    if (!expectedTest) continue;

    const fullTestPath = path.join(ROOT, expectedTest);
    if (!fs.existsSync(fullTestPath)) {
      missing.push({
        sourceFile: file,
        expectedTestFile: expectedTest,
        reason: "Test file not found",
      });
    }
  }

  return missing;
}

// Run checks
const missing = checkTests();

console.log("\n🧪 Test Coverage Check\n");
console.log("=".repeat(70));

if (missing.length === 0) {
  console.log("✅ All source files have corresponding test files");
  process.exit(0);
}

console.log(`\n⚠️  Found ${missing.length} source file(s) without tests:\n`);

for (const { sourceFile, expectedTestFile } of missing) {
  console.log(`  📄 ${sourceFile}`);
  console.log(`     Expected: ${expectedTestFile}\n`);
}

console.log("=".repeat(70));

if (strict) {
  console.log("\n❌ Test coverage check FAILED (--strict mode)");
  console.log("   Create the missing test files or add to exempt patterns.\n");
  process.exit(1);
} else {
  console.log("\n⚠️  Test coverage check completed with warnings");
  console.log("   Consider adding tests for the files above.\n");
  process.exit(0);
}
