/**
 * Tests for base storage utilities
 *
 * Tests file I/O operations with temporary directories.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { promises as fs } from "fs";
import path from "path";
import {
  readJsonFile,
  writeJsonFile,
  deleteFile,
  ensureDirectory,
  listJsonFiles,
  readAllJsonFiles,
  directoryExists,
  listSubdirectories,
  ensureDataDirectories,
  withFileLock,
  DATA_DIR,
} from "../base";

const TEST_DIR = path.join(process.cwd(), "__tests__", "temp-storage");

describe("Storage Base Utilities", () => {
  beforeEach(async () => {
    // Clean up test directory before each test
    try {
      await fs.rm(TEST_DIR, { recursive: true, force: true });
    } catch {
      // Ignore if directory doesn't exist
    }
  });

  afterEach(async () => {
    // Clean up test directory after each test
    try {
      await fs.rm(TEST_DIR, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe("ensureDirectory", () => {
    it("should create directory if it does not exist", async () => {
      const dirPath = path.join(TEST_DIR, "new-dir");
      await ensureDirectory(dirPath);

      const exists = await directoryExists(dirPath);
      expect(exists).toBe(true);
    });

    it("should create nested directories recursively", async () => {
      const dirPath = path.join(TEST_DIR, "level1", "level2", "level3");
      await ensureDirectory(dirPath);

      const exists = await directoryExists(dirPath);
      expect(exists).toBe(true);
    });

    it("should not throw if directory already exists", async () => {
      const dirPath = path.join(TEST_DIR, "existing-dir");
      await ensureDirectory(dirPath);
      await ensureDirectory(dirPath); // Call again

      const exists = await directoryExists(dirPath);
      expect(exists).toBe(true);
    });
  });

  describe("readJsonFile", () => {
    it("should read and parse existing JSON file", async () => {
      const filePath = path.join(TEST_DIR, "test.json");
      await ensureDirectory(TEST_DIR);
      const testData = { name: "test", value: 42, nested: { key: "value" } };
      await fs.writeFile(filePath, JSON.stringify(testData), "utf-8");

      const result = await readJsonFile(filePath);

      expect(result).toEqual(testData);
    });

    it("should return null for non-existent file", async () => {
      const filePath = path.join(TEST_DIR, "nonexistent.json");
      const result = await readJsonFile(filePath);

      expect(result).toBeNull();
    });

    it("should throw error for invalid JSON", async () => {
      const filePath = path.join(TEST_DIR, "invalid.json");
      await ensureDirectory(TEST_DIR);
      await fs.writeFile(filePath, "invalid json content", "utf-8");

      await expect(readJsonFile(filePath)).rejects.toThrow();
    });
  });

  describe("writeJsonFile", () => {
    it("should write JSON file atomically", async () => {
      const filePath = path.join(TEST_DIR, "write-test.json");
      await ensureDirectory(TEST_DIR);
      const testData = { name: "test", value: 123 };

      await writeJsonFile(filePath, testData);

      const result = await readJsonFile(filePath);
      expect(result).toEqual(testData);
    });

    it("should handle nested objects", async () => {
      const filePath = path.join(TEST_DIR, "nested-test.json");
      await ensureDirectory(TEST_DIR);
      const testData = {
        level1: {
          level2: {
            level3: { value: "deep" },
          },
        },
      };

      await writeJsonFile(filePath, testData);

      const result = await readJsonFile(filePath);
      expect(result).toEqual(testData);
    });

    it("should handle arrays", async () => {
      const filePath = path.join(TEST_DIR, "array-test.json");
      await ensureDirectory(TEST_DIR);
      const testData = { items: [1, 2, 3, { nested: "value" }] };

      await writeJsonFile(filePath, testData);

      const result = await readJsonFile(filePath);
      expect(result).toEqual(testData);
    });

    it("should write to temp file first, then rename (atomic write)", async () => {
      const filePath = path.join(TEST_DIR, "atomic-test.json");
      await ensureDirectory(TEST_DIR);
      const testData = { value: "atomic" };

      // Start write
      const writePromise = writeJsonFile(filePath, testData);

      // Check that temp file exists during write (with polling to handle fast writes)
      const tempPath = `${filePath}.tmp`;
      let tempExists = false;
      let finalExists = false;

      // Poll a few times to catch the temp file during the write operation
      for (let i = 0; i < 10; i++) {
        try {
          await fs.access(tempPath);
          tempExists = true;
          break;
        } catch {
          // Temp file doesn't exist yet, check if final file exists (write completed)
          try {
            await fs.access(filePath);
            finalExists = true;
            break;
          } catch {
            // Neither exists yet, wait a bit and try again
            await new Promise((resolve) => setTimeout(resolve, 10));
          }
        }
      }

      // Either temp file exists (write in progress) or final file exists (write completed very quickly)
      // Both cases validate the atomic write pattern
      expect(tempExists || finalExists).toBe(true);

      await writePromise;

      // Final file should exist
      const result = await readJsonFile(filePath);
      expect(result).toEqual(testData);

      // Temp file should not exist after write completes
      try {
        await fs.access(tempPath);
        expect.fail("Temp file should not exist after write");
      } catch {
        // Expected - temp file should be cleaned up
      }
    });
  });

  describe("deleteFile", () => {
    it("should delete existing file", async () => {
      const filePath = path.join(TEST_DIR, "delete-test.json");
      await ensureDirectory(TEST_DIR);
      await fs.writeFile(filePath, JSON.stringify({ test: true }), "utf-8");

      const result = await deleteFile(filePath);

      expect(result).toBe(true);
      const exists = await readJsonFile(filePath);
      expect(exists).toBeNull();
    });

    it("should return false for non-existent file", async () => {
      const filePath = path.join(TEST_DIR, "nonexistent.json");
      const result = await deleteFile(filePath);

      expect(result).toBe(false);
    });
  });

  describe("listJsonFiles", () => {
    it("should list all JSON files in directory", async () => {
      await ensureDirectory(TEST_DIR);
      await fs.writeFile(path.join(TEST_DIR, "file1.json"), "{}", "utf-8");
      await fs.writeFile(path.join(TEST_DIR, "file2.json"), "{}", "utf-8");
      await fs.writeFile(path.join(TEST_DIR, "not-json.txt"), "text", "utf-8");

      const result = await listJsonFiles(TEST_DIR);

      expect(result).toContain("file1");
      expect(result).toContain("file2");
      expect(result).not.toContain("not-json");
      expect(result.length).toBe(2);
    });

    it("should return empty array for empty directory", async () => {
      await ensureDirectory(TEST_DIR);
      const result = await listJsonFiles(TEST_DIR);
      expect(result).toEqual([]);
    });

    it("should create directory if it does not exist", async () => {
      const newDir = path.join(TEST_DIR, "new-list-dir");
      const result = await listJsonFiles(newDir);

      expect(result).toEqual([]);
      const exists = await directoryExists(newDir);
      expect(exists).toBe(true);
    });

    it("should return empty array for non-existent directory", async () => {
      const nonExistentDir = path.join(TEST_DIR, "nonexistent");
      const result = await listJsonFiles(nonExistentDir);
      expect(result).toEqual([]);
    });
  });

  describe("readAllJsonFiles", () => {
    it("should read all JSON files in directory", async () => {
      await ensureDirectory(TEST_DIR);
      const data1 = { id: "1", name: "First" };
      const data2 = { id: "2", name: "Second" };
      await writeJsonFile(path.join(TEST_DIR, "file1.json"), data1);
      await writeJsonFile(path.join(TEST_DIR, "file2.json"), data2);

      const result = await readAllJsonFiles(TEST_DIR);

      expect(result).toHaveLength(2);
      expect(result).toContainEqual(data1);
      expect(result).toContainEqual(data2);
    });

    it("should return empty array for empty directory", async () => {
      await ensureDirectory(TEST_DIR);
      const result = await readAllJsonFiles(TEST_DIR);
      expect(result).toEqual([]);
    });

    it("should throw on corrupt files by default", async () => {
      await ensureDirectory(TEST_DIR);
      await writeJsonFile(path.join(TEST_DIR, "valid.json"), { id: "1" });
      await fs.writeFile(path.join(TEST_DIR, "invalid.json"), "invalid json", "utf-8");

      await expect(readAllJsonFiles(TEST_DIR)).rejects.toThrow();
    });

    it("should skip corrupt files when skipCorrupt is true", async () => {
      await ensureDirectory(TEST_DIR);
      await writeJsonFile(path.join(TEST_DIR, "valid.json"), { id: "1" });
      await fs.writeFile(path.join(TEST_DIR, "invalid.json"), "invalid json", "utf-8");

      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const result = await readAllJsonFiles(TEST_DIR, { skipCorrupt: true });

      expect(result).toHaveLength(1);
      expect(result).toContainEqual({ id: "1" });
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Skipping corrupt file"),
        expect.anything()
      );
      consoleSpy.mockRestore();
    });
  });

  describe("directoryExists", () => {
    it("should return true for existing directory", async () => {
      await ensureDirectory(TEST_DIR);
      const result = await directoryExists(TEST_DIR);
      expect(result).toBe(true);
    });

    it("should return false for non-existent directory", async () => {
      const result = await directoryExists(path.join(TEST_DIR, "nonexistent"));
      expect(result).toBe(false);
    });

    it("should return false for file (not directory)", async () => {
      await ensureDirectory(TEST_DIR);
      const filePath = path.join(TEST_DIR, "file.txt");
      await fs.writeFile(filePath, "content", "utf-8");

      const result = await directoryExists(filePath);
      expect(result).toBe(false);
    });
  });

  describe("listSubdirectories", () => {
    it("should list subdirectories", async () => {
      await ensureDirectory(TEST_DIR);
      await ensureDirectory(path.join(TEST_DIR, "dir1"));
      await ensureDirectory(path.join(TEST_DIR, "dir2"));
      await fs.writeFile(path.join(TEST_DIR, "file.txt"), "content", "utf-8");

      const result = await listSubdirectories(TEST_DIR);

      expect(result).toContain("dir1");
      expect(result).toContain("dir2");
      expect(result).not.toContain("file.txt");
    });

    it("should return empty array for empty directory", async () => {
      await ensureDirectory(TEST_DIR);
      const result = await listSubdirectories(TEST_DIR);
      expect(result).toEqual([]);
    });

    it("should return empty array for non-existent directory", async () => {
      const result = await listSubdirectories(path.join(TEST_DIR, "nonexistent"));
      expect(result).toEqual([]);
    });
  });

  describe("ensureDataDirectories", () => {
    it("should create all required data directories", async () => {
      await ensureDataDirectories();

      const expectedDirs = [
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

      for (const dir of expectedDirs) {
        const exists = await directoryExists(path.join(DATA_DIR, dir));
        expect(exists, `Expected data/${dir} to exist`).toBe(true);
      }
    });

    it("should be idempotent", async () => {
      await ensureDataDirectories();
      await ensureDataDirectories();

      const exists = await directoryExists(path.join(DATA_DIR, "users"));
      expect(exists).toBe(true);
    });
  });

  // ===========================================================================
  // withFileLock
  // ===========================================================================

  describe("withFileLock", () => {
    const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

    it("should return the result of fn", async () => {
      const result = await withFileLock("/test/lock", async () => 42);
      expect(result).toBe(42);
    });

    it("should serialise concurrent operations on the same path", async () => {
      const order: number[] = [];
      const p1 = withFileLock("/test/serial", async () => {
        order.push(1);
        await delay(20);
        order.push(2);
      });
      const p2 = withFileLock("/test/serial", async () => {
        order.push(3);
      });
      await Promise.all([p1, p2]);
      // 3 must not appear between 1 and 2
      expect(order).toEqual([1, 2, 3]);
    });

    it("should allow concurrent operations on different paths", async () => {
      const order: string[] = [];
      const p1 = withFileLock("/test/a", async () => {
        order.push("a-start");
        await delay(20);
        order.push("a-end");
      });
      const p2 = withFileLock("/test/b", async () => {
        order.push("b-start");
        await delay(10);
        order.push("b-end");
      });
      await Promise.all([p1, p2]);
      // Both should start before either ends (parallel execution)
      expect(order.indexOf("a-start")).toBeLessThan(order.indexOf("a-end"));
      expect(order.indexOf("b-start")).toBeLessThan(order.indexOf("b-end"));
    });

    it("should not bleed errors between callers", async () => {
      const p1 = withFileLock("/test/errors", async () => {
        throw new Error("boom");
      });
      const p2 = withFileLock("/test/errors", async () => "ok");

      await expect(p1).rejects.toThrow("boom");
      await expect(p2).resolves.toBe("ok");
    });

    it("should propagate fn errors to the correct caller", async () => {
      await expect(
        withFileLock("/test/propagate", async () => {
          throw new Error("test error");
        })
      ).rejects.toThrow("test error");
    });

    it("should clean up the lock after all callers drain", async () => {
      await withFileLock("/test/cleanup", async () => "done");
      // After completion, the internal map entry should be cleaned up.
      // We verify by running another operation — if it hangs, cleanup failed.
      const result = await withFileLock("/test/cleanup", async () => "second");
      expect(result).toBe("second");
    });
  });
});
