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
    return files
      .filter((file) => file.endsWith(".json"))
      .map((file) => file.replace(".json", ""));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

/**
 * Read all JSON files in a directory and return their contents
 */
export async function readAllJsonFiles<T>(dirPath: string): Promise<T[]> {
  const fileIds = await listJsonFiles(dirPath);
  const items: T[] = [];

  for (const id of fileIds) {
    const filePath = path.join(dirPath, `${id}.json`);
    const item = await readJsonFile<T>(filePath);
    if (item) {
      items.push(item);
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

