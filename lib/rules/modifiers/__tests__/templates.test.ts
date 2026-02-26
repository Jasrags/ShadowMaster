/**
 * Tests for modifier templates
 *
 * Validates template integrity: unique IDs, kebab-case,
 * valid effect types and triggers, and valid sources.
 *
 * @see Issue #114
 */

import { describe, it, expect } from "vitest";
import { MODIFIER_TEMPLATES, getModifierTemplate } from "../templates";
import type { EffectType, EffectTrigger } from "@/lib/types/effects";

// =============================================================================
// VALID VALUES
// =============================================================================

const VALID_EFFECT_TYPES: Set<EffectType> = new Set([
  "dice-pool-modifier",
  "limit-modifier",
  "threshold-modifier",
  "attribute-modifier",
  "attribute-maximum",
  "initiative-modifier",
  "wound-modifier",
  "resistance-modifier",
  "healing-modifier",
  "karma-cost-modifier",
  "nuyen-cost-modifier",
  "time-modifier",
  "signature-modifier",
  "glitch-modifier",
  "accuracy-modifier",
  "recoil-compensation",
  "damage-resistance-modifier",
  "armor-modifier",
  "special",
]);

const VALID_TRIGGERS: Set<EffectTrigger> = new Set([
  "always",
  "skill-test",
  "attribute-test",
  "combat-action",
  "defense-test",
  "resistance-test",
  "social-test",
  "magic-use",
  "matrix-action",
  "healing",
  "perception-audio",
  "perception-visual",
  "ranged-attack",
  "melee-attack",
  "damage-resistance",
  "full-defense",
  "first-meeting",
  "damage-taken",
  "fear-intimidation",
  "withdrawal",
  "on-exposure",
]);

const VALID_SOURCES = new Set(["gm", "environment", "condition", "temporary"]);
const VALID_CATEGORIES = new Set([
  "cover",
  "visibility",
  "environmental",
  "social",
  "combat",
  "magic",
]);
const VALID_DURATIONS = new Set(["combat-turn", "minute", "scene", "hour", "permanent"]);
const KEBAB_CASE_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// =============================================================================
// TESTS
// =============================================================================

describe("MODIFIER_TEMPLATES", () => {
  it("has at least 10 templates", () => {
    expect(MODIFIER_TEMPLATES.length).toBeGreaterThanOrEqual(10);
  });

  it("has unique template IDs", () => {
    const ids = MODIFIER_TEMPLATES.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has unique effect IDs", () => {
    const effectIds = MODIFIER_TEMPLATES.map((t) => t.effect.id);
    expect(new Set(effectIds).size).toBe(effectIds.length);
  });

  it("uses kebab-case for template IDs", () => {
    for (const t of MODIFIER_TEMPLATES) {
      expect(t.id).toMatch(KEBAB_CASE_REGEX);
    }
  });

  it("uses kebab-case for effect IDs", () => {
    for (const t of MODIFIER_TEMPLATES) {
      expect(t.effect.id).toMatch(KEBAB_CASE_REGEX);
    }
  });

  it("has valid effect types", () => {
    for (const t of MODIFIER_TEMPLATES) {
      expect(VALID_EFFECT_TYPES).toContain(t.effect.type);
    }
  });

  it("has valid triggers", () => {
    for (const t of MODIFIER_TEMPLATES) {
      for (const trigger of t.effect.triggers) {
        expect(VALID_TRIGGERS).toContain(trigger);
      }
    }
  });

  it("has at least one trigger per effect", () => {
    for (const t of MODIFIER_TEMPLATES) {
      expect(t.effect.triggers.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("has valid sources", () => {
    for (const t of MODIFIER_TEMPLATES) {
      expect(VALID_SOURCES).toContain(t.source);
    }
  });

  it("has valid categories", () => {
    for (const t of MODIFIER_TEMPLATES) {
      expect(VALID_CATEGORIES).toContain(t.category);
    }
  });

  it("has valid default durations", () => {
    for (const t of MODIFIER_TEMPLATES) {
      expect(VALID_DURATIONS).toContain(t.defaultDuration);
    }
  });

  it("has non-empty names and descriptions", () => {
    for (const t of MODIFIER_TEMPLATES) {
      expect(t.name.trim().length).toBeGreaterThan(0);
      expect(t.description.trim().length).toBeGreaterThan(0);
    }
  });

  it("has numeric effect values", () => {
    for (const t of MODIFIER_TEMPLATES) {
      expect(typeof t.effect.value).toBe("number");
    }
  });
});

describe("getModifierTemplate", () => {
  it("returns template by ID", () => {
    const result = getModifierTemplate("partial-cover");
    expect(result).toBeDefined();
    expect(result!.name).toBe("Partial Cover");
  });

  it("returns undefined for unknown ID", () => {
    expect(getModifierTemplate("does-not-exist")).toBeUndefined();
  });
});
