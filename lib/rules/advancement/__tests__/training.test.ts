/**
 * Tests for training time calculations and modifiers
 *
 * Tests training time calculations for all advancement types,
 * instructor bonuses, quality modifiers, and combined modifiers.
 */

import { describe, it, expect } from "vitest";
import type { AdvancementType } from "@/lib/types";
import {
  calculateAttributeTrainingTime,
  calculateActiveSkillTrainingTime,
  calculateKnowledgeSkillTrainingTime,
  calculateSkillGroupTrainingTime,
  calculateSpecializationTrainingTime,
  applyInstructorBonus,
  applyTimeModifier,
  calculateFinalTrainingTime,
  calculateAdvancementTrainingTime,
} from "../training";

describe("Training Time Calculations", () => {
  describe("calculateAttributeTrainingTime", () => {
    it("should calculate time as new rating × 1 week (7 days)", () => {
      expect(calculateAttributeTrainingTime(1)).toBe(7);
      expect(calculateAttributeTrainingTime(2)).toBe(14);
      expect(calculateAttributeTrainingTime(3)).toBe(21);
      expect(calculateAttributeTrainingTime(4)).toBe(28);
      expect(calculateAttributeTrainingTime(5)).toBe(35);
      expect(calculateAttributeTrainingTime(6)).toBe(42);
    });

    it("should throw error for invalid rating", () => {
      expect(() => calculateAttributeTrainingTime(0)).toThrow(
        "Attribute rating must be at least 1"
      );
      expect(() => calculateAttributeTrainingTime(-1)).toThrow(
        "Attribute rating must be at least 1"
      );
    });
  });

  describe("calculateActiveSkillTrainingTime", () => {
    it("should calculate time for ratings 1-4 as new rating × 1 day", () => {
      expect(calculateActiveSkillTrainingTime(1)).toBe(1);
      expect(calculateActiveSkillTrainingTime(2)).toBe(2);
      expect(calculateActiveSkillTrainingTime(3)).toBe(3);
      expect(calculateActiveSkillTrainingTime(4)).toBe(4);
    });

    it("should calculate time for ratings 5-8 as new rating × 1 week (7 days)", () => {
      expect(calculateActiveSkillTrainingTime(5)).toBe(35); // 5 × 7
      expect(calculateActiveSkillTrainingTime(6)).toBe(42); // 6 × 7
      expect(calculateActiveSkillTrainingTime(7)).toBe(49); // 7 × 7
      expect(calculateActiveSkillTrainingTime(8)).toBe(56); // 8 × 7
    });

    it("should calculate time for ratings 9-13 as new rating × 2 weeks (14 days)", () => {
      expect(calculateActiveSkillTrainingTime(9)).toBe(126); // 9 × 14
      expect(calculateActiveSkillTrainingTime(10)).toBe(140); // 10 × 14
      expect(calculateActiveSkillTrainingTime(11)).toBe(154); // 11 × 14
      expect(calculateActiveSkillTrainingTime(12)).toBe(168); // 12 × 14
      expect(calculateActiveSkillTrainingTime(13)).toBe(182); // 13 × 14
    });

    it("should throw error for invalid rating", () => {
      expect(() => calculateActiveSkillTrainingTime(0)).toThrow("Skill rating must be at least 1");
      expect(() => calculateActiveSkillTrainingTime(-1)).toThrow("Skill rating must be at least 1");
    });
  });

  describe("calculateKnowledgeSkillTrainingTime", () => {
    it("should use same formula as active skills", () => {
      expect(calculateKnowledgeSkillTrainingTime(1)).toBe(1);
      expect(calculateKnowledgeSkillTrainingTime(4)).toBe(4);
      expect(calculateKnowledgeSkillTrainingTime(5)).toBe(35);
      expect(calculateKnowledgeSkillTrainingTime(8)).toBe(56);
      expect(calculateKnowledgeSkillTrainingTime(9)).toBe(126);
    });
  });

  describe("calculateSkillGroupTrainingTime", () => {
    it("should calculate time as new rating × 2 weeks (14 days)", () => {
      expect(calculateSkillGroupTrainingTime(1)).toBe(14);
      expect(calculateSkillGroupTrainingTime(2)).toBe(28);
      expect(calculateSkillGroupTrainingTime(3)).toBe(42);
      expect(calculateSkillGroupTrainingTime(4)).toBe(56);
      expect(calculateSkillGroupTrainingTime(5)).toBe(70);
      expect(calculateSkillGroupTrainingTime(6)).toBe(84);
    });

    it("should throw error for invalid rating", () => {
      expect(() => calculateSkillGroupTrainingTime(0)).toThrow(
        "Skill group rating must be at least 1"
      );
      expect(() => calculateSkillGroupTrainingTime(-1)).toThrow(
        "Skill group rating must be at least 1"
      );
    });
  });

  describe("calculateSpecializationTrainingTime", () => {
    it("should return fixed time of 1 month (30 days)", () => {
      expect(calculateSpecializationTrainingTime()).toBe(30);
    });
  });

  describe("applyInstructorBonus", () => {
    it("should reduce time by 25% and round down", () => {
      expect(applyInstructorBonus(100)).toBe(75); // 100 * 0.75 = 75
      expect(applyInstructorBonus(10)).toBe(7); // 10 * 0.75 = 7.5, round down = 7
      expect(applyInstructorBonus(7)).toBe(5); // 7 * 0.75 = 5.25, round down = 5
      expect(applyInstructorBonus(4)).toBe(3); // 4 * 0.75 = 3
      expect(applyInstructorBonus(1)).toBe(0); // 1 * 0.75 = 0.75, round down = 0
    });

    it("should handle zero or negative time", () => {
      expect(applyInstructorBonus(0)).toBe(0);
      expect(applyInstructorBonus(-1)).toBe(-1);
    });
  });

  describe("applyTimeModifier", () => {
    it("should apply positive percentage modifier (increase time)", () => {
      expect(applyTimeModifier(100, 50)).toBe(150); // 100 * 1.5 = 150
      expect(applyTimeModifier(10, 25)).toBe(13); // 10 * 1.25 = 12.5, round = 13
      expect(applyTimeModifier(7, 100)).toBe(14); // 7 * 2.0 = 14
    });

    it("should apply negative percentage modifier (decrease time)", () => {
      expect(applyTimeModifier(100, -25)).toBe(75); // 100 * 0.75 = 75
      expect(applyTimeModifier(10, -50)).toBe(5); // 10 * 0.5 = 5
    });

    it("should round to nearest day", () => {
      expect(applyTimeModifier(10, 33)).toBe(13); // 10 * 1.33 = 13.3, round = 13
      expect(applyTimeModifier(7, 14)).toBe(8); // 7 * 1.14 = 7.98, round = 8
    });

    it("should handle zero or negative time", () => {
      expect(applyTimeModifier(0, 50)).toBe(0);
      expect(applyTimeModifier(-1, 50)).toBe(-1);
    });
  });

  describe("calculateFinalTrainingTime", () => {
    it("should return base time when no modifiers", () => {
      expect(calculateFinalTrainingTime(100)).toBe(100);
      expect(calculateFinalTrainingTime(7)).toBe(7);
    });

    it("should apply instructor bonus only", () => {
      expect(calculateFinalTrainingTime(100, { instructorBonus: true })).toBe(75);
      expect(calculateFinalTrainingTime(10, { instructorBonus: true })).toBe(7);
    });

    it("should apply time modifier only", () => {
      expect(calculateFinalTrainingTime(100, { timeModifier: 50 })).toBe(150);
      expect(calculateFinalTrainingTime(10, { timeModifier: -25 })).toBe(8);
    });

    it("should apply instructor bonus first, then time modifier", () => {
      // Base: 100 days
      // Instructor bonus: 100 * 0.75 = 75 (round down)
      // Time modifier +50%: 75 * 1.5 = 112.5, round = 113
      expect(calculateFinalTrainingTime(100, { instructorBonus: true, timeModifier: 50 })).toBe(
        113
      );

      // Base: 10 days
      // Instructor bonus: 10 * 0.75 = 7 (round down)
      // Time modifier +50%: 7 * 1.5 = 10.5, round = 11
      expect(calculateFinalTrainingTime(10, { instructorBonus: true, timeModifier: 50 })).toBe(11);
    });

    it("should enforce minimum of 1 day", () => {
      expect(calculateFinalTrainingTime(1, { instructorBonus: true })).toBe(1); // 1 * 0.75 = 0.75, but min is 1
      expect(calculateFinalTrainingTime(2, { instructorBonus: true, timeModifier: -90 })).toBe(1); // Would be < 1, but min is 1
    });
  });

  describe("calculateAdvancementTrainingTime", () => {
    it("should calculate attribute training time", () => {
      expect(calculateAdvancementTrainingTime("attribute", 3)).toBe(21);
      expect(calculateAdvancementTrainingTime("attribute", 5)).toBe(35);
    });

    it("should calculate skill training time", () => {
      expect(calculateAdvancementTrainingTime("skill", 3)).toBe(3);
      expect(calculateAdvancementTrainingTime("skill", 5)).toBe(35);
      expect(calculateAdvancementTrainingTime("skill", 9)).toBe(126);
    });

    it("should calculate skill group training time", () => {
      expect(calculateAdvancementTrainingTime("skillGroup", 2)).toBe(28);
      expect(calculateAdvancementTrainingTime("skillGroup", 4)).toBe(56);
    });

    it("should calculate knowledge skill training time", () => {
      expect(calculateAdvancementTrainingTime("knowledgeSkill", 3)).toBe(3);
      expect(calculateAdvancementTrainingTime("knowledgeSkill", 5)).toBe(35);
    });

    it("should calculate language skill training time", () => {
      expect(calculateAdvancementTrainingTime("languageSkill", 2)).toBe(2);
      expect(calculateAdvancementTrainingTime("languageSkill", 4)).toBe(4);
    });

    it("should calculate specialization training time", () => {
      expect(calculateAdvancementTrainingTime("specialization")).toBe(30);
    });

    it("should return 0 for edge (no downtime)", () => {
      expect(calculateAdvancementTrainingTime("edge", 3)).toBe(0);
    });

    it("should return 0 for quality (instant)", () => {
      expect(calculateAdvancementTrainingTime("quality")).toBe(0);
    });

    it("should apply instructor bonus", () => {
      // Attribute rating 4: 4 * 7 = 28 days
      // With instructor: 28 * 0.75 = 21 days
      expect(calculateAdvancementTrainingTime("attribute", 4, { instructorBonus: true })).toBe(21);

      // Skill rating 5: 5 * 7 = 35 days
      // With instructor: 35 * 0.75 = 26 days (round down)
      expect(calculateAdvancementTrainingTime("skill", 5, { instructorBonus: true })).toBe(26);
    });

    it("should apply time modifier", () => {
      // Attribute rating 4: 4 * 7 = 28 days
      // With +50% modifier: 28 * 1.5 = 42 days
      expect(calculateAdvancementTrainingTime("attribute", 4, { timeModifier: 50 })).toBe(42);
    });

    it("should apply both instructor bonus and time modifier", () => {
      // Attribute rating 4: 4 * 7 = 28 days
      // Instructor bonus: 28 * 0.75 = 21 days
      // +50% modifier: 21 * 1.5 = 31.5, round = 32 days
      expect(
        calculateAdvancementTrainingTime("attribute", 4, {
          instructorBonus: true,
          timeModifier: 50,
        })
      ).toBe(32);
    });

    it("should throw error when rating required but not provided", () => {
      expect(() => calculateAdvancementTrainingTime("attribute")).toThrow(
        "Rating required for attribute training time"
      );
      expect(() => calculateAdvancementTrainingTime("skill")).toThrow(
        "Rating required for skill training time"
      );
      expect(() => calculateAdvancementTrainingTime("skillGroup")).toThrow(
        "Rating required for skill group training time"
      );
    });

    it("should throw error for unsupported advancement types", () => {
      expect(() => calculateAdvancementTrainingTime("spell" as AdvancementType)).toThrow(
        "Spell/ritual training time calculation not yet implemented"
      );
      expect(() => calculateAdvancementTrainingTime("complexForm" as AdvancementType)).toThrow(
        "Complex form training time calculation not yet implemented"
      );
      expect(() => calculateAdvancementTrainingTime("focus" as AdvancementType)).toThrow(
        "Focus bonding training time calculation not yet implemented"
      );
      expect(() => calculateAdvancementTrainingTime("initiation" as AdvancementType)).toThrow(
        "Initiation training time calculation not yet implemented"
      );
      // Test with invalid type - need to cast to bypass type checking for this test
      expect(() => calculateAdvancementTrainingTime("unknown" as AdvancementType)).toThrow(
        "Unknown advancement type: unknown"
      );
    });
  });
});
