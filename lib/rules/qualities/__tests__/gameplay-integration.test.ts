/**
 * Tests for quality gameplay integration
 *
 * Tests dice pool modifiers, wound modifiers, limit modifiers,
 * lifestyle costs, healing modifiers, and attribute modifiers.
 */

import { describe, it, expect, beforeEach } from "vitest";
import type { Character, Quality, MergedRuleset } from "@/lib/types";
import {
  calculateWoundModifier,
  calculateSkillDicePool,
  calculateLimit,
  calculateLifestyleCost,
  calculateHealingDicePool,
  calculateAttributeValue,
  calculateAttributeMaximum,
} from "../gameplay-integration";
import { createMockMergedRuleset } from "@/__tests__/mocks/rulesets";
import { createMockCharacter } from "@/__tests__/mocks/storage";

describe("Quality Gameplay Integration", () => {
  let ruleset: MergedRuleset;
  let character: Character;

  beforeEach(() => {
    ruleset = createMockMergedRuleset({
      modules: {
        ...createMockMergedRuleset().modules,
        qualities: {
          positive: [],
          negative: [],
        },
      },
    });
    character = createMockCharacter({
      attributes: {
        agility: 4,
        strength: 3,
        body: 3,
        reaction: 3,
        logic: 3,
        intuition: 3,
        willpower: 3,
        charisma: 3,
      },
      skills: {
        firearms: 4,
      },
      condition: {
        physicalDamage: 0,
        stunDamage: 0,
      },
    });
  });

  describe("calculateWoundModifier", () => {
    it("should calculate base wound modifier", () => {
      const characterWithDamage = createMockCharacter({
        condition: {
          physicalDamage: 6,
          stunDamage: 0,
        },
      });

      const modifier = calculateWoundModifier(characterWithDamage, ruleset, "physical");
      // 6 damage / 3 interval = -2 modifier
      expect(modifier).toBe(-2);
    });

    it("should apply High Pain Tolerance (boxes ignored)", () => {
      const quality: Quality = {
        id: "high-pain-tolerance",
        name: "High Pain Tolerance",
        type: "positive",
        karmaCost: 5,
        summary: "Ignore wound boxes",
        effects: [
          {
            id: "ignore-boxes",
            type: "wound-modifier",
            trigger: "damage-taken",
            target: { stat: "wound-boxes-ignored" },
            value: 2,
          },
        ],
      };

      const rulesetWithQuality = createMockMergedRuleset({
        modules: {
          ...createMockMergedRuleset().modules,
          qualities: {
            positive: [quality],
            negative: [],
          },
        },
      });

      const characterWithQuality = createMockCharacter({
        positiveQualities: [
          {
            qualityId: "high-pain-tolerance",
            source: "creation",
          },
        ],
        condition: {
          physicalDamage: 6,
          stunDamage: 0,
        },
      });

      const modifier = calculateWoundModifier(characterWithQuality, rulesetWithQuality, "physical");
      // 6 damage - 2 ignored = 4 effective damage / 3 interval = -1 modifier
      expect(modifier).toBe(-1);
    });

    it("should handle stun damage track", () => {
      const characterWithStun = createMockCharacter({
        condition: {
          physicalDamage: 0,
          stunDamage: 9,
        },
      });

      const modifier = calculateWoundModifier(characterWithStun, ruleset, "stun");
      // 9 damage / 3 interval = -3 modifier
      expect(modifier).toBe(-3);
    });
  });

  describe("calculateSkillDicePool", () => {
    it("should calculate base dice pool", () => {
      const pool = calculateSkillDicePool(character, ruleset, "firearms", "agility", 4);
      // 4 agility + 4 skill = 8 dice
      expect(pool).toBe(8);
    });

    it("should apply dice pool modifiers from qualities", () => {
      const quality: Quality = {
        id: "catlike",
        name: "Catlike",
        type: "positive",
        karmaCost: 5,
        summary: "Bonus to Stealth",
        effects: [
          {
            id: "stealth-bonus",
            type: "dice-pool-modifier",
            trigger: "skill-test",
            target: { skill: "stealth" },
            value: 2,
          },
        ],
      };

      const rulesetWithQuality = createMockMergedRuleset({
        modules: {
          ...createMockMergedRuleset().modules,
          qualities: {
            positive: [quality],
            negative: [],
          },
        },
      });

      const characterWithQuality = createMockCharacter({
        ...character,
        positiveQualities: [
          {
            qualityId: "catlike",
            source: "creation",
          },
        ],
        skills: {
          stealth: 3,
        },
      });

      const pool = calculateSkillDicePool(
        characterWithQuality,
        rulesetWithQuality,
        "stealth",
        "agility",
        3
      );
      // 4 agility + 3 skill + 2 quality = 9 dice
      expect(pool).toBe(9);
    });

    it("should not apply modifiers to wrong skill", () => {
      const quality: Quality = {
        id: "catlike",
        name: "Catlike",
        type: "positive",
        karmaCost: 5,
        summary: "Bonus to Stealth",
        effects: [
          {
            id: "stealth-bonus",
            type: "dice-pool-modifier",
            trigger: "skill-test",
            target: { skill: "stealth" },
            value: 2,
          },
        ],
      };

      const rulesetWithQuality = createMockMergedRuleset({
        modules: {
          ...createMockMergedRuleset().modules,
          qualities: {
            positive: [quality],
            negative: [],
          },
        },
      });

      const characterWithQuality = createMockCharacter({
        ...character,
        positiveQualities: [
          {
            qualityId: "catlike",
            source: "creation",
          },
        ],
      });

      const pool = calculateSkillDicePool(
        characterWithQuality,
        rulesetWithQuality,
        "firearms",
        "agility",
        4
      );
      // 4 agility + 4 skill = 8 dice (no bonus for firearms)
      expect(pool).toBe(8);
    });

    it("should ensure pool does not go below 0", () => {
      const quality: Quality = {
        id: "penalty-quality",
        name: "Penalty Quality",
        type: "negative",
        karmaBonus: 5,
        summary: "Large penalty",
        effects: [
          {
            id: "large-penalty",
            type: "dice-pool-modifier",
            trigger: "skill-test",
            target: {},
            value: -20,
          },
        ],
      };

      const rulesetWithQuality = createMockMergedRuleset({
        modules: {
          ...createMockMergedRuleset().modules,
          qualities: {
            positive: [],
            negative: [quality],
          },
        },
      });

      const characterWithQuality = createMockCharacter({
        ...character,
        negativeQualities: [
          {
            qualityId: "penalty-quality",
            source: "creation",
          },
        ],
      });

      const pool = calculateSkillDicePool(
        characterWithQuality,
        rulesetWithQuality,
        "firearms",
        "agility",
        4
      );
      // Should be clamped to 0, not negative
      expect(pool).toBe(0);
    });
  });

  describe("calculateLimit", () => {
    it("should calculate physical limit", () => {
      const characterWithAttrs = createMockCharacter({
        attributes: {
          strength: 4,
          body: 3,
          reaction: 3,
        },
      });

      const limit = calculateLimit(characterWithAttrs, ruleset, "physical");
      // (4*2 + 3 + 3) / 3 = 14/3 = 4.67 -> 5
      expect(limit).toBe(5);
    });

    it("should calculate mental limit", () => {
      const characterWithAttrs = createMockCharacter({
        attributes: {
          logic: 4,
          intuition: 3,
          willpower: 3,
        },
      });

      const limit = calculateLimit(characterWithAttrs, ruleset, "mental");
      // (4*2 + 3 + 3) / 3 = 14/3 = 4.67 -> 5
      expect(limit).toBe(5);
    });

    it("should apply limit modifiers from qualities", () => {
      const quality: Quality = {
        id: "indomitable",
        name: "Indomitable",
        type: "positive",
        karmaCost: 5,
        summary: "Bonus to Physical limit",
        effects: [
          {
            id: "physical-limit-bonus",
            type: "limit-modifier",
            trigger: "always",
            target: { limit: "physical" },
            value: 1,
          },
        ],
      };

      const rulesetWithQuality = createMockMergedRuleset({
        modules: {
          ...createMockMergedRuleset().modules,
          qualities: {
            positive: [quality],
            negative: [],
          },
        },
      });

      const characterWithQuality = createMockCharacter({
        attributes: {
          strength: 4,
          body: 3,
          reaction: 3,
        },
        positiveQualities: [
          {
            qualityId: "indomitable",
            source: "creation",
          },
        ],
      });

      const limit = calculateLimit(characterWithQuality, rulesetWithQuality, "physical");
      // Base 5 + 1 modifier = 6
      expect(limit).toBe(6);
    });

    it("should ensure limit does not go below 1", () => {
      const quality: Quality = {
        id: "limit-penalty",
        name: "Limit Penalty",
        type: "negative",
        karmaBonus: 5,
        summary: "Large limit penalty",
        effects: [
          {
            id: "large-penalty",
            type: "limit-modifier",
            trigger: "always",
            target: { limit: "physical" },
            value: -10,
          },
        ],
      };

      const rulesetWithQuality = createMockMergedRuleset({
        modules: {
          ...createMockMergedRuleset().modules,
          qualities: {
            positive: [],
            negative: [quality],
          },
        },
      });

      const characterWithQuality = createMockCharacter({
        attributes: {
          strength: 1,
          body: 1,
          reaction: 1,
        },
        negativeQualities: [
          {
            qualityId: "limit-penalty",
            source: "creation",
          },
        ],
      });

      const limit = calculateLimit(characterWithQuality, rulesetWithQuality, "physical");
      // Should be clamped to 1, not 0 or negative
      expect(limit).toBe(1);
    });
  });

  describe("calculateLifestyleCost", () => {
    it("should calculate base lifestyle cost", () => {
      const cost = calculateLifestyleCost(character, ruleset, 1000);
      expect(cost).toBe(1000);
    });

    it("should apply dependents modifiers", () => {
      const characterWithDependent = createMockCharacter({
        negativeQualities: [
          {
            qualityId: "dependents",
            source: "creation",
            rating: 2,
            specification: "Child",
            dynamicState: {
              type: "dependent",
              state: {
                name: "Child",
                relationship: "child",
                tier: 2,
                currentStatus: "safe",
                lastCheckedIn: new Date().toISOString(),
                lifestyleCostModifier: 20, // +20%
                timeCommitmentHours: 10,
              },
            },
          },
        ],
      });

      const cost = calculateLifestyleCost(characterWithDependent, ruleset, 1000);
      // 1000 * 1.2 = 1200
      expect(cost).toBe(1200);
    });
  });

  describe("calculateHealingDicePool", () => {
    it("should calculate base healing pool", () => {
      const pool = calculateHealingDicePool(character, ruleset, "first-aid", false, 6);
      expect(pool).toBe(6);
    });

    it("should apply healing modifiers", () => {
      const quality: Quality = {
        id: "quick-healer",
        name: "Quick Healer",
        type: "positive",
        karmaCost: 5,
        summary: "Bonus to healing",
        effects: [
          {
            id: "healing-bonus",
            type: "healing-modifier",
            trigger: "healing",
            target: { affectsOthers: false },
            value: 2,
          },
        ],
      };

      const rulesetWithQuality = createMockMergedRuleset({
        modules: {
          ...createMockMergedRuleset().modules,
          qualities: {
            positive: [quality],
            negative: [],
          },
        },
      });

      const characterWithQuality = createMockCharacter({
        ...character,
        positiveQualities: [
          {
            qualityId: "quick-healer",
            source: "creation",
          },
        ],
      });

      const pool = calculateHealingDicePool(
        characterWithQuality,
        rulesetWithQuality,
        "first-aid",
        true, // healing self
        6
      );
      // 6 base + 2 quality = 8
      expect(pool).toBe(8);
    });
  });

  describe("calculateAttributeValue", () => {
    it("should calculate base attribute value", () => {
      const value = calculateAttributeValue(character, ruleset, "agility");
      expect(value).toBe(4);
    });

    it("should apply attribute modifiers", () => {
      const quality: Quality = {
        id: "attribute-bonus",
        name: "Attribute Bonus",
        type: "positive",
        karmaCost: 5,
        summary: "Bonus to Agility",
        effects: [
          {
            id: "agility-bonus",
            type: "attribute-modifier",
            trigger: "always",
            target: { attribute: "agility" },
            value: 1,
          },
        ],
      };

      const rulesetWithQuality = createMockMergedRuleset({
        modules: {
          ...createMockMergedRuleset().modules,
          qualities: {
            positive: [quality],
            negative: [],
          },
        },
      });

      const characterWithQuality = createMockCharacter({
        ...character,
        positiveQualities: [
          {
            qualityId: "attribute-bonus",
            source: "creation",
          },
        ],
      });

      const value = calculateAttributeValue(characterWithQuality, rulesetWithQuality, "agility");
      // 4 base + 1 modifier = 5
      expect(value).toBe(5);
    });
  });

  describe("calculateAttributeMaximum", () => {
    it("should calculate base attribute maximum", () => {
      const max = calculateAttributeMaximum(character, ruleset, "agility", 6);
      expect(max).toBe(6);
    });

    it("should apply attribute maximum modifiers", () => {
      const quality: Quality = {
        id: "attribute-max-bonus",
        name: "Attribute Max Bonus",
        type: "positive",
        karmaCost: 5,
        summary: "Increases Agility maximum",
        effects: [
          {
            id: "agility-max-bonus",
            type: "attribute-maximum",
            trigger: "always",
            target: { attribute: "agility" },
            value: 1,
          },
        ],
      };

      const rulesetWithQuality = createMockMergedRuleset({
        modules: {
          ...createMockMergedRuleset().modules,
          qualities: {
            positive: [quality],
            negative: [],
          },
        },
      });

      const characterWithQuality = createMockCharacter({
        ...character,
        positiveQualities: [
          {
            qualityId: "attribute-max-bonus",
            source: "creation",
          },
        ],
      });

      const max = calculateAttributeMaximum(characterWithQuality, rulesetWithQuality, "agility", 6);
      // 6 base + 1 modifier = 7
      expect(max).toBe(7);
    });
  });
});
