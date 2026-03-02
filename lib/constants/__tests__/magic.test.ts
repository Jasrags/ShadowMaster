/**
 * Tests for magic constants
 */

import { describe, it, expect } from "vitest";
import { ACTIVATION_ORDER, ACTIVATION_LABELS, SPELL_KARMA_COST, SPELL_CATEGORIES } from "../magic";

describe("Magic Constants", () => {
  describe("ACTIVATION_ORDER", () => {
    it("should contain all five activation types in order", () => {
      expect(ACTIVATION_ORDER).toEqual(["free", "simple", "complex", "interrupt", "other"]);
    });
  });

  describe("ACTIVATION_LABELS", () => {
    it("should have a label for every activation type", () => {
      for (const type of ACTIVATION_ORDER) {
        expect(ACTIVATION_LABELS[type]).toBeDefined();
        expect(typeof ACTIVATION_LABELS[type]).toBe("string");
      }
    });

    it("should use 'Interrupt Action' (not 'Interrupt')", () => {
      expect(ACTIVATION_LABELS.interrupt).toBe("Interrupt Action");
    });

    it("should have expected labels", () => {
      expect(ACTIVATION_LABELS.free).toBe("Free Action");
      expect(ACTIVATION_LABELS.simple).toBe("Simple Action");
      expect(ACTIVATION_LABELS.complex).toBe("Complex Action");
      expect(ACTIVATION_LABELS.other).toBe("Passive / Other");
    });
  });

  describe("SPELL_KARMA_COST", () => {
    it("should be 5", () => {
      expect(SPELL_KARMA_COST).toBe(5);
    });
  });

  describe("SPELL_CATEGORIES", () => {
    it("should have 5 base categories", () => {
      expect(SPELL_CATEGORIES).toHaveLength(5);
    });

    it("should contain all spell categories", () => {
      const ids = SPELL_CATEGORIES.map((c) => c.id);
      expect(ids).toEqual(["combat", "detection", "health", "illusion", "manipulation"]);
    });

    it("should not include 'all' filter category", () => {
      const ids = SPELL_CATEGORIES.map((c) => c.id);
      expect(ids).not.toContain("all");
    });

    it("should have human-readable names", () => {
      for (const cat of SPELL_CATEGORIES) {
        expect(cat.name).toBeTruthy();
        // Name should be capitalized
        expect(cat.name[0]).toBe(cat.name[0].toUpperCase());
      }
    });
  });
});
