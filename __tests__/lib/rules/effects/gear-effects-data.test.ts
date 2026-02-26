/**
 * Data validation tests for gear effects in the unified effect system.
 *
 * Validates that all `effects` arrays added to gear and weapon modification
 * catalog items in core-rulebook.json conform to the unified effect schema.
 *
 * @see Issue #111
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { UNIFIED_TRIGGERS, UNIFIED_TYPES } from "@/lib/rules/effects/quality-adapter";
import type { SpecificAction } from "@/lib/types/effects";

// ---------------------------------------------------------------------------
// Load catalog data
// ---------------------------------------------------------------------------

const VALID_SPECIFIC_ACTIONS: ReadonlySet<string> = new Set<SpecificAction>([
  "locate-sound-source",
  "detect-ambush",
  "read-lips",
  "spot-hidden",
  "called-shot",
  "suppressive-fire",
  "full-auto",
  "negotiate",
  "intimidate",
  "con",
  "hack-on-the-fly",
  "brute-force",
  "data-spike",
]);

interface CatalogEffect {
  id: string;
  type: string;
  triggers: string[];
  target: Record<string, unknown>;
  value: unknown;
  description?: string;
  stackingGroup?: string;
  stackingPriority?: number;
  requiresWireless?: boolean;
  wirelessOverride?: Record<string, unknown>;
  condition?: Record<string, unknown>;
}

interface CatalogItem {
  id: string;
  name: string;
  effects?: CatalogEffect[];
}

function loadCoreRulebook(): Record<string, unknown> {
  const filePath = join(process.cwd(), "data/editions/sr5/core-rulebook.json");
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

/**
 * Collect catalog items with unified `effects` arrays from gear and modifications modules only.
 * Excludes qualities module (which has old-format effects).
 */
function collectItemsWithEffects(modules: Record<string, unknown>): CatalogItem[] {
  const items: CatalogItem[] = [];
  const gearModules = ["gear", "modifications"];

  function traverse(obj: unknown): void {
    if (Array.isArray(obj)) {
      for (const element of obj) {
        traverse(element);
      }
    } else if (typeof obj === "object" && obj !== null) {
      const record = obj as Record<string, unknown>;
      if (
        typeof record.id === "string" &&
        typeof record.name === "string" &&
        Array.isArray(record.effects)
      ) {
        // Only include items whose effects have the unified format (triggers array)
        const unifiedEffects = (record.effects as Record<string, unknown>[]).filter((e) =>
          Array.isArray(e.triggers)
        );
        if (unifiedEffects.length > 0) {
          items.push({
            id: record.id,
            name: record.name,
            effects: unifiedEffects as unknown as CatalogEffect[],
          });
        }
      }
      for (const value of Object.values(record)) {
        traverse(value);
      }
    }
  }

  for (const moduleName of gearModules) {
    if (modules[moduleName]) {
      traverse(modules[moduleName]);
    }
  }

  return items;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Gear effects data validation", () => {
  const rulebook = loadCoreRulebook();
  const modules = rulebook.modules as Record<string, unknown>;
  const itemsWithEffects = collectItemsWithEffects(modules);

  it("should find catalog items with effects arrays", () => {
    // We added effects to 13 items total
    expect(itemsWithEffects.length).toBeGreaterThanOrEqual(13);
  });

  it("every effect has required fields: id, type, triggers, target, value", () => {
    for (const item of itemsWithEffects) {
      for (const effect of item.effects!) {
        expect(effect.id, `${item.id}: missing id`).toBeDefined();
        expect(typeof effect.id, `${item.id}: id not string`).toBe("string");
        expect(effect.type, `${item.id}: missing type`).toBeDefined();
        expect(effect.triggers, `${item.id}: missing triggers`).toBeDefined();
        expect(Array.isArray(effect.triggers), `${item.id}: triggers not array`).toBe(true);
        expect(effect.triggers.length, `${item.id}: triggers empty`).toBeGreaterThan(0);
        expect(effect.target, `${item.id}: missing target`).toBeDefined();
        expect(typeof effect.target, `${item.id}: target not object`).toBe("object");
        expect(effect.value, `${item.id}: missing value`).toBeDefined();
      }
    }
  });

  it("every type value is in UNIFIED_TYPES", () => {
    for (const item of itemsWithEffects) {
      for (const effect of item.effects!) {
        expect(UNIFIED_TYPES.has(effect.type), `${item.id}: unknown type "${effect.type}"`).toBe(
          true
        );
      }
    }
  });

  it("every trigger value is in UNIFIED_TRIGGERS", () => {
    for (const item of itemsWithEffects) {
      for (const effect of item.effects!) {
        for (const trigger of effect.triggers) {
          expect(UNIFIED_TRIGGERS.has(trigger), `${item.id}: unknown trigger "${trigger}"`).toBe(
            true
          );
        }
      }
    }
  });

  it("no duplicate effect IDs across all gear items", () => {
    const seenIds = new Set<string>();
    for (const item of itemsWithEffects) {
      for (const effect of item.effects!) {
        expect(seenIds.has(effect.id), `Duplicate effect ID: "${effect.id}" in ${item.id}`).toBe(
          false
        );
        seenIds.add(effect.id);
      }
    }
  });

  it("wirelessOverride has only valid keys when present", () => {
    const validKeys = new Set(["type", "bonusValue", "description"]);
    for (const item of itemsWithEffects) {
      for (const effect of item.effects!) {
        if (effect.wirelessOverride) {
          for (const key of Object.keys(effect.wirelessOverride)) {
            expect(
              validKeys.has(key),
              `${item.id}/${effect.id}: invalid wirelessOverride key "${key}"`
            ).toBe(true);
          }
        }
      }
    }
  });

  it("per-rating values have { perRating: number } shape", () => {
    for (const item of itemsWithEffects) {
      for (const effect of item.effects!) {
        if (typeof effect.value === "object" && effect.value !== null) {
          const val = effect.value as Record<string, unknown>;
          expect(typeof val.perRating, `${item.id}/${effect.id}: perRating not a number`).toBe(
            "number"
          );
          expect(
            Object.keys(val).length,
            `${item.id}/${effect.id}: perRating object has extra keys`
          ).toBe(1);
        }
      }
    }
  });

  it("specificAction values are valid SpecificAction enum values when present", () => {
    for (const item of itemsWithEffects) {
      for (const effect of item.effects!) {
        const specificAction = effect.target.specificAction;
        if (specificAction !== undefined) {
          expect(
            VALID_SPECIFIC_ACTIONS.has(specificAction as string),
            `${item.id}/${effect.id}: invalid specificAction "${specificAction}"`
          ).toBe(true);
        }
      }
    }
  });
});
