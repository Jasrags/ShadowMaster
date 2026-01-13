#!/usr/bin/env npx tsx

/**
 * Health check and data integrity utility for Shadow Master
 *
 * Usage:
 *   npx tsx scripts/health-check.ts [--fix] [--verbose]
 *   npx tsx scripts/health-check.ts --help
 *
 * Examples:
 *   npx tsx scripts/health-check.ts
 *   npx tsx scripts/health-check.ts --verbose
 *   npx tsx scripts/health-check.ts --fix
 */

import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

const USAGE = `
Shadow Master Health Check Utility

Usage:
  npx tsx scripts/health-check.ts [options]

Options:
  --fix               Attempt to fix issues (remove orphaned data)
  --verbose, -v       Show detailed output
  --json              Output results as JSON
  --help, -h          Show this help message

Examples:
  npx tsx scripts/health-check.ts
  npx tsx scripts/health-check.ts --verbose
  npx tsx scripts/health-check.ts --fix

Checks performed:
  - Storage statistics (users, characters, campaigns)
  - JSON file integrity (valid JSON syntax)
  - Orphaned characters (characters without valid owner)
  - Orphaned campaign references (characters referencing missing campaigns)
  - Data directory structure
  - File size anomalies (empty or suspiciously large files)
`;

interface HealthIssue {
  type: "error" | "warning" | "info";
  category: string;
  message: string;
  path?: string;
  fixable?: boolean;
}

interface HealthStats {
  users: number;
  characters: number;
  campaigns: number;
  editions: number;
  totalFiles: number;
  totalSizeBytes: number;
  averageFileSizeBytes: number;
}

interface HealthReport {
  timestamp: string;
  status: "healthy" | "warning" | "critical";
  stats: HealthStats;
  issues: HealthIssue[];
  checksPerformed: string[];
}

interface UserRecord {
  id: string;
  email: string;
  username: string;
}

interface CharacterRecord {
  id: string;
  ownerId: string;
  name: string;
  campaignId?: string;
}

interface CampaignRecord {
  id: string;
  name: string;
  ownerId: string;
}

/**
 * Read and parse a JSON file safely
 */
async function readJsonSafe<T>(filePath: string): Promise<{ data: T | null; error?: string }> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(content) as T;
    return { data };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return { data: null, error: "File not found" };
    }
    if (error instanceof SyntaxError) {
      return { data: null, error: `Invalid JSON: ${error.message}` };
    }
    return { data: null, error: String(error) };
  }
}

/**
 * Get all files in a directory recursively
 */
async function getAllFiles(dirPath: string): Promise<string[]> {
  const files: string[] = [];

  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        files.push(...(await getAllFiles(fullPath)));
      } else {
        files.push(fullPath);
      }
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }

  return files;
}

/**
 * Get directory size in bytes
 */
async function getDirectorySize(dirPath: string): Promise<number> {
  let totalSize = 0;

  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        totalSize += await getDirectorySize(entryPath);
      } else {
        const stat = await fs.stat(entryPath);
        totalSize += stat.size;
      }
    }
  } catch {
    // Directory doesn't exist
  }

  return totalSize;
}

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Load all users
 */
async function loadUsers(): Promise<Map<string, UserRecord>> {
  const users = new Map<string, UserRecord>();
  const usersDir = path.join(DATA_DIR, "users");

  try {
    const files = await fs.readdir(usersDir);

    for (const file of files) {
      if (!file.endsWith(".json")) continue;

      const filePath = path.join(usersDir, file);
      const result = await readJsonSafe<UserRecord>(filePath);

      if (result.data && result.data.id) {
        users.set(result.data.id, result.data);
      }
    }
  } catch {
    // Users directory might not exist
  }

  return users;
}

/**
 * Load all campaigns
 */
async function loadCampaigns(): Promise<Map<string, CampaignRecord>> {
  const campaigns = new Map<string, CampaignRecord>();
  const campaignsDir = path.join(DATA_DIR, "campaigns");

  try {
    const files = await fs.readdir(campaignsDir);

    for (const file of files) {
      if (!file.endsWith(".json")) continue;

      const filePath = path.join(campaignsDir, file);
      const result = await readJsonSafe<CampaignRecord>(filePath);

      if (result.data && result.data.id) {
        campaigns.set(result.data.id, result.data);
      }
    }
  } catch {
    // Campaigns directory might not exist
  }

  return campaigns;
}

/**
 * Load all characters
 */
async function loadCharacters(): Promise<{ char: CharacterRecord; path: string }[]> {
  const characters: { char: CharacterRecord; path: string }[] = [];
  const charsDir = path.join(DATA_DIR, "characters");

  try {
    const userDirs = await fs.readdir(charsDir);

    for (const userId of userDirs) {
      const userCharDir = path.join(charsDir, userId);
      const stat = await fs.stat(userCharDir);

      if (!stat.isDirectory()) continue;

      const files = await fs.readdir(userCharDir);

      for (const file of files) {
        if (!file.endsWith(".json")) continue;

        const filePath = path.join(userCharDir, file);
        const result = await readJsonSafe<CharacterRecord>(filePath);

        if (result.data) {
          characters.push({ char: result.data, path: filePath });
        }
      }
    }
  } catch {
    // Characters directory might not exist
  }

  return characters;
}

/**
 * Check JSON file integrity
 */
async function checkJsonIntegrity(verbose: boolean): Promise<HealthIssue[]> {
  const issues: HealthIssue[] = [];
  const jsonFiles = await getAllFiles(DATA_DIR);

  for (const filePath of jsonFiles) {
    if (!filePath.endsWith(".json")) continue;

    // Skip edition data (static files)
    if (filePath.includes("/editions/")) continue;

    const result = await readJsonSafe<unknown>(filePath);

    if (result.error) {
      issues.push({
        type: "error",
        category: "json-integrity",
        message: result.error,
        path: filePath,
        fixable: false,
      });
    } else if (verbose) {
      // Check for empty files
      const stat = await fs.stat(filePath);
      if (stat.size === 0) {
        issues.push({
          type: "warning",
          category: "json-integrity",
          message: "Empty file",
          path: filePath,
          fixable: true,
        });
      } else if (stat.size > 10 * 1024 * 1024) {
        // > 10MB
        issues.push({
          type: "warning",
          category: "json-integrity",
          message: `Large file (${formatBytes(stat.size)})`,
          path: filePath,
          fixable: false,
        });
      }
    }
  }

  return issues;
}

/**
 * Check for orphaned characters
 */
async function checkOrphanedCharacters(
  users: Map<string, UserRecord>,
  characters: { char: CharacterRecord; path: string }[]
): Promise<HealthIssue[]> {
  const issues: HealthIssue[] = [];

  for (const { char, path: charPath } of characters) {
    if (!users.has(char.ownerId)) {
      issues.push({
        type: "error",
        category: "orphaned-data",
        message: `Character "${char.name}" (${char.id}) has invalid owner: ${char.ownerId}`,
        path: charPath,
        fixable: true,
      });
    }
  }

  return issues;
}

/**
 * Check for orphaned campaign references
 */
async function checkOrphanedCampaignRefs(
  campaigns: Map<string, CampaignRecord>,
  characters: { char: CharacterRecord; path: string }[]
): Promise<HealthIssue[]> {
  const issues: HealthIssue[] = [];

  for (const { char, path: charPath } of characters) {
    if (char.campaignId && !campaigns.has(char.campaignId)) {
      issues.push({
        type: "warning",
        category: "orphaned-reference",
        message: `Character "${char.name}" references non-existent campaign: ${char.campaignId}`,
        path: charPath,
        fixable: true,
      });
    }
  }

  return issues;
}

/**
 * Check directory structure
 */
async function checkDirectoryStructure(): Promise<HealthIssue[]> {
  const issues: HealthIssue[] = [];
  const requiredDirs = ["users", "characters", "editions"];

  for (const dir of requiredDirs) {
    const dirPath = path.join(DATA_DIR, dir);
    try {
      const stat = await fs.stat(dirPath);
      if (!stat.isDirectory()) {
        issues.push({
          type: "error",
          category: "directory-structure",
          message: `${dir} exists but is not a directory`,
          path: dirPath,
          fixable: false,
        });
      }
    } catch {
      issues.push({
        type: "warning",
        category: "directory-structure",
        message: `${dir} directory does not exist`,
        path: dirPath,
        fixable: false,
      });
    }
  }

  return issues;
}

/**
 * Compute statistics
 */
async function computeStats(
  users: Map<string, UserRecord>,
  characters: { char: CharacterRecord; path: string }[],
  campaigns: Map<string, CampaignRecord>
): Promise<HealthStats> {
  const allFiles = await getAllFiles(DATA_DIR);
  const jsonFiles = allFiles.filter((f) => f.endsWith(".json"));
  const totalSize = await getDirectorySize(DATA_DIR);

  // Count editions
  let editions = 0;
  try {
    const editionsDir = path.join(DATA_DIR, "editions");
    const editionEntries = await fs.readdir(editionsDir);
    editions = editionEntries.length;
  } catch {
    // Editions directory might not exist
  }

  return {
    users: users.size,
    characters: characters.length,
    campaigns: campaigns.size,
    editions,
    totalFiles: jsonFiles.length,
    totalSizeBytes: totalSize,
    averageFileSizeBytes: jsonFiles.length > 0 ? Math.round(totalSize / jsonFiles.length) : 0,
  };
}

/**
 * Fix orphaned characters by deleting them
 */
async function fixOrphanedCharacters(issues: HealthIssue[]): Promise<number> {
  let fixed = 0;

  for (const issue of issues) {
    if (issue.category === "orphaned-data" && issue.fixable && issue.path) {
      try {
        await fs.unlink(issue.path);
        console.log(`  Deleted: ${issue.path}`);
        fixed++;
      } catch (error) {
        console.error(`  Failed to delete ${issue.path}: ${error}`);
      }
    }
  }

  return fixed;
}

/**
 * Run health check
 */
async function runHealthCheck(fix: boolean, verbose: boolean, jsonOutput: boolean): Promise<void> {
  if (!jsonOutput) {
    console.log("\nShadow Master Health Check");
    console.log("=".repeat(50));
  }

  const checksPerformed: string[] = [];
  const allIssues: HealthIssue[] = [];

  // Load data
  if (!jsonOutput) console.log("\nLoading data...");
  const users = await loadUsers();
  const campaigns = await loadCampaigns();
  const characters = await loadCharacters();

  // Check directory structure
  checksPerformed.push("directory-structure");
  const dirIssues = await checkDirectoryStructure();
  allIssues.push(...dirIssues);

  // Check JSON integrity
  checksPerformed.push("json-integrity");
  if (!jsonOutput) console.log("Checking JSON integrity...");
  const jsonIssues = await checkJsonIntegrity(verbose);
  allIssues.push(...jsonIssues);

  // Check orphaned characters
  checksPerformed.push("orphaned-characters");
  if (!jsonOutput) console.log("Checking for orphaned characters...");
  const orphanedCharIssues = await checkOrphanedCharacters(users, characters);
  allIssues.push(...orphanedCharIssues);

  // Check orphaned campaign references
  checksPerformed.push("orphaned-campaign-refs");
  if (!jsonOutput) console.log("Checking campaign references...");
  const orphanedCampaignIssues = await checkOrphanedCampaignRefs(campaigns, characters);
  allIssues.push(...orphanedCampaignIssues);

  // Compute stats
  const stats = await computeStats(users, characters, campaigns);

  // Determine overall status
  const errorCount = allIssues.filter((i) => i.type === "error").length;
  const warningCount = allIssues.filter((i) => i.type === "warning").length;
  let status: "healthy" | "warning" | "critical" = "healthy";

  if (errorCount > 0) {
    status = "critical";
  } else if (warningCount > 0) {
    status = "warning";
  }

  // Build report
  const report: HealthReport = {
    timestamp: new Date().toISOString(),
    status,
    stats,
    issues: allIssues,
    checksPerformed,
  };

  // Output results
  if (jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  // Print statistics
  console.log("\n--- Statistics ---");
  console.log(`  Users:        ${stats.users}`);
  console.log(`  Characters:   ${stats.characters}`);
  console.log(`  Campaigns:    ${stats.campaigns}`);
  console.log(`  Editions:     ${stats.editions}`);
  console.log(`  Total files:  ${stats.totalFiles}`);
  console.log(`  Total size:   ${formatBytes(stats.totalSizeBytes)}`);
  console.log(`  Avg file:     ${formatBytes(stats.averageFileSizeBytes)}`);

  // Print issues
  if (allIssues.length > 0) {
    console.log("\n--- Issues Found ---");

    const errors = allIssues.filter((i) => i.type === "error");
    const warnings = allIssues.filter((i) => i.type === "warning");

    if (errors.length > 0) {
      console.log(`\nErrors (${errors.length}):`);
      for (const issue of errors) {
        console.log(`  [ERROR] ${issue.message}`);
        if (verbose && issue.path) {
          console.log(`          Path: ${issue.path}`);
        }
      }
    }

    if (warnings.length > 0) {
      console.log(`\nWarnings (${warnings.length}):`);
      for (const issue of warnings) {
        console.log(`  [WARN]  ${issue.message}`);
        if (verbose && issue.path) {
          console.log(`          Path: ${issue.path}`);
        }
      }
    }
  }

  // Fix issues if requested
  if (fix && allIssues.some((i) => i.fixable)) {
    console.log("\n--- Fixing Issues ---");
    const fixableIssues = allIssues.filter((i) => i.fixable);
    console.log(`Found ${fixableIssues.length} fixable issue(s)`);

    const fixed = await fixOrphanedCharacters(allIssues);
    console.log(`Fixed ${fixed} issue(s)`);
  }

  // Print summary
  console.log("\n--- Summary ---");
  const statusIcon =
    status === "healthy" ? "HEALTHY" : status === "warning" ? "WARNING" : "CRITICAL";
  const statusColor =
    status === "healthy" ? "\x1b[32m" : status === "warning" ? "\x1b[33m" : "\x1b[31m";

  console.log(`  Status: ${statusColor}${statusIcon}\x1b[0m`);
  console.log(`  Errors: ${errorCount}`);
  console.log(`  Warnings: ${warningCount}`);

  if (!fix && allIssues.some((i) => i.fixable)) {
    console.log(
      `\n  Run with --fix to automatically fix ${allIssues.filter((i) => i.fixable).length} issue(s)`
    );
  }

  console.log();

  // Exit with error code if critical
  if (status === "critical") {
    process.exit(1);
  }
}

/**
 * Parse command line arguments
 */
function parseArgs(args: string[]): {
  fix: boolean;
  verbose: boolean;
  jsonOutput: boolean;
  help: boolean;
} {
  return {
    fix: args.includes("--fix"),
    verbose: args.includes("--verbose") || args.includes("-v"),
    jsonOutput: args.includes("--json"),
    help: args.includes("--help") || args.includes("-h"),
  };
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const { fix, verbose, jsonOutput, help } = parseArgs(args);

  if (help) {
    console.log(USAGE);
    process.exit(0);
  }

  try {
    await runHealthCheck(fix, verbose, jsonOutput);
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
