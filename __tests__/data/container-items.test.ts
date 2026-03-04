/**
 * Data validation tests for container items in core-rulebook.json.
 *
 * Validates that all items with containerProperties have valid schema values.
 *
 * @see Issue #471
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

// ---------------------------------------------------------------------------
// Load catalog data
// ---------------------------------------------------------------------------

interface ContainerProps {
  weightCapacity: number;
  slotCapacity?: number;
  allowedCategories?: string[];
  rigid?: boolean;
}

interface CatalogGearItem {
  id: string;
  name: string;
  category: string;
  cost: number;
  availability: number;
  weight?: number;
  containerProperties?: ContainerProps;
}

const rawJson = readFileSync(join(process.cwd(), "data/editions/sr5/core-rulebook.json"), "utf-8");
const rulebook = JSON.parse(rawJson);

const miscellaneous: CatalogGearItem[] = rulebook.modules.gear.payload.miscellaneous;

const containerItems = miscellaneous.filter((item) => item.containerProperties !== undefined);

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("SR5 container catalog items", () => {
  it("should have at least one container item in miscellaneous", () => {
    expect(containerItems.length).toBeGreaterThan(0);
  });

  describe.each(containerItems)("$name ($id)", (item) => {
    it("should have weightCapacity > 0", () => {
      expect(item.containerProperties!.weightCapacity).toBeGreaterThan(0);
    });

    it("should have slotCapacity > 0 when present", () => {
      if (item.containerProperties!.slotCapacity !== undefined) {
        expect(item.containerProperties!.slotCapacity).toBeGreaterThan(0);
      }
    });

    it("should have rigid as boolean when present", () => {
      if (item.containerProperties!.rigid !== undefined) {
        expect(typeof item.containerProperties!.rigid).toBe("boolean");
      }
    });

    it("should have valid cost", () => {
      expect(item.cost).toBeGreaterThan(0);
    });

    it("should have category 'miscellaneous'", () => {
      expect(item.category).toBe("miscellaneous");
    });

    it("should have kebab-case id", () => {
      expect(item.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    });
  });
});
