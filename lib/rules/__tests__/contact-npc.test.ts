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
  getMetatypeBaseAttributes,
  type NpcBuildEntry,
  type ContactStatBlock,
  type NpcMetatype,
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

  it("should calculate derived stats with concrete values", () => {
    const block = generateContactStatBlock(3);
    // All base attributes are 3 (human average)
    expect(block.derived.initiative).toBe(6); // REA 3 + INT 3
    expect(block.derived.composure).toBe(6); // CHA 3 + WIL 3
    expect(block.derived.judgeIntentions).toBe(6); // CHA 3 + INT 3 (SR5 p. 152)
    expect(block.derived.physicalConditionMonitor).toBe(10); // ceil(3/2) + 8
    expect(block.derived.stunConditionMonitor).toBe(10); // ceil(3/2) + 8
  });

  it("should throw for out-of-range Connection rating", () => {
    expect(() => generateContactStatBlock(0)).toThrow("Connection rating");
    expect(() => generateContactStatBlock(13)).toThrow("Connection rating");
    expect(() => generateContactStatBlock(-1)).toThrow("Connection rating");
  });

  it("should throw for non-integer Connection rating", () => {
    expect(() => generateContactStatBlock(2.5)).toThrow("Connection rating");
    expect(() => generateContactStatBlock(NaN)).toThrow("Connection rating");
  });

  it("should default to human metatype", () => {
    const block = generateContactStatBlock(4);
    expect(block.metatype).toBe("human");
  });

  it("should include metatype in stat block", () => {
    const block = generateContactStatBlock(4, "ork");
    expect(block.metatype).toBe("ork");
  });
});

// =============================================================================
// METATYPE BASE ATTRIBUTES
// =============================================================================

describe("getMetatypeBaseAttributes", () => {
  it("returns human average attributes (all 3s)", () => {
    const attrs = getMetatypeBaseAttributes("human");
    expect(attrs.body).toBe(3);
    expect(attrs.agility).toBe(3);
    expect(attrs.reaction).toBe(3);
    expect(attrs.strength).toBe(3);
    expect(attrs.charisma).toBe(3);
    expect(attrs.intuition).toBe(3);
    expect(attrs.logic).toBe(3);
    expect(attrs.willpower).toBe(3);
  });

  it("returns elf racial minimums (AGI 2, CHA 3, rest 1)", () => {
    const attrs = getMetatypeBaseAttributes("elf");
    expect(attrs.agility).toBe(2);
    expect(attrs.charisma).toBe(3);
    expect(attrs.body).toBe(1);
    expect(attrs.strength).toBe(1);
  });

  it("returns dwarf racial minimums (BOD 3, STR 3, WIL 2)", () => {
    const attrs = getMetatypeBaseAttributes("dwarf");
    expect(attrs.body).toBe(3);
    expect(attrs.strength).toBe(3);
    expect(attrs.willpower).toBe(2);
    expect(attrs.agility).toBe(1);
  });

  it("returns ork racial minimums (BOD 4, STR 3)", () => {
    const attrs = getMetatypeBaseAttributes("ork");
    expect(attrs.body).toBe(4);
    expect(attrs.strength).toBe(3);
    expect(attrs.agility).toBe(1);
    expect(attrs.charisma).toBe(1);
  });

  it("returns troll racial minimums (BOD 5, STR 5)", () => {
    const attrs = getMetatypeBaseAttributes("troll");
    expect(attrs.body).toBe(5);
    expect(attrs.strength).toBe(5);
    expect(attrs.agility).toBe(1);
    expect(attrs.charisma).toBe(1);
  });

  it("returns a copy (not a reference)", () => {
    const attrs1 = getMetatypeBaseAttributes("human");
    const attrs2 = getMetatypeBaseAttributes("human");
    attrs1.body = 99;
    expect(attrs2.body).toBe(3);
  });

  it("throws for unknown metatype", () => {
    expect(() => getMetatypeBaseAttributes("gnome" as NpcMetatype)).toThrow("Unknown metatype");
  });
});

// =============================================================================
// METATYPE STAT BLOCK GENERATION
// =============================================================================

describe("generateContactStatBlock — metatype support", () => {
  it("generates ork stat block with correct base attributes and derived stats", () => {
    const block = generateContactStatBlock(4, "ork");

    expect(block.baseAttributes.body).toBe(4);
    expect(block.baseAttributes.strength).toBe(3);
    expect(block.baseAttributes.agility).toBe(1);

    // Derived: initiative = REA(1) + INT(1) = 2
    expect(block.derived.initiative).toBe(2);
    // Physical CM: ceil(4/2) + 8 = 10
    expect(block.derived.physicalConditionMonitor).toBe(10);
    // Stun CM: ceil(1/2) + 8 = 9
    expect(block.derived.stunConditionMonitor).toBe(9);
  });

  it("generates troll stat block with higher body-based derived stats", () => {
    const block = generateContactStatBlock(6, "troll");

    expect(block.baseAttributes.body).toBe(5);
    expect(block.baseAttributes.strength).toBe(5);
    // Physical CM: ceil(5/2) + 8 = 11
    expect(block.derived.physicalConditionMonitor).toBe(11);
  });

  it("generates elf stat block with higher charisma-based derived stats", () => {
    const block = generateContactStatBlock(3, "elf");

    expect(block.baseAttributes.charisma).toBe(3);
    expect(block.baseAttributes.agility).toBe(2);
    // Composure: CHA(3) + WIL(1) = 4
    expect(block.derived.composure).toBe(4);
    // Judge Intentions: CHA(3) + INT(1) = 4
    expect(block.derived.judgeIntentions).toBe(4);
  });

  it("generates dwarf stat block with willpower-based derived stats", () => {
    const block = generateContactStatBlock(3, "dwarf");

    expect(block.baseAttributes.willpower).toBe(2);
    // Stun CM: ceil(2/2) + 8 = 9
    expect(block.derived.stunConditionMonitor).toBe(9);
  });

  it("preserves build points regardless of metatype", () => {
    const human = generateContactStatBlock(6, "human");
    const troll = generateContactStatBlock(6, "troll");

    expect(human.bonusAttributePoints).toBe(troll.bonusAttributePoints);
    expect(human.totalSkillPoints).toBe(troll.totalSkillPoints);
    expect(human.specialAttributePoints).toBe(troll.specialAttributePoints);
    expect(human.nuyen).toBe(troll.nuyen);
  });
});
