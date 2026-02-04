/**
 * Unit tests for CreationBudgetContext helper functions
 *
 * Tests validation and derivation logic for character creation budgets.
 */

import { describe, it, expect } from "vitest";
import { _testExports, type BudgetState } from "../CreationBudgetContext";
import type { CreationState } from "../../types/creation";

const { extractSpentValues, validateBudgets } = _testExports;

// =============================================================================
// Test Helpers
// =============================================================================

function createMinimalCreationState(overrides?: Partial<CreationState>): CreationState {
  return {
    characterId: "test-char-1",
    creationMethodId: "sr5-priority",
    currentStep: 0,
    completedSteps: [],
    budgets: {},
    selections: {},
    priorities: {},
    errors: [],
    warnings: [],
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

function createBudgetState(total: number, spent: number, label: string): BudgetState {
  return {
    total,
    spent,
    remaining: total - spent,
    label,
    displayFormat: "number",
  };
}

// =============================================================================
// extractSpentValues Tests
// =============================================================================

// Helper to create empty totals for tests that don't need specific totals
const emptyTotals: Record<
  string,
  { total: number; label: string; displayFormat?: "number" | "currency" }
> = {};

// Helper to create totals with spell slots
function createTotalsWithSpellSlots(
  spellSlots: number
): Record<string, { total: number; label: string; displayFormat?: "number" | "currency" }> {
  return {
    "spell-slots": { total: spellSlots, label: "Free Spells", displayFormat: "number" },
  };
}

// Empty skill categories for tests that don't need them
const emptySkillCategories: Record<string, string | undefined> = {};

describe("extractSpentValues", () => {
  describe("contact points derivation", () => {
    it("derives contact points from selections.contacts array (within free pool)", () => {
      const stateBudgets = {};
      const selections = {
        attributes: { charisma: 4 }, // Free pool = 4 × 3 = 12
        contacts: [
          { connection: 3, loyalty: 2 }, // 5 points
          { connection: 4, loyalty: 3 }, // 7 points
        ],
      };

      const spent = extractSpentValues(
        stateBudgets,
        selections,
        emptyTotals,
        null,
        undefined,
        emptySkillCategories
      );

      // Total is 12, free pool is 12, so spent = 12
      expect(spent["contact-points"]).toBe(12);
    });

    it("caps contact points at free pool (CHA × 3)", () => {
      const stateBudgets = {};
      const selections = {
        attributes: { charisma: 3 }, // Free pool = 3 × 3 = 9
        contacts: [
          { connection: 3, loyalty: 2 }, // 5 points
          { connection: 4, loyalty: 3 }, // 7 points - total 12
        ],
      };

      const spent = extractSpentValues(
        stateBudgets,
        selections,
        emptyTotals,
        null,
        undefined,
        emptySkillCategories
      );

      // Total is 12, but free pool is 9, so spent is capped at 9
      // The extra 3 points go to karma, not contact points
      expect(spent["contact-points"]).toBe(9);
    });

    it("returns 0 when no contacts are selected", () => {
      const stateBudgets = {};
      const selections = {};

      const spent = extractSpentValues(
        stateBudgets,
        selections,
        emptyTotals,
        null,
        undefined,
        emptySkillCategories
      );

      expect(spent["contact-points"]).toBe(0);
    });

    it("handles empty contacts array", () => {
      const stateBudgets = {};
      const selections = { contacts: [] };

      const spent = extractSpentValues(
        stateBudgets,
        selections,
        emptyTotals,
        null,
        undefined,
        emptySkillCategories
      );

      expect(spent["contact-points"]).toBe(0);
    });
  });

  describe("spell slots derivation", () => {
    it("derives spell slots from selections.spells array length (within free allocation)", () => {
      const stateBudgets = {};
      const selections = {
        spells: ["fireball", "lightning-bolt", "ice-shield"],
      };
      const totals = createTotalsWithSpellSlots(10);

      const spent = extractSpentValues(
        stateBudgets,
        selections,
        totals,
        null,
        undefined,
        emptySkillCategories
      );

      expect(spent["spell-slots"]).toBe(3);
    });

    it("caps spell slots at free allocation", () => {
      const stateBudgets = {};
      const selections = {
        spells: ["spell-1", "spell-2", "spell-3", "spell-4", "spell-5"],
      };
      const totals = createTotalsWithSpellSlots(3); // Only 3 free slots

      const spent = extractSpentValues(
        stateBudgets,
        selections,
        totals,
        null,
        undefined,
        emptySkillCategories
      );

      // 5 spells selected, but only 3 free slots - caps at 3
      expect(spent["spell-slots"]).toBe(3);
    });

    it("handles spells as object array", () => {
      const stateBudgets = {};
      const selections = {
        spells: [{ id: "fireball" }, { id: "lightning-bolt" }],
      };
      const totals = createTotalsWithSpellSlots(10);

      const spent = extractSpentValues(
        stateBudgets,
        selections,
        totals,
        null,
        undefined,
        emptySkillCategories
      );

      expect(spent["spell-slots"]).toBe(2);
    });

    it("returns 0 when no spells are selected", () => {
      const stateBudgets = {};
      const selections = {};

      const spent = extractSpentValues(
        stateBudgets,
        selections,
        emptyTotals,
        null,
        undefined,
        emptySkillCategories
      );

      expect(spent["spell-slots"]).toBe(0);
    });

    it("returns 0 when no free spells are available", () => {
      const stateBudgets = {};
      const selections = {
        spells: ["fireball", "lightning-bolt"],
      };

      const spent = extractSpentValues(
        stateBudgets,
        selections,
        emptyTotals,
        null,
        undefined,
        emptySkillCategories
      );

      // No spell-slots in totals means 0 free spells
      expect(spent["spell-slots"]).toBe(0);
    });
  });

  describe("lifestyle spending derivation", () => {
    it("derives lifestyle spending from selections.lifestyles", () => {
      const stateBudgets = {};
      const selections = {
        lifestyles: [
          { monthlyCost: 1000, prepaidMonths: 3 }, // 3000
          { monthlyCost: 500, prepaidMonths: 1 }, // 500
        ],
      };

      const spent = extractSpentValues(
        stateBudgets,
        selections,
        emptyTotals,
        null,
        undefined,
        emptySkillCategories
      );

      // Lifestyle is part of total nuyen spent
      // Check that it's included in the nuyen calculation
      expect(spent["nuyen"]).toBeGreaterThanOrEqual(3500);
    });

    it("defaults prepaidMonths to 1 when not specified", () => {
      const stateBudgets = {};
      const selections = {
        lifestyles: [{ monthlyCost: 2000 }],
      };

      const spent = extractSpentValues(
        stateBudgets,
        selections,
        emptyTotals,
        null,
        undefined,
        emptySkillCategories
      );

      expect(spent["nuyen"]).toBeGreaterThanOrEqual(2000);
    });
  });

  describe("rigging equipment spending derivation", () => {
    it("includes vehicles in nuyen spending", () => {
      const stateBudgets = {};
      const selections = {
        vehicles: [
          { cost: 3000, quantity: 1 },
          { cost: 5000, quantity: 2 },
        ],
      };

      const spent = extractSpentValues(
        stateBudgets,
        selections,
        emptyTotals,
        null,
        undefined,
        emptySkillCategories
      );

      // 3000 + (5000 * 2) = 13000
      expect(spent["nuyen"]).toBe(13000);
    });

    it("includes drones in nuyen spending", () => {
      const stateBudgets = {};
      const selections = {
        drones: [{ cost: 1000 }, { cost: 2500 }, { cost: 500 }],
      };

      const spent = extractSpentValues(
        stateBudgets,
        selections,
        emptyTotals,
        null,
        undefined,
        emptySkillCategories
      );

      expect(spent["nuyen"]).toBe(4000);
    });

    it("includes RCCs in nuyen spending", () => {
      const stateBudgets = {};
      const selections = {
        rccs: [{ cost: 1400 }, { cost: 3000 }],
      };

      const spent = extractSpentValues(
        stateBudgets,
        selections,
        emptyTotals,
        null,
        undefined,
        emptySkillCategories
      );

      expect(spent["nuyen"]).toBe(4400);
    });

    it("includes autosofts in nuyen spending", () => {
      const stateBudgets = {};
      const selections = {
        autosofts: [{ cost: 500 }, { cost: 1000 }, { cost: 750 }],
      };

      const spent = extractSpentValues(
        stateBudgets,
        selections,
        emptyTotals,
        null,
        undefined,
        emptySkillCategories
      );

      expect(spent["nuyen"]).toBe(2250);
    });

    it("combines all rigging equipment in nuyen spending", () => {
      const stateBudgets = {};
      const selections = {
        vehicles: [{ cost: 3000, quantity: 1 }],
        drones: [{ cost: 1000 }],
        rccs: [{ cost: 1400 }],
        autosofts: [{ cost: 500 }],
      };

      const spent = extractSpentValues(
        stateBudgets,
        selections,
        emptyTotals,
        null,
        undefined,
        emptySkillCategories
      );

      // 3000 + 1000 + 1400 + 500 = 5900
      expect(spent["nuyen"]).toBe(5900);
    });
  });
});

// =============================================================================
// validateBudgets Tests
// =============================================================================

describe("skill points with free skills derivation", () => {
  // Mock priority table with Magic B granting 2 magical skills at Rating 4
  const mockPriorityTable = {
    levels: ["A", "B", "C", "D", "E"],
    categories: [],
    table: {
      B: {
        magic: {
          options: [
            {
              path: "magician",
              magicRating: 4,
              freeSkills: [{ type: "magical", rating: 4, count: 2 }],
              spells: 7,
            },
          ],
        },
      },
    },
  };

  const mockSkillCategories: Record<string, string | undefined> = {
    alchemy: "magical",
    arcana: "magical",
    spellcasting: "magical",
    summoning: "magical",
    counterspelling: "magical",
    banishing: "magical",
    binding: "magical",
    pistols: "combat",
    perception: "physical",
    impersonation: "social",
    clubs: "combat",
  };

  it("subtracts free skill points from total when magical skills qualify", () => {
    const stateBudgets = {};
    const selections = {
      "magical-path": "magician",
      skills: {
        alchemy: 4, // magical, rating 4 - qualifies for free
        arcana: 4, // magical, rating 4 - qualifies for free
        banishing: 3, // magical, rating 3 - below free rating, doesn't qualify
        binding: 3, // magical, rating 3 - below free rating
        counterspelling: 1, // magical, rating 1 - below free rating
        summoning: 1, // magical, rating 1 - below free rating
        clubs: 2, // combat, not magical
        impersonation: 3, // social, not magical
        perception: 1, // physical, not magical
      },
    };
    const priorities = { magic: "B" };

    const spent = extractSpentValues(
      stateBudgets,
      selections,
      emptyTotals,
      mockPriorityTable,
      priorities,
      mockSkillCategories
    );

    // Total skill points: 4+4+3+3+1+1+2+3+1 = 22
    // Free skill points: 2 skills × 4 rating = 8 (alchemy and arcana qualify)
    // Expected spent: 22 - 8 = 14
    expect(spent["skill-points"]).toBe(14);
  });

  it("does not subtract free points when skills are below required rating", () => {
    const stateBudgets = {};
    const selections = {
      "magical-path": "magician",
      skills: {
        alchemy: 3, // magical, but rating 3 < required 4
        arcana: 3, // magical, but rating 3 < required 4
        pistols: 4, // combat, not magical
      },
    };
    const priorities = { magic: "B" };

    const spent = extractSpentValues(
      stateBudgets,
      selections,
      emptyTotals,
      mockPriorityTable,
      priorities,
      mockSkillCategories
    );

    // Total: 3+3+4 = 10
    // No free points - magical skills are below required rating 4
    expect(spent["skill-points"]).toBe(10);
  });

  it("only subtracts free points for qualifying magical skills, not combat skills", () => {
    const stateBudgets = {};
    const selections = {
      "magical-path": "magician",
      skills: {
        alchemy: 5, // magical, rating 5 - qualifies
        pistols: 5, // combat, not magical - doesn't qualify
        perception: 4, // physical, not magical - doesn't qualify
      },
    };
    const priorities = { magic: "B" };

    const spent = extractSpentValues(
      stateBudgets,
      selections,
      emptyTotals,
      mockPriorityTable,
      priorities,
      mockSkillCategories
    );

    // Total: 5+5+4 = 14
    // Free: 1 skill × 4 rating = 4 (only alchemy qualifies, count is 2 but only 1 available)
    // Expected: 14 - 4 = 10
    expect(spent["skill-points"]).toBe(10);
  });

  it("does not subtract free points when no magical path selected", () => {
    const stateBudgets = {};
    const selections = {
      skills: {
        alchemy: 4,
        arcana: 4,
      },
    };
    const priorities = { magic: "B" };

    const spent = extractSpentValues(
      stateBudgets,
      selections,
      emptyTotals,
      mockPriorityTable,
      priorities,
      mockSkillCategories
    );

    // No magical-path selected, so no free skills
    expect(spent["skill-points"]).toBe(8);
  });

  it("does not subtract free points when priority table is null", () => {
    const stateBudgets = {};
    const selections = {
      "magical-path": "magician",
      skills: {
        alchemy: 4,
        arcana: 4,
      },
    };
    const priorities = { magic: "B" };

    const spent = extractSpentValues(
      stateBudgets,
      selections,
      emptyTotals,
      null, // No priority table
      priorities,
      mockSkillCategories
    );

    // No priority table, so no free skills
    expect(spent["skill-points"]).toBe(8);
  });
});

describe("skill points with broken groups derivation", () => {
  const firearmsGroupDef = { id: "firearms", skills: ["automatics", "longarms", "pistols"] };
  const stealthGroupDef = { id: "stealth", skills: ["disguise", "palming", "sneaking"] };

  it("subtracts broken group base ratings from skill points", () => {
    const stateBudgets = {};
    // Firearms group at 5, broken by raising pistols to 6
    const selections = {
      skills: { automatics: 5, longarms: 5, pistols: 6 },
      skillGroups: { firearms: { rating: 5, isBroken: true } },
    };

    const spent = extractSpentValues(
      stateBudgets,
      selections,
      emptyTotals,
      null,
      undefined,
      emptySkillCategories,
      [firearmsGroupDef]
    );

    // Total ratings: 5+5+6 = 16
    // Broken group offset: min(5,5)+min(5,5)+min(6,5) = 5+5+5 = 15
    // Expected: 16 - 15 = 1
    expect(spent["skill-points"]).toBe(1);
  });

  it("does not subtract offset when no groups are broken", () => {
    const stateBudgets = {};
    const selections = {
      skills: { automatics: 5, longarms: 5, pistols: 5 },
      skillGroups: { firearms: { rating: 5, isBroken: false } },
    };

    const spent = extractSpentValues(
      stateBudgets,
      selections,
      emptyTotals,
      null,
      undefined,
      emptySkillCategories,
      [firearmsGroupDef]
    );

    // Total ratings: 15, no broken groups, offset = 0
    expect(spent["skill-points"]).toBe(15);
  });

  it("handles multiple broken groups", () => {
    const stateBudgets = {};
    const selections = {
      skills: {
        automatics: 5,
        longarms: 5,
        pistols: 6,
        disguise: 3,
        palming: 4,
        sneaking: 3,
      },
      skillGroups: {
        firearms: { rating: 5, isBroken: true },
        stealth: { rating: 3, isBroken: true },
      },
    };

    const spent = extractSpentValues(
      stateBudgets,
      selections,
      emptyTotals,
      null,
      undefined,
      emptySkillCategories,
      [firearmsGroupDef, stealthGroupDef]
    );

    // Total ratings: 5+5+6+3+4+3 = 26
    // Firearms offset: 5+5+5 = 15
    // Stealth offset: 3+3+3 = 9
    // Expected: 26 - 15 - 9 = 2
    expect(spent["skill-points"]).toBe(2);
  });

  it("defaults to no offset when skillGroupDefs omitted (backward compat)", () => {
    const stateBudgets = {};
    const selections = {
      skills: { automatics: 5, longarms: 5, pistols: 6 },
      skillGroups: { firearms: { rating: 5, isBroken: true } },
    };

    // Call without 7th argument - should default to empty array
    const spent = extractSpentValues(
      stateBudgets,
      selections,
      emptyTotals,
      null,
      undefined,
      emptySkillCategories
    );

    // No group defs means offset = 0, so full ratings are counted
    expect(spent["skill-points"]).toBe(16);
  });
});

describe("validateBudgets", () => {
  describe("karma conversion limit validation", () => {
    it("allows up to 10 karma for nuyen conversion", () => {
      const budgets: Record<string, BudgetState> = {
        karma: createBudgetState(25, 10, "Karma"),
      };
      const state = createMinimalCreationState({
        budgets: { "karma-spent-gear": 10 },
      });

      const { errors } = validateBudgets(budgets, state, null, emptySkillCategories);

      const conversionError = errors.find((e) => e.constraintId === "karma-conversion-limit");
      expect(conversionError).toBeUndefined();
    });

    it("returns error when karma conversion exceeds 10", () => {
      const budgets: Record<string, BudgetState> = {
        karma: createBudgetState(25, 11, "Karma"),
      };
      const state = createMinimalCreationState({
        budgets: { "karma-spent-gear": 11 },
      });

      const { errors } = validateBudgets(budgets, state, null, emptySkillCategories);

      const conversionError = errors.find((e) => e.constraintId === "karma-conversion-limit");
      expect(conversionError).toBeDefined();
      expect(conversionError?.message).toContain("cannot exceed 10 karma");
      expect(conversionError?.message).toContain("currently 11");
    });

    it("does not error when no karma is converted", () => {
      const budgets: Record<string, BudgetState> = {
        karma: createBudgetState(25, 0, "Karma"),
      };
      const state = createMinimalCreationState({
        budgets: {},
      });

      const { errors } = validateBudgets(budgets, state, null, emptySkillCategories);

      const conversionError = errors.find((e) => e.constraintId === "karma-conversion-limit");
      expect(conversionError).toBeUndefined();
    });
  });

  describe("issue #247: broken skill group budget (full character scenario)", () => {
    // Real SR5 skill group definitions from core-rulebook.json
    const sr5SkillGroupDefs = [
      { id: "firearms", skills: ["automatics", "longarms", "pistols"] },
      { id: "stealth", skills: ["disguise", "palming", "sneaking"] },
      { id: "athletics", skills: ["gymnastics", "running", "swimming"] },
    ];

    // Mock priority table: Skills A = 46/10, Skills B = 36/5
    const mockPriorityTable = {
      levels: ["A", "B", "C", "D", "E"],
      categories: [],
      table: {
        A: {
          skills: { skillPoints: 46, skillGroupPoints: 10 },
          attributes: 24,
          metatype: { specialAttributePoints: { human: 7 } },
          resources: 75000,
          magic: {},
        },
        B: {
          skills: { skillPoints: 36, skillGroupPoints: 5 },
          attributes: 20,
          metatype: { specialAttributePoints: { human: 4 } },
          resources: 50000,
          magic: {},
        },
      },
    };

    it("correctly budgets a street samurai with broken Firearms group", () => {
      // Character: Street Samurai, Human
      // Priority: Skills A (46 skill points, 10 group points)
      // Skill Groups: Firearms 5 (broken), Athletics 3
      // Individual Skills: automatics 5, longarms 5, pistols 6 (broken out),
      //   perception 4, sneaking 3, etiquette 2
      // Karma spent: 12 karma to raise pistols 5→6 (6×2=12)
      const stateBudgets = {};
      const priorities = { skills: "A" };
      const selections = {
        skillGroups: {
          firearms: { rating: 5, isBroken: true },
          athletics: 3, // not broken, legacy number format
        },
        skills: {
          // Broken group members (all 3 added to individual skills)
          automatics: 5,
          longarms: 5,
          pistols: 6, // raised above group with karma
          // Other individual skills
          perception: 4,
          sneaking: 3,
          etiquette: 2,
        },
        skillKarmaSpent: {
          skillRatingPoints: 1, // 1 rating point purchased with karma (pistols 5→6)
          skillRaises: { pistols: 12 }, // 6×2 = 12 karma
          specializations: 0,
        },
      };

      const spent = extractSpentValues(
        stateBudgets,
        selections,
        emptyTotals,
        mockPriorityTable,
        priorities,
        emptySkillCategories,
        sr5SkillGroupDefs
      );

      // --- Skill group points ---
      // firearms (broken, rating 5) + athletics (rating 3) = 8 group points
      expect(spent["skill-group-points"]).toBe(8);

      // --- Skill points ---
      // Total individual ratings: 5+5+6+4+3+2 = 25
      // Karma rating points: 1 (pistols 5→6)
      // Broken group offset: min(5,5)+min(5,5)+min(6,5) = 5+5+5 = 15
      // Spent skill points: 25 - 1 - 15 = 9
      //   (perception 4 + sneaking 3 + etiquette 2 = 9 — just the non-group skills)
      expect(spent["skill-points"]).toBe(9);
    });

    it("shows the bug (before fix) when skillGroupDefs is omitted", () => {
      // Same character but without skill group definitions
      // This simulates backward-compat behavior — no offset applied
      const stateBudgets = {};
      const priorities = { skills: "A" };
      const selections = {
        skillGroups: {
          firearms: { rating: 5, isBroken: true },
          athletics: 3,
        },
        skills: {
          automatics: 5,
          longarms: 5,
          pistols: 6,
          perception: 4,
          sneaking: 3,
          etiquette: 2,
        },
        skillKarmaSpent: {
          skillRatingPoints: 1,
          skillRaises: { pistols: 12 },
          specializations: 0,
        },
      };

      // Without 7th arg, defaults to empty array → no offset
      const spent = extractSpentValues(
        stateBudgets,
        selections,
        emptyTotals,
        mockPriorityTable,
        priorities,
        emptySkillCategories
        // no skillGroupDefs — backward compat
      );

      // Without the fix: 25 - 1 = 24 (the old buggy value)
      // The 15 base points from the Firearms group are double-counted
      expect(spent["skill-points"]).toBe(24);
    });

    it("handles a rigger with two broken groups and specializations", () => {
      // Priority: Skills B (36 skill points, 5 group points)
      // Skill Groups: Firearms 4 (broken), Stealth 3 (broken)
      // Firearms members: automatics 4, longarms 5, pistols 4
      // Stealth members: disguise 3, palming 4, sneaking 3
      // Other skills: pilot-ground-craft 5, electronic-warfare 3
      // Specializations: pistols (Semi-Automatics), sneaking (Urban)
      const stateBudgets = {};
      const priorities = { skills: "B" };
      const selections = {
        skillGroups: {
          firearms: { rating: 4, isBroken: true },
          stealth: { rating: 3, isBroken: true },
        },
        skills: {
          automatics: 4,
          longarms: 5, // raised above group with karma
          pistols: 4,
          disguise: 3,
          palming: 4, // raised above group with karma
          sneaking: 3,
          "pilot-ground-craft": 5,
          "electronic-warfare": 3,
        },
        skillKarmaSpent: {
          skillRatingPoints: 2, // longarms 4→5 (1 pt) + palming 3→4 (1 pt)
          skillRaises: { longarms: 10, palming: 8 }, // 5×2=10, 4×2=8
          specializations: 0,
        },
        skillSpecializations: {
          pistols: ["Semi-Automatics"],
          sneaking: ["Urban"],
        },
      };

      const spent = extractSpentValues(
        stateBudgets,
        selections,
        emptyTotals,
        mockPriorityTable,
        priorities,
        emptySkillCategories,
        sr5SkillGroupDefs
      );

      // Skill group points: firearms 4 + stealth 3 = 7
      expect(spent["skill-group-points"]).toBe(7);

      // Skill points calculation:
      // Total ratings: 4+5+4+3+4+3+5+3 = 31
      // Specializations: 2 (pistols + sneaking)
      // Karma rating points: 2
      // Broken group offset:
      //   firearms: min(4,4)+min(5,4)+min(4,4) = 4+4+4 = 12
      //   stealth: min(3,3)+min(4,3)+min(3,3) = 3+3+3 = 9
      //   total offset: 21
      // Spent: 31 + 2 - 2 - 21 = 10
      //   (pilot-ground-craft 5 + electronic-warfare 3 + 2 specs = 10)
      expect(spent["skill-points"]).toBe(10);
    });

    it("correctly handles non-broken groups (no offset applied)", () => {
      // Character with intact skill groups — no offset should be applied
      // Skill Groups: Firearms 5 (intact), Athletics 3 (intact)
      // Only non-group individual skills
      const stateBudgets = {};
      const priorities = { skills: "A" };
      const selections = {
        skillGroups: {
          firearms: { rating: 5, isBroken: false },
          athletics: 3,
        },
        skills: {
          perception: 4,
          sneaking: 3,
          etiquette: 2,
        },
      };

      const spent = extractSpentValues(
        stateBudgets,
        selections,
        emptyTotals,
        mockPriorityTable,
        priorities,
        emptySkillCategories,
        sr5SkillGroupDefs
      );

      // Group points: 5 + 3 = 8
      expect(spent["skill-group-points"]).toBe(8);

      // No broken groups, no offset. Total: 4+3+2 = 9
      expect(spent["skill-points"]).toBe(9);
    });
  });

  describe("budget overspend validation", () => {
    it("returns error when budget is overspent", () => {
      const budgets: Record<string, BudgetState> = {
        "attribute-points": createBudgetState(24, 26, "Attribute Points"),
      };
      const state = createMinimalCreationState();

      const { errors } = validateBudgets(budgets, state, null, emptySkillCategories);

      const overspentError = errors.find((e) => e.constraintId === "attribute-points-overspent");
      expect(overspentError).toBeDefined();
      expect(overspentError?.message).toContain("overspent by 2");
    });
  });

  describe("nuyen carryover warning", () => {
    it("warns when nuyen remaining exceeds 5000", () => {
      const budgets: Record<string, BudgetState> = {
        nuyen: createBudgetState(50000, 40000, "Nuyen"),
      };
      const state = createMinimalCreationState();

      const { warnings } = validateBudgets(budgets, state, null, emptySkillCategories);

      const carryoverWarning = warnings.find((w) => w.constraintId === "nuyen-carryover");
      expect(carryoverWarning).toBeDefined();
      expect(carryoverWarning?.message).toContain("5,000");
    });
  });

  describe("quality limits validation", () => {
    it("errors when positive qualities exceed 25 karma", () => {
      const budgets: Record<string, BudgetState> = {};
      const state = createMinimalCreationState({
        selections: {
          positiveQualities: [
            { id: "q1", karma: 15 },
            { id: "q2", karma: 15 },
          ],
        },
      });

      const { errors } = validateBudgets(budgets, state, null, emptySkillCategories);

      const qualityError = errors.find((e) => e.constraintId === "positive-quality-limit");
      expect(qualityError).toBeDefined();
      expect(qualityError?.message).toContain("cannot exceed 25 karma");
    });
  });
});
