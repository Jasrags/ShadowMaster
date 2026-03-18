/**
 * Tests for contact NPC building table (Run Faster p. 180)
 *
 * Connection Rating determines attribute points, skill points,
 * special attribute points, and nuyen for building contact NPCs.
 */

import { describe, it, expect } from "vitest";
import {
  getNpcBuildTable,
  getNpcBuildEntry,
  generateContactStatBlock,
  type NpcBuildEntry,
  type ContactStatBlock,
} from "../contact-npc";

// =============================================================================
// NPC BUILD TABLE
// =============================================================================

describe("getNpcBuildTable", () => {
  it("should return 12 entries (Connection 1-12)", () => {
    const table = getNpcBuildTable();
    expect(table).toHaveLength(12);
  });

  it("should have entries for every Connection rating 1-12", () => {
    const table = getNpcBuildTable();
    for (let i = 1; i <= 12; i++) {
      expect(table.find((e) => e.connectionRating === i)).toBeDefined();
    }
  });

  it("should have increasing skill points as Connection rises", () => {
    const table = getNpcBuildTable();
    // Skill points should generally increase (not strictly monotonic but trending up)
    expect(table[0].totalSkillPoints).toBeLessThan(table[11].totalSkillPoints);
  });
});

describe("getNpcBuildEntry", () => {
  it("should return correct values for Connection 1", () => {
    const entry = getNpcBuildEntry(1);
    expect(entry).toBeDefined();
    expect(entry!.bonusAttributePoints).toBe(0);
    expect(entry!.totalSkillPoints).toBe(14);
    expect(entry!.specialAttributePoints).toBe(0);
    expect(entry!.nuyen).toBe(6000);
  });

  it("should return correct values for Connection 6", () => {
    const entry = getNpcBuildEntry(6);
    expect(entry).toBeDefined();
    expect(entry!.bonusAttributePoints).toBe(3);
    expect(entry!.totalSkillPoints).toBe(30);
    expect(entry!.specialAttributePoints).toBe(5);
    expect(entry!.nuyen).toBe(250000);
  });

  it("should return correct values for Connection 12", () => {
    const entry = getNpcBuildEntry(12);
    expect(entry).toBeDefined();
    expect(entry!.bonusAttributePoints).toBe(3);
    expect(entry!.totalSkillPoints).toBe(46);
    expect(entry!.specialAttributePoints).toBe(10);
    expect(entry!.nuyen).toBe(500000);
  });

  it("should return undefined for Connection 0", () => {
    expect(getNpcBuildEntry(0)).toBeUndefined();
  });

  it("should return undefined for Connection 13", () => {
    expect(getNpcBuildEntry(13)).toBeUndefined();
  });

  it("should return undefined for non-integer", () => {
    expect(getNpcBuildEntry(2.5)).toBeUndefined();
  });
});

// =============================================================================
// STAT BLOCK GENERATION
// =============================================================================

describe("generateContactStatBlock", () => {
  it("should generate stat block with correct build points", () => {
    const block = generateContactStatBlock(4);
    expect(block.connectionRating).toBe(4);
    expect(block.bonusAttributePoints).toBe(2);
    expect(block.totalSkillPoints).toBe(26);
    expect(block.specialAttributePoints).toBe(4);
    expect(block.nuyen).toBe(175000);
  });

  it("should include base metatype attributes for human", () => {
    const block = generateContactStatBlock(1);
    // Human base attributes are all 3 (average for all 8 physical/mental attributes)
    expect(block.baseAttributes.body).toBe(3);
    expect(block.baseAttributes.agility).toBe(3);
    expect(block.baseAttributes.reaction).toBe(3);
    expect(block.baseAttributes.strength).toBe(3);
    expect(block.baseAttributes.charisma).toBe(3);
    expect(block.baseAttributes.intuition).toBe(3);
    expect(block.baseAttributes.logic).toBe(3);
    expect(block.baseAttributes.willpower).toBe(3);
  });

  it("should calculate derived stats", () => {
    const block = generateContactStatBlock(3);
    // Initiative = Reaction + Intuition
    expect(block.derived.initiative).toBe(
      block.baseAttributes.reaction + block.baseAttributes.intuition
    );
    // Composure = Charisma + Willpower
    expect(block.derived.composure).toBe(
      block.baseAttributes.charisma + block.baseAttributes.willpower
    );
  });

  it("should throw for invalid Connection rating", () => {
    expect(() => generateContactStatBlock(0)).toThrow("Connection rating");
    expect(() => generateContactStatBlock(13)).toThrow("Connection rating");
  });
});
