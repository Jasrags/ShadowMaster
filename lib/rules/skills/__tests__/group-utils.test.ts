/**
 * Tests for skill group utilities
 *
 * Tests all skill group helper functions including normalization,
 * karma cost calculations, restoration detection, and budget helpers.
 */

import { describe, it, expect } from "vitest";
import type { SkillGroupValue } from "@/lib/types/creation-selections";
import {
  normalizeGroupValue,
  getGroupRating,
  isGroupBroken,
  createBrokenGroup,
  createRestoredGroup,
  calculateSkillRaiseKarmaCost,
  calculateSkillGroupRaiseKarmaCost,
  SPECIALIZATION_KARMA_COST,
  calculateSpecializationKarmaCost,
  canRestoreGroup,
  calculateGroupPointsSpent,
  calculateBrokenGroupSkillPointOffset,
  getActiveGroups,
  getBrokenGroups,
  type NormalizedGroupValue,
} from "../group-utils";

describe("Skill Group Utilities", () => {
  // ===========================================================================
  // NORMALIZATION FUNCTIONS
  // ===========================================================================

  describe("normalizeGroupValue", () => {
    it("should convert legacy number format to object format", () => {
      const result = normalizeGroupValue(4);
      expect(result).toEqual({ rating: 4, isBroken: false });
    });

    it("should pass through object format unchanged", () => {
      const input: SkillGroupValue = { rating: 4, isBroken: true };
      const result = normalizeGroupValue(input);
      expect(result).toEqual({ rating: 4, isBroken: true });
    });

    it("should handle zero rating", () => {
      const result = normalizeGroupValue(0);
      expect(result).toEqual({ rating: 0, isBroken: false });
    });

    it("should handle non-broken object format", () => {
      const input: SkillGroupValue = { rating: 3, isBroken: false };
      const result = normalizeGroupValue(input);
      expect(result).toEqual({ rating: 3, isBroken: false });
    });
  });

  describe("getGroupRating", () => {
    it("should extract rating from number format", () => {
      expect(getGroupRating(5)).toBe(5);
      expect(getGroupRating(0)).toBe(0);
      expect(getGroupRating(6)).toBe(6);
    });

    it("should extract rating from object format", () => {
      expect(getGroupRating({ rating: 3, isBroken: false })).toBe(3);
      expect(getGroupRating({ rating: 4, isBroken: true })).toBe(4);
      expect(getGroupRating({ rating: 0, isBroken: false })).toBe(0);
    });
  });

  describe("isGroupBroken", () => {
    it("should return false for number format (legacy is never broken)", () => {
      expect(isGroupBroken(4)).toBe(false);
      expect(isGroupBroken(0)).toBe(false);
    });

    it("should return correct boolean for object format", () => {
      expect(isGroupBroken({ rating: 3, isBroken: true })).toBe(true);
      expect(isGroupBroken({ rating: 3, isBroken: false })).toBe(false);
    });
  });

  describe("createBrokenGroup", () => {
    it("should create broken group from number format", () => {
      const result = createBrokenGroup(4);
      expect(result).toEqual({ rating: 4, isBroken: true });
    });

    it("should create broken group from object format", () => {
      const result = createBrokenGroup({ rating: 3, isBroken: false });
      expect(result).toEqual({ rating: 3, isBroken: true });
    });

    it("should maintain rating when already broken", () => {
      const result = createBrokenGroup({ rating: 5, isBroken: true });
      expect(result).toEqual({ rating: 5, isBroken: true });
    });
  });

  describe("createRestoredGroup", () => {
    it("should create non-broken group with given rating", () => {
      expect(createRestoredGroup(4)).toEqual({ rating: 4, isBroken: false });
      expect(createRestoredGroup(1)).toEqual({ rating: 1, isBroken: false });
      expect(createRestoredGroup(6)).toEqual({ rating: 6, isBroken: false });
    });

    it("should handle zero rating", () => {
      expect(createRestoredGroup(0)).toEqual({ rating: 0, isBroken: false });
    });
  });

  // ===========================================================================
  // KARMA COST CALCULATIONS
  // ===========================================================================

  describe("calculateSkillRaiseKarmaCost", () => {
    it("should return 0 when target is less than or equal to current", () => {
      expect(calculateSkillRaiseKarmaCost(4, 4)).toBe(0);
      expect(calculateSkillRaiseKarmaCost(4, 3)).toBe(0);
      expect(calculateSkillRaiseKarmaCost(4, 0)).toBe(0);
    });

    it("should calculate cost for single rating increase (new rating × 2)", () => {
      // 0 → 1: 1 × 2 = 2
      expect(calculateSkillRaiseKarmaCost(0, 1)).toBe(2);
      // 3 → 4: 4 × 2 = 8
      expect(calculateSkillRaiseKarmaCost(3, 4)).toBe(8);
      // 5 → 6: 6 × 2 = 12
      expect(calculateSkillRaiseKarmaCost(5, 6)).toBe(12);
    });

    it("should calculate cumulative cost for multiple rating increases", () => {
      // 0 → 3: (1×2) + (2×2) + (3×2) = 2 + 4 + 6 = 12
      expect(calculateSkillRaiseKarmaCost(0, 3)).toBe(12);
      // 2 → 5: (3×2) + (4×2) + (5×2) = 6 + 8 + 10 = 24
      expect(calculateSkillRaiseKarmaCost(2, 5)).toBe(24);
      // 0 → 6: (1×2) + (2×2) + (3×2) + (4×2) + (5×2) + (6×2) = 2+4+6+8+10+12 = 42
      expect(calculateSkillRaiseKarmaCost(0, 6)).toBe(42);
    });
  });

  describe("calculateSkillGroupRaiseKarmaCost", () => {
    it("should return 0 when target is less than or equal to current", () => {
      expect(calculateSkillGroupRaiseKarmaCost(4, 4)).toBe(0);
      expect(calculateSkillGroupRaiseKarmaCost(4, 3)).toBe(0);
      expect(calculateSkillGroupRaiseKarmaCost(4, 0)).toBe(0);
    });

    it("should calculate cost for single rating increase (new rating × 5)", () => {
      // 0 → 1: 1 × 5 = 5
      expect(calculateSkillGroupRaiseKarmaCost(0, 1)).toBe(5);
      // 3 → 4: 4 × 5 = 20
      expect(calculateSkillGroupRaiseKarmaCost(3, 4)).toBe(20);
      // 5 → 6: 6 × 5 = 30
      expect(calculateSkillGroupRaiseKarmaCost(5, 6)).toBe(30);
    });

    it("should calculate cumulative cost for multiple rating increases", () => {
      // 0 → 3: (1×5) + (2×5) + (3×5) = 5 + 10 + 15 = 30
      expect(calculateSkillGroupRaiseKarmaCost(0, 3)).toBe(30);
      // 2 → 5: (3×5) + (4×5) + (5×5) = 15 + 20 + 25 = 60
      expect(calculateSkillGroupRaiseKarmaCost(2, 5)).toBe(60);
      // 0 → 6: (1×5) + (2×5) + (3×5) + (4×5) + (5×5) + (6×5) = 5+10+15+20+25+30 = 105
      expect(calculateSkillGroupRaiseKarmaCost(0, 6)).toBe(105);
    });
  });

  describe("SPECIALIZATION_KARMA_COST constant", () => {
    it("should be 7 karma per SR5 rules", () => {
      expect(SPECIALIZATION_KARMA_COST).toBe(7);
    });
  });

  describe("calculateSpecializationKarmaCost", () => {
    it("should multiply count by 7", () => {
      expect(calculateSpecializationKarmaCost(0)).toBe(0);
      expect(calculateSpecializationKarmaCost(1)).toBe(7);
      expect(calculateSpecializationKarmaCost(2)).toBe(14);
      expect(calculateSpecializationKarmaCost(5)).toBe(35);
    });
  });

  // ===========================================================================
  // RESTORATION DETECTION
  // ===========================================================================

  describe("canRestoreGroup", () => {
    it("should return canRestore: true when all members have equal ratings", () => {
      const memberSkillIds = ["skill-a", "skill-b", "skill-c"];
      const skillRatings = { "skill-a": 4, "skill-b": 4, "skill-c": 4 };

      const result = canRestoreGroup(memberSkillIds, skillRatings);
      expect(result).toEqual({ canRestore: true, commonRating: 4 });
    });

    it("should return canRestore: false when members have different ratings", () => {
      const memberSkillIds = ["skill-a", "skill-b", "skill-c"];
      const skillRatings = { "skill-a": 4, "skill-b": 5, "skill-c": 4 };

      const result = canRestoreGroup(memberSkillIds, skillRatings);
      expect(result).toEqual({ canRestore: false });
    });

    it("should return canRestore: false when a member skill is missing", () => {
      const memberSkillIds = ["skill-a", "skill-b", "skill-c"];
      const skillRatings = { "skill-a": 4, "skill-b": 4 }; // skill-c missing

      const result = canRestoreGroup(memberSkillIds, skillRatings);
      expect(result).toEqual({ canRestore: false });
    });

    it("should return canRestore: false when a member skill has rating 0", () => {
      const memberSkillIds = ["skill-a", "skill-b", "skill-c"];
      const skillRatings = { "skill-a": 4, "skill-b": 4, "skill-c": 0 };

      const result = canRestoreGroup(memberSkillIds, skillRatings);
      expect(result).toEqual({ canRestore: false });
    });

    it("should handle empty member list", () => {
      const result = canRestoreGroup([], {});
      // Empty arrays: every() returns true for empty, but no ratings exist
      // ratings array is empty, allExist check passes (every on empty is true)
      // firstRating is undefined, allEqual passes (every on empty is true)
      expect(result).toEqual({ canRestore: true, commonRating: undefined });
    });

    it("should handle single member skill", () => {
      const memberSkillIds = ["skill-a"];
      const skillRatings = { "skill-a": 3 };

      const result = canRestoreGroup(memberSkillIds, skillRatings);
      expect(result).toEqual({ canRestore: true, commonRating: 3 });
    });

    it("should return canRestore: false when skill rating is undefined", () => {
      const memberSkillIds = ["skill-a", "skill-b"];
      const skillRatings: Record<string, number> = { "skill-a": 4 };

      const result = canRestoreGroup(memberSkillIds, skillRatings);
      expect(result).toEqual({ canRestore: false });
    });
  });

  // ===========================================================================
  // BUDGET HELPERS
  // ===========================================================================

  describe("calculateGroupPointsSpent", () => {
    it("should return 0 for empty object", () => {
      expect(calculateGroupPointsSpent({})).toBe(0);
    });

    it("should sum ratings from number format", () => {
      const skillGroups = {
        athletics: 3,
        firearms: 4,
        stealth: 2,
      };
      expect(calculateGroupPointsSpent(skillGroups)).toBe(9);
    });

    it("should sum ratings from object format", () => {
      const skillGroups: Record<string, SkillGroupValue> = {
        athletics: { rating: 3, isBroken: false },
        firearms: { rating: 4, isBroken: false },
      };
      expect(calculateGroupPointsSpent(skillGroups)).toBe(7);
    });

    it("should count broken groups toward the total (points already spent)", () => {
      const skillGroups: Record<string, SkillGroupValue> = {
        athletics: { rating: 3, isBroken: true },
        firearms: { rating: 4, isBroken: false },
      };
      expect(calculateGroupPointsSpent(skillGroups)).toBe(7);
    });

    it("should handle mixed number and object formats", () => {
      const skillGroups: Record<string, SkillGroupValue> = {
        athletics: 3,
        firearms: { rating: 4, isBroken: true },
        stealth: { rating: 2, isBroken: false },
      };
      expect(calculateGroupPointsSpent(skillGroups)).toBe(9);
    });
  });

  describe("getActiveGroups", () => {
    it("should return empty object when all groups are broken", () => {
      const skillGroups: Record<string, SkillGroupValue> = {
        athletics: { rating: 3, isBroken: true },
        firearms: { rating: 4, isBroken: true },
      };
      expect(getActiveGroups(skillGroups)).toEqual({});
    });

    it("should return only non-broken groups", () => {
      const skillGroups: Record<string, SkillGroupValue> = {
        athletics: { rating: 3, isBroken: true },
        firearms: { rating: 4, isBroken: false },
        stealth: { rating: 2, isBroken: false },
      };
      const result = getActiveGroups(skillGroups);
      expect(result).toEqual({
        firearms: { rating: 4, isBroken: false },
        stealth: { rating: 2, isBroken: false },
      });
    });

    it("should normalize number format to object format", () => {
      const skillGroups: Record<string, SkillGroupValue> = {
        athletics: 3,
        firearms: 4,
      };
      const result = getActiveGroups(skillGroups);
      expect(result).toEqual({
        athletics: { rating: 3, isBroken: false },
        firearms: { rating: 4, isBroken: false },
      });
    });

    it("should return empty object for empty input", () => {
      expect(getActiveGroups({})).toEqual({});
    });
  });

  describe("getBrokenGroups", () => {
    it("should return empty object when no groups are broken", () => {
      const skillGroups: Record<string, SkillGroupValue> = {
        athletics: { rating: 3, isBroken: false },
        firearms: 4,
      };
      expect(getBrokenGroups(skillGroups)).toEqual({});
    });

    it("should return only broken groups", () => {
      const skillGroups: Record<string, SkillGroupValue> = {
        athletics: { rating: 3, isBroken: true },
        firearms: { rating: 4, isBroken: false },
        stealth: { rating: 2, isBroken: true },
      };
      const result = getBrokenGroups(skillGroups);
      expect(result).toEqual({
        athletics: { rating: 3, isBroken: true },
        stealth: { rating: 2, isBroken: true },
      });
    });

    it("should not return any groups in number format (they are never broken)", () => {
      const skillGroups: Record<string, SkillGroupValue> = {
        athletics: 3,
        firearms: 4,
      };
      expect(getBrokenGroups(skillGroups)).toEqual({});
    });

    it("should return empty object for empty input", () => {
      expect(getBrokenGroups({})).toEqual({});
    });
  });

  // ===========================================================================
  // BROKEN GROUP SKILL POINT OFFSET
  // ===========================================================================

  describe("calculateBrokenGroupSkillPointOffset", () => {
    const firearmsGroupDef = { id: "firearms", skills: ["automatics", "longarms", "pistols"] };
    const stealthGroupDef = { id: "stealth", skills: ["disguise", "palming", "sneaking"] };

    it("should return 0 when no groups are broken", () => {
      const skillGroups: Record<string, SkillGroupValue> = {
        firearms: { rating: 5, isBroken: false },
      };
      const skills = { automatics: 5, longarms: 5, pistols: 5 };

      expect(calculateBrokenGroupSkillPointOffset(skillGroups, skills, [firearmsGroupDef])).toBe(0);
    });

    it("should return 0 when no skill group definitions provided", () => {
      const skillGroups: Record<string, SkillGroupValue> = {
        firearms: { rating: 5, isBroken: true },
      };
      const skills = { automatics: 5, longarms: 5, pistols: 6 };

      expect(calculateBrokenGroupSkillPointOffset(skillGroups, skills, [])).toBe(0);
    });

    it("should calculate offset for a single broken group", () => {
      // Firearms group at rating 5, broken by raising pistols to 6
      const skillGroups: Record<string, SkillGroupValue> = {
        firearms: { rating: 5, isBroken: true },
      };
      const skills = { automatics: 5, longarms: 5, pistols: 6 };

      // offset = min(5,5) + min(5,5) + min(6,5) = 5 + 5 + 5 = 15
      expect(calculateBrokenGroupSkillPointOffset(skillGroups, skills, [firearmsGroupDef])).toBe(
        15
      );
    });

    it("should calculate offset for multiple broken groups", () => {
      const skillGroups: Record<string, SkillGroupValue> = {
        firearms: { rating: 5, isBroken: true },
        stealth: { rating: 3, isBroken: true },
      };
      const skills = {
        automatics: 5,
        longarms: 5,
        pistols: 6,
        disguise: 3,
        palming: 4,
        sneaking: 3,
      };

      // firearms offset = min(5,5) + min(5,5) + min(6,5) = 15
      // stealth offset = min(3,3) + min(4,3) + min(3,3) = 3 + 3 + 3 = 9
      expect(
        calculateBrokenGroupSkillPointOffset(skillGroups, skills, [
          firearmsGroupDef,
          stealthGroupDef,
        ])
      ).toBe(24);
    });

    it("should handle member skills missing from individual skills map", () => {
      const skillGroups: Record<string, SkillGroupValue> = {
        firearms: { rating: 5, isBroken: true },
      };
      // Only pistols is in skills - automatics and longarms are missing
      const skills = { pistols: 6 };

      // offset = min(6,5) = 5 (automatics and longarms are skipped)
      expect(calculateBrokenGroupSkillPointOffset(skillGroups, skills, [firearmsGroupDef])).toBe(5);
    });

    it("should ignore non-broken groups", () => {
      const skillGroups: Record<string, SkillGroupValue> = {
        firearms: { rating: 5, isBroken: false },
        stealth: { rating: 3, isBroken: true },
      };
      const skills = {
        automatics: 5,
        longarms: 5,
        pistols: 5,
        disguise: 3,
        palming: 4,
        sneaking: 3,
      };

      // Only stealth is broken: min(3,3) + min(4,3) + min(3,3) = 9
      expect(
        calculateBrokenGroupSkillPointOffset(skillGroups, skills, [
          firearmsGroupDef,
          stealthGroupDef,
        ])
      ).toBe(9);
    });

    it("should handle group not found in definitions", () => {
      const skillGroups: Record<string, SkillGroupValue> = {
        "unknown-group": { rating: 5, isBroken: true },
      };
      const skills = { "skill-a": 5 };

      expect(calculateBrokenGroupSkillPointOffset(skillGroups, skills, [firearmsGroupDef])).toBe(0);
    });

    it("should handle empty inputs", () => {
      expect(calculateBrokenGroupSkillPointOffset({}, {}, [])).toBe(0);
      expect(calculateBrokenGroupSkillPointOffset({}, {}, [firearmsGroupDef])).toBe(0);
      expect(calculateBrokenGroupSkillPointOffset({}, { pistols: 5 }, [firearmsGroupDef])).toBe(0);
    });

    it("should handle member skill with rating 0", () => {
      const skillGroups: Record<string, SkillGroupValue> = {
        firearms: { rating: 5, isBroken: true },
      };
      const skills = { automatics: 0, longarms: 5, pistols: 6 };

      // offset = 0 (automatics skipped) + min(5,5) + min(6,5) = 0 + 5 + 5 = 10
      expect(calculateBrokenGroupSkillPointOffset(skillGroups, skills, [firearmsGroupDef])).toBe(
        10
      );
    });

    it("should handle broken group with rating 0", () => {
      const skillGroups: Record<string, SkillGroupValue> = {
        firearms: { rating: 0, isBroken: true },
      };
      const skills = { automatics: 1, longarms: 1, pistols: 2 };

      // Group rating is 0, so early continue - offset = 0
      expect(calculateBrokenGroupSkillPointOffset(skillGroups, skills, [firearmsGroupDef])).toBe(0);
    });
  });
});
