/**
 * Edition storage layer
 *
 * Handles loading edition definitions and their associated books.
 * Editions are stored in data/editions/{editionCode}/ directories.
 *
 * Directory structure:
 *   data/editions/sr5/
 *     ├── edition.json         (Edition metadata)
 *     ├── core-rulebook.json   (Core book payload)
 *     └── run-faster.json      (Sourcebook payload, optional)
 */

import path from "path";
import type {
  Edition,
  EditionCode,
  Book,
  BookPayload,
  CreationMethod,
} from "../types";
import {
  readJsonFile,
  listSubdirectories,
  directoryExists,
} from "./base";

const EDITIONS_DIR = path.join(process.cwd(), "data", "editions");

/**
 * Get the directory path for an edition
 */
function getEditionDir(editionCode: EditionCode): string {
  return path.join(EDITIONS_DIR, editionCode);
}

/**
 * Get the file path for an edition's metadata
 */
function getEditionFilePath(editionCode: EditionCode): string {
  return path.join(getEditionDir(editionCode), "edition.json");
}

/**
 * Get the file path for a book payload within an edition
 */
function getBookFilePath(editionCode: EditionCode, bookFileName: string): string {
  // Ensure .json extension
  const fileName = bookFileName.endsWith(".json") ? bookFileName : `${bookFileName}.json`;
  return path.join(getEditionDir(editionCode), fileName);
}

// =============================================================================
// EDITION OPERATIONS
// =============================================================================

/**
 * Get an edition by its code
 */
export async function getEdition(editionCode: EditionCode): Promise<Edition | null> {
  const filePath = getEditionFilePath(editionCode);
  return readJsonFile<Edition>(filePath);
}

/**
 * Get all available editions
 */
export async function getAllEditions(): Promise<Edition[]> {
  const editionCodes = await listSubdirectories(EDITIONS_DIR);
  const editions: Edition[] = [];

  for (const code of editionCodes) {
    const edition = await getEdition(code as EditionCode);
    if (edition) {
      editions.push(edition);
    }
  }

  return editions;
}

/**
 * Check if an edition exists
 */
export async function editionExists(editionCode: EditionCode): Promise<boolean> {
  const editionDir = getEditionDir(editionCode);
  return directoryExists(editionDir);
}

// =============================================================================
// BOOK OPERATIONS
// =============================================================================

/**
 * Get a book's metadata from an edition
 * Note: Book metadata is stored within the edition.json or book payload
 */
export async function getBook(
  editionCode: EditionCode,
  bookId: string
): Promise<Book | null> {
  const edition = await getEdition(editionCode);
  if (!edition) return null;

  // Books are referenced in the edition, but their full data is in payloads
  // For now, we need to load the book payload and extract metadata
  const books = await getAllBooks(editionCode);
  return books.find((book) => book.id === bookId) || null;
}

/**
 * Get all books for an edition
 * Scans the edition directory for book payload files
 */
export async function getAllBooks(editionCode: EditionCode): Promise<Book[]> {
  const edition = await getEdition(editionCode);
  if (!edition) return [];

  const books: Book[] = [];
  const editionDir = getEditionDir(editionCode);

  // Load each book referenced in the edition
  for (const bookId of edition.bookIds) {
    // Try to find the book file - could be named by ID or slug
    const bookPayload = await getBookPayload(editionCode, bookId);
    if (bookPayload) {
      // Extract Book metadata from payload
      const book: Book = {
        id: bookPayload.meta.bookId,
        editionId: edition.id,
        title: bookPayload.meta.title,
        isCore: bookPayload.meta.category === "core",
        categories: [bookPayload.meta.category],
        payloadRef: path.join(editionDir, `${bookId}.json`),
        createdAt: new Date().toISOString(),
      };
      books.push(book);
    }
  }

  return books;
}

/**
 * Get the core rulebook for an edition
 */
export async function getCoreBook(editionCode: EditionCode): Promise<Book | null> {
  const books = await getAllBooks(editionCode);
  return books.find((book) => book.isCore) || null;
}

// =============================================================================
// BOOK PAYLOAD OPERATIONS
// =============================================================================

/**
 * Get a book's full payload (rule modules and overrides)
 */
export async function getBookPayload(
  editionCode: EditionCode,
  bookId: string
): Promise<BookPayload | null> {
  const filePath = getBookFilePath(editionCode, bookId);
  return readJsonFile<BookPayload>(filePath);
}

/**
 * Get all book payloads for an edition
 */
export async function getAllBookPayloads(
  editionCode: EditionCode
): Promise<BookPayload[]> {
  const edition = await getEdition(editionCode);
  if (!edition) return [];

  const payloads: BookPayload[] = [];

  for (const bookId of edition.bookIds) {
    const payload = await getBookPayload(editionCode, bookId);
    if (payload) {
      payloads.push(payload);
    }
  }

  return payloads;
}

// =============================================================================
// CREATION METHOD OPERATIONS
// =============================================================================

/**
 * Get a creation method by ID from an edition
 */
export async function getCreationMethod(
  editionCode: EditionCode,
  methodId: string
): Promise<CreationMethod | null> {
  // Creation methods are stored in the creationMethods module of the core book
  const corePayload = await getBookPayload(editionCode, "core-rulebook");
  if (!corePayload?.modules?.creationMethods?.payload) return null;

  const methods = corePayload.modules.creationMethods.payload as {
    creationMethods?: CreationMethod[];
  };

  return methods.creationMethods?.find((m) => m.id === methodId) || null;
}

/**
 * Get all creation methods available for an edition
 */
export async function getAllCreationMethods(
  editionCode: EditionCode
): Promise<CreationMethod[]> {
  const edition = await getEdition(editionCode);
  if (!edition) return [];

  // Load creation methods from all book payloads
  const payloads = await getAllBookPayloads(editionCode);
  const methods: CreationMethod[] = [];

  for (const payload of payloads) {
    const methodsModule = payload.modules?.creationMethods?.payload as {
      creationMethods?: CreationMethod[];
    };

    if (methodsModule?.creationMethods) {
      methods.push(...methodsModule.creationMethods);
    }
  }

  return methods;
}

/**
 * Get the default creation method for an edition
 */
export async function getDefaultCreationMethod(
  editionCode: EditionCode
): Promise<CreationMethod | null> {
  const edition = await getEdition(editionCode);
  if (!edition?.defaultCreationMethodId) return null;

  return getCreationMethod(editionCode, edition.defaultCreationMethodId);
}

// =============================================================================
// DISCOVERY OPERATIONS (Content Summarization)
// =============================================================================

import type {
  ContentSummary,
  ContentCategory,
  BookSummary,
} from "../types/discovery";

/**
 * Get a content summary for an edition
 * Provides counts of metatypes, skills, qualities, etc.
 */
export async function getEditionContentSummary(
  editionCode: EditionCode
): Promise<ContentSummary | null> {
  const edition = await getEdition(editionCode);
  if (!edition) return null;

  const payloads = await getAllBookPayloads(editionCode);
  
  // Aggregate counts across all books
  let metatypeCount = 0;
  let skillCount = 0;
  let qualityCount = 0;
  let spellCount = 0;
  let gearCount = 0;
  let augmentationCount = 0;
  let vehicleCount = 0;
  
  const categoryCounts: Record<string, number> = {};

  for (const payload of payloads) {
    const modules = payload.modules || {};

    // Count metatypes
    const metatypesPayload = modules.metatypes?.payload as { metatypes?: unknown[] } | undefined;
    if (metatypesPayload?.metatypes) {
      metatypeCount += metatypesPayload.metatypes.length;
      categoryCounts["metatypes"] = (categoryCounts["metatypes"] || 0) + metatypesPayload.metatypes.length;
    }

    // Count skills
    const skillsPayload = modules.skills?.payload as { activeSkills?: unknown[] } | undefined;
    if (skillsPayload?.activeSkills) {
      skillCount += skillsPayload.activeSkills.length;
      categoryCounts["skills"] = (categoryCounts["skills"] || 0) + skillsPayload.activeSkills.length;
    }

    // Count qualities
    const qualitiesPayload = modules.qualities?.payload as { positive?: unknown[]; negative?: unknown[] } | undefined;
    if (qualitiesPayload) {
      const positiveCount = qualitiesPayload.positive?.length || 0;
      const negativeCount = qualitiesPayload.negative?.length || 0;
      qualityCount += positiveCount + negativeCount;
      categoryCounts["qualities"] = (categoryCounts["qualities"] || 0) + positiveCount + negativeCount;
    }

    // Count spells
    const magicPayload = modules.magic?.payload as { spells?: unknown[] } | undefined;
    if (magicPayload?.spells) {
      spellCount += magicPayload.spells.length;
      categoryCounts["spells"] = (categoryCounts["spells"] || 0) + magicPayload.spells.length;
    }

    // Count gear
    const gearPayload = modules.gear?.payload as { 
      weapons?: unknown[]; 
      armor?: unknown[]; 
      electronics?: unknown[];
      miscellaneous?: unknown[];
    } | undefined;
    if (gearPayload) {
      const weaponCount = gearPayload.weapons?.length || 0;
      const armorCount = gearPayload.armor?.length || 0;
      const electronicsCount = gearPayload.electronics?.length || 0;
      const miscCount = gearPayload.miscellaneous?.length || 0;
      gearCount += weaponCount + armorCount + electronicsCount + miscCount;
      categoryCounts["gear"] = (categoryCounts["gear"] || 0) + weaponCount + armorCount + electronicsCount + miscCount;
    }

    // Count augmentations (cyberware + bioware)
    const cyberwarePayload = modules.cyberware?.payload as { items?: unknown[] } | undefined;
    const biowarePayload = modules.bioware?.payload as { items?: unknown[] } | undefined;
    const cyberCount = cyberwarePayload?.items?.length || 0;
    const bioCount = biowarePayload?.items?.length || 0;
    augmentationCount += cyberCount + bioCount;
    if (cyberCount > 0 || bioCount > 0) {
      categoryCounts["augmentations"] = (categoryCounts["augmentations"] || 0) + cyberCount + bioCount;
    }

    // Count vehicles
    const vehiclesPayload = modules.vehicles?.payload as { vehicles?: unknown[]; drones?: unknown[] } | undefined;
    if (vehiclesPayload) {
      const vCount = vehiclesPayload.vehicles?.length || 0;
      const dCount = vehiclesPayload.drones?.length || 0;
      vehicleCount += vCount + dCount;
      categoryCounts["vehicles"] = (categoryCounts["vehicles"] || 0) + vCount + dCount;
    }
  }

  // Build category list
  const categories: ContentCategory[] = Object.entries(categoryCounts).map(([id, count]) => ({
    id,
    name: id.charAt(0).toUpperCase() + id.slice(1),
    itemCount: count,
  }));

  return {
    editionCode,
    metatypeCount,
    skillCount,
    qualityCount,
    spellCount,
    gearCount,
    augmentationCount,
    vehicleCount,
    categories,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Get a summary of a specific book's content contributions
 */
export async function getBookSummary(
  editionCode: EditionCode,
  bookId: string
): Promise<BookSummary | null> {
  const payload = await getBookPayload(editionCode, bookId);
  if (!payload) return null;

  const modules = payload.modules || {};
  const contributions: ContentCategory[] = [];

  // Count contributions per module type
  const moduleTypes: Array<{ key: string; name: string; countPath: string[] }> = [
    { key: "metatypes", name: "Metatypes", countPath: ["metatypes"] },
    { key: "skills", name: "Skills", countPath: ["activeSkills"] },
    { key: "qualities", name: "Qualities", countPath: ["positive", "negative"] },
    { key: "gear", name: "Gear", countPath: ["weapons", "armor", "electronics"] },
    { key: "magic", name: "Magic", countPath: ["spells", "paths"] },
    { key: "cyberware", name: "Cyberware", countPath: ["items"] },
    { key: "bioware", name: "Bioware", countPath: ["items"] },
    { key: "vehicles", name: "Vehicles", countPath: ["vehicles", "drones"] },
  ];

  for (const { key, name, countPath } of moduleTypes) {
    const modulePayload = modules[key as keyof typeof modules]?.payload as Record<string, unknown[]> | undefined;
    if (modulePayload) {
      let count = 0;
      for (const path of countPath) {
        const items = modulePayload[path];
        if (Array.isArray(items)) {
          count += items.length;
        }
      }
      if (count > 0) {
        contributions.push({ id: key, name, itemCount: count });
      }
    }
  }

  return {
    id: payload.meta.bookId,
    title: payload.meta.title,
    category: payload.meta.category,
    role: payload.meta.category === "core" ? "Core rules foundation" : "Content expansion",
    contentContributions: contributions,
  };
}

