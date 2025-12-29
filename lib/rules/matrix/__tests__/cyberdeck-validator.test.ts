import { describe, it, expect } from "vitest";
import {
  validateCyberdeckConfig,
  createDefaultConfig,
  createOffensiveConfig,
  createStealthyConfig,
  swapAttributes,
  calculateMatrixConditionMonitor,
  getInitiativeDiceBonus,
  getBiofeedbackDamageType,
} from "../cyberdeck-validator";
import type { CyberdeckAttributeConfig } from "@/lib/types/matrix";

describe("cyberdeck-validator", () => {
  // Standard Ares Predator cyberdeck array
  const standardArray = [5, 4, 3, 2];
  // High-end cyberdeck array
  const highEndArray = [7, 6, 5, 4];

  describe("validateCyberdeckConfig", () => {
    it("should validate a correct configuration", () => {
      const config: CyberdeckAttributeConfig = {
        attack: 5,
        sleaze: 4,
        dataProcessing: 3,
        firewall: 2,
      };

      const result = validateCyberdeckConfig(config, standardArray);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should allow values in any order", () => {
      const config: CyberdeckAttributeConfig = {
        attack: 2,
        sleaze: 5,
        dataProcessing: 4,
        firewall: 3,
      };

      const result = validateCyberdeckConfig(config, standardArray);

      expect(result.valid).toBe(true);
    });

    it("should reject invalid values not in array", () => {
      const config: CyberdeckAttributeConfig = {
        attack: 6, // Not in standardArray
        sleaze: 4,
        dataProcessing: 3,
        firewall: 2,
      };

      const result = validateCyberdeckConfig(config, standardArray);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should reject duplicate values", () => {
      const config: CyberdeckAttributeConfig = {
        attack: 5,
        sleaze: 5, // Duplicate
        dataProcessing: 3,
        firewall: 2,
      };

      const result = validateCyberdeckConfig(config, standardArray);

      expect(result.valid).toBe(false);
    });

    it("should reject configurations with missing values from array", () => {
      const config: CyberdeckAttributeConfig = {
        attack: 5,
        sleaze: 4,
        dataProcessing: 4, // Missing 3, duplicate 4
        firewall: 2,
      };

      const result = validateCyberdeckConfig(config, standardArray);

      expect(result.valid).toBe(false);
    });
  });

  describe("createDefaultConfig", () => {
    it("should create balanced config from array", () => {
      const config = createDefaultConfig(standardArray);

      // Should use all values from array exactly once
      const values = [config.attack, config.sleaze, config.dataProcessing, config.firewall];
      const sorted = [...values].sort((a, b) => b - a);
      const arraySorted = [...standardArray].sort((a, b) => b - a);

      expect(sorted).toEqual(arraySorted);
    });

    it("should prioritize dataProcessing and firewall for defensive balance", () => {
      const config = createDefaultConfig(standardArray);

      // Default config puts higher values on DP and FW for defense
      expect(config.dataProcessing).toBeGreaterThanOrEqual(config.attack);
      expect(config.firewall).toBeGreaterThanOrEqual(config.sleaze);
    });
  });

  describe("createOffensiveConfig", () => {
    it("should prioritize attack and sleaze", () => {
      const config = createOffensiveConfig(standardArray);
      const sorted = [...standardArray].sort((a, b) => b - a);

      // Highest values go to attack and sleaze
      expect(config.attack).toBe(sorted[0]);
      expect(config.sleaze).toBe(sorted[1]);
    });
  });

  describe("createStealthyConfig", () => {
    it("should prioritize sleaze and dataProcessing", () => {
      const config = createStealthyConfig(standardArray);
      const sorted = [...standardArray].sort((a, b) => b - a);

      // Highest value goes to sleaze
      expect(config.sleaze).toBe(sorted[0]);
      // Second highest to DP for perception defense
      expect(config.dataProcessing).toBe(sorted[1]);
    });
  });

  describe("swapAttributes", () => {
    it("should swap two attribute values", () => {
      const config: CyberdeckAttributeConfig = {
        attack: 5,
        sleaze: 4,
        dataProcessing: 3,
        firewall: 2,
      };

      const swapped = swapAttributes(config, "attack", "firewall");

      expect(swapped.attack).toBe(2);
      expect(swapped.firewall).toBe(5);
      expect(swapped.sleaze).toBe(4);
      expect(swapped.dataProcessing).toBe(3);
    });

    it("should not mutate original config", () => {
      const config: CyberdeckAttributeConfig = {
        attack: 5,
        sleaze: 4,
        dataProcessing: 3,
        firewall: 2,
      };

      swapAttributes(config, "attack", "sleaze");

      expect(config.attack).toBe(5);
      expect(config.sleaze).toBe(4);
    });
  });

  describe("calculateMatrixConditionMonitor", () => {
    it("should calculate condition monitor from device rating", () => {
      // Implementation: deviceRating + 8
      expect(calculateMatrixConditionMonitor(1)).toBe(9);
      expect(calculateMatrixConditionMonitor(2)).toBe(10);
      expect(calculateMatrixConditionMonitor(3)).toBe(11);
      expect(calculateMatrixConditionMonitor(4)).toBe(12);
      expect(calculateMatrixConditionMonitor(5)).toBe(13);
      expect(calculateMatrixConditionMonitor(6)).toBe(14);
    });
  });

  describe("getInitiativeDiceBonus", () => {
    it("should return correct bonus for cold-sim VR", () => {
      expect(getInitiativeDiceBonus("cold-sim-vr")).toBe(1);
    });

    it("should return correct bonus for hot-sim VR", () => {
      expect(getInitiativeDiceBonus("hot-sim-vr")).toBe(2);
    });

    it("should return 0 for AR", () => {
      expect(getInitiativeDiceBonus("ar")).toBe(0);
    });
  });

  describe("getBiofeedbackDamageType", () => {
    it("should return stun for cold-sim VR", () => {
      expect(getBiofeedbackDamageType("cold-sim-vr")).toBe("stun");
    });

    it("should return physical for hot-sim VR", () => {
      expect(getBiofeedbackDamageType("hot-sim-vr")).toBe("physical");
    });

    it("should return null for AR", () => {
      expect(getBiofeedbackDamageType("ar")).toBe(null);
    });
  });
});
