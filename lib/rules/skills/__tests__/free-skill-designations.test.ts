/**
 * Unit tests for free-skill designation functions
 *
 * Tests the explicit designation-based free skill allocation system.
 */

import { describe, it, expect } from "vitest";
import {
  canDesignateForFreeSkill,
  calculateFreePointsFromDesignations,
  getDesignatedFreeSkills,
  getFreeSkillAllocationStatus,
  getDesignatedSkillFreeRating,
  type FreeSkillConfig,
  type FreeSkillDesignations,
} from "../free-skills";

// =============================================================================
// Test Helpers
// =============================================================================

/**
 * Mock skill categories for testing
 */
const mockSkillCategories: Record<string, string | undefined> = {
  // Magical skills
  spellcasting: "magical",
  summoning: "magical",
  counterspelling: "magical",
  binding: "magical",
  // Resonance skills
  compiling: "resonance",
  registering: "resonance",
  // Combat skills
  pistols: "combat",
  automatics: "combat",
  // Physical skills
  athletics: "physical",
  sneaking: "physical",
};

const mockTypeLabels: Record<string, { label: string }> = {
  magical: { label: "magical skills" },
  resonance: { label: "resonance skills" },
  active: { label: "active skills" },
};

// =============================================================================
// canDesignateForFreeSkill Tests
// =============================================================================

describe("canDesignateForFreeSkill", () => {
  it("allows designation when skill type matches and slots available", () => {
    const result = canDesignateForFreeSkill("spellcasting", "magical", "magical", [], 2);

    expect(result.canDesignate).toBe(true);
    expect(result.reason).toBeUndefined();
  });

  it("prevents designation when skill already designated", () => {
    const result = canDesignateForFreeSkill(
      "spellcasting",
      "magical",
      "magical",
      ["spellcasting"],
      2
    );

    expect(result.canDesignate).toBe(false);
    expect(result.reason).toBe("Already designated");
  });

  it("prevents designation when all slots filled", () => {
    const result = canDesignateForFreeSkill(
      "counterspelling",
      "magical",
      "magical",
      ["spellcasting", "summoning"],
      2
    );

    expect(result.canDesignate).toBe(false);
    expect(result.reason).toBe("All slots filled");
  });

  it("prevents designation when skill type does not match", () => {
    const result = canDesignateForFreeSkill("pistols", "combat", "magical", [], 2);

    expect(result.canDesignate).toBe(false);
    expect(result.reason).toBe("Skill must be magical type");
  });

  it("allows any skill type for active free skills", () => {
    const result = canDesignateForFreeSkill("pistols", "combat", "active", [], 1);

    expect(result.canDesignate).toBe(true);
  });

  it("allows resonance skills for resonance free skill type", () => {
    const result = canDesignateForFreeSkill("compiling", "resonance", "resonance", [], 2);

    expect(result.canDesignate).toBe(true);
  });
});

// =============================================================================
// calculateFreePointsFromDesignations Tests
// =============================================================================

describe("calculateFreePointsFromDesignations", () => {
  it("returns 0 when no designations", () => {
    const skills = { spellcasting: 5, summoning: 5 };
    const configs: FreeSkillConfig[] = [{ type: "magical", rating: 5, count: 2 }];

    const result = calculateFreePointsFromDesignations(skills, configs, undefined);

    expect(result).toBe(0);
  });

  it("calculates free points for fully rated designated skills", () => {
    const skills = { spellcasting: 5, summoning: 5 };
    const configs: FreeSkillConfig[] = [{ type: "magical", rating: 5, count: 2 }];
    const designations: FreeSkillDesignations = {
      magical: ["spellcasting", "summoning"],
    };

    const result = calculateFreePointsFromDesignations(skills, configs, designations);

    expect(result).toBe(10); // 5 + 5
  });

  it("caps free points at skill rating when below free rating", () => {
    const skills = { spellcasting: 3, summoning: 2 };
    const configs: FreeSkillConfig[] = [{ type: "magical", rating: 5, count: 2 }];
    const designations: FreeSkillDesignations = {
      magical: ["spellcasting", "summoning"],
    };

    const result = calculateFreePointsFromDesignations(skills, configs, designations);

    expect(result).toBe(5); // 3 + 2
  });

  it("caps free points at free rating when skill exceeds it", () => {
    const skills = { spellcasting: 6, summoning: 6 };
    const configs: FreeSkillConfig[] = [{ type: "magical", rating: 5, count: 2 }];
    const designations: FreeSkillDesignations = {
      magical: ["spellcasting", "summoning"],
    };

    const result = calculateFreePointsFromDesignations(skills, configs, designations);

    expect(result).toBe(10); // 5 + 5 (capped)
  });

  it("handles partial designations", () => {
    const skills = { spellcasting: 5, summoning: 5 };
    const configs: FreeSkillConfig[] = [{ type: "magical", rating: 5, count: 2 }];
    const designations: FreeSkillDesignations = {
      magical: ["spellcasting"], // Only one designated
    };

    const result = calculateFreePointsFromDesignations(skills, configs, designations);

    expect(result).toBe(5); // Only one skill counts
  });

  it("handles designated skill not in skills map (rating 0)", () => {
    const skills = { spellcasting: 5 };
    const configs: FreeSkillConfig[] = [{ type: "magical", rating: 5, count: 2 }];
    const designations: FreeSkillDesignations = {
      magical: ["spellcasting", "summoning"], // summoning not purchased yet
    };

    const result = calculateFreePointsFromDesignations(skills, configs, designations);

    expect(result).toBe(5); // 5 + 0
  });

  it("handles multiple free skill types", () => {
    const skills = {
      spellcasting: 5,
      pistols: 4,
    };
    const configs: FreeSkillConfig[] = [
      { type: "magical", rating: 5, count: 1 },
      { type: "active", rating: 4, count: 1 },
    ];
    const designations: FreeSkillDesignations = {
      magical: ["spellcasting"],
      active: ["pistols"],
    };

    const result = calculateFreePointsFromDesignations(skills, configs, designations);

    expect(result).toBe(9); // 5 + 4
  });

  it("skips magicalGroup configs", () => {
    const skills = { spellcasting: 5 };
    const configs: FreeSkillConfig[] = [
      { type: "magical", rating: 5, count: 1 },
      { type: "magicalGroup", rating: 4, count: 1 },
    ];
    const designations: FreeSkillDesignations = {
      magical: ["spellcasting"],
    };

    const result = calculateFreePointsFromDesignations(skills, configs, designations);

    expect(result).toBe(5); // Only magical, not magicalGroup
  });

  it("returns 0 for resonance when no resonance designations", () => {
    const skills = { compiling: 5 };
    const configs: FreeSkillConfig[] = [{ type: "resonance", rating: 5, count: 2 }];
    const designations: FreeSkillDesignations = {
      magical: ["spellcasting"], // Wrong type
    };

    const result = calculateFreePointsFromDesignations(skills, configs, designations);

    expect(result).toBe(0);
  });

  it("calculates resonance free points correctly", () => {
    const skills = { compiling: 5, registering: 4 };
    const configs: FreeSkillConfig[] = [{ type: "resonance", rating: 5, count: 2 }];
    const designations: FreeSkillDesignations = {
      resonance: ["compiling", "registering"],
    };

    const result = calculateFreePointsFromDesignations(skills, configs, designations);

    expect(result).toBe(9); // 5 + 4 (registering capped at its rating)
  });
});

// =============================================================================
// getDesignatedFreeSkills Tests
// =============================================================================

describe("getDesignatedFreeSkills", () => {
  it("returns empty set when no designations", () => {
    const result = getDesignatedFreeSkills(undefined);

    expect(result.size).toBe(0);
  });

  it("returns all designated magical skills", () => {
    const designations: FreeSkillDesignations = {
      magical: ["spellcasting", "summoning"],
    };

    const result = getDesignatedFreeSkills(designations);

    expect(result.has("spellcasting")).toBe(true);
    expect(result.has("summoning")).toBe(true);
    expect(result.size).toBe(2);
  });

  it("returns all designated resonance skills", () => {
    const designations: FreeSkillDesignations = {
      resonance: ["compiling", "registering"],
    };

    const result = getDesignatedFreeSkills(designations);

    expect(result.has("compiling")).toBe(true);
    expect(result.has("registering")).toBe(true);
  });

  it("returns all designated active skills", () => {
    const designations: FreeSkillDesignations = {
      active: ["pistols"],
    };

    const result = getDesignatedFreeSkills(designations);

    expect(result.has("pistols")).toBe(true);
  });

  it("combines designations from multiple types", () => {
    const designations: FreeSkillDesignations = {
      magical: ["spellcasting"],
      active: ["pistols"],
    };

    const result = getDesignatedFreeSkills(designations);

    expect(result.has("spellcasting")).toBe(true);
    expect(result.has("pistols")).toBe(true);
    expect(result.size).toBe(2);
  });

  it("handles empty arrays", () => {
    const designations: FreeSkillDesignations = {
      magical: [],
      resonance: [],
      active: [],
    };

    const result = getDesignatedFreeSkills(designations);

    expect(result.size).toBe(0);
  });
});

// =============================================================================
// getFreeSkillAllocationStatus Tests
// =============================================================================

describe("getFreeSkillAllocationStatus", () => {
  it("returns empty array when no configs", () => {
    const skills = { spellcasting: 5 };
    const configs: FreeSkillConfig[] = [];

    const result = getFreeSkillAllocationStatus(skills, configs, undefined, mockTypeLabels);

    expect(result).toEqual([]);
  });

  it("returns status for unfilled slots", () => {
    const skills = {};
    const configs: FreeSkillConfig[] = [{ type: "magical", rating: 5, count: 2 }];

    const result = getFreeSkillAllocationStatus(skills, configs, undefined, mockTypeLabels);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      type: "magical",
      label: "magical skills",
      freeRating: 5,
      totalSlots: 2,
      usedSlots: 0,
      remainingSlots: 2,
      designatedSkillIds: [],
      designatedSkillRatings: {},
      isComplete: false,
      belowFreeRating: [],
    });
  });

  it("returns status for partially filled slots", () => {
    const skills = { spellcasting: 5 };
    const configs: FreeSkillConfig[] = [{ type: "magical", rating: 5, count: 2 }];
    const designations: FreeSkillDesignations = {
      magical: ["spellcasting"],
    };

    const result = getFreeSkillAllocationStatus(skills, configs, designations, mockTypeLabels);

    expect(result).toHaveLength(1);
    expect(result[0].usedSlots).toBe(1);
    expect(result[0].remainingSlots).toBe(1);
    expect(result[0].isComplete).toBe(false);
    expect(result[0].designatedSkillIds).toEqual(["spellcasting"]);
    expect(result[0].designatedSkillRatings).toEqual({ spellcasting: 5 });
  });

  it("returns status for complete slots", () => {
    const skills = { spellcasting: 5, summoning: 5 };
    const configs: FreeSkillConfig[] = [{ type: "magical", rating: 5, count: 2 }];
    const designations: FreeSkillDesignations = {
      magical: ["spellcasting", "summoning"],
    };

    const result = getFreeSkillAllocationStatus(skills, configs, designations, mockTypeLabels);

    expect(result[0].usedSlots).toBe(2);
    expect(result[0].remainingSlots).toBe(0);
    expect(result[0].isComplete).toBe(true);
  });

  it("reports skills below free rating", () => {
    const skills = { spellcasting: 3, summoning: 5 };
    const configs: FreeSkillConfig[] = [{ type: "magical", rating: 5, count: 2 }];
    const designations: FreeSkillDesignations = {
      magical: ["spellcasting", "summoning"],
    };

    const result = getFreeSkillAllocationStatus(skills, configs, designations, mockTypeLabels);

    expect(result[0].belowFreeRating).toHaveLength(1);
    expect(result[0].belowFreeRating[0]).toEqual({
      skillId: "spellcasting",
      currentRating: 3,
      freeRating: 5,
    });
  });

  it("handles designated skill with rating 0", () => {
    const skills = { spellcasting: 5 }; // summoning not purchased
    const configs: FreeSkillConfig[] = [{ type: "magical", rating: 5, count: 2 }];
    const designations: FreeSkillDesignations = {
      magical: ["spellcasting", "summoning"],
    };

    const result = getFreeSkillAllocationStatus(skills, configs, designations, mockTypeLabels);

    expect(result[0].designatedSkillRatings).toEqual({
      spellcasting: 5,
      summoning: 0,
    });
    expect(result[0].belowFreeRating).toContainEqual({
      skillId: "summoning",
      currentRating: 0,
      freeRating: 5,
    });
  });

  it("skips magicalGroup configs", () => {
    const skills = {};
    const configs: FreeSkillConfig[] = [
      { type: "magical", rating: 5, count: 2 },
      { type: "magicalGroup", rating: 4, count: 1 },
    ];

    const result = getFreeSkillAllocationStatus(skills, configs, undefined, mockTypeLabels);

    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("magical");
  });

  it("handles multiple config types", () => {
    const skills = { spellcasting: 5, pistols: 4 };
    const configs: FreeSkillConfig[] = [
      { type: "magical", rating: 5, count: 1 },
      { type: "active", rating: 4, count: 1 },
    ];
    const designations: FreeSkillDesignations = {
      magical: ["spellcasting"],
      active: ["pistols"],
    };

    const result = getFreeSkillAllocationStatus(skills, configs, designations, mockTypeLabels);

    expect(result).toHaveLength(2);
    expect(result.find((s) => s.type === "magical")?.isComplete).toBe(true);
    expect(result.find((s) => s.type === "active")?.isComplete).toBe(true);
  });

  it("uses fallback label when not provided", () => {
    const skills = {};
    const configs: FreeSkillConfig[] = [{ type: "unknown-type", rating: 4, count: 1 }];

    const result = getFreeSkillAllocationStatus(skills, configs, undefined, {});

    expect(result[0].label).toBe("unknown-type");
  });
});

// =============================================================================
// getDesignatedSkillFreeRating Tests
// =============================================================================

describe("getDesignatedSkillFreeRating", () => {
  it("returns undefined when no designations", () => {
    const configs: FreeSkillConfig[] = [{ type: "magical", rating: 5, count: 2 }];

    const result = getDesignatedSkillFreeRating("spellcasting", configs, undefined);

    expect(result).toBeUndefined();
  });

  it("returns free rating for designated magical skill", () => {
    const configs: FreeSkillConfig[] = [{ type: "magical", rating: 5, count: 2 }];
    const designations: FreeSkillDesignations = {
      magical: ["spellcasting", "summoning"],
    };

    const result = getDesignatedSkillFreeRating("spellcasting", configs, designations);

    expect(result).toBe(5);
  });

  it("returns free rating for designated resonance skill", () => {
    const configs: FreeSkillConfig[] = [{ type: "resonance", rating: 4, count: 2 }];
    const designations: FreeSkillDesignations = {
      resonance: ["compiling"],
    };

    const result = getDesignatedSkillFreeRating("compiling", configs, designations);

    expect(result).toBe(4);
  });

  it("returns free rating for designated active skill", () => {
    const configs: FreeSkillConfig[] = [{ type: "active", rating: 4, count: 1 }];
    const designations: FreeSkillDesignations = {
      active: ["pistols"],
    };

    const result = getDesignatedSkillFreeRating("pistols", configs, designations);

    expect(result).toBe(4);
  });

  it("returns undefined for non-designated skill", () => {
    const configs: FreeSkillConfig[] = [{ type: "magical", rating: 5, count: 2 }];
    const designations: FreeSkillDesignations = {
      magical: ["spellcasting"],
    };

    const result = getDesignatedSkillFreeRating("summoning", configs, designations);

    expect(result).toBeUndefined();
  });

  it("skips magicalGroup configs", () => {
    const configs: FreeSkillConfig[] = [
      { type: "magical", rating: 5, count: 1 },
      { type: "magicalGroup", rating: 4, count: 1 },
    ];
    const designations: FreeSkillDesignations = {
      magical: ["spellcasting"],
    };

    const result = getDesignatedSkillFreeRating("spellcasting", configs, designations);

    expect(result).toBe(5);
  });
});
