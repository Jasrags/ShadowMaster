import { describe, test, expect } from "vitest";
import { getNeighborhoodZone, calculateFatigueDV, calculateSecurityThreshold } from "../mechanics";
import type { NeighborhoodZoneData } from "../../loader-types";

// =============================================================================
// FACTORIES
// =============================================================================

const ZONES: NeighborhoodZoneData[] = [
  { level: 0, zone: "Z", responseTime: "2d6 hours", description: "Lawless barrens" },
  { level: 1, zone: "E", responseTime: "1d6 hours", description: "Low-rent industrial" },
  {
    level: 2,
    zone: "D",
    responseTime: "1d6 × 12 minutes",
    description: "Mixed industrial/residential",
  },
  { level: 3, zone: "C", responseTime: "1d6 × 10 minutes", description: "Aging district" },
  { level: 4, zone: "B", responseTime: "1d6 × 5 minutes", description: "Middle class" },
  { level: 5, zone: "A", responseTime: "2d6 + 3 minutes", description: "High-class" },
  { level: 6, zone: "AA", responseTime: "1d6 + 4 minutes", description: "Luxury" },
  { level: 7, zone: "AAA", responseTime: "1d6 minutes", description: "Corporate HQ" },
];

// =============================================================================
// TESTS
// =============================================================================

describe("getNeighborhoodZone", () => {
  test("returns zone for valid level", () => {
    const zone = getNeighborhoodZone(0, ZONES);
    expect(zone).toBeDefined();
    expect(zone!.zone).toBe("Z");
    expect(zone!.responseTime).toBe("2d6 hours");
  });

  test("returns AAA for level 7", () => {
    const zone = getNeighborhoodZone(7, ZONES);
    expect(zone!.zone).toBe("AAA");
  });

  test("returns B for level 4", () => {
    const zone = getNeighborhoodZone(4, ZONES);
    expect(zone!.zone).toBe("B");
  });

  test("returns undefined for unknown level", () => {
    expect(getNeighborhoodZone(99, ZONES)).toBeUndefined();
  });

  test("returns undefined for empty zones array", () => {
    expect(getNeighborhoodZone(0, [])).toBeUndefined();
  });
});

describe("calculateFatigueDV", () => {
  test("returns 6 at C&N level 0 (Street)", () => {
    expect(calculateFatigueDV(0)).toBe(6);
  });

  test("returns 4 at C&N level 1 (Squatter)", () => {
    expect(calculateFatigueDV(1)).toBe(4);
  });

  test("returns 2 at C&N level 2 (Low)", () => {
    expect(calculateFatigueDV(2)).toBe(2);
  });

  test("returns 0 at C&N level 3 (Middle)", () => {
    expect(calculateFatigueDV(3)).toBe(0);
  });

  test("returns 0 at C&N level 4+ (no negative DV)", () => {
    expect(calculateFatigueDV(4)).toBe(0);
    expect(calculateFatigueDV(5)).toBe(0);
  });
});

describe("calculateSecurityThreshold", () => {
  test("returns 0 for security level 0", () => {
    expect(calculateSecurityThreshold(0)).toBe(0);
  });

  test("returns double the security level", () => {
    expect(calculateSecurityThreshold(1)).toBe(2);
    expect(calculateSecurityThreshold(3)).toBe(6);
    expect(calculateSecurityThreshold(5)).toBe(10);
    expect(calculateSecurityThreshold(8)).toBe(16);
  });
});
