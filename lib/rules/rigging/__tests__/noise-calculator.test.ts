import { describe, it, expect } from "vitest";
import {
  getDistanceBand,
  getDistanceNoise,
  getNoiseForDistance,
  getTerrainNoise,
  calculateTerrainNoise,
  getSpamZoneNoise,
  getStaticZoneNoise,
  calculateNoise,
  applyNoiseToPool,
  isSignalBlocked,
  getNoiseDescription,
  calculateTotalNoiseReduction,
  getDistanceDescription,
  calculateDroneNoise,
  type SpamZoneLevel,
  type StaticZoneLevel,
} from "../noise-calculator";
import type { TerrainModifier, DistanceBand } from "@/lib/types/rigging";

// =============================================================================
// DISTANCE BAND TESTS
// =============================================================================

describe("noise-calculator", () => {
  describe("getDistanceBand", () => {
    it("should return 'close' for 0 meters", () => {
      expect(getDistanceBand(0)).toBe("close");
    });

    it("should return 'close' for distances up to 100 meters", () => {
      expect(getDistanceBand(50)).toBe("close");
      expect(getDistanceBand(100)).toBe("close");
    });

    it("should return 'near' for 101 meters", () => {
      expect(getDistanceBand(101)).toBe("near");
    });

    it("should return 'near' for distances up to 1km", () => {
      expect(getDistanceBand(500)).toBe("near");
      expect(getDistanceBand(1000)).toBe("near");
    });

    it("should return 'medium' for 1001 meters", () => {
      expect(getDistanceBand(1001)).toBe("medium");
    });

    it("should return 'medium' for distances up to 10km", () => {
      expect(getDistanceBand(5000)).toBe("medium");
      expect(getDistanceBand(10000)).toBe("medium");
    });

    it("should return 'far' for 10001 meters", () => {
      expect(getDistanceBand(10001)).toBe("far");
    });

    it("should return 'far' for distances up to 100km", () => {
      expect(getDistanceBand(50000)).toBe("far");
      expect(getDistanceBand(100000)).toBe("far");
    });

    it("should return 'extreme' for distances over 100km", () => {
      expect(getDistanceBand(100001)).toBe("extreme");
      expect(getDistanceBand(500000)).toBe("extreme");
    });
  });

  describe("getDistanceNoise", () => {
    it("should return 0 for close band", () => {
      expect(getDistanceNoise("close")).toBe(0);
    });

    it("should return 1 for near band", () => {
      expect(getDistanceNoise("near")).toBe(1);
    });

    it("should return 3 for medium band", () => {
      expect(getDistanceNoise("medium")).toBe(3);
    });

    it("should return 5 for far band", () => {
      expect(getDistanceNoise("far")).toBe(5);
    });

    it("should return 8 for extreme band", () => {
      expect(getDistanceNoise("extreme")).toBe(8);
    });
  });

  describe("getNoiseForDistance", () => {
    it("should return 0 for 0 meters", () => {
      expect(getNoiseForDistance(0)).toBe(0);
    });

    it("should return 0 for 100 meters (close)", () => {
      expect(getNoiseForDistance(100)).toBe(0);
    });

    it("should return 1 for 500 meters (near)", () => {
      expect(getNoiseForDistance(500)).toBe(1);
    });

    it("should return 3 for 5km (medium)", () => {
      expect(getNoiseForDistance(5000)).toBe(3);
    });

    it("should return 5 for 50km (far)", () => {
      expect(getNoiseForDistance(50000)).toBe(5);
    });

    it("should return 8 for 200km (extreme)", () => {
      expect(getNoiseForDistance(200000)).toBe(8);
    });
  });

  // =============================================================================
  // TERRAIN MODIFIER TESTS
  // =============================================================================

  describe("getTerrainNoise", () => {
    it("should return 1 for dense_foliage", () => {
      expect(getTerrainNoise("dense_foliage")).toBe(1);
    });

    it("should return 10 for faraday_cage", () => {
      expect(getTerrainNoise("faraday_cage")).toBe(10);
    });

    it("should return 0 for jamming (variable)", () => {
      expect(getTerrainNoise("jamming")).toBe(0);
    });

    it("should return 2 for spam_zone", () => {
      expect(getTerrainNoise("spam_zone")).toBe(2);
    });

    it("should return 3 for static_zone", () => {
      expect(getTerrainNoise("static_zone")).toBe(3);
    });
  });

  describe("calculateTerrainNoise", () => {
    it("should return 0 for empty modifiers", () => {
      expect(calculateTerrainNoise([])).toBe(0);
    });

    it("should return single modifier value", () => {
      expect(calculateTerrainNoise(["dense_foliage"])).toBe(1);
    });

    it("should stack multiple terrain modifiers", () => {
      const modifiers: TerrainModifier[] = ["dense_foliage", "spam_zone"];
      expect(calculateTerrainNoise(modifiers)).toBe(3); // 1 + 2
    });

    it("should handle all modifiers stacking", () => {
      const modifiers: TerrainModifier[] = ["dense_foliage", "faraday_cage", "static_zone"];
      expect(calculateTerrainNoise(modifiers)).toBe(14); // 1 + 10 + 3
    });
  });

  // =============================================================================
  // SPAM/STATIC ZONE TESTS
  // =============================================================================

  describe("getSpamZoneNoise", () => {
    it("should return 0 for none", () => {
      expect(getSpamZoneNoise("none")).toBe(0);
    });

    it("should return 1 for light", () => {
      expect(getSpamZoneNoise("light")).toBe(1);
    });

    it("should return 2 for medium", () => {
      expect(getSpamZoneNoise("medium")).toBe(2);
    });

    it("should return 3 for heavy", () => {
      expect(getSpamZoneNoise("heavy")).toBe(3);
    });
  });

  describe("getStaticZoneNoise", () => {
    it("should return 0 for none", () => {
      expect(getStaticZoneNoise("none")).toBe(0);
    });

    it("should return 1 for light", () => {
      expect(getStaticZoneNoise("light")).toBe(1);
    });

    it("should return 2 for medium", () => {
      expect(getStaticZoneNoise("medium")).toBe(2);
    });

    it("should return 3 for heavy", () => {
      expect(getStaticZoneNoise("heavy")).toBe(3);
    });
  });

  // =============================================================================
  // COMPLETE NOISE CALCULATION TESTS
  // =============================================================================

  describe("calculateNoise", () => {
    it("should calculate noise with only distance", () => {
      const result = calculateNoise({ distanceMeters: 500 });

      expect(result.distanceBand).toBe("near");
      expect(result.distanceNoise).toBe(1);
      expect(result.terrainNoise).toBe(0);
      expect(result.spamZoneNoise).toBe(0);
      expect(result.staticZoneNoise).toBe(0);
      expect(result.noiseReduction).toBe(0);
      expect(result.totalNoise).toBe(1);
    });

    it("should include terrain modifiers", () => {
      const result = calculateNoise({
        distanceMeters: 100,
        terrainModifiers: ["dense_foliage", "spam_zone"],
      });

      expect(result.distanceNoise).toBe(0);
      expect(result.terrainNoise).toBe(3); // 1 + 2
      expect(result.totalNoise).toBe(3);
    });

    it("should include spam zone noise", () => {
      const result = calculateNoise({
        distanceMeters: 100,
        spamZone: "heavy",
      });

      expect(result.spamZoneNoise).toBe(3);
      expect(result.totalNoise).toBe(3);
    });

    it("should include static zone noise", () => {
      const result = calculateNoise({
        distanceMeters: 100,
        staticZone: "medium",
      });

      expect(result.staticZoneNoise).toBe(2);
      expect(result.totalNoise).toBe(2);
    });

    it("should apply noise reduction", () => {
      const result = calculateNoise({
        distanceMeters: 5000, // 3 noise
        noiseReduction: 2,
      });

      expect(result.distanceNoise).toBe(3);
      expect(result.noiseReduction).toBe(2);
      expect(result.totalNoise).toBe(1);
    });

    it("should not allow negative total noise", () => {
      const result = calculateNoise({
        distanceMeters: 100, // 0 noise
        noiseReduction: 5,
      });

      expect(result.totalNoise).toBe(0);
    });

    it("should include additional noise", () => {
      const result = calculateNoise({
        distanceMeters: 100,
        additionalNoise: 4,
      });

      expect(result.totalNoise).toBe(4);
    });

    it("should calculate complete noise with all inputs", () => {
      const result = calculateNoise({
        distanceMeters: 5000, // medium: 3
        terrainModifiers: ["dense_foliage"], // +1
        spamZone: "light", // +1
        staticZone: "light", // +1
        additionalNoise: 2,
        noiseReduction: 3,
      });

      // 3 + 1 + 1 + 1 + 2 - 3 = 5
      expect(result.totalNoise).toBe(5);
      expect(result.distanceBand).toBe("medium");
      expect(result.distanceNoise).toBe(3);
      expect(result.terrainNoise).toBe(1);
      expect(result.spamZoneNoise).toBe(1);
      expect(result.staticZoneNoise).toBe(1);
      expect(result.noiseReduction).toBe(3);
    });
  });

  // =============================================================================
  // NOISE APPLICATION TESTS
  // =============================================================================

  describe("applyNoiseToPool", () => {
    it("should reduce dice pool by noise", () => {
      expect(applyNoiseToPool(10, 3)).toBe(7);
    });

    it("should not reduce pool below 0", () => {
      expect(applyNoiseToPool(3, 10)).toBe(0);
    });

    it("should return full pool with 0 noise", () => {
      expect(applyNoiseToPool(8, 0)).toBe(8);
    });

    it("should handle exact reduction to 0", () => {
      expect(applyNoiseToPool(5, 5)).toBe(0);
    });
  });

  describe("isSignalBlocked", () => {
    it("should return false for noise below 12", () => {
      expect(isSignalBlocked(0)).toBe(false);
      expect(isSignalBlocked(5)).toBe(false);
      expect(isSignalBlocked(11)).toBe(false);
    });

    it("should return true for noise at 12", () => {
      expect(isSignalBlocked(12)).toBe(true);
    });

    it("should return true for noise above 12", () => {
      expect(isSignalBlocked(15)).toBe(true);
      expect(isSignalBlocked(20)).toBe(true);
    });
  });

  // =============================================================================
  // DESCRIPTION TESTS
  // =============================================================================

  describe("getNoiseDescription", () => {
    it("should return 'Clear signal' for 0 noise", () => {
      expect(getNoiseDescription(0)).toBe("Clear signal");
    });

    it("should return 'Light interference' for 1-2 noise", () => {
      expect(getNoiseDescription(1)).toBe("Light interference");
      expect(getNoiseDescription(2)).toBe("Light interference");
    });

    it("should return 'Moderate interference' for 3-4 noise", () => {
      expect(getNoiseDescription(3)).toBe("Moderate interference");
      expect(getNoiseDescription(4)).toBe("Moderate interference");
    });

    it("should return 'Heavy interference' for 5-6 noise", () => {
      expect(getNoiseDescription(5)).toBe("Heavy interference");
      expect(getNoiseDescription(6)).toBe("Heavy interference");
    });

    it("should return 'Severe interference' for 7-8 noise", () => {
      expect(getNoiseDescription(7)).toBe("Severe interference");
      expect(getNoiseDescription(8)).toBe("Severe interference");
    });

    it("should return 'Critical interference' for 9-11 noise", () => {
      expect(getNoiseDescription(9)).toBe("Critical interference");
      expect(getNoiseDescription(10)).toBe("Critical interference");
      expect(getNoiseDescription(11)).toBe("Critical interference");
    });

    it("should return 'Signal blocked' for 12+ noise", () => {
      expect(getNoiseDescription(12)).toBe("Signal blocked");
      expect(getNoiseDescription(15)).toBe("Signal blocked");
    });
  });

  describe("getDistanceDescription", () => {
    it("should describe close band", () => {
      expect(getDistanceDescription("close")).toBe("Within 100m");
    });

    it("should describe near band", () => {
      expect(getDistanceDescription("near")).toBe("100m - 1km");
    });

    it("should describe medium band", () => {
      expect(getDistanceDescription("medium")).toBe("1km - 10km");
    });

    it("should describe far band", () => {
      expect(getDistanceDescription("far")).toBe("10km - 100km");
    });

    it("should describe extreme band", () => {
      expect(getDistanceDescription("extreme")).toBe("Over 100km");
    });
  });

  // =============================================================================
  // HELPER FUNCTION TESTS
  // =============================================================================

  describe("calculateTotalNoiseReduction", () => {
    it("should return 0 for empty sources", () => {
      expect(calculateTotalNoiseReduction([])).toBe(0);
    });

    it("should return single source value", () => {
      expect(calculateTotalNoiseReduction([3])).toBe(3);
    });

    it("should stack multiple sources", () => {
      expect(calculateTotalNoiseReduction([2, 3, 1])).toBe(6);
    });
  });

  describe("calculateDroneNoise", () => {
    it("should calculate noise for drone at close range", () => {
      const result = calculateDroneNoise(50, 0);

      expect(result.distanceBand).toBe("close");
      expect(result.totalNoise).toBe(0);
    });

    it("should apply RCC noise reduction", () => {
      const result = calculateDroneNoise(5000, 4); // 3 noise - 4 reduction

      expect(result.distanceNoise).toBe(3);
      expect(result.noiseReduction).toBe(4);
      expect(result.totalNoise).toBe(0);
    });

    it("should include environment modifiers", () => {
      const result = calculateDroneNoise(100, 0, {
        spamZone: "medium",
        staticZone: "light",
      });

      expect(result.spamZoneNoise).toBe(2);
      expect(result.staticZoneNoise).toBe(1);
      expect(result.totalNoise).toBe(3);
    });

    it("should include terrain modifiers", () => {
      const result = calculateDroneNoise(100, 0, {
        terrain: ["dense_foliage"],
      });

      expect(result.terrainNoise).toBe(1);
      expect(result.totalNoise).toBe(1);
    });

    it("should calculate complete noise with all inputs", () => {
      const result = calculateDroneNoise(5000, 3, {
        terrain: ["dense_foliage"],
        spamZone: "light",
        staticZone: "light",
      });

      // distance 3 + terrain 1 + spam 1 + static 1 - reduction 3 = 3
      expect(result.totalNoise).toBe(3);
    });
  });
});
