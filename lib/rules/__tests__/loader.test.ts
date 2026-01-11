/**
 * Tests for ruleset loader
 *
 * Tests loading edition metadata, books, and extraction functions.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  loadRuleset,
  loadEdition,
  loadAllEditions,
  loadBook,
  loadAllBooks,
  loadCreationMethod,
  loadAllCreationMethods,
  extractModule,
  extractAllModules,
  getAvailableModuleTypes,
  extractMetatypes,
  extractSkills,
  extractQualities,
  extractPriorityTable,
  extractMagicPaths,
  extractLifestyles,
  extractLifestyleModifiers,
  extractGear,
  extractSpells,
  extractComplexForms,
  extractCyberware,
  extractBioware,
  extractAugmentationRules,
  extractContactTemplates,
  extractAdeptPowers,
} from "../loader";
import type { EditionCode } from "@/lib/types";
import * as storageModule from "@/lib/storage/editions";

// Mock the storage module
vi.mock("@/lib/storage/editions");

describe("loadRuleset", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should load ruleset with core rulebook", async () => {
    const mockEdition = {
      id: "sr5",
      name: "Shadowrun 5th Edition",
      shortCode: "sr5" as EditionCode,
      releaseYear: 2013,
      bookIds: ["core-rulebook"],
      creationMethodIds: ["priority"],
      createdAt: new Date().toISOString(),
    };

    const mockBookPayload = {
      meta: {
        title: "Core Rulebook",
        category: "core",
      },
      modules: {
        metatypes: {
          payload: {
            human: { id: "human", name: "Human" },
          },
        },
      },
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(storageModule.getEdition).mockResolvedValue(mockEdition as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(storageModule.getBookPayload).mockResolvedValue(mockBookPayload as any);
    vi.mocked(storageModule.getAllCreationMethods).mockResolvedValue([]);

    const result = await loadRuleset({ editionCode: "sr5" });

    expect(result.success).toBe(true);
    expect(result.ruleset).toBeDefined();
    expect(result.ruleset?.edition.id).toBe("sr5");
    expect(result.ruleset?.books).toHaveLength(1);
    expect(result.ruleset?.books[0].id).toBe("core-rulebook");
    expect(result.ruleset?.books[0].isCore).toBe(true);
  });

  it("should return error for non-existent edition", async () => {
    vi.mocked(storageModule.getEdition).mockResolvedValue(null);

    const result = await loadRuleset({ editionCode: "nonexistent" as EditionCode });

    expect(result.success).toBe(false);
    expect(result.error).toContain("not found");
  });

  it("should load multiple books in order", async () => {
    const mockEdition = {
      id: "sr5",
      name: "Shadowrun 5th Edition",
      shortCode: "sr5" as EditionCode,
      releaseYear: 2013,
      bookIds: ["core-rulebook", "sourcebook"],
      creationMethodIds: ["priority"],
      createdAt: new Date().toISOString(),
    };

    const mockCoreBook = {
      meta: { title: "Core Rulebook", category: "core" },
      modules: {},
    };

    const mockSourcebook = {
      meta: { title: "Sourcebook", category: "sourcebook" },
      modules: {},
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(storageModule.getEdition).mockResolvedValue(mockEdition as any);
    vi.mocked(storageModule.getBookPayload)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockResolvedValueOnce(mockCoreBook as any)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockResolvedValueOnce(mockSourcebook as any);
    vi.mocked(storageModule.getAllCreationMethods).mockResolvedValue([]);

    const result = await loadRuleset({ editionCode: "sr5" });

    expect(result.success).toBe(true);
    expect(result.ruleset?.books).toHaveLength(2);
    expect(result.ruleset?.books[0].id).toBe("core-rulebook");
    expect(result.ruleset?.books[1].id).toBe("sourcebook");
  });

  it("should return error if core rulebook is missing", async () => {
    const mockEdition = {
      id: "sr5",
      name: "Shadowrun 5th Edition",
      shortCode: "sr5" as EditionCode,
      releaseYear: 2013,
      bookIds: ["core-rulebook"],
      creationMethodIds: ["priority"],
      createdAt: new Date().toISOString(),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(storageModule.getEdition).mockResolvedValue(mockEdition as any);
    vi.mocked(storageModule.getBookPayload).mockResolvedValue(null);
    vi.mocked(storageModule.getAllCreationMethods).mockResolvedValue([]);

    const result = await loadRuleset({ editionCode: "sr5" });

    expect(result.success).toBe(false);
    expect(result.error).toContain("Core rulebook");
  });

  it("should load specific books when bookIds provided", async () => {
    const mockEdition = {
      id: "sr5",
      name: "Shadowrun 5th Edition",
      shortCode: "sr5" as EditionCode,
      releaseYear: 2013,
      bookIds: ["core-rulebook", "sourcebook1", "sourcebook2"],
      creationMethodIds: ["priority"],
      createdAt: new Date().toISOString(),
    };

    const mockBook = {
      meta: { title: "Book", category: "core" },
      modules: {},
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(storageModule.getEdition).mockResolvedValue(mockEdition as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(storageModule.getBookPayload).mockResolvedValue(mockBook as any);
    vi.mocked(storageModule.getAllCreationMethods).mockResolvedValue([]);

    const result = await loadRuleset({
      editionCode: "sr5",
      bookIds: ["sourcebook1"],
    });

    expect(result.success).toBe(true);
    // Should include core + sourcebook1
    expect(result.ruleset?.books.length).toBeGreaterThanOrEqual(1);
  });
});

describe("extraction functions", () => {
  const mockLoadedRuleset = {
    edition: {
      id: "sr5",
      name: "Shadowrun 5th Edition",
      shortCode: "sr5" as EditionCode,
      releaseYear: 2013,
      bookIds: ["core-rulebook"],
      creationMethodIds: ["priority"],
      createdAt: new Date().toISOString(),
    },
    books: [
      {
        id: "core-rulebook",
        title: "Core Rulebook",
        isCore: true,
        loadOrder: 0,
        payload: {
          meta: { title: "Core Rulebook", category: "core" },
          modules: {
            metatypes: {
              payload: {
                metatypes: [
                  { id: "human", name: "Human" },
                  { id: "elf", name: "Elf" },
                ],
              },
            },
            skills: {
              payload: {
                activeSkills: [{ id: "firearms", name: "Firearms", linkedAttribute: "agility" }],
                skillGroups: [],
                knowledgeCategories: [],
                creationLimits: {
                  maxSkillRating: 6,
                  maxSkillRatingWithAptitude: 7,
                  freeKnowledgePoints: "(LOG + INT) × 2",
                  nativeLanguageRating: 6,
                },
                exampleKnowledgeSkills: [],
                exampleLanguages: [],
              },
            },
            qualities: {
              payload: {
                positive: [{ id: "aptitude", name: "Aptitude", karmaCost: 10 }],
                negative: [{ id: "allergy", name: "Allergy", karmaBonus: 5 }],
              },
            },
            priorities: {
              payload: {
                levels: ["A", "B", "C", "D", "E"],
                categories: [{ id: "metatype", name: "Metatype" }],
                table: {},
              },
            },
            magic: {
              payload: {
                paths: [
                  { id: "mundane", name: "Mundane", hasMagic: false, hasResonance: false },
                  { id: "magician", name: "Magician", hasMagic: true, hasResonance: false },
                ],
                spells: {
                  combat: [],
                  detection: [],
                  health: [],
                  illusion: [],
                  manipulation: [],
                },
                complexForms: [],
              },
            },
            lifestyle: {
              payload: {
                lifestyles: [{ id: "street", name: "Street", monthlyCost: 0, startingNuyen: "0" }],
                metatypeModifiers: { human: 1, elf: 1.2 },
              },
            },
            gear: {
              payload: {
                categories: [],
                weapons: { melee: [], pistols: [] },
                armor: [],
                commlinks: [],
                cyberdecks: [],
                electronics: [],
                tools: [],
                survival: [],
                medical: [],
                security: [],
                miscellaneous: [],
                ammunition: [],
              },
            },
            cyberware: {
              payload: {
                rules: {
                  maxEssence: 6,
                  maxAttributeBonus: 4,
                  maxAvailabilityAtCreation: 12,
                  trackEssenceHoles: true,
                  magicReductionFormula: "roundUp",
                },
                grades: [],
                catalog: [],
              },
            },
            bioware: {
              payload: {
                grades: [],
                catalog: [],
              },
            },
            contactTemplates: {
              payload: {
                templates: [{ id: "fixer", name: "Fixer", connection: 3, loyalty: 2 }],
              },
            },
            adeptPowers: {
              payload: {
                powers: [
                  {
                    id: "improved-reflexes",
                    name: "Improved Reflexes",
                    cost: 1.5,
                    costType: "perLevel",
                  },
                ],
              },
            },
          },
        },
      },
    ],
    creationMethods: [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;

  describe("extractModule", () => {
    it("should extract module from first book that has it", () => {
      const result = extractModule(mockLoadedRuleset, "metatypes");
      expect(result).toBeDefined();
      expect(result?.metatypes).toBeDefined();
      expect(Array.isArray(result?.metatypes)).toBe(true);
    });

    it("should return null for non-existent module", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = extractModule(mockLoadedRuleset, "nonexistent" as any);
      expect(result).toBeNull();
    });
  });

  describe("extractAllModules", () => {
    it("should extract all instances of a module type", () => {
      const result = extractAllModules(mockLoadedRuleset, "metatypes");
      expect(result).toHaveLength(1);
      expect(result[0].bookId).toBe("core-rulebook");
      expect(result[0].payload).toBeDefined();
    });
  });

  describe("getAvailableModuleTypes", () => {
    it("should return all module types in ruleset", () => {
      const result = getAvailableModuleTypes(mockLoadedRuleset);
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain("metatypes");
      expect(result).toContain("skills");
    });
  });

  describe("extractMetatypes", () => {
    it("should extract metatypes array", () => {
      const result = extractMetatypes(mockLoadedRuleset);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it("should return empty array if module not found", () => {
      const emptyRuleset = { ...mockLoadedRuleset, books: [] };
      const result = extractMetatypes(emptyRuleset);
      expect(result).toEqual([]);
    });
  });

  describe("extractSkills", () => {
    it("should extract skills data structure", () => {
      const result = extractSkills(mockLoadedRuleset);
      expect(result.activeSkills).toBeDefined();
      expect(result.skillGroups).toBeDefined();
      expect(result.knowledgeCategories).toBeDefined();
      expect(result.creationLimits).toBeDefined();
      expect(result.exampleKnowledgeSkills).toBeDefined();
      expect(result.exampleLanguages).toBeDefined();
    });

    it("should return default creation limits if not found", () => {
      const emptyRuleset = { ...mockLoadedRuleset, books: [] };
      const result = extractSkills(emptyRuleset);
      expect(result.creationLimits.maxSkillRating).toBe(6);
    });
  });

  describe("extractQualities", () => {
    it("should extract positive and negative qualities", () => {
      const result = extractQualities(mockLoadedRuleset);
      expect(result.positive).toBeDefined();
      expect(result.negative).toBeDefined();
      expect(Array.isArray(result.positive)).toBe(true);
      expect(Array.isArray(result.negative)).toBe(true);
    });
  });

  describe("extractPriorityTable", () => {
    it("should extract priority table", () => {
      const result = extractPriorityTable(mockLoadedRuleset);
      expect(result).toBeDefined();
      expect(result?.levels).toBeDefined();
      expect(result?.categories).toBeDefined();
      expect(result?.table).toBeDefined();
    });

    it("should return null if not found", () => {
      const emptyRuleset = { ...mockLoadedRuleset, books: [] };
      const result = extractPriorityTable(emptyRuleset);
      expect(result).toBeNull();
    });
  });

  describe("extractMagicPaths", () => {
    it("should extract magic paths", () => {
      const result = extractMagicPaths(mockLoadedRuleset);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("extractLifestyles", () => {
    it("should extract lifestyles", () => {
      const result = extractLifestyles(mockLoadedRuleset);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("extractLifestyleModifiers", () => {
    it("should extract lifestyle metatype modifiers", () => {
      const result = extractLifestyleModifiers(mockLoadedRuleset);
      expect(typeof result).toBe("object");
      expect(result.human).toBeDefined();
    });
  });

  describe("extractGear", () => {
    it("should extract gear catalog", () => {
      const result = extractGear(mockLoadedRuleset);
      expect(result).toBeDefined();
      expect(result?.categories).toBeDefined();
      expect(result?.weapons).toBeDefined();
    });

    it("should return null if not found", () => {
      const emptyRuleset = { ...mockLoadedRuleset, books: [] };
      const result = extractGear(emptyRuleset);
      expect(result).toBeNull();
    });
  });

  describe("extractSpells", () => {
    it("should extract spells catalog", () => {
      const result = extractSpells(mockLoadedRuleset);
      expect(result).toBeDefined();
      expect(result?.combat).toBeDefined();
      expect(result?.detection).toBeDefined();
    });

    it("should return null if not found", () => {
      const emptyRuleset = { ...mockLoadedRuleset, books: [] };
      const result = extractSpells(emptyRuleset);
      expect(result).toBeNull();
    });
  });

  describe("extractComplexForms", () => {
    it("should extract complex forms", () => {
      const result = extractComplexForms(mockLoadedRuleset);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("extractCyberware", () => {
    it("should extract cyberware catalog", () => {
      const result = extractCyberware(mockLoadedRuleset);
      expect(result).toBeDefined();
      expect(result?.rules).toBeDefined();
      expect(result?.grades).toBeDefined();
      expect(result?.catalog).toBeDefined();
    });

    it("should return null if not found", () => {
      const emptyRuleset = { ...mockLoadedRuleset, books: [] };
      const result = extractCyberware(emptyRuleset);
      expect(result).toBeNull();
    });

    it("should provide default rules if missing", () => {
      const rulesetWithoutRules = {
        ...mockLoadedRuleset,
        books: [
          {
            ...mockLoadedRuleset.books[0],
            payload: {
              ...mockLoadedRuleset.books[0].payload,
              modules: {
                cyberware: {
                  payload: {
                    grades: [],
                    catalog: [],
                  },
                },
              },
            },
          },
        ],
      };
      const result = extractCyberware(rulesetWithoutRules);
      expect(result?.rules.maxEssence).toBe(6);
    });
  });

  describe("extractBioware", () => {
    it("should extract bioware catalog", () => {
      const result = extractBioware(mockLoadedRuleset);
      expect(result).toBeDefined();
      expect(result?.grades).toBeDefined();
      expect(result?.catalog).toBeDefined();
    });

    it("should return null if not found", () => {
      const emptyRuleset = { ...mockLoadedRuleset, books: [] };
      const result = extractBioware(emptyRuleset);
      expect(result).toBeNull();
    });
  });

  describe("extractAugmentationRules", () => {
    it("should extract augmentation rules from cyberware", () => {
      const result = extractAugmentationRules(mockLoadedRuleset);
      expect(result.maxEssence).toBeDefined();
      expect(result.maxAttributeBonus).toBeDefined();
    });

    it("should return defaults if cyberware not found", () => {
      const emptyRuleset = { ...mockLoadedRuleset, books: [] };
      const result = extractAugmentationRules(emptyRuleset);
      expect(result.maxEssence).toBe(6);
    });
  });

  describe("extractContactTemplates", () => {
    it("should extract contact templates", () => {
      const result = extractContactTemplates(mockLoadedRuleset);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("extractAdeptPowers", () => {
    it("should extract adept powers", () => {
      const result = extractAdeptPowers(mockLoadedRuleset);
      expect(Array.isArray(result)).toBe(true);
    });
  });
});

describe("convenience loaders", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should load edition", async () => {
    const mockEdition = {
      id: "sr5",
      name: "Shadowrun 5th Edition",
      shortCode: "sr5" as EditionCode,
      releaseYear: 2013,
      bookIds: ["core-rulebook"],
      creationMethodIds: ["priority"],
      createdAt: new Date().toISOString(),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(storageModule.getEdition).mockResolvedValue(mockEdition as any);

    const result = await loadEdition("sr5");
    expect(result).toEqual(mockEdition);
  });

  it("should load all editions", async () => {
    const mockEditions = [
      {
        id: "sr5",
        name: "SR5",
        shortCode: "sr5" as EditionCode,
        releaseYear: 2013,
        bookIds: [],
        creationMethodIds: [],
        createdAt: new Date().toISOString(),
      },
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(storageModule.getAllEditions).mockResolvedValue(mockEditions as any);

    const result = await loadAllEditions();
    expect(result).toEqual(mockEditions);
  });

  it("should load book payload", async () => {
    const mockPayload = {
      meta: { title: "Book", category: "core" },
      modules: {},
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(storageModule.getBookPayload).mockResolvedValue(mockPayload as any);

    const result = await loadBook("sr5", "core-rulebook");
    expect(result).toEqual(mockPayload);
  });

  it("should load all book payloads", async () => {
    const mockPayloads = [{ meta: { title: "Book1", category: "core" }, modules: {} }];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(storageModule.getAllBookPayloads).mockResolvedValue(mockPayloads as any);

    const result = await loadAllBooks("sr5");
    expect(result).toEqual(mockPayloads);
  });

  it("should load creation method", async () => {
    const mockMethod = {
      id: "priority",
      name: "Priority",
      editionId: "sr5",
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(storageModule.getCreationMethod).mockResolvedValue(mockMethod as any);

    const result = await loadCreationMethod("sr5", "priority");
    expect(result).toEqual(mockMethod);
  });

  it("should load all creation methods", async () => {
    const mockMethods = [{ id: "priority", name: "Priority", editionId: "sr5" }];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(storageModule.getAllCreationMethods).mockResolvedValue(mockMethods as any);

    const result = await loadAllCreationMethods("sr5");
    expect(result).toEqual(mockMethods);
  });
});
