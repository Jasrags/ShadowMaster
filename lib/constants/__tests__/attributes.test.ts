/**
 * Tests for attribute constants
 */

import { describe, it, expect } from "vitest";
import {
  PHYSICAL_ATTRIBUTES,
  MENTAL_ATTRIBUTES,
  SPECIAL_ATTRIBUTES,
  CORE_ATTRIBUTES,
  ALL_ATTRIBUTES,
  ATTRIBUTE_ABBREVIATION_MAP,
  normalizeAttributeKey,
  isValidAttribute,
  isCoreAttribute,
  isSpecialAttribute,
} from "../attributes";

describe("Attribute Constants", () => {
  describe("attribute arrays", () => {
    it("should have correct physical attributes", () => {
      expect(PHYSICAL_ATTRIBUTES).toEqual(["body", "agility", "reaction", "strength"]);
    });

    it("should have correct mental attributes", () => {
      expect(MENTAL_ATTRIBUTES).toEqual(["willpower", "logic", "intuition", "charisma"]);
    });

    it("should have correct special attributes", () => {
      expect(SPECIAL_ATTRIBUTES).toEqual(["edge", "magic", "resonance"]);
    });

    it("should have CORE_ATTRIBUTES as physical + mental", () => {
      expect(CORE_ATTRIBUTES).toEqual([...PHYSICAL_ATTRIBUTES, ...MENTAL_ATTRIBUTES]);
    });

    it("should have ALL_ATTRIBUTES as core + special", () => {
      expect(ALL_ATTRIBUTES).toEqual([...CORE_ATTRIBUTES, ...SPECIAL_ATTRIBUTES]);
    });
  });

  describe("ATTRIBUTE_ABBREVIATION_MAP", () => {
    it("should map physical abbreviations correctly", () => {
      expect(ATTRIBUTE_ABBREVIATION_MAP["bod"]).toBe("body");
      expect(ATTRIBUTE_ABBREVIATION_MAP["agi"]).toBe("agility");
      expect(ATTRIBUTE_ABBREVIATION_MAP["rea"]).toBe("reaction");
      expect(ATTRIBUTE_ABBREVIATION_MAP["str"]).toBe("strength");
    });

    it("should map mental abbreviations correctly", () => {
      expect(ATTRIBUTE_ABBREVIATION_MAP["wil"]).toBe("willpower");
      expect(ATTRIBUTE_ABBREVIATION_MAP["log"]).toBe("logic");
      expect(ATTRIBUTE_ABBREVIATION_MAP["int"]).toBe("intuition");
      expect(ATTRIBUTE_ABBREVIATION_MAP["cha"]).toBe("charisma");
    });

    it("should map special abbreviations correctly", () => {
      expect(ATTRIBUTE_ABBREVIATION_MAP["mag"]).toBe("magic");
      expect(ATTRIBUTE_ABBREVIATION_MAP["res"]).toBe("resonance");
    });
  });

  describe("normalizeAttributeKey", () => {
    it("should normalize abbreviations to full names", () => {
      expect(normalizeAttributeKey("bod")).toBe("body");
      expect(normalizeAttributeKey("agi")).toBe("agility");
      expect(normalizeAttributeKey("rea")).toBe("reaction");
      expect(normalizeAttributeKey("str")).toBe("strength");
      expect(normalizeAttributeKey("wil")).toBe("willpower");
      expect(normalizeAttributeKey("log")).toBe("logic");
      expect(normalizeAttributeKey("int")).toBe("intuition");
      expect(normalizeAttributeKey("cha")).toBe("charisma");
      expect(normalizeAttributeKey("mag")).toBe("magic");
      expect(normalizeAttributeKey("res")).toBe("resonance");
    });

    it("should be case-insensitive", () => {
      expect(normalizeAttributeKey("BOD")).toBe("body");
      expect(normalizeAttributeKey("Agi")).toBe("agility");
      expect(normalizeAttributeKey("CHARISMA")).toBe("charisma");
    });

    it("should pass through full names unchanged (lowercased)", () => {
      expect(normalizeAttributeKey("body")).toBe("body");
      expect(normalizeAttributeKey("agility")).toBe("agility");
      expect(normalizeAttributeKey("edge")).toBe("edge");
    });

    it("should return unknown keys lowercased", () => {
      expect(normalizeAttributeKey("unknown")).toBe("unknown");
      expect(normalizeAttributeKey("CUSTOM")).toBe("custom");
    });
  });

  describe("isValidAttribute", () => {
    it("should return true for valid full attribute names", () => {
      expect(isValidAttribute("body")).toBe(true);
      expect(isValidAttribute("charisma")).toBe(true);
      expect(isValidAttribute("magic")).toBe(true);
    });

    it("should return true for valid abbreviations", () => {
      expect(isValidAttribute("bod")).toBe(true);
      expect(isValidAttribute("cha")).toBe(true);
      expect(isValidAttribute("mag")).toBe(true);
    });

    it("should be case-insensitive", () => {
      expect(isValidAttribute("BODY")).toBe(true);
      expect(isValidAttribute("Agility")).toBe(true);
    });

    it("should return false for invalid attribute names", () => {
      expect(isValidAttribute("unknown")).toBe(false);
      expect(isValidAttribute("power")).toBe(false);
    });
  });

  describe("isCoreAttribute", () => {
    it("should return true for physical attributes", () => {
      expect(isCoreAttribute("body")).toBe(true);
      expect(isCoreAttribute("bod")).toBe(true);
    });

    it("should return true for mental attributes", () => {
      expect(isCoreAttribute("charisma")).toBe(true);
      expect(isCoreAttribute("cha")).toBe(true);
    });

    it("should return false for special attributes", () => {
      expect(isCoreAttribute("magic")).toBe(false);
      expect(isCoreAttribute("edge")).toBe(false);
      expect(isCoreAttribute("resonance")).toBe(false);
    });
  });

  describe("isSpecialAttribute", () => {
    it("should return true for special attributes", () => {
      expect(isSpecialAttribute("edge")).toBe(true);
      expect(isSpecialAttribute("magic")).toBe(true);
      expect(isSpecialAttribute("resonance")).toBe(true);
    });

    it("should return true for special attribute abbreviations", () => {
      expect(isSpecialAttribute("mag")).toBe(true);
      expect(isSpecialAttribute("res")).toBe(true);
    });

    it("should return false for core attributes", () => {
      expect(isSpecialAttribute("body")).toBe(false);
      expect(isSpecialAttribute("charisma")).toBe(false);
    });
  });
});
