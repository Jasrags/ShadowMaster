/**
 * Rule Merging Engine
 *
 * Combines base edition rules with book overrides in deterministic,
 * predictable ways to produce an immutable MergedRuleset.
 *
 * Merge Strategies:
 * - replace: Completely replace the base value
 * - merge: Deep merge objects, merge arrays by ID
 * - append: Append to arrays or add new keys
 * - remove: Remove specified keys or array items
 */

import { v4 as uuidv4 } from "uuid";
import type {
  ID,
  MergeStrategy,
  RuleModuleType,
  MergedRuleset,
  BookModuleEntry,
} from "../types";
import type { LoadedRuleset } from "./loader";

// =============================================================================
// TYPES
// =============================================================================

/**
 * A module payload that can be merged
 */
type ModulePayload = Record<string, unknown>;

/**
 * Result of producing a merged ruleset
 */
export interface MergeResult {
  success: boolean;
  ruleset?: MergedRuleset;
  error?: string;
}

// =============================================================================
// DEEP MERGE UTILITIES
// =============================================================================

/**
 * Check if a value is a plain object (not array, null, Date, etc.)
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Date) &&
    !(value instanceof RegExp)
  );
}

/**
 * Check if array items have an 'id' field (for ID-based merging)
 */
function isArrayWithIds(arr: unknown[]): arr is Array<{ id: string;[key: string]: unknown }> {
  return arr.length > 0 && arr.every((item) => isPlainObject(item) && "id" in item);
}

/**
 * Deep clone a value
 */
function deepClone<T>(value: T): T {
  if (value === null || typeof value !== "object") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => deepClone(item)) as T;
  }

  if (value instanceof Date) {
    return new Date(value.getTime()) as T;
  }

  const cloned: Record<string, unknown> = {};
  for (const key of Object.keys(value)) {
    cloned[key] = deepClone((value as Record<string, unknown>)[key]);
  }
  return cloned as T;
}

/**
 * Deep merge two objects
 *
 * Rules:
 * - Objects: recursively merge keys
 * - Arrays with IDs: merge by ID, append new items
 * - Arrays without IDs: append override items
 * - Scalars: override value wins
 */
function deepMerge(base: ModulePayload, override: ModulePayload): ModulePayload {
  const result = deepClone(base);

  for (const key of Object.keys(override)) {
    const baseValue = result[key];
    const overrideValue = override[key];

    if (overrideValue === undefined) {
      continue;
    }

    // If override is null, set to null (explicit removal)
    if (overrideValue === null) {
      result[key] = null;
      continue;
    }

    // Both are plain objects - recurse
    if (isPlainObject(baseValue) && isPlainObject(overrideValue)) {
      result[key] = deepMerge(baseValue, overrideValue);
      continue;
    }

    // Both are arrays
    if (Array.isArray(baseValue) && Array.isArray(overrideValue)) {
      // If arrays have ID fields, merge by ID
      if (isArrayWithIds(baseValue) && isArrayWithIds(overrideValue)) {
        result[key] = mergeArraysById(baseValue, overrideValue);
      } else {
        // Otherwise append (avoiding duplicates for primitives)
        result[key] = appendArrays(baseValue, overrideValue);
      }
      continue;
    }

    // Default: override wins
    result[key] = deepClone(overrideValue);
  }

  return result;
}

/**
 * Merge two arrays by ID field
 * - Items with matching IDs are merged
 * - New items are appended
 */
function mergeArraysById(
  base: Array<{ id: string;[key: string]: unknown }>,
  override: Array<{ id: string;[key: string]: unknown }>
): Array<{ id: string;[key: string]: unknown }> {
  const result = deepClone(base);


  for (const overrideItem of override) {
    const existingIndex = result.findIndex((item) => item.id === overrideItem.id);

    if (existingIndex >= 0) {
      // Merge existing item
      result[existingIndex] = deepMerge(
        result[existingIndex] as ModulePayload,
        overrideItem as ModulePayload
      ) as { id: string;[key: string]: unknown };
    } else {
      // Append new item
      result.push(deepClone(overrideItem));
    }
  }

  return result;
}

/**
 * Append override array to base array
 * For primitives, avoids duplicates
 */
function appendArrays(base: unknown[], override: unknown[]): unknown[] {
  const result = deepClone(base);

  for (const item of override) {
    // For primitive types, check for duplicates
    if (typeof item !== "object" || item === null) {
      if (!result.includes(item)) {
        result.push(item);
      }
    } else {
      // For objects, always append (they'll be merged by ID if needed)
      result.push(deepClone(item));
    }
  }

  return result;
}

/**
 * Remove keys/items specified in the override from the base
 */
function removeFromPayload(base: ModulePayload, toRemove: ModulePayload): ModulePayload {
  const result = deepClone(base);

  for (const key of Object.keys(toRemove)) {
    const removeSpec = toRemove[key];

    // If removeSpec is true or matches the key, delete it
    if (removeSpec === true) {
      delete result[key];
      continue;
    }

    // If both are arrays, remove items by ID
    if (Array.isArray(result[key]) && Array.isArray(removeSpec)) {
      const baseArray = result[key] as unknown[];
      const idsToRemove = new Set(
        (removeSpec as Array<{ id?: string } | string>).map((item) =>
          typeof item === "string" ? item : item.id
        )
      );

      result[key] = baseArray.filter((item) => {
        if (isPlainObject(item) && "id" in item) {
          return !idsToRemove.has(item.id as string);
        }
        return !idsToRemove.has(item as string);
      });
      continue;
    }

    // If both are objects, recurse
    if (isPlainObject(result[key]) && isPlainObject(removeSpec)) {
      result[key] = removeFromPayload(
        result[key] as ModulePayload,
        removeSpec as ModulePayload
      );
    }
  }

  return result;
}

// =============================================================================
// MERGE RULES
// =============================================================================

/**
 * Apply a merge strategy to combine base with override
 */
export function mergeRules(
  base: ModulePayload,
  override: ModulePayload,
  strategy: MergeStrategy
): ModulePayload {
  switch (strategy) {
    case "replace":
      // Complete replacement
      return deepClone(override);

    case "merge":
      // Deep merge
      return deepMerge(base, override);

    case "append":
      // Append arrays, add new keys
      return appendPayloads(base, override);

    case "remove":
      // Remove specified keys/items
      return removeFromPayload(base, override);

    default:
      throw new Error(`Unknown merge strategy: ${strategy}`);
  }
}

/**
 * Append strategy: add new keys, append to arrays, don't overwrite existing
 */
function appendPayloads(base: ModulePayload, override: ModulePayload): ModulePayload {
  const result = deepClone(base);

  for (const key of Object.keys(override)) {
    const baseValue = result[key];
    const overrideValue = override[key];

    if (baseValue === undefined) {
      // New key - add it
      result[key] = deepClone(overrideValue);
      continue;
    }

    // Both are arrays - append
    if (Array.isArray(baseValue) && Array.isArray(overrideValue)) {
      if (isArrayWithIds(baseValue) && isArrayWithIds(overrideValue)) {
        result[key] = mergeArraysById(baseValue, overrideValue);
      } else {
        result[key] = appendArrays(baseValue, overrideValue);
      }
      continue;
    }

    // Both are objects - recurse with append strategy
    if (isPlainObject(baseValue) && isPlainObject(overrideValue)) {
      result[key] = appendPayloads(baseValue, overrideValue);
      continue;
    }

    // For scalars in append mode, keep base value (don't overwrite)
    // Only add if base doesn't have it
  }

  return result;
}

// =============================================================================
// PRODUCE MERGED RULESET
// =============================================================================

/**
 * Produce a merged ruleset from a loaded ruleset
 *
 * Process:
 * 1. Start with empty modules
 * 2. For each book in load order (core first):
 *    - For each module in the book:
 *      - Apply the module's merge strategy
 * 3. Return immutable merged ruleset with snapshot ID
 */
export function produceMergedRuleset(loadedRuleset: LoadedRuleset): MergeResult {
  try {
    const { edition, books } = loadedRuleset;

    // Initialize empty modules container
    const mergedModules: Record<RuleModuleType, ModulePayload> = {} as Record<
      RuleModuleType,
      ModulePayload
    >;

    // Sort books by load order (should already be sorted, but ensure it)
    const sortedBooks = [...books].sort((a, b) => a.loadOrder - b.loadOrder);

    // Process each book in order
    for (const book of sortedBooks) {
      const modules = book.payload.modules;
      if (!modules) continue;

      // Process each module in the book
      for (const [moduleTypeStr, moduleEntry] of Object.entries(modules)) {
        const moduleType = moduleTypeStr as RuleModuleType;
        const entry = moduleEntry as BookModuleEntry;

        if (!entry.payload) continue;

        // Determine merge strategy
        const strategy = inferMergeStrategy(entry);

        // Get current base (empty if this is the first time we see this module)
        const currentBase = mergedModules[moduleType] || {};

        // Apply merge
        mergedModules[moduleType] = mergeRules(
          currentBase,
          entry.payload as ModulePayload,
          strategy
        );
      }
    }

    // Create the final immutable merged ruleset
    const mergedRuleset: MergedRuleset = {
      snapshotId: uuidv4(),
      editionId: edition.id,
      editionCode: edition.shortCode,
      bookIds: sortedBooks.map((b) => b.id),
      modules: mergedModules,
      createdAt: new Date().toISOString(),
    };

    // Freeze the ruleset to make it immutable
    Object.freeze(mergedRuleset);
    Object.freeze(mergedRuleset.modules);

    return {
      success: true,
      ruleset: mergedRuleset,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error during merge",
    };
  }
}

/**
 * Infer the merge strategy from a BookModuleEntry
 */
function inferMergeStrategy(entry: BookModuleEntry): MergeStrategy {
  // Explicit strategy takes precedence
  if (entry.mergeStrategy) {
    return entry.mergeStrategy;
  }

  // Shorthand flags
  if (entry.replace === true) {
    return "replace";
  }

  if (entry.append === true) {
    return "append";
  }

  // Default to merge
  return "merge";
}

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

/**
 * Load and merge a ruleset in one step
 */
export async function loadAndMergeRuleset(
  editionCode: string,
  bookIds?: ID[]
): Promise<MergeResult> {
  // Import dynamically to avoid circular dependency
  const { loadRuleset } = await import("./loader");

  const loadResult = await loadRuleset({
    editionCode: editionCode as import("../types").EditionCode,
    bookIds,
  });

  if (!loadResult.success || !loadResult.ruleset) {
    return {
      success: false,
      error: loadResult.error || "Failed to load ruleset",
    };
  }

  return produceMergedRuleset(loadResult.ruleset);
}

/**
 * Get a module from a merged ruleset with type safety
 */
export function getModule<T = ModulePayload>(
  ruleset: MergedRuleset,
  moduleType: RuleModuleType
): T | undefined {
  return ruleset.modules[moduleType] as T | undefined;
}

/**
 * Check if a merged ruleset has a specific module
 */
export function hasModule(ruleset: MergedRuleset, moduleType: RuleModuleType): boolean {
  return moduleType in ruleset.modules && ruleset.modules[moduleType] !== undefined;
}

/**
 * Get all module types present in a merged ruleset
 */
export function getModuleTypes(ruleset: MergedRuleset): RuleModuleType[] {
  return Object.keys(ruleset.modules) as RuleModuleType[];
}

