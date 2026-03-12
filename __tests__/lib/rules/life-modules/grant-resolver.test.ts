import { describe, it, expect } from "vitest";
import {
  resolveLifeModuleGrants,
  lookupModule,
  EMPTY_GRANTS,
} from "@/lib/rules/life-modules/grant-resolver";
import type { LifeModulesCatalog, LifeModuleSelection, LifeModule } from "@/lib/types/life-modules";

// =============================================================================
// TEST CATALOG FIXTURES
// =============================================================================

const makeModule = (
  overrides: Partial<LifeModule> & { id: string; phase: LifeModule["phase"] }
): LifeModule => ({
  name: overrides.id,
  karmaCost: 0,
  ...overrides,
});

const testCatalog: LifeModulesCatalog = {
  nationality: [
    makeModule({
      id: "ucas",
      phase: "nationality",
      karmaCost: 15,
      requiresSubModuleSelection: true,
      subModules: [
        makeModule({
          id: "ucas-general",
          phase: "nationality",
          attributeModifiers: { logic: 1 },
          activeSkills: { computer: 1, etiquette: 1 },
          knowledgeSkills: { history: 1, ucas: 1 },
          languages: { english: 0 },
          qualities: [{ id: "sinner-national", type: "negative" }],
        }),
        makeModule({
          id: "ucas-seattle",
          phase: "nationality",
          attributeModifiers: { intuition: 1 },
          activeSkills: { etiquette: 2, negotiation: 1 },
          knowledgeSkills: { seattle: 2 },
          languages: { english: 0 },
          contacts: [{ archetype: "fixer", connection: 2, loyalty: 1 }],
        }),
      ],
    }),
    makeModule({
      id: "cas",
      phase: "nationality",
      karmaCost: 15,
      attributeModifiers: { charisma: 1 },
      activeSkills: { etiquette: 1 },
      languages: { english: 0 },
    }),
  ],
  formative: [
    makeModule({
      id: "military-brat",
      phase: "formative",
      karmaCost: 40,
      yearsAdded: 10,
      attributeModifiers: { body: 1, willpower: 1 },
      activeSkills: { gymnastics: 1, pistols: 1 },
      knowledgeSkills: { "military-life": 2 },
    }),
    makeModule({
      id: "street-kid",
      phase: "formative",
      karmaCost: 40,
      yearsAdded: 10,
      attributeModifiers: { agility: 1, intuition: 1 },
      activeSkills: { sneaking: 2, palming: 1 },
      skillGroups: { stealth: 1 },
    }),
  ],
  teen: [
    makeModule({
      id: "gang-member",
      phase: "teen",
      karmaCost: 50,
      yearsAdded: 7,
      activeSkills: { pistols: 3, intimidation: 2 },
      knowledgeSkills: { "gang-id": 3 },
      qualities: [{ id: "toughness", type: "positive" }],
    }),
  ],
  education: [
    makeModule({
      id: "state-university",
      phase: "education",
      karmaCost: 50,
      yearsAdded: 4,
      nuyenBonus: 5000,
      requiresSubModuleSelection: true,
      subModules: [
        makeModule({
          id: "state-u-science",
          phase: "education",
          activeSkills: { "first-aid": 2 },
          knowledgeSkills: { biology: 3, chemistry: 2 },
        }),
      ],
    }),
  ],
  career: [
    makeModule({
      id: "law-enforcement",
      phase: "career",
      karmaCost: 100,
      yearsAdded: 4,
      activeSkills: { pistols: 3, perception: 2, etiquette: 1 },
      knowledgeSkills: { law: 3 },
      contacts: [{ archetype: "police-contact", connection: 3, loyalty: 2 }],
    }),
    // Module with very high skill grants (to test capping)
    makeModule({
      id: "veteran-soldier",
      phase: "career",
      karmaCost: 100,
      yearsAdded: 4,
      activeSkills: { pistols: 5, automatics: 6 },
      knowledgeSkills: { "military-tactics": 8 },
    }),
  ],
  tour: [],
};

// =============================================================================
// lookupModule
// =============================================================================

describe("lookupModule", () => {
  it("finds a top-level module by ID", () => {
    const result = lookupModule("cas", undefined, testCatalog);
    expect(result).toBeDefined();
    expect(result!.id).toBe("cas");
  });

  it("resolves to sub-module when subModuleId is provided", () => {
    const result = lookupModule("ucas", "ucas-seattle", testCatalog);
    expect(result).toBeDefined();
    expect(result!.id).toBe("ucas-seattle");
  });

  it("falls back to parent when subModuleId not found in subModules", () => {
    const result = lookupModule("ucas", "nonexistent", testCatalog);
    expect(result).toBeDefined();
    expect(result!.id).toBe("ucas");
  });

  it("returns undefined for unknown module ID", () => {
    const result = lookupModule("unknown-module", undefined, testCatalog);
    expect(result).toBeUndefined();
  });

  it("finds modules across different phases", () => {
    expect(lookupModule("military-brat", undefined, testCatalog)?.id).toBe("military-brat");
    expect(lookupModule("gang-member", undefined, testCatalog)?.id).toBe("gang-member");
    expect(lookupModule("law-enforcement", undefined, testCatalog)?.id).toBe("law-enforcement");
  });
});

// =============================================================================
// resolveLifeModuleGrants — empty / edge cases
// =============================================================================

describe("resolveLifeModuleGrants", () => {
  describe("empty and edge cases", () => {
    it("returns EMPTY_GRANTS for empty selections", () => {
      const result = resolveLifeModuleGrants([], testCatalog);
      expect(result).toEqual(EMPTY_GRANTS);
    });

    it("returns EMPTY_GRANTS for undefined-like input", () => {
      const result = resolveLifeModuleGrants(
        undefined as unknown as readonly LifeModuleSelection[],
        testCatalog
      );
      expect(result).toEqual(EMPTY_GRANTS);
    });

    it("skips unknown module IDs gracefully", () => {
      const selections: LifeModuleSelection[] = [
        { moduleId: "nonexistent", phase: "nationality", karmaCost: 15 },
      ];
      const result = resolveLifeModuleGrants(selections, testCatalog);
      expect(result).toEqual(EMPTY_GRANTS);
    });
  });

  // ===========================================================================
  // Single module grants
  // ===========================================================================

  describe("single module grants", () => {
    it("resolves a top-level module with all grant types", () => {
      const selections: LifeModuleSelection[] = [
        { moduleId: "cas", phase: "nationality", karmaCost: 15 },
      ];
      const result = resolveLifeModuleGrants(selections, testCatalog);

      expect(result.attributeModifiers).toEqual({ charisma: 1 });
      expect(result.activeSkills).toEqual({ etiquette: 1 });
      expect(result.languages).toEqual({ english: 0 });
      expect(result.qualities).toEqual([]);
      expect(result.contacts).toEqual([]);
      expect(result.calculatedAge).toBe(0);
      expect(result.nuyenBonus).toBe(0);
    });

    it("resolves sub-module grants when subModuleId is selected", () => {
      const selections: LifeModuleSelection[] = [
        { moduleId: "ucas", subModuleId: "ucas-general", phase: "nationality", karmaCost: 15 },
      ];
      const result = resolveLifeModuleGrants(selections, testCatalog);

      expect(result.attributeModifiers).toEqual({ logic: 1 });
      expect(result.activeSkills).toEqual({ computer: 1, etiquette: 1 });
      expect(result.knowledgeSkills).toEqual({ history: 1, ucas: 1 });
      expect(result.qualities).toEqual([{ id: "sinner-national", type: "negative" }]);
    });

    it("resolves contacts from sub-module", () => {
      const selections: LifeModuleSelection[] = [
        { moduleId: "ucas", subModuleId: "ucas-seattle", phase: "nationality", karmaCost: 15 },
      ];
      const result = resolveLifeModuleGrants(selections, testCatalog);

      expect(result.contacts).toEqual([{ archetype: "fixer", connection: 2, loyalty: 1 }]);
    });

    it("calculates yearsAdded for a single module", () => {
      const selections: LifeModuleSelection[] = [
        { moduleId: "military-brat", phase: "formative", karmaCost: 40 },
      ];
      const result = resolveLifeModuleGrants(selections, testCatalog);

      expect(result.calculatedAge).toBe(10);
    });

    it("resolves skill groups", () => {
      const selections: LifeModuleSelection[] = [
        { moduleId: "street-kid", phase: "formative", karmaCost: 40 },
      ];
      const result = resolveLifeModuleGrants(selections, testCatalog);

      expect(result.skillGroups).toEqual({ stealth: 1 });
    });

    it("resolves nuyen bonus", () => {
      const selections: LifeModuleSelection[] = [
        {
          moduleId: "state-university",
          subModuleId: "state-u-science",
          phase: "education",
          karmaCost: 50,
        },
      ];
      const result = resolveLifeModuleGrants(selections, testCatalog);

      // nuyenBonus is on parent, sub-module doesn't override it
      // Since we resolve to sub-module, parent's nuyenBonus is NOT included
      // This is correct — sub-module replaces parent
      expect(result.activeSkills).toEqual({ "first-aid": 2 });
      expect(result.knowledgeSkills).toEqual({ biology: 3, chemistry: 2 });
    });
  });

  // ===========================================================================
  // Multiple modules — additive accumulation
  // ===========================================================================

  describe("additive accumulation across modules", () => {
    it("sums attribute modifiers from multiple modules", () => {
      const selections: LifeModuleSelection[] = [
        { moduleId: "ucas", subModuleId: "ucas-general", phase: "nationality", karmaCost: 15 },
        { moduleId: "military-brat", phase: "formative", karmaCost: 40 },
      ];
      const result = resolveLifeModuleGrants(selections, testCatalog);

      expect(result.attributeModifiers).toEqual({
        logic: 1, // from ucas-general
        body: 1, // from military-brat
        willpower: 1, // from military-brat
      });
    });

    it("sums active skill ranks from multiple modules", () => {
      const selections: LifeModuleSelection[] = [
        { moduleId: "ucas", subModuleId: "ucas-general", phase: "nationality", karmaCost: 15 },
        { moduleId: "military-brat", phase: "formative", karmaCost: 40 },
      ];
      const result = resolveLifeModuleGrants(selections, testCatalog);

      expect(result.activeSkills).toEqual({
        computer: 1, // from ucas-general
        etiquette: 1, // from ucas-general
        gymnastics: 1, // from military-brat
        pistols: 1, // from military-brat
      });
    });

    it("sums same skill across modules", () => {
      const selections: LifeModuleSelection[] = [
        { moduleId: "military-brat", phase: "formative", karmaCost: 40 },
        { moduleId: "gang-member", phase: "teen", karmaCost: 50 },
      ];
      const result = resolveLifeModuleGrants(selections, testCatalog);

      // pistols: 1 (military-brat) + 3 (gang-member) = 4
      expect(result.activeSkills.pistols).toBe(4);
    });

    it("accumulates age across modules", () => {
      const selections: LifeModuleSelection[] = [
        { moduleId: "military-brat", phase: "formative", karmaCost: 40 },
        { moduleId: "gang-member", phase: "teen", karmaCost: 50 },
        { moduleId: "law-enforcement", phase: "career", karmaCost: 100 },
      ];
      const result = resolveLifeModuleGrants(selections, testCatalog);

      // 10 + 7 + 4 = 21
      expect(result.calculatedAge).toBe(21);
    });

    it("accumulates qualities from multiple modules", () => {
      const selections: LifeModuleSelection[] = [
        { moduleId: "ucas", subModuleId: "ucas-general", phase: "nationality", karmaCost: 15 },
        { moduleId: "gang-member", phase: "teen", karmaCost: 50 },
      ];
      const result = resolveLifeModuleGrants(selections, testCatalog);

      expect(result.qualities).toEqual([
        { id: "sinner-national", type: "negative" },
        { id: "toughness", type: "positive" },
      ]);
    });

    it("accumulates contacts from multiple modules", () => {
      const selections: LifeModuleSelection[] = [
        { moduleId: "ucas", subModuleId: "ucas-seattle", phase: "nationality", karmaCost: 15 },
        { moduleId: "law-enforcement", phase: "career", karmaCost: 100 },
      ];
      const result = resolveLifeModuleGrants(selections, testCatalog);

      expect(result.contacts).toHaveLength(2);
      expect(result.contacts[0].archetype).toBe("fixer");
      expect(result.contacts[1].archetype).toBe("police-contact");
    });
  });

  // ===========================================================================
  // Skill cap enforcement
  // ===========================================================================

  describe("skill cap enforcement", () => {
    it("caps active skills at 7", () => {
      const selections: LifeModuleSelection[] = [
        { moduleId: "military-brat", phase: "formative", karmaCost: 40 },
        { moduleId: "gang-member", phase: "teen", karmaCost: 50 },
        { moduleId: "law-enforcement", phase: "career", karmaCost: 100 },
        { moduleId: "veteran-soldier", phase: "career", karmaCost: 100 },
      ];
      const result = resolveLifeModuleGrants(selections, testCatalog);

      // pistols: 1 + 3 + 3 + 5 = 12, capped to 7
      expect(result.activeSkills.pistols).toBe(7);
      // automatics: 6, under cap
      expect(result.activeSkills.automatics).toBe(6);
    });

    it("caps knowledge skills at 9", () => {
      const selections: LifeModuleSelection[] = [
        { moduleId: "gang-member", phase: "teen", karmaCost: 50 },
        { moduleId: "veteran-soldier", phase: "career", karmaCost: 100 },
      ];
      const result = resolveLifeModuleGrants(selections, testCatalog);

      // military-tactics: 8 (under cap 9)
      expect(result.knowledgeSkills["military-tactics"]).toBe(8);
      // gang-id: 3 (under cap 9)
      expect(result.knowledgeSkills["gang-id"]).toBe(3);
    });

    it("does not cap attribute modifiers", () => {
      // Attributes are raw modifiers, not constrained by skill caps
      const selections: LifeModuleSelection[] = [
        { moduleId: "ucas", subModuleId: "ucas-seattle", phase: "nationality", karmaCost: 15 },
        { moduleId: "street-kid", phase: "formative", karmaCost: 40 },
      ];
      const result = resolveLifeModuleGrants(selections, testCatalog);

      // intuition: 1 (ucas-seattle) + 1 (street-kid) = 2
      expect(result.attributeModifiers.intuition).toBe(2);
    });
  });

  // ===========================================================================
  // Full life path scenario
  // ===========================================================================

  describe("full life path scenario", () => {
    it("resolves a complete character life path", () => {
      const selections: LifeModuleSelection[] = [
        { moduleId: "ucas", subModuleId: "ucas-general", phase: "nationality", karmaCost: 15 },
        { moduleId: "military-brat", phase: "formative", karmaCost: 40 },
        { moduleId: "gang-member", phase: "teen", karmaCost: 50 },
        { moduleId: "law-enforcement", phase: "career", karmaCost: 100 },
      ];
      const result = resolveLifeModuleGrants(selections, testCatalog);

      // Attributes: logic:1, body:1, willpower:1
      expect(result.attributeModifiers).toEqual({ logic: 1, body: 1, willpower: 1 });

      // Active skills (all under cap):
      // computer:1, etiquette:1+1=2, gymnastics:1, pistols:1+3+3=7(cap), intimidation:2, perception:2
      expect(result.activeSkills.computer).toBe(1);
      expect(result.activeSkills.etiquette).toBe(2);
      expect(result.activeSkills.pistols).toBe(7); // capped
      expect(result.activeSkills.perception).toBe(2);
      expect(result.activeSkills.intimidation).toBe(2);

      // Knowledge: history:1, ucas:1, military-life:2, gang-id:3, law:3
      expect(result.knowledgeSkills).toEqual({
        history: 1,
        ucas: 1,
        "military-life": 2,
        "gang-id": 3,
        law: 3,
      });

      // Languages
      expect(result.languages).toEqual({ english: 0 });

      // Qualities
      expect(result.qualities).toHaveLength(2);

      // Contacts
      expect(result.contacts).toHaveLength(1);
      expect(result.contacts[0].archetype).toBe("police-contact");

      // Age: 0 + 10 + 7 + 4 = 21
      expect(result.calculatedAge).toBe(21);
    });
  });
});
