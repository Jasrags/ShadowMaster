/**
 * Shapeshifter Rules Tests
 *
 * Unit tests for shapeshifter identification, metahuman form options,
 * and karma cost utilities.
 */

import { describe, it, expect } from "vitest";
import {
  SHAPESHIFTER_METATYPE_IDS,
  isShapeshifterMetatype,
  METAHUMAN_FORM_KARMA_COSTS,
  METAHUMAN_FORM_OPTIONS,
  VALID_METAHUMAN_FORM_IDS,
  getMetahumanFormKarmaCost,
} from "../shapeshifter";

// =============================================================================
// SHAPESHIFTER IDENTIFICATION
// =============================================================================

describe("SHAPESHIFTER_METATYPE_IDS", () => {
  it("should contain exactly 10 shapeshifter species", () => {
    expect(SHAPESHIFTER_METATYPE_IDS).toHaveLength(10);
  });

  it("should contain all expected species", () => {
    const expected = [
      "shapeshifter-bovine",
      "shapeshifter-canine",
      "shapeshifter-equine",
      "shapeshifter-falconine",
      "shapeshifter-leonine",
      "shapeshifter-lupine",
      "shapeshifter-pantherine",
      "shapeshifter-tigrine",
      "shapeshifter-ursine",
      "shapeshifter-vulpine",
    ];
    expect(SHAPESHIFTER_METATYPE_IDS).toEqual(expected);
  });

  it("should use kebab-case for all IDs", () => {
    for (const id of SHAPESHIFTER_METATYPE_IDS) {
      expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("isShapeshifterMetatype", () => {
  it("should return true for all shapeshifter IDs", () => {
    for (const id of SHAPESHIFTER_METATYPE_IDS) {
      expect(isShapeshifterMetatype(id)).toBe(true);
    }
  });

  it("should return false for base metatypes", () => {
    expect(isShapeshifterMetatype("human")).toBe(false);
    expect(isShapeshifterMetatype("elf")).toBe(false);
    expect(isShapeshifterMetatype("dwarf")).toBe(false);
    expect(isShapeshifterMetatype("ork")).toBe(false);
    expect(isShapeshifterMetatype("troll")).toBe(false);
  });

  it("should return false for metasapients", () => {
    expect(isShapeshifterMetatype("centaur")).toBe(false);
    expect(isShapeshifterMetatype("naga")).toBe(false);
    expect(isShapeshifterMetatype("pixie")).toBe(false);
  });

  it("should return false for empty string", () => {
    expect(isShapeshifterMetatype("")).toBe(false);
  });
});

// =============================================================================
// METAHUMAN FORM OPTIONS
// =============================================================================

describe("METAHUMAN_FORM_OPTIONS", () => {
  it("should have exactly 5 options", () => {
    expect(METAHUMAN_FORM_OPTIONS).toHaveLength(5);
  });

  it("should include all base metatypes", () => {
    const ids = METAHUMAN_FORM_OPTIONS.map((o) => o.id);
    expect(ids).toContain("human");
    expect(ids).toContain("dwarf");
    expect(ids).toContain("elf");
    expect(ids).toContain("ork");
    expect(ids).toContain("troll");
  });
});

describe("VALID_METAHUMAN_FORM_IDS", () => {
  it("should match METAHUMAN_FORM_OPTIONS ids", () => {
    const optionIds = METAHUMAN_FORM_OPTIONS.map((o) => o.id);
    expect(VALID_METAHUMAN_FORM_IDS).toEqual(optionIds);
  });
});

// =============================================================================
// KARMA COSTS
// =============================================================================

describe("METAHUMAN_FORM_KARMA_COSTS", () => {
  it("should have human form as free (0 karma)", () => {
    expect(METAHUMAN_FORM_KARMA_COSTS.human).toBe(0);
  });

  it("should have correct karma costs for all forms", () => {
    expect(METAHUMAN_FORM_KARMA_COSTS.dwarf).toBe(8);
    expect(METAHUMAN_FORM_KARMA_COSTS.elf).toBe(5);
    expect(METAHUMAN_FORM_KARMA_COSTS.ork).toBe(10);
    expect(METAHUMAN_FORM_KARMA_COSTS.troll).toBe(20);
  });

  it("should have costs for all valid form IDs", () => {
    for (const id of VALID_METAHUMAN_FORM_IDS) {
      expect(METAHUMAN_FORM_KARMA_COSTS[id]).toBeDefined();
    }
  });
});

describe("getMetahumanFormKarmaCost", () => {
  it("should return correct cost for valid forms", () => {
    expect(getMetahumanFormKarmaCost("human")).toBe(0);
    expect(getMetahumanFormKarmaCost("elf")).toBe(5);
    expect(getMetahumanFormKarmaCost("dwarf")).toBe(8);
    expect(getMetahumanFormKarmaCost("ork")).toBe(10);
    expect(getMetahumanFormKarmaCost("troll")).toBe(20);
  });

  it("should return undefined for invalid form IDs", () => {
    expect(getMetahumanFormKarmaCost("invalid")).toBeUndefined();
    expect(getMetahumanFormKarmaCost("")).toBeUndefined();
    expect(getMetahumanFormKarmaCost("shapeshifter-lupine")).toBeUndefined();
  });
});
