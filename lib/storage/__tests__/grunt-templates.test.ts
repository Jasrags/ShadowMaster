/**
 * Unit tests for grunt-templates.ts storage module
 *
 * Tests grunt template loading from edition data using VI mocks.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { GruntTemplate, ProfessionalRating } from "@/lib/types/grunts";
import type { EditionCode } from "@/lib/types";

// Mock the base storage module
vi.mock("../base", () => ({
  readJsonFile: vi.fn(),
  readAllJsonFiles: vi.fn(),
  listJsonFiles: vi.fn(),
  directoryExists: vi.fn(),
}));

// Import after mocking
import * as gruntTemplateStorage from "../grunt-templates";
import * as base from "../base";

// =============================================================================
// TEST FIXTURES
// =============================================================================

function createMockTemplate(overrides: Partial<GruntTemplate> = {}): GruntTemplate {
  return {
    id: `template-${Date.now()}`,
    editionCode: "sr5",
    name: "Gang Member",
    description: "A typical street gang member",
    professionalRating: 1 as ProfessionalRating,
    category: "gang",
    baseGrunts: {
      attributes: {
        body: 3,
        agility: 3,
        reaction: 3,
        strength: 3,
        willpower: 3,
        logic: 2,
        intuition: 3,
        charisma: 2,
      },
      essence: 6,
      skills: {
        firearms: 2,
        "unarmed combat": 2,
      },
      gear: [],
      weapons: [],
      armor: [],
      conditionMonitorSize: 10,
    },
    moraleTier: {
      breakThreshold: 50,
      rallyCost: 1,
      canRally: false,
    },
    ...overrides,
  };
}

// =============================================================================
// SETUP
// =============================================================================

beforeEach(() => {
  vi.clearAllMocks();
});

// =============================================================================
// GET GRUNT TEMPLATES TESTS
// =============================================================================

describe("getGruntTemplates", () => {
  it("should return all templates for an edition", async () => {
    const templates = [
      createMockTemplate({ id: "t1", name: "Gang Member", professionalRating: 1 }),
      createMockTemplate({ id: "t2", name: "Security Guard", professionalRating: 2 }),
      createMockTemplate({ id: "t3", name: "Corporate Agent", professionalRating: 3 }),
    ];

    vi.mocked(base.directoryExists).mockResolvedValueOnce(true);
    vi.mocked(base.readAllJsonFiles).mockResolvedValueOnce(templates);

    const result = await gruntTemplateStorage.getGruntTemplates("sr5");

    expect(result).toHaveLength(3);
    expect(result.map((t) => t.name)).toContain("Gang Member");
  });

  it("should filter by Professional Rating", async () => {
    const templates = [
      createMockTemplate({ id: "t1", name: "Gang Member", professionalRating: 1 }),
      createMockTemplate({ id: "t2", name: "Security Guard", professionalRating: 2 }),
      createMockTemplate({ id: "t3", name: "Corporate Agent", professionalRating: 2 }),
    ];

    vi.mocked(base.directoryExists).mockResolvedValueOnce(true);
    vi.mocked(base.readAllJsonFiles).mockResolvedValueOnce(templates);

    const result = await gruntTemplateStorage.getGruntTemplates("sr5", 2 as ProfessionalRating);

    expect(result).toHaveLength(2);
    expect(result.every((t) => t.professionalRating === 2)).toBe(true);
  });

  it("should return empty array for non-existent edition", async () => {
    vi.mocked(base.directoryExists).mockResolvedValueOnce(false);

    const result = await gruntTemplateStorage.getGruntTemplates("non-existent" as EditionCode);

    expect(result).toEqual([]);
  });

  it("should sort by Professional Rating then by name", async () => {
    const templates = [
      createMockTemplate({ id: "t1", name: "Zebra", professionalRating: 2 }),
      createMockTemplate({ id: "t2", name: "Alpha", professionalRating: 2 }),
      createMockTemplate({ id: "t3", name: "Beta", professionalRating: 1 }),
    ];

    vi.mocked(base.directoryExists).mockResolvedValueOnce(true);
    vi.mocked(base.readAllJsonFiles).mockResolvedValueOnce(templates);

    const result = await gruntTemplateStorage.getGruntTemplates("sr5");

    expect(result[0].name).toBe("Beta"); // PR 1
    expect(result[1].name).toBe("Alpha"); // PR 2, alphabetically first
    expect(result[2].name).toBe("Zebra"); // PR 2, alphabetically second
  });
});

// =============================================================================
// GET GRUNT TEMPLATE TESTS
// =============================================================================

describe("getGruntTemplate", () => {
  it("should return template by ID", async () => {
    const template = createMockTemplate({ id: "specific-template" });

    vi.mocked(base.readJsonFile).mockResolvedValueOnce(template);

    const result = await gruntTemplateStorage.getGruntTemplate("sr5", "specific-template");

    expect(result).toEqual(template);
  });

  it("should return null for non-existent template", async () => {
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(null);

    const result = await gruntTemplateStorage.getGruntTemplate("sr5", "non-existent");

    expect(result).toBeNull();
  });
});

// =============================================================================
// GET TEMPLATES BY RATING TESTS
// =============================================================================

describe("getTemplatesByRating", () => {
  it("should return map of PR to templates", async () => {
    const templates = [
      createMockTemplate({ id: "t1", professionalRating: 1 }),
      createMockTemplate({ id: "t2", professionalRating: 2 }),
      createMockTemplate({ id: "t3", professionalRating: 2 }),
      createMockTemplate({ id: "t4", professionalRating: 3 }),
    ];

    vi.mocked(base.directoryExists).mockResolvedValueOnce(true);
    vi.mocked(base.readAllJsonFiles).mockResolvedValueOnce(templates);

    const result = await gruntTemplateStorage.getTemplatesByRating("sr5");

    expect(result.get(1 as ProfessionalRating)?.length).toBe(1);
    expect(result.get(2 as ProfessionalRating)?.length).toBe(2);
    expect(result.get(3 as ProfessionalRating)?.length).toBe(1);
  });
});

// =============================================================================
// GET TEMPLATE BY NAME TESTS
// =============================================================================

describe("getTemplateByName", () => {
  it("should return template by name (case-insensitive)", async () => {
    const templates = [
      createMockTemplate({ id: "t1", name: "Gang Member" }),
      createMockTemplate({ id: "t2", name: "Security Guard" }),
    ];

    vi.mocked(base.directoryExists).mockResolvedValueOnce(true);
    vi.mocked(base.readAllJsonFiles).mockResolvedValueOnce(templates);

    const result = await gruntTemplateStorage.getTemplateByName("sr5", "gang member");

    expect(result?.name).toBe("Gang Member");
  });

  it("should return null for non-existent name", async () => {
    const templates = [createMockTemplate({ id: "t1", name: "Gang Member" })];

    vi.mocked(base.directoryExists).mockResolvedValueOnce(true);
    vi.mocked(base.readAllJsonFiles).mockResolvedValueOnce(templates);

    const result = await gruntTemplateStorage.getTemplateByName("sr5", "Non Existent");

    expect(result).toBeNull();
  });
});

// =============================================================================
// GET TEMPLATES BY CATEGORY TESTS
// =============================================================================

describe("getTemplatesByCategory", () => {
  it("should filter templates by category", async () => {
    const templates = [
      createMockTemplate({ id: "t1", category: "gang" }),
      createMockTemplate({ id: "t2", category: "corporate" }),
      createMockTemplate({ id: "t3", category: "gang" }),
    ];

    vi.mocked(base.directoryExists).mockResolvedValueOnce(true);
    vi.mocked(base.readAllJsonFiles).mockResolvedValueOnce(templates);

    const result = await gruntTemplateStorage.getTemplatesByCategory("sr5", "gang");

    expect(result).toHaveLength(2);
    expect(result.every((t) => t.category === "gang")).toBe(true);
  });
});

// =============================================================================
// SEARCH TEMPLATES TESTS
// =============================================================================

describe("searchTemplates", () => {
  it("should search templates by name (case-insensitive)", async () => {
    const templates = [
      createMockTemplate({ id: "t1", name: "Gang Member", description: "Street thug" }),
      createMockTemplate({ id: "t2", name: "Security Guard", description: "Corporate security" }),
      createMockTemplate({ id: "t3", name: "Gang Boss", description: "Leader" }),
    ];

    vi.mocked(base.directoryExists).mockResolvedValueOnce(true);
    vi.mocked(base.readAllJsonFiles).mockResolvedValueOnce(templates);

    const result = await gruntTemplateStorage.searchTemplates("sr5", "gang");

    expect(result).toHaveLength(2);
    expect(result.map((t) => t.name)).toContain("Gang Member");
    expect(result.map((t) => t.name)).toContain("Gang Boss");
  });

  it("should search templates by description", async () => {
    const templates = [
      createMockTemplate({ id: "t1", name: "Guard", description: "Corporate security personnel" }),
      createMockTemplate({ id: "t2", name: "Thug", description: "Street thug" }),
    ];

    vi.mocked(base.directoryExists).mockResolvedValueOnce(true);
    vi.mocked(base.readAllJsonFiles).mockResolvedValueOnce(templates);

    const result = await gruntTemplateStorage.searchTemplates("sr5", "corporate");

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Guard");
  });
});

// =============================================================================
// HAS TEMPLATES TESTS
// =============================================================================

describe("hasTemplates", () => {
  it("should return true when templates exist", async () => {
    vi.mocked(base.directoryExists).mockResolvedValueOnce(true);
    vi.mocked(base.listJsonFiles).mockResolvedValueOnce(["template1", "template2"]);

    const result = await gruntTemplateStorage.hasTemplates("sr5");

    expect(result).toBe(true);
  });

  it("should return false when directory does not exist", async () => {
    vi.mocked(base.directoryExists).mockResolvedValueOnce(false);

    const result = await gruntTemplateStorage.hasTemplates("sr5");

    expect(result).toBe(false);
  });

  it("should return false when directory is empty", async () => {
    vi.mocked(base.directoryExists).mockResolvedValueOnce(true);
    vi.mocked(base.listJsonFiles).mockResolvedValueOnce([]);

    const result = await gruntTemplateStorage.hasTemplates("sr5");

    expect(result).toBe(false);
  });
});

// =============================================================================
// GET TEMPLATE CATEGORIES TESTS
// =============================================================================

describe("getTemplateCategories", () => {
  it("should return sorted unique categories", async () => {
    const templates = [
      createMockTemplate({ id: "t1", category: "gang" }),
      createMockTemplate({ id: "t2", category: "corporate" }),
      createMockTemplate({ id: "t3", category: "gang" }),
      createMockTemplate({ id: "t4", category: "military" }),
    ];

    vi.mocked(base.directoryExists).mockResolvedValueOnce(true);
    vi.mocked(base.readAllJsonFiles).mockResolvedValueOnce(templates);

    const result = await gruntTemplateStorage.getTemplateCategories("sr5");

    expect(result).toEqual(["corporate", "gang", "military"]);
  });

  it("should handle templates without category", async () => {
    const templates = [
      createMockTemplate({ id: "t1", category: "gang" }),
      createMockTemplate({ id: "t2", category: undefined }),
    ];

    vi.mocked(base.directoryExists).mockResolvedValueOnce(true);
    vi.mocked(base.readAllJsonFiles).mockResolvedValueOnce(templates);

    const result = await gruntTemplateStorage.getTemplateCategories("sr5");

    expect(result).toEqual(["gang"]);
  });
});
