#!/usr/bin/env npx tsx

/**
 * Backup and restore utility for Shadow Master data
 *
 * Usage:
 *   npx tsx scripts/backup.ts create [--output <dir>]
 *   npx tsx scripts/backup.ts restore <backup-name>
 *   npx tsx scripts/backup.ts list [--dir <dir>]
 *   npx tsx scripts/backup.ts --help
 *
 * Examples:
 *   npx tsx scripts/backup.ts create
 *   npx tsx scripts/backup.ts create --output ./my-backups
 *   npx tsx scripts/backup.ts list
 *   npx tsx scripts/backup.ts restore backup-2024-01-15T10-30-00
 */

import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DEFAULT_BACKUP_DIR = path.join(process.cwd(), "backups");

// Directories to backup (relative to data/)
const BACKUP_TARGETS = ["users", "characters", "campaigns"];

// Directories to exclude from backup (edition data is static)
const EXCLUDE_DIRS = ["editions"];

const USAGE = `
Shadow Master Backup Utility

Usage:
  npx tsx scripts/backup.ts <command> [options]

Commands:
  create              Create a new backup of the data directory
  restore <name>      Restore from a specific backup
  list                List all available backups

Options:
  --output <dir>      Output directory for backups (default: ./backups)
  --dir <dir>         Directory to look for backups (default: ./backups)
  --force             Skip confirmation prompts
  --help, -h          Show this help message

Examples:
  npx tsx scripts/backup.ts create
  npx tsx scripts/backup.ts create --output /mnt/backups
  npx tsx scripts/backup.ts list
  npx tsx scripts/backup.ts restore backup-2024-01-15T10-30-00
  npx tsx scripts/backup.ts restore backup-2024-01-15T10-30-00 --force

Notes:
  - Backups include users, characters, and campaigns
  - Edition data (rules, sourcebooks) is not backed up as it's static
  - Backups are stored as directories with JSON files preserved
  - Use --force to skip confirmation when restoring
`;

interface BackupMetadata {
  name: string;
  createdAt: string;
  version: string;
  stats: {
    users: number;
    characters: number;
    campaigns: number;
    totalFiles: number;
    totalSizeBytes: number;
  };
}

/**
 * Generate a timestamp-based backup name
 */
function generateBackupName(): string {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, "-").slice(0, 19);
  return `backup-${timestamp}`;
}

/**
 * Copy a directory recursively
 */
async function copyDirectory(src: string, dest: string): Promise<number> {
  let fileCount = 0;

  try {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        fileCount += await copyDirectory(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
        fileCount++;
      }
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }

  return fileCount;
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
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }

  return totalSize;
}

/**
 * Count JSON files in a directory (recursively)
 */
async function countJsonFiles(dirPath: string): Promise<number> {
  let count = 0;

  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        count += await countJsonFiles(entryPath);
      } else if (entry.name.endsWith(".json")) {
        count++;
      }
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      // Directory doesn't exist, return 0
    }
  }

  return count;
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
 * Create a backup
 */
async function createBackup(outputDir: string): Promise<void> {
  console.log("Creating backup...\n");

  const backupName = generateBackupName();
  const backupPath = path.join(outputDir, backupName);

  // Ensure backup directory exists
  await fs.mkdir(outputDir, { recursive: true });

  // Check if backup already exists
  try {
    await fs.access(backupPath);
    console.error(`Error: Backup ${backupName} already exists`);
    process.exit(1);
  } catch {
    // Expected - backup doesn't exist yet
  }

  // Create backup directory
  await fs.mkdir(backupPath, { recursive: true });

  let totalFiles = 0;
  const stats: BackupMetadata["stats"] = {
    users: 0,
    characters: 0,
    campaigns: 0,
    totalFiles: 0,
    totalSizeBytes: 0,
  };

  // Copy each target directory
  for (const target of BACKUP_TARGETS) {
    const srcPath = path.join(DATA_DIR, target);
    const destPath = path.join(backupPath, target);

    try {
      await fs.access(srcPath);
      console.log(`  Backing up ${target}...`);
      const fileCount = await copyDirectory(srcPath, destPath);
      totalFiles += fileCount;

      // Get counts for metadata
      if (target === "users") {
        stats.users = await countJsonFiles(srcPath);
      } else if (target === "characters") {
        stats.characters = await countJsonFiles(srcPath);
      } else if (target === "campaigns") {
        stats.campaigns = await countJsonFiles(srcPath);
      }

      console.log(`    Copied ${fileCount} files`);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        console.log(`  Skipping ${target} (directory not found)`);
      } else {
        throw error;
      }
    }
  }

  stats.totalFiles = totalFiles;
  stats.totalSizeBytes = await getDirectorySize(backupPath);

  // Write metadata
  const metadata: BackupMetadata = {
    name: backupName,
    createdAt: new Date().toISOString(),
    version: "1.0.0",
    stats,
  };

  await fs.writeFile(
    path.join(backupPath, "backup-metadata.json"),
    JSON.stringify(metadata, null, 2)
  );

  console.log(`
Backup completed successfully!
  Name: ${backupName}
  Location: ${backupPath}
  Users: ${stats.users}
  Characters: ${stats.characters}
  Campaigns: ${stats.campaigns}
  Total files: ${stats.totalFiles}
  Total size: ${formatBytes(stats.totalSizeBytes)}
`);
}

/**
 * List available backups
 */
async function listBackups(backupDir: string): Promise<void> {
  console.log(`\nLooking for backups in: ${backupDir}\n`);

  try {
    await fs.access(backupDir);
  } catch {
    console.log("No backups found (backup directory does not exist)");
    return;
  }

  const entries = await fs.readdir(backupDir, { withFileTypes: true });
  const backups: BackupMetadata[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const metadataPath = path.join(backupDir, entry.name, "backup-metadata.json");
    try {
      const content = await fs.readFile(metadataPath, "utf-8");
      const metadata = JSON.parse(content) as BackupMetadata;
      backups.push(metadata);
    } catch {
      // Not a valid backup directory
    }
  }

  if (backups.length === 0) {
    console.log("No backups found");
    return;
  }

  // Sort by date (newest first)
  backups.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  console.log(`Found ${backups.length} backup(s):\n`);
  console.log(
    "NAME                              DATE                 USERS  CHARS  CAMPAIGNS  SIZE"
  );
  console.log("-".repeat(95));

  for (const backup of backups) {
    const date = new Date(backup.createdAt).toLocaleString();
    const size = formatBytes(backup.stats.totalSizeBytes);
    console.log(
      `${backup.name.padEnd(34)}${date.padEnd(21)}${String(backup.stats.users).padEnd(7)}${String(backup.stats.characters).padEnd(7)}${String(backup.stats.campaigns).padEnd(11)}${size}`
    );
  }

  console.log();
}

/**
 * Restore from a backup
 */
async function restoreBackup(backupDir: string, backupName: string, force: boolean): Promise<void> {
  const backupPath = path.join(backupDir, backupName);

  // Check if backup exists
  try {
    await fs.access(backupPath);
  } catch {
    console.error(`Error: Backup '${backupName}' not found in ${backupDir}`);
    process.exit(1);
  }

  // Read metadata
  const metadataPath = path.join(backupPath, "backup-metadata.json");
  let metadata: BackupMetadata;

  try {
    const content = await fs.readFile(metadataPath, "utf-8");
    metadata = JSON.parse(content) as BackupMetadata;
  } catch {
    console.error(`Error: Invalid backup - missing or corrupt metadata`);
    process.exit(1);
  }

  console.log(`\nRestore from backup:`);
  console.log(`  Name: ${metadata.name}`);
  console.log(`  Created: ${new Date(metadata.createdAt).toLocaleString()}`);
  console.log(`  Users: ${metadata.stats.users}`);
  console.log(`  Characters: ${metadata.stats.characters}`);
  console.log(`  Campaigns: ${metadata.stats.campaigns}`);
  console.log();

  if (!force) {
    console.log("WARNING: This will OVERWRITE existing data!");
    console.log("Use --force to skip this confirmation.\n");
    console.log("To proceed, run:");
    console.log(`  npx tsx scripts/backup.ts restore ${backupName} --force\n`);
    process.exit(0);
  }

  console.log("Restoring...\n");

  // Restore each directory
  for (const target of BACKUP_TARGETS) {
    const srcPath = path.join(backupPath, target);
    const destPath = path.join(DATA_DIR, target);

    try {
      await fs.access(srcPath);

      // Remove existing directory
      console.log(`  Removing existing ${target}...`);
      await fs.rm(destPath, { recursive: true, force: true });

      // Copy from backup
      console.log(`  Restoring ${target}...`);
      const fileCount = await copyDirectory(srcPath, destPath);
      console.log(`    Restored ${fileCount} files`);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        console.log(`  Skipping ${target} (not in backup)`);
      } else {
        throw error;
      }
    }
  }

  console.log(`
Restore completed successfully!
  Restored from: ${metadata.name}
  Users: ${metadata.stats.users}
  Characters: ${metadata.stats.characters}
  Campaigns: ${metadata.stats.campaigns}
`);
}

/**
 * Parse command line arguments
 */
function parseArgs(args: string[]): {
  command: string;
  backupName?: string;
  outputDir: string;
  force: boolean;
  help: boolean;
} {
  const result = {
    command: "",
    backupName: undefined as string | undefined,
    outputDir: DEFAULT_BACKUP_DIR,
    force: false,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--help" || arg === "-h") {
      result.help = true;
    } else if (arg === "--force") {
      result.force = true;
    } else if (arg === "--output" || arg === "--dir") {
      result.outputDir = args[++i] || DEFAULT_BACKUP_DIR;
    } else if (!result.command) {
      result.command = arg;
    } else if (!result.backupName) {
      result.backupName = arg;
    }
  }

  return result;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const { command, backupName, outputDir, force, help } = parseArgs(args);

  if (help || !command) {
    console.log(USAGE);
    process.exit(help ? 0 : 1);
  }

  try {
    switch (command) {
      case "create":
        await createBackup(outputDir);
        break;

      case "list":
        await listBackups(outputDir);
        break;

      case "restore":
        if (!backupName) {
          console.error("Error: Backup name is required for restore");
          console.log("\nUsage: npx tsx scripts/backup.ts restore <backup-name>");
          process.exit(1);
        }
        await restoreBackup(outputDir, backupName, force);
        break;

      default:
        console.error(`Error: Unknown command '${command}'`);
        console.log(USAGE);
        process.exit(1);
    }
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
