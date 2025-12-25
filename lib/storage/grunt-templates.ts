/**
 * Grunt template storage layer
 *
 * Loads grunt templates from edition data at /data/editions/{editionCode}/grunt-templates/
 *
 * Templates are read-only edition data that provide default configurations
 * for each Professional Rating tier (0-6).
 *
 * @see /docs/capabilities/campaign.npc-governance.md
 */

import path from "path";
import type { ID } from "../types";
import type { EditionCode } from "../types/edition";
import type { GruntTemplate, ProfessionalRating } from "../types/grunts";
import { readJsonFile, readAllJsonFiles, listJsonFiles, directoryExists } from "./base";

// =============================================================================
// PATH UTILITIES
// =============================================================================

/**
 * Base data directory
 */
const DATA_DIR = path.join(process.cwd(), "data");

/**
 * Get the grunt templates directory for an edition
 */
function getTemplatesDir(editionCode: EditionCode): string {
  return path.join(DATA_DIR, "editions", editionCode, "grunt-templates");
}

/**
 * Get the file path for a specific template
 */
function getTemplatePath(editionCode: EditionCode, templateId: ID): string {
  return path.join(getTemplatesDir(editionCode), `${templateId}.json`);
}

// =============================================================================
// QUERY OPERATIONS
// =============================================================================

/**
 * Get all grunt templates for an edition
 *
 * @param editionCode - Edition to query (e.g., "sr5")
 * @param professionalRating - Optional filter by Professional Rating
 * @returns Array of grunt templates
 */
export async function getGruntTemplates(
  editionCode: EditionCode,
  professionalRating?: ProfessionalRating
): Promise<GruntTemplate[]> {
  const dir = getTemplatesDir(editionCode);

  // Check if directory exists
  const exists = await directoryExists(dir);
  if (!exists) {
    return [];
  }

  // Read all templates
  const templates = await readAllJsonFiles<GruntTemplate>(dir);

  // Filter by Professional Rating if specified
  if (professionalRating !== undefined) {
    return templates.filter((t) => t.professionalRating === professionalRating);
  }

  // Sort by Professional Rating, then by name
  return templates.sort((a, b) => {
    if (a.professionalRating !== b.professionalRating) {
      return a.professionalRating - b.professionalRating;
    }
    return a.name.localeCompare(b.name);
  });
}

/**
 * Get a specific grunt template by ID
 *
 * @param editionCode - Edition the template belongs to
 * @param templateId - Template ID to retrieve
 * @returns Template or null if not found
 */
export async function getGruntTemplate(
  editionCode: EditionCode,
  templateId: ID
): Promise<GruntTemplate | null> {
  const filePath = getTemplatePath(editionCode, templateId);
  return readJsonFile<GruntTemplate>(filePath);
}

/**
 * Get templates grouped by Professional Rating
 *
 * @param editionCode - Edition to query
 * @returns Map of PR to templates
 */
export async function getTemplatesByRating(
  editionCode: EditionCode
): Promise<Map<ProfessionalRating, GruntTemplate[]>> {
  const templates = await getGruntTemplates(editionCode);
  const grouped = new Map<ProfessionalRating, GruntTemplate[]>();

  for (const template of templates) {
    const existing = grouped.get(template.professionalRating) ?? [];
    existing.push(template);
    grouped.set(template.professionalRating, existing);
  }

  return grouped;
}

/**
 * Get template by name (case-insensitive)
 *
 * @param editionCode - Edition to query
 * @param name - Template name to search for
 * @returns Template or null if not found
 */
export async function getTemplateByName(
  editionCode: EditionCode,
  name: string
): Promise<GruntTemplate | null> {
  const templates = await getGruntTemplates(editionCode);
  const nameLower = name.toLowerCase();
  return templates.find((t) => t.name.toLowerCase() === nameLower) ?? null;
}

/**
 * Get templates by category
 *
 * @param editionCode - Edition to query
 * @param category - Category to filter by
 * @returns Array of matching templates
 */
export async function getTemplatesByCategory(
  editionCode: EditionCode,
  category: string
): Promise<GruntTemplate[]> {
  const templates = await getGruntTemplates(editionCode);
  return templates.filter((t) => t.category === category);
}

/**
 * Search templates by name or description
 *
 * @param editionCode - Edition to query
 * @param query - Search query
 * @returns Array of matching templates
 */
export async function searchTemplates(
  editionCode: EditionCode,
  query: string
): Promise<GruntTemplate[]> {
  const templates = await getGruntTemplates(editionCode);
  const queryLower = query.toLowerCase();

  return templates.filter(
    (t) =>
      t.name.toLowerCase().includes(queryLower) ||
      t.description.toLowerCase().includes(queryLower)
  );
}

/**
 * Check if templates exist for an edition
 *
 * @param editionCode - Edition to check
 * @returns True if templates directory exists and has files
 */
export async function hasTemplates(editionCode: EditionCode): Promise<boolean> {
  const dir = getTemplatesDir(editionCode);
  const exists = await directoryExists(dir);
  if (!exists) {
    return false;
  }

  const files = await listJsonFiles(dir);
  return files.length > 0;
}

/**
 * Get available template categories for an edition
 *
 * @param editionCode - Edition to query
 * @returns Array of unique category names
 */
export async function getTemplateCategories(
  editionCode: EditionCode
): Promise<string[]> {
  const templates = await getGruntTemplates(editionCode);
  const categories = new Set<string>();

  for (const template of templates) {
    if (template.category) {
      categories.add(template.category);
    }
  }

  return Array.from(categories).sort();
}
