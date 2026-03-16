/**
 * Base storage utilities for file-based JSON persistence
 *
 * Provides common patterns for reading/writing JSON files with
 * atomic writes and directory management.
 *
 * This module is server-only and should never be imported in client components.
 */

import { promises as fs } from "fs";
import path from "path";

/** Root data directory for all file-based storage */
export const DATA_DIR = path.join(process.cwd(), "data");

/**
 * Sanitize a path segment to prevent path traversal attacks.
 * Strips directory separators and ".." sequences from user-provided IDs.
 *
 * @param segment - A user-provided ID used as a filename or directory name
 * @returns The sanitized segment safe for use in path.join()
 * @throws Error if the sanitized result is empty
 */
export function sanitizePathSegment(segment: string): string {
  // Remove path separators and null bytes
  const sanitized = segment.replace(/[/\\:\0]/g, "").replace(/\.\./g, "");
  if (!sanitized) {
    throw new Error("Invalid path segment: empty after sanitization");
  }
  return sanitized;
}

/**
 * Check if a file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Ensures a directory exists, creating it recursively if necessary
 */
export async function ensureDirectory(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
      throw error;
    }
  }
}

/**
 * Read and parse a JSON file
 * Returns null if file doesn't exist
 */
export async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

/**
 * Write JSON to a file atomically (write to temp, then rename)
 */
export async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  const tempFilePath = `${filePath}.tmp`;

  try {
    await fs.writeFile(tempFilePath, JSON.stringify(data, null, 2), "utf-8");
    await fs.rename(tempFilePath, filePath);
  } catch (error) {
    // Clean up temp file if rename fails
    try {
      await fs.unlink(tempFilePath);
    } catch {
      // Ignore cleanup errors
    }
    throw error;
  }
}

/**
 * Delete a file if it exists
 */
export async function deleteFile(filePath: string): Promise<boolean> {
  try {
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

/**
 * List all JSON files in a directory
 * Returns array of file paths (without extension)
 */
export async function listJsonFiles(dirPath: string): Promise<string[]> {
  try {
    await ensureDirectory(dirPath);
    const files = await fs.readdir(dirPath);
    return files.filter((file) => file.endsWith(".json")).map((file) => file.replace(".json", ""));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

/**
 * Read all JSON files in a directory and return their contents.
 * When skipCorrupt is true, corrupt files are skipped with a warning log.
 * Defaults to throwing on corrupt files to prevent silent data loss.
 */
export async function readAllJsonFiles<T>(
  dirPath: string,
  options?: { skipCorrupt?: boolean }
): Promise<T[]> {
  const fileIds = await listJsonFiles(dirPath);
  const items: T[] = [];

  for (const id of fileIds) {
    try {
      const filePath = path.join(dirPath, `${id}.json`);
      const item = await readJsonFile<T>(filePath);
      if (item) {
        items.push(item);
      }
    } catch (error) {
      if (options?.skipCorrupt) {
        console.error(`Skipping corrupt file ${id}.json in ${dirPath}:`, error);
      } else {
        throw error;
      }
    }
  }

  return items;
}

/**
 * Check if a directory exists
 */
export async function directoryExists(dirPath: string): Promise<boolean> {
  try {
    const stat = await fs.stat(dirPath);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

/**
 * List subdirectories in a directory
 */
export async function listSubdirectories(dirPath: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

/**
 * Delete a directory recursively
 */
export async function deleteDirectory(dirPath: string): Promise<boolean> {
  try {
    await fs.rm(dirPath, { recursive: true, force: true });
    return true;
  } catch {
    return false;
  }
}

/**
 * Ensure all required top-level data directories exist.
 * Called once at server startup via instrumentation.ts.
 */
export async function ensureDataDirectories(): Promise<void> {
  const dirs = [
    "users",
    "characters",
    "campaigns",
    "campaign_templates",
    "activity",
    "migrations",
    "security/logs",
    "combat",
    "ruleset-snapshots",
    "notifications",
    "emails",
    "audit",
    "audit/users",
    "audit/users-archived",
    "editions",
    "violations",
    "templates",
    "drift-reports",
    "matrix/overwatch",
  ];
  await Promise.all(dirs.map((dir) => ensureDirectory(path.join(DATA_DIR, dir))));
}

// =============================================================================
// ASYNC MUTEX FOR FILE INDEX OPERATIONS
// =============================================================================

/**
 * Simple async mutex for serializing read-modify-write cycles on index files.
 *
 * Prevents concurrent requests from reading stale data and overwriting each
 * other's changes. Scoped to single-process Node.js deployments.
 *
 * Usage:
 *   const result = await withFileLock(indexPath, async () => {
 *     const data = await readJsonFile(indexPath);
 *     const updated = { ...data, newField: value };
 *     await writeJsonFile(indexPath, updated);
 *     return updated;
 *   });
 */
const fileLocks = new Map<string, Promise<unknown>>();

export async function withFileLock<T>(filePath: string, fn: () => Promise<T>): Promise<T> {
  const existing = fileLocks.get(filePath) ?? Promise.resolve();

  // Each caller gets its own result promise, isolated from predecessors.
  // The chain promise tracks ordering; the caller promise tracks this fn's outcome.
  let resolve!: (v: T | PromiseLike<T>) => void;
  let reject!: (e: unknown) => void;
  const callerPromise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  // Wait for predecessor to settle (pass or fail), then run fn
  const operation = existing
    .then(
      () => {},
      () => {}
    )
    .then(() => fn())
    .then(resolve, reject);

  // Store the chain so the next caller waits for us
  fileLocks.set(filePath, operation);

  try {
    return await callerPromise;
  } finally {
    // Clean up if we're still the latest operation (prevents memory leak)
    if (fileLocks.get(filePath) === operation) {
      fileLocks.delete(filePath);
    }
  }
}
