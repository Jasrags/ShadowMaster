/**
 * Archetype storage layer
 *
 * Loads character archetypes from edition data at /data/editions/{editionCode}/archetypes/
 *
 * Archetypes are read-only edition data that provide pre-filled character
 * creation starting points for common character concepts.
 */

import path from "path";
import type { ID } from "../types";
import type { EditionCode } from "../types/edition";
import type { CharacterArchetype, ArchetypeCategory } from "../types/archetype";
import { readJsonFile, readAllJsonFiles, listJsonFiles, directoryExists } from "./base";

// =============================================================================
// PATH UTILITIES
// =============================================================================

const DATA_DIR = path.join(process.cwd(), "data");

function getArchetypesDir(editionCode: EditionCode): string {
  return path.join(DATA_DIR, "editions", editionCode, "archetypes");
}

function getArchetypePath(editionCode: EditionCode, archetypeId: ID): string {
  return path.join(getArchetypesDir(editionCode), `${archetypeId}.json`);
}

// =============================================================================
// QUERY OPERATIONS
// =============================================================================

/**
 * Get all archetypes for an edition
 *
 * @param editionCode - Edition to query (e.g., "sr5")
 * @param category - Optional filter by category
 * @returns Array of archetypes sorted by difficulty then name
 */
export async function getArchetypes(
  editionCode: EditionCode,
  category?: ArchetypeCategory
): Promise<CharacterArchetype[]> {
  const dir = getArchetypesDir(editionCode);

  const exists = await directoryExists(dir);
  if (!exists) {
    return [];
  }

  const archetypes = await readAllJsonFiles<CharacterArchetype>(dir);

  const filtered = category ? archetypes.filter((a) => a.category === category) : archetypes;

  const difficultyOrder: Record<string, number> = { beginner: 0, intermediate: 1, advanced: 2 };
  return filtered.sort((a, b) => {
    const diffA = difficultyOrder[a.difficulty] ?? 1;
    const diffB = difficultyOrder[b.difficulty] ?? 1;
    if (diffA !== diffB) return diffA - diffB;
    return a.name.localeCompare(b.name);
  });
}

/**
 * Get a specific archetype by ID
 */
export async function getArchetype(
  editionCode: EditionCode,
  archetypeId: ID
): Promise<CharacterArchetype | null> {
  const filePath = getArchetypePath(editionCode, archetypeId);
  return readJsonFile<CharacterArchetype>(filePath);
}

/**
 * Search archetypes by name or description
 */
export async function searchArchetypes(
  editionCode: EditionCode,
  query: string
): Promise<CharacterArchetype[]> {
  const archetypes = await getArchetypes(editionCode);
  const queryLower = query.toLowerCase();

  return archetypes.filter(
    (a) =>
      a.name.toLowerCase().includes(queryLower) || a.description.toLowerCase().includes(queryLower)
  );
}

/**
 * Check if archetypes exist for an edition
 */
export async function hasArchetypes(editionCode: EditionCode): Promise<boolean> {
  const dir = getArchetypesDir(editionCode);
  const exists = await directoryExists(dir);
  if (!exists) return false;

  const files = await listJsonFiles(dir);
  return files.length > 0;
}
