/**
 * Search Index Utility
 *
 * Flattens all browsable rule modules into ContentPreviewItem arrays
 * for universal search and category browsing.
 */

import type { ContentPreviewItem } from "@/lib/types";
import { GEAR_SEARCH_KEYS } from "@/lib/rules/gear/catalog-helpers";

/** Named item with at minimum an id and name */
interface NamedItem {
  id?: string;
  name: string;
  description?: string;
  summary?: string;
  category?: string;
  linkedAttribute?: string;
  damage?: string;
  armorRating?: number;
  type?: string;
  [key: string]: unknown;
}

/**
 * Extract an array of named items into ContentPreviewItem format
 */
function extractNamedArray(
  arr: unknown,
  category: string,
  subcategory: string | undefined,
  sourceBook: string,
  summaryFn?: (item: NamedItem) => string | undefined
): ContentPreviewItem[] {
  if (!Array.isArray(arr)) return [];
  const items: ContentPreviewItem[] = [];
  for (const item of arr as NamedItem[]) {
    if (!item.name) continue;
    items.push({
      id: item.id || item.name.toLowerCase().replace(/\s+/g, "-"),
      name: item.name,
      category,
      subcategory,
      summary: summaryFn
        ? summaryFn(item)
        : item.description?.slice(0, 100) || item.summary?.slice(0, 100),
      source: sourceBook,
    });
  }
  return items;
}

/**
 * Extract items from a nested object where each key maps to an array of named items
 */
function extractNestedArrays(
  obj: unknown,
  category: string,
  sourceBook: string,
  formatSubcategory: (key: string) => string,
  summaryFn?: (item: NamedItem) => string | undefined
): ContentPreviewItem[] {
  if (!obj || typeof obj !== "object") return [];
  const items: ContentPreviewItem[] = [];
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (Array.isArray(value)) {
      items.push(
        ...extractNamedArray(value, category, formatSubcategory(key), sourceBook, summaryFn)
      );
    }
  }
  return items;
}

/** Convert camelCase/kebab-case key to Title Case label */
function keyToLabel(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// =============================================================================
// Module-specific extractors
// =============================================================================

type ModuleExtractor = (
  payload: Record<string, unknown>,
  sourceBook: string
) => ContentPreviewItem[];

const moduleExtractors: Record<string, ModuleExtractor> = {
  metatypes: (payload, sourceBook) =>
    extractNamedArray(payload.metatypes, "metatypes", undefined, sourceBook),

  skills: (payload, sourceBook) =>
    extractNamedArray(payload.activeSkills, "skills", undefined, sourceBook, (item) =>
      item.linkedAttribute ? `Linked to ${item.linkedAttribute}` : undefined
    ),

  qualities: (payload, sourceBook) => [
    ...extractNamedArray(payload.positive, "qualities", "Positive", sourceBook),
    ...extractNamedArray(payload.negative, "qualities", "Negative", sourceBook),
  ],

  gear: (payload, sourceBook) => {
    const items: ContentPreviewItem[] = [];

    // Weapons - nested by type
    items.push(
      ...extractNestedArrays(payload.weapons, "gear", sourceBook, keyToLabel, (item) =>
        item.damage ? `${item.damage}` : undefined
      )
    );

    // Armor - can be array or nested object
    if (Array.isArray(payload.armor)) {
      items.push(
        ...extractNamedArray(payload.armor, "gear", "Armor", sourceBook, (item) =>
          item.armorRating ? `Armor: ${item.armorRating}` : undefined
        )
      );
    } else if (payload.armor && typeof payload.armor === "object") {
      items.push(
        ...extractNestedArrays(
          payload.armor,
          "gear",
          sourceBook,
          () => "Armor",
          (item) => (item.armorRating ? `Armor: ${item.armorRating}` : undefined)
        )
      );
    }

    // All other gear sub-arrays
    for (const key of GEAR_SEARCH_KEYS) {
      if (Array.isArray(payload[key])) {
        items.push(...extractNamedArray(payload[key], "gear", keyToLabel(key), sourceBook));
      }
    }

    return items;
  },

  magic: (payload, sourceBook) => {
    const items: ContentPreviewItem[] = [];

    // Spells - nested by school
    if (payload.spells && typeof payload.spells === "object") {
      items.push(
        ...extractNestedArrays(
          payload.spells,
          "magic",
          sourceBook,
          (key) => `${keyToLabel(key)} Spells`
        )
      );
    }

    items.push(...extractNamedArray(payload.complexForms, "magic", "Complex Forms", sourceBook));
    items.push(...extractNamedArray(payload.traditions, "magic", "Traditions", sourceBook));
    items.push(...extractNamedArray(payload.mentorSpirits, "magic", "Mentor Spirits", sourceBook));
    items.push(...extractNamedArray(payload.rituals, "magic", "Rituals", sourceBook));
    items.push(...extractNamedArray(payload.paths, "magic", "Paths", sourceBook));
    items.push(...extractNamedArray(payload.spriteTypes, "magic", "Sprite Types", sourceBook));
    items.push(...extractNamedArray(payload.spritePowers, "magic", "Sprite Powers", sourceBook));

    return items;
  },

  cyberware: (payload, sourceBook) =>
    extractNamedArray(payload.catalog, "cyberware", undefined, sourceBook, (item) =>
      item.category ? keyToLabel(item.category as string) : undefined
    ),

  bioware: (payload, sourceBook) =>
    extractNamedArray(payload.catalog, "bioware", undefined, sourceBook, (item) =>
      item.category ? keyToLabel(item.category as string) : undefined
    ),

  vehicles: (payload, sourceBook) => {
    const items: ContentPreviewItem[] = [];
    const vehicleArrayKeys = [
      "groundcraft",
      "watercraft",
      "aircraft",
      "drones",
      "rccs",
      "autosofts",
    ];
    for (const key of vehicleArrayKeys) {
      if (Array.isArray(payload[key])) {
        items.push(...extractNamedArray(payload[key], "vehicles", keyToLabel(key), sourceBook));
      }
    }
    return items;
  },

  programs: (payload, sourceBook) => {
    const items: ContentPreviewItem[] = [];
    const programKeys = [
      "common",
      "hacking",
      "agents",
      "datasofts",
      "mapsofts",
      "shopsofts",
      "tutorsofts",
      "skillsofts",
    ];
    for (const key of programKeys) {
      if (Array.isArray(payload[key])) {
        items.push(...extractNamedArray(payload[key], "programs", keyToLabel(key), sourceBook));
      }
    }
    return items;
  },

  foci: (payload, sourceBook) => extractNamedArray(payload.foci, "foci", undefined, sourceBook),

  adeptPowers: (payload, sourceBook) =>
    extractNamedArray(payload.powers, "adeptPowers", undefined, sourceBook),

  spirits: (payload, sourceBook) =>
    extractNamedArray(payload.spiritTypes, "spirits", undefined, sourceBook),

  critterPowers: (payload, sourceBook) =>
    extractNamedArray(payload.powers, "critterPowers", undefined, sourceBook),

  critterWeaknesses: (payload, sourceBook) =>
    extractNamedArray(payload.weaknesses, "critterWeaknesses", undefined, sourceBook),

  critters: (payload, sourceBook) =>
    extractNamedArray(payload.critters, "critters", undefined, sourceBook),

  modifications: (payload, sourceBook) => {
    const items: ContentPreviewItem[] = [];
    const modKeys = ["weaponMods", "armorMods", "gearMods", "vehicleMods"];
    for (const key of modKeys) {
      if (Array.isArray(payload[key])) {
        items.push(
          ...extractNamedArray(payload[key], "modifications", keyToLabel(key), sourceBook)
        );
      }
    }
    return items;
  },

  lifestyle: (payload, sourceBook) =>
    extractNamedArray(payload.lifestyles, "lifestyle", undefined, sourceBook),

  contactArchetypes: (payload, sourceBook) =>
    extractNamedArray(payload.archetypes, "contactArchetypes", undefined, sourceBook),

  contactTemplates: (payload, sourceBook) =>
    extractNamedArray(payload.templates, "contactTemplates", undefined, sourceBook),

  favorServices: (payload, sourceBook) =>
    extractNamedArray(payload.services, "favorServices", undefined, sourceBook),

  actions: (payload, sourceBook) => {
    const items: ContentPreviewItem[] = [];
    const actionKeys = ["combat", "general", "magic", "matrix", "social", "vehicle"];
    for (const key of actionKeys) {
      if (Array.isArray(payload[key])) {
        items.push(...extractNamedArray(payload[key], "actions", keyToLabel(key), sourceBook));
      }
    }
    return items;
  },
};

// Modules that are config-only, not browsable
const SKIPPED_MODULES = new Set([
  "advancement",
  "diceRules",
  "priorities",
  "attributes",
  "creationMethods",
  "categoryModificationDefaults",
  "socialModifiers",
  "gameplayLevels",
]);

/**
 * All browsable category keys (matches moduleExtractors keys)
 */
export const BROWSABLE_CATEGORIES = Object.keys(moduleExtractors);

/**
 * Flatten all modules from a book payload into searchable ContentPreviewItems.
 *
 * @param modules - The modules object from a book payload
 * @param sourceBook - The book title for attribution
 * @returns Array of all browsable items
 */
export function flattenModulesForSearch(
  modules: Record<string, { payload?: unknown }>,
  sourceBook: string
): ContentPreviewItem[] {
  const items: ContentPreviewItem[] = [];

  for (const [moduleKey, moduleData] of Object.entries(modules)) {
    if (SKIPPED_MODULES.has(moduleKey)) continue;
    if (!moduleData?.payload) continue;

    const extractor = moduleExtractors[moduleKey];
    if (extractor) {
      items.push(...extractor(moduleData.payload as Record<string, unknown>, sourceBook));
    }
  }

  return items;
}
