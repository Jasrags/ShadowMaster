#!/usr/bin/env npx tsx
/**
 * Creation UX Audit
 *
 * Comprehensive audit tool for checking visual consistency, accessibility,
 * dark mode support, responsive design, and interactive states across
 * all creation components.
 *
 * Usage:
 *   pnpm audit:creation              # Run audit with default settings
 *   pnpm audit:creation --strict     # Fail on critical/high violations
 *   pnpm audit:creation --verbose    # Show all violation details
 *   pnpm audit:creation --output=markdown  # Generate markdown report
 *   pnpm audit:creation --fix        # Auto-fix simple issues (not yet implemented)
 *
 * Exit codes:
 *   0 - Success (or warnings only in non-strict mode)
 *   1 - Critical/high violations found (in strict mode)
 */

import * as fs from "fs";
import * as path from "path";

// Import checkers
import { checkAccessibility } from "./checkers/accessibility";
import { checkDarkMode } from "./checkers/dark-mode";
import { checkVisualConsistency } from "./checkers/visual-consistency";
import { checkResponsive } from "./checkers/responsive";
import { checkInteractiveStates } from "./checkers/interactive-states";

// Import reporters
import { reportToConsole, calculateSummary, type AuditResults } from "./reporters/console";
import { writeMarkdownReport } from "./reporters/markdown";

// =============================================================================
// CONFIGURATION
// =============================================================================

const ROOT = path.resolve(__dirname, "../..");
const CREATION_DIR = path.join(ROOT, "components/creation");

// Files to exclude from auditing
const EXCLUDE_PATTERNS = [/__tests__\//, /\.test\.tsx?$/, /\.spec\.tsx?$/, /index\.tsx?$/];

// =============================================================================
// CLI ARGUMENT PARSING
// =============================================================================

interface CliOptions {
  strict: boolean;
  verbose: boolean;
  output: "console" | "markdown" | "both";
  outputPath?: string;
  category?: string;
  file?: string;
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  const options: CliOptions = {
    strict: false,
    verbose: false,
    output: "console",
  };

  for (const arg of args) {
    if (arg === "--strict") {
      options.strict = true;
    } else if (arg === "--verbose" || arg === "-v") {
      options.verbose = true;
    } else if (arg === "--output=markdown") {
      options.output = "markdown";
    } else if (arg === "--output=both") {
      options.output = "both";
    } else if (arg.startsWith("--output-path=")) {
      options.outputPath = arg.replace("--output-path=", "");
    } else if (arg.startsWith("--category=")) {
      options.category = arg.replace("--category=", "");
    } else if (arg.startsWith("--file=")) {
      options.file = arg.replace("--file=", "");
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }
  }

  return options;
}

function printHelp(): void {
  console.log(`
Creation UX Audit - Check creation components for UX consistency

Usage:
  pnpm audit:creation [options]

Options:
  --strict          Fail on critical/high violations (exit code 1)
  --verbose, -v     Show detailed violation information
  --output=FORMAT   Output format: console (default), markdown, both
  --output-path=P   Path for markdown output (default: ./audit-report.md)
  --category=CAT    Only run specific category (accessibility, dark-mode,
                    visual, responsive, interactive)
  --file=PATH       Only audit a specific file
  --help, -h        Show this help message

Examples:
  pnpm audit:creation                     # Basic audit
  pnpm audit:creation --strict            # CI mode, fail on issues
  pnpm audit:creation --verbose           # Show all details
  pnpm audit:creation --output=markdown   # Generate report
  pnpm audit:creation --category=accessibility  # Only accessibility
`);
}

// =============================================================================
// FILE DISCOVERY
// =============================================================================

function findCreationComponents(specificFile?: string): string[] {
  if (specificFile) {
    const fullPath = path.resolve(ROOT, specificFile);
    if (fs.existsSync(fullPath)) {
      return [fullPath];
    }
    console.error(`File not found: ${specificFile}`);
    process.exit(1);
  }

  const components: string[] = [];

  function scanDir(dir: string): void {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".tsx")) {
        // Check if should be excluded
        const relativePath = path.relative(ROOT, fullPath);
        const shouldExclude = EXCLUDE_PATTERNS.some((pattern) => pattern.test(relativePath));

        if (!shouldExclude) {
          components.push(fullPath);
        }
      }
    }
  }

  scanDir(CREATION_DIR);
  return components.sort();
}

// =============================================================================
// AUDIT EXECUTION
// =============================================================================

function runAudit(files: string[], options: CliOptions): AuditResults {
  const results: AuditResults = {
    components: files,
    accessibility: [],
    darkMode: [],
    visualConsistency: [],
    responsive: [],
    interactiveStates: [],
  };

  // Progress indicator
  const total = files.length;
  let current = 0;

  for (const file of files) {
    current++;
    const relativePath = path.relative(ROOT, file);

    if (options.verbose) {
      process.stdout.write(`\r  Scanning ${current}/${total}: ${relativePath.padEnd(60)}`);
    }

    // Read file content
    const content = fs.readFileSync(file, "utf-8");

    // Run checkers based on category filter
    if (!options.category || options.category === "accessibility") {
      results.accessibility.push(checkAccessibility(file, content));
    }

    if (!options.category || options.category === "dark-mode") {
      results.darkMode.push(checkDarkMode(file, content));
    }

    if (!options.category || options.category === "visual") {
      results.visualConsistency.push(checkVisualConsistency(file, content));
    }

    if (!options.category || options.category === "responsive") {
      results.responsive.push(checkResponsive(file, content));
    }

    if (!options.category || options.category === "interactive") {
      results.interactiveStates.push(checkInteractiveStates(file, content));
    }
  }

  if (options.verbose) {
    process.stdout.write("\r" + " ".repeat(80) + "\r");
  }

  return results;
}

// =============================================================================
// MAIN
// =============================================================================

function main(): void {
  const options = parseArgs();

  console.log("\n🔍 Starting Creation UX Audit...\n");

  // Find components
  const components = findCreationComponents(options.file);
  console.log(`   Found ${components.length} components to audit\n`);

  // Run audit
  const results = runAudit(components, options);

  // Generate output
  if (options.output === "console" || options.output === "both") {
    reportToConsole(results, { verbose: options.verbose, strict: options.strict });
  }

  if (options.output === "markdown" || options.output === "both") {
    const outputPath = options.outputPath || path.join(ROOT, "audit-report.md");
    writeMarkdownReport(results, outputPath);
  }

  // Determine exit code
  const summary = calculateSummary(results);

  if (options.strict && (summary.criticalViolations > 0 || summary.highViolations > 0)) {
    process.exit(1);
  }

  process.exit(0);
}

// Run
main();
