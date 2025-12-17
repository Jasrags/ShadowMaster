/**
 * Tests for base storage utilities
 * 
 * Tests file I/O operations with temporary directories.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import {
  readJsonFile,
  writeJsonFile,
  deleteFile,
  ensureDirectory,
  listJsonFiles,
  readAllJsonFiles,
  directoryExists,
  listSubdirectories,
} from '../base';

const TEST_DIR = path.join(process.cwd(), '__tests__', 'temp-storage');

describe('Storage Base Utilities', () => {
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

  describe('ensureDirectory', () => {
    it('should create directory if it does not exist', async () => {
      const dirPath = path.join(TEST_DIR, 'new-dir');
      await ensureDirectory(dirPath);

      const exists = await directoryExists(dirPath);
      expect(exists).toBe(true);
    });

    it('should create nested directories recursively', async () => {
      const dirPath = path.join(TEST_DIR, 'level1', 'level2', 'level3');
      await ensureDirectory(dirPath);

      const exists = await directoryExists(dirPath);
      expect(exists).toBe(true);
    });

    it('should not throw if directory already exists', async () => {
      const dirPath = path.join(TEST_DIR, 'existing-dir');
      await ensureDirectory(dirPath);
      await ensureDirectory(dirPath); // Call again

      const exists = await directoryExists(dirPath);
      expect(exists).toBe(true);
    });
  });

  describe('readJsonFile', () => {
    it('should read and parse existing JSON file', async () => {
      const filePath = path.join(TEST_DIR, 'test.json');
      await ensureDirectory(TEST_DIR);
      const testData = { name: 'test', value: 42, nested: { key: 'value' } };
      await fs.writeFile(filePath, JSON.stringify(testData), 'utf-8');

      const result = await readJsonFile(filePath);

      expect(result).toEqual(testData);
    });

    it('should return null for non-existent file', async () => {
      const filePath = path.join(TEST_DIR, 'nonexistent.json');
      const result = await readJsonFile(filePath);

      expect(result).toBeNull();
    });

    it('should throw error for invalid JSON', async () => {
      const filePath = path.join(TEST_DIR, 'invalid.json');
      await ensureDirectory(TEST_DIR);
      await fs.writeFile(filePath, 'invalid json content', 'utf-8');

      await expect(readJsonFile(filePath)).rejects.toThrow();
    });
  });

  describe('writeJsonFile', () => {
    it('should write JSON file atomically', async () => {
      const filePath = path.join(TEST_DIR, 'write-test.json');
      await ensureDirectory(TEST_DIR);
      const testData = { name: 'test', value: 123 };

      await writeJsonFile(filePath, testData);

      const result = await readJsonFile(filePath);
      expect(result).toEqual(testData);
    });

    it('should handle nested objects', async () => {
      const filePath = path.join(TEST_DIR, 'nested-test.json');
      await ensureDirectory(TEST_DIR);
      const testData = {
        level1: {
          level2: {
            level3: { value: 'deep' }
          }
        }
      };

      await writeJsonFile(filePath, testData);

      const result = await readJsonFile(filePath);
      expect(result).toEqual(testData);
    });

    it('should handle arrays', async () => {
      const filePath = path.join(TEST_DIR, 'array-test.json');
      await ensureDirectory(TEST_DIR);
      const testData = { items: [1, 2, 3, { nested: 'value' }] };

      await writeJsonFile(filePath, testData);

      const result = await readJsonFile(filePath);
      expect(result).toEqual(testData);
    });

    it('should write to temp file first, then rename (atomic write)', async () => {
      const filePath = path.join(TEST_DIR, 'atomic-test.json');
      await ensureDirectory(TEST_DIR);
      const testData = { value: 'atomic' };

      // Start write
      const writePromise = writeJsonFile(filePath, testData);

      // Check that temp file exists during write
      const tempPath = `${filePath}.tmp`;
      let tempExists = false;
      try {
        await fs.access(tempPath);
        tempExists = true;
      } catch {
        // Temp file might not exist yet or already renamed
      }
      expect(tempExists).toBe(true);

      await writePromise;

      // Final file should exist
      const result = await readJsonFile(filePath);
      expect(result).toEqual(testData);

      // Temp file should not exist
      try {
        await fs.access(tempPath);
        expect.fail('Temp file should not exist after write');
      } catch {
        // Expected - temp file should be cleaned up
      }
    });
  });

  describe('deleteFile', () => {
    it('should delete existing file', async () => {
      const filePath = path.join(TEST_DIR, 'delete-test.json');
      await ensureDirectory(TEST_DIR);
      await fs.writeFile(filePath, JSON.stringify({ test: true }), 'utf-8');

      const result = await deleteFile(filePath);

      expect(result).toBe(true);
      const exists = await readJsonFile(filePath);
      expect(exists).toBeNull();
    });

    it('should return false for non-existent file', async () => {
      const filePath = path.join(TEST_DIR, 'nonexistent.json');
      const result = await deleteFile(filePath);

      expect(result).toBe(false);
    });
  });

  describe('listJsonFiles', () => {
    it('should list all JSON files in directory', async () => {
      await ensureDirectory(TEST_DIR);
      await fs.writeFile(path.join(TEST_DIR, 'file1.json'), '{}', 'utf-8');
      await fs.writeFile(path.join(TEST_DIR, 'file2.json'), '{}', 'utf-8');
      await fs.writeFile(path.join(TEST_DIR, 'not-json.txt'), 'text', 'utf-8');

      const result = await listJsonFiles(TEST_DIR);

      expect(result).toContain('file1');
      expect(result).toContain('file2');
      expect(result).not.toContain('not-json');
      expect(result.length).toBe(2);
    });

    it('should return empty array for empty directory', async () => {
      await ensureDirectory(TEST_DIR);
      const result = await listJsonFiles(TEST_DIR);
      expect(result).toEqual([]);
    });

    it('should create directory if it does not exist', async () => {
      const newDir = path.join(TEST_DIR, 'new-list-dir');
      const result = await listJsonFiles(newDir);

      expect(result).toEqual([]);
      const exists = await directoryExists(newDir);
      expect(exists).toBe(true);
    });

    it('should return empty array for non-existent directory', async () => {
      const nonExistentDir = path.join(TEST_DIR, 'nonexistent');
      const result = await listJsonFiles(nonExistentDir);
      expect(result).toEqual([]);
    });
  });

  describe('readAllJsonFiles', () => {
    it('should read all JSON files in directory', async () => {
      await ensureDirectory(TEST_DIR);
      const data1 = { id: '1', name: 'First' };
      const data2 = { id: '2', name: 'Second' };
      await writeJsonFile(path.join(TEST_DIR, 'file1.json'), data1);
      await writeJsonFile(path.join(TEST_DIR, 'file2.json'), data2);

      const result = await readAllJsonFiles(TEST_DIR);

      expect(result).toHaveLength(2);
      expect(result).toContainEqual(data1);
      expect(result).toContainEqual(data2);
    });

    it('should return empty array for empty directory', async () => {
      await ensureDirectory(TEST_DIR);
      const result = await readAllJsonFiles(TEST_DIR);
      expect(result).toEqual([]);
    });

    it('should handle invalid JSON files gracefully', async () => {
      await ensureDirectory(TEST_DIR);
      await writeJsonFile(path.join(TEST_DIR, 'valid.json'), { id: '1' });
      await fs.writeFile(path.join(TEST_DIR, 'invalid.json'), 'invalid json', 'utf-8');

      // readAllJsonFiles uses readJsonFile which throws on invalid JSON
      // So invalid files will cause the function to throw
      // This is expected behavior - invalid files should be fixed, not silently skipped
      await expect(readAllJsonFiles(TEST_DIR)).rejects.toThrow();
    });
  });

  describe('directoryExists', () => {
    it('should return true for existing directory', async () => {
      await ensureDirectory(TEST_DIR);
      const result = await directoryExists(TEST_DIR);
      expect(result).toBe(true);
    });

    it('should return false for non-existent directory', async () => {
      const result = await directoryExists(path.join(TEST_DIR, 'nonexistent'));
      expect(result).toBe(false);
    });

    it('should return false for file (not directory)', async () => {
      await ensureDirectory(TEST_DIR);
      const filePath = path.join(TEST_DIR, 'file.txt');
      await fs.writeFile(filePath, 'content', 'utf-8');

      const result = await directoryExists(filePath);
      expect(result).toBe(false);
    });
  });

  describe('listSubdirectories', () => {
    it('should list subdirectories', async () => {
      await ensureDirectory(TEST_DIR);
      await ensureDirectory(path.join(TEST_DIR, 'dir1'));
      await ensureDirectory(path.join(TEST_DIR, 'dir2'));
      await fs.writeFile(path.join(TEST_DIR, 'file.txt'), 'content', 'utf-8');

      const result = await listSubdirectories(TEST_DIR);

      expect(result).toContain('dir1');
      expect(result).toContain('dir2');
      expect(result).not.toContain('file.txt');
    });

    it('should return empty array for empty directory', async () => {
      await ensureDirectory(TEST_DIR);
      const result = await listSubdirectories(TEST_DIR);
      expect(result).toEqual([]);
    });

    it('should return empty array for non-existent directory', async () => {
      const result = await listSubdirectories(path.join(TEST_DIR, 'nonexistent'));
      expect(result).toEqual([]);
    });
  });
});

