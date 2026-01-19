/**
 * Unit tests for editions.ts storage module
 *
 * Tests edition, book, and creation method loading with VI mocks.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Edition, EditionCode, Book, BookPayload, CreationMethod } from "@/lib/types";

// Mock the base storage module
vi.mock("../base", () => ({
  readJsonFile: vi.fn(),
  listSubdirectories: vi.fn(),
  directoryExists: vi.fn(),
}));

// Import after mocking
import * as editionsStorage from "../editions";
import * as base from "../base";

// =============================================================================
// TEST FIXTURES
// =============================================================================

function createMockEdition(overrides: Partial<Edition> = {}): Edition {
  return {
    id: "sr5-edition",
    shortCode: "sr5" as EditionCode,
    name: "Shadowrun 5th Edition",
    version: "1.0.0",
    bookIds: ["core-rulebook"],
    creationMethodIds: ["priority", "karma-gen"],
    defaultCreationMethodId: "priority",
    releaseYear: 2013,
    description: "Fifth edition of Shadowrun",
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

function createMockBookPayload(overrides: Partial<BookPayload> = {}): BookPayload {
  return {
    meta: {
      bookId: "core-rulebook",
      title: "Core Rulebook",
      version: "1.0.0",
      category: "core",
      edition: "sr5" as EditionCode,
      ...overrides.meta,
    },
    modules: {
      metatypes: {
        replace: true,
        payload: {
          metatypes: [
            { id: "human", name: "Human" },
            { id: "elf", name: "Elf" },
          ],
        },
      },
      skills: {
        replace: true,
        payload: {
          activeSkills: [
            { id: "firearms", name: "Firearms" },
            { id: "athletics", name: "Athletics" },
          ],
        },
      },
      qualities: {
        replace: true,
        payload: {
          positive: [{ id: "ambidextrous", name: "Ambidextrous" }],
          negative: [{ id: "addiction", name: "Addiction" }],
        },
      },
      creationMethods: {
        replace: true,
        payload: {
          creationMethods: [
            {
              id: "priority",
              name: "Priority",
              description: "Classic priority-based creation",
              type: "priority",
              budgets: {},
            },
            {
              id: "karma-gen",
              name: "Karma Gen",
              description: "Point-buy system",
              type: "karma",
              budgets: {},
            },
          ],
        },
      },
      ...overrides.modules,
    },
  };
}

// =============================================================================
// SETUP
// =============================================================================

beforeEach(() => {
  vi.clearAllMocks();
});

// =============================================================================
// GET EDITION TESTS
// =============================================================================

describe("getEdition", () => {
  it("should return edition by code", async () => {
    const edition = createMockEdition();
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(edition);

    const result = await editionsStorage.getEdition("sr5");

    expect(result).toEqual(edition);
  });

  it("should return null for non-existent edition", async () => {
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(null);

    const result = await editionsStorage.getEdition("non-existent" as EditionCode);

    expect(result).toBeNull();
  });
});

// =============================================================================
// GET ALL EDITIONS TESTS
// =============================================================================

describe("getAllEditions", () => {
  it("should return all editions", async () => {
    vi.mocked(base.listSubdirectories).mockResolvedValueOnce(["sr5", "sr6"]);
    vi.mocked(base.readJsonFile)
      .mockResolvedValueOnce(createMockEdition({ shortCode: "sr5" as EditionCode }))
      .mockResolvedValueOnce(createMockEdition({ shortCode: "sr6" as EditionCode, name: "SR6" }));

    const result = await editionsStorage.getAllEditions();

    expect(result).toHaveLength(2);
    expect(result.map((e) => e.shortCode)).toContain("sr5");
    expect(result.map((e) => e.shortCode)).toContain("sr6");
  });

  it("should return empty array when no editions exist", async () => {
    vi.mocked(base.listSubdirectories).mockResolvedValueOnce([]);

    const result = await editionsStorage.getAllEditions();

    expect(result).toEqual([]);
  });

  it("should skip invalid edition directories", async () => {
    vi.mocked(base.listSubdirectories).mockResolvedValueOnce(["sr5", "invalid"]);
    vi.mocked(base.readJsonFile)
      .mockResolvedValueOnce(createMockEdition({ shortCode: "sr5" as EditionCode }))
      .mockResolvedValueOnce(null);

    const result = await editionsStorage.getAllEditions();

    expect(result).toHaveLength(1);
    expect(result[0].shortCode).toBe("sr5");
  });
});

// =============================================================================
// EDITION EXISTS TESTS
// =============================================================================

describe("editionExists", () => {
  it("should return true when edition directory exists", async () => {
    vi.mocked(base.directoryExists).mockResolvedValueOnce(true);

    const result = await editionsStorage.editionExists("sr5");

    expect(result).toBe(true);
  });

  it("should return false when edition directory does not exist", async () => {
    vi.mocked(base.directoryExists).mockResolvedValueOnce(false);

    const result = await editionsStorage.editionExists("non-existent" as EditionCode);

    expect(result).toBe(false);
  });
});

// =============================================================================
// GET BOOK TESTS
// =============================================================================

describe("getBook", () => {
  it("should return book by ID", async () => {
    const edition = createMockEdition({ bookIds: ["core-rulebook"] });
    const payload = createMockBookPayload();

    // getBook calls: getEdition, then getAllBooks which calls getEdition again and getBookPayload
    vi.mocked(base.readJsonFile)
      .mockResolvedValueOnce(edition) // getBook -> getEdition
      .mockResolvedValueOnce(edition) // getAllBooks -> getEdition
      .mockResolvedValueOnce(payload); // getAllBooks -> getBookPayload

    const result = await editionsStorage.getBook("sr5", "core-rulebook");

    expect(result?.id).toBe("core-rulebook");
    expect(result?.title).toBe("Core Rulebook");
  });

  it("should return null for non-existent book", async () => {
    const edition = createMockEdition({ bookIds: ["core-rulebook"] });
    const payload = createMockBookPayload();

    // getBook calls: getEdition, then getAllBooks which calls getEdition again and getBookPayload
    vi.mocked(base.readJsonFile)
      .mockResolvedValueOnce(edition) // getBook -> getEdition
      .mockResolvedValueOnce(edition) // getAllBooks -> getEdition
      .mockResolvedValueOnce(payload); // getAllBooks -> getBookPayload

    const result = await editionsStorage.getBook("sr5", "non-existent");

    expect(result).toBeNull();
  });

  it("should return null for non-existent edition", async () => {
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(null);

    const result = await editionsStorage.getBook("non-existent" as EditionCode, "core-rulebook");

    expect(result).toBeNull();
  });
});

// =============================================================================
// GET ALL BOOKS TESTS
// =============================================================================

describe("getAllBooks", () => {
  it("should return all books for an edition", async () => {
    const edition = createMockEdition({ bookIds: ["core-rulebook", "run-faster"] });

    vi.mocked(base.readJsonFile)
      .mockResolvedValueOnce(edition)
      .mockResolvedValueOnce(
        createMockBookPayload({
          meta: {
            bookId: "core-rulebook",
            title: "Core Rulebook",
            version: "1.0.0",
            category: "core",
            edition: "sr5" as EditionCode,
          },
        })
      )
      .mockResolvedValueOnce(
        createMockBookPayload({
          meta: {
            bookId: "run-faster",
            title: "Run Faster",
            version: "1.0.0",
            category: "sourcebook",
            edition: "sr5" as EditionCode,
          },
        })
      );

    const result = await editionsStorage.getAllBooks("sr5");

    expect(result).toHaveLength(2);
  });

  it("should return empty array for non-existent edition", async () => {
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(null);

    const result = await editionsStorage.getAllBooks("non-existent" as EditionCode);

    expect(result).toEqual([]);
  });
});

// =============================================================================
// GET CORE BOOK TESTS
// =============================================================================

describe("getCoreBook", () => {
  it("should return the core rulebook", async () => {
    const edition = createMockEdition();
    const payload = createMockBookPayload();

    vi.mocked(base.readJsonFile).mockResolvedValueOnce(edition).mockResolvedValueOnce(payload);

    const result = await editionsStorage.getCoreBook("sr5");

    expect(result?.isCore).toBe(true);
    expect(result?.title).toBe("Core Rulebook");
  });

  it("should return null when no core book exists", async () => {
    const edition = createMockEdition({ bookIds: ["sourcebook"] });
    const payload = createMockBookPayload({
      meta: {
        bookId: "sourcebook",
        title: "Sourcebook",
        version: "1.0.0",
        category: "sourcebook",
        edition: "sr5" as EditionCode,
      },
    });

    vi.mocked(base.readJsonFile).mockResolvedValueOnce(edition).mockResolvedValueOnce(payload);

    const result = await editionsStorage.getCoreBook("sr5");

    expect(result).toBeNull();
  });
});

// =============================================================================
// GET BOOK PAYLOAD TESTS
// =============================================================================

describe("getBookPayload", () => {
  it("should return book payload by ID", async () => {
    const payload = createMockBookPayload();
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(payload);

    const result = await editionsStorage.getBookPayload("sr5", "core-rulebook");

    expect(result).toEqual(payload);
  });

  it("should return null for non-existent book", async () => {
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(null);

    const result = await editionsStorage.getBookPayload("sr5", "non-existent");

    expect(result).toBeNull();
  });
});

// =============================================================================
// GET ALL BOOK PAYLOADS TESTS
// =============================================================================

describe("getAllBookPayloads", () => {
  it("should return all book payloads for an edition", async () => {
    const edition = createMockEdition({ bookIds: ["core-rulebook", "run-faster"] });

    vi.mocked(base.readJsonFile)
      .mockResolvedValueOnce(edition)
      .mockResolvedValueOnce(createMockBookPayload())
      .mockResolvedValueOnce(
        createMockBookPayload({
          meta: {
            bookId: "run-faster",
            title: "Run Faster",
            version: "1.0.0",
            category: "sourcebook",
            edition: "sr5" as EditionCode,
          },
        })
      );

    const result = await editionsStorage.getAllBookPayloads("sr5");

    expect(result).toHaveLength(2);
  });
});

// =============================================================================
// GET CREATION METHOD TESTS
// =============================================================================

describe("getCreationMethod", () => {
  it("should return creation method by ID", async () => {
    const payload = createMockBookPayload();
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(payload);

    const result = await editionsStorage.getCreationMethod("sr5", "priority");

    expect(result?.id).toBe("priority");
    expect(result?.name).toBe("Priority");
  });

  it("should return null for non-existent method", async () => {
    const payload = createMockBookPayload();
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(payload);

    const result = await editionsStorage.getCreationMethod("sr5", "non-existent");

    expect(result).toBeNull();
  });

  it("should return null if core book has no creation methods", async () => {
    // Create a payload without the creationMethods module
    const payload = createMockBookPayload();
    delete (payload.modules as Record<string, unknown>).creationMethods;
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(payload);

    const result = await editionsStorage.getCreationMethod("sr5", "priority");

    expect(result).toBeNull();
  });
});

// =============================================================================
// GET ALL CREATION METHODS TESTS
// =============================================================================

describe("getAllCreationMethods", () => {
  it("should return all creation methods from all books", async () => {
    const edition = createMockEdition({ bookIds: ["core-rulebook"] });
    const payload = createMockBookPayload();

    // getAllCreationMethods calls: getEdition, then getAllBookPayloads which calls getEdition again and getBookPayload
    vi.mocked(base.readJsonFile)
      .mockResolvedValueOnce(edition) // getAllCreationMethods -> getEdition
      .mockResolvedValueOnce(edition) // getAllBookPayloads -> getEdition
      .mockResolvedValueOnce(payload); // getAllBookPayloads -> getBookPayload

    const result = await editionsStorage.getAllCreationMethods("sr5");

    expect(result).toHaveLength(2);
    expect(result.map((m) => m.id)).toContain("priority");
    expect(result.map((m) => m.id)).toContain("karma-gen");
  });

  it("should return empty array for non-existent edition", async () => {
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(null);

    const result = await editionsStorage.getAllCreationMethods("non-existent" as EditionCode);

    expect(result).toEqual([]);
  });
});

// =============================================================================
// GET DEFAULT CREATION METHOD TESTS
// =============================================================================

describe("getDefaultCreationMethod", () => {
  it("should return the default creation method", async () => {
    const edition = createMockEdition({ defaultCreationMethodId: "priority" });
    const payload = createMockBookPayload();

    vi.mocked(base.readJsonFile).mockResolvedValueOnce(edition).mockResolvedValueOnce(payload);

    const result = await editionsStorage.getDefaultCreationMethod("sr5");

    expect(result?.id).toBe("priority");
  });

  it("should return null when edition has no default", async () => {
    const edition = createMockEdition({ defaultCreationMethodId: undefined });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(edition);

    const result = await editionsStorage.getDefaultCreationMethod("sr5");

    expect(result).toBeNull();
  });

  it("should return null for non-existent edition", async () => {
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(null);

    const result = await editionsStorage.getDefaultCreationMethod("non-existent" as EditionCode);

    expect(result).toBeNull();
  });
});

// =============================================================================
// GET EDITION CONTENT SUMMARY TESTS
// =============================================================================

describe("getEditionContentSummary", () => {
  it("should return content summary with counts", async () => {
    const edition = createMockEdition();
    const payload = createMockBookPayload();

    vi.mocked(base.readJsonFile)
      .mockResolvedValueOnce(edition) // getEdition
      .mockResolvedValueOnce(edition) // getAllBookPayloads -> getEdition
      .mockResolvedValueOnce(payload); // getAllBookPayloads -> getBookPayload

    const result = await editionsStorage.getEditionContentSummary("sr5");

    expect(result?.editionCode).toBe("sr5");
    expect(result?.metatypeCount).toBe(2);
    expect(result?.skillCount).toBe(2);
    expect(result?.qualityCount).toBe(2);
    expect(result?.categories.length).toBeGreaterThan(0);
  });

  it("should return null for non-existent edition", async () => {
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(null);

    const result = await editionsStorage.getEditionContentSummary("non-existent" as EditionCode);

    expect(result).toBeNull();
  });
});

// =============================================================================
// GET BOOK SUMMARY TESTS
// =============================================================================

describe("getBookSummary", () => {
  it("should return book summary with contributions", async () => {
    const payload = createMockBookPayload();
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(payload);

    const result = await editionsStorage.getBookSummary("sr5", "core-rulebook");

    expect(result?.id).toBe("core-rulebook");
    expect(result?.title).toBe("Core Rulebook");
    expect(result?.category).toBe("core");
    expect(result?.contentContributions.length).toBeGreaterThan(0);
  });

  it("should return null for non-existent book", async () => {
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(null);

    const result = await editionsStorage.getBookSummary("sr5", "non-existent");

    expect(result).toBeNull();
  });
});
