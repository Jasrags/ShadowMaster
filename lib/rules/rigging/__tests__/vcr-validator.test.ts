import { describe, it, expect } from "vitest";
import {
  hasVehicleControlRig,
  getVehicleControlRig,
  validateJumpInRequirements,
  calculateVCRControlBonus,
  calculateVCRInitiativeBonus,
  calculateVCRBonuses,
  canPerformRiggingActions,
  getMaxVCRRating,
} from "../vcr-validator";
import {
  createTestCharacter,
  createTestVCRCyberware,
  createTestCharacterRCC,
  createTestCharacterDrone,
} from "./fixtures";
import type { CyberwareItem } from "@/lib/types/character";

// =============================================================================
// VCR DETECTION TESTS
// =============================================================================

describe("vcr-validator", () => {
  describe("hasVehicleControlRig", () => {
    it("should return false for character with no cyberware", () => {
      const character = createTestCharacter({ hasVCR: false });
      character.cyberware = [];
      expect(hasVehicleControlRig(character)).toBe(false);
    });

    it("should return false for character with undefined cyberware", () => {
      const character = createTestCharacter({ hasVCR: false });
      character.cyberware = undefined as unknown as CyberwareItem[];
      expect(hasVehicleControlRig(character)).toBe(false);
    });

    it("should return true for character with VCR via catalogId pattern", () => {
      const character = createTestCharacter({ hasVCR: true, vcrRating: 2 });
      expect(hasVehicleControlRig(character)).toBe(true);
    });

    it("should detect VCR with vehicle-control-rig catalogId", () => {
      const character = createTestCharacter();
      character.cyberware = [createTestVCRCyberware(2, { catalogId: "vehicle-control-rig-2" })];
      expect(hasVehicleControlRig(character)).toBe(true);
    });

    it("should detect VCR with vcr catalogId", () => {
      const character = createTestCharacter();
      character.cyberware = [
        createTestVCRCyberware(2, { catalogId: "vcr-rating-2", name: "Standard Implant" }),
      ];
      expect(hasVehicleControlRig(character)).toBe(true);
    });

    it("should detect VCR with control-rig catalogId", () => {
      const character = createTestCharacter();
      character.cyberware = [
        createTestVCRCyberware(2, { catalogId: "control-rig-mk2", name: "Standard Implant" }),
      ];
      expect(hasVehicleControlRig(character)).toBe(true);
    });

    it("should detect VCR by name pattern - vehicle control rig", () => {
      const character = createTestCharacter();
      character.cyberware = [
        createTestVCRCyberware(2, { catalogId: "custom-cyberware", name: "Vehicle Control Rig" }),
      ];
      expect(hasVehicleControlRig(character)).toBe(true);
    });

    it("should detect VCR by name pattern - control rig", () => {
      const character = createTestCharacter();
      character.cyberware = [
        createTestVCRCyberware(2, { catalogId: "custom-cyberware", name: "Control Rig Rating 3" }),
      ];
      expect(hasVehicleControlRig(character)).toBe(true);
    });

    it("should detect VCR by name pattern - VCR", () => {
      const character = createTestCharacter();
      character.cyberware = [
        createTestVCRCyberware(2, { catalogId: "custom-cyberware", name: "Standard VCR" }),
      ];
      expect(hasVehicleControlRig(character)).toBe(true);
    });

    it("should be case-insensitive for name matching", () => {
      const character = createTestCharacter();
      character.cyberware = [
        createTestVCRCyberware(2, { catalogId: "custom-cyberware", name: "VEHICLE CONTROL RIG" }),
      ];
      expect(hasVehicleControlRig(character)).toBe(true);
    });

    it("should return false for non-VCR cyberware", () => {
      const character = createTestCharacter();
      character.cyberware = [
        {
          id: "datajack-1",
          catalogId: "datajack",
          name: "Datajack",
          category: "headware",
          grade: "standard",
          rating: 1,
          baseEssenceCost: 0.1,
          essenceCost: 0.1,
          cost: 1000,
          availability: 4,
        },
      ];
      expect(hasVehicleControlRig(character)).toBe(false);
    });
  });

  describe("getVehicleControlRig", () => {
    it("should return null for character with no VCR", () => {
      const character = createTestCharacter({ hasVCR: false });
      character.cyberware = [];
      expect(getVehicleControlRig(character)).toBeNull();
    });

    it("should return null for undefined cyberware", () => {
      const character = createTestCharacter({ hasVCR: false });
      character.cyberware = undefined as unknown as CyberwareItem[];
      expect(getVehicleControlRig(character)).toBeNull();
    });

    it("should return VCR details for character with VCR", () => {
      const character = createTestCharacter({ hasVCR: true, vcrRating: 2 });
      const vcr = getVehicleControlRig(character);

      expect(vcr).not.toBeNull();
      expect(vcr!.rating).toBe(2);
      expect(vcr!.controlBonus).toBe(2);
      expect(vcr!.initiativeDiceBonus).toBe(2);
      expect(vcr!.essenceCost).toBe(2);
    });

    it("should default rating to 1 if not specified", () => {
      const character = createTestCharacter();
      character.cyberware = [
        {
          id: "vcr-1",
          catalogId: "vehicle-control-rig",
          name: "Vehicle Control Rig",
          category: "bodyware",
          grade: "standard",
          baseEssenceCost: 1,
          essenceCost: 1,
          cost: 43000,
          availability: 12,
        },
      ];
      const vcr = getVehicleControlRig(character);

      expect(vcr).not.toBeNull();
      expect(vcr!.rating).toBe(1);
    });

    it("should use cyberware grade if provided", () => {
      const character = createTestCharacter();
      character.cyberware = [createTestVCRCyberware(2, { grade: "alpha" })];
      const vcr = getVehicleControlRig(character);

      expect(vcr).not.toBeNull();
      expect(vcr!.grade).toBe("alpha");
    });

    it("should include catalogId in VCR details", () => {
      const character = createTestCharacter({ hasVCR: true, vcrRating: 3 });
      const vcr = getVehicleControlRig(character);

      expect(vcr).not.toBeNull();
      expect(vcr!.catalogId).toBe("vehicle-control-rig-2");
    });
  });

  // =============================================================================
  // VALIDATION TESTS
  // =============================================================================

  describe("validateJumpInRequirements", () => {
    it("should return valid for character with VCR", () => {
      const character = createTestCharacter({ hasVCR: true, vcrRating: 2 });
      const result = validateJumpInRequirements(character, "vehicle");

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.vcrRating).toBe(2);
      expect(result.controlBonus).toBe(2);
      expect(result.initiativeBonus).toBe(2);
    });

    it("should return invalid for character without VCR", () => {
      const character = createTestCharacter({ hasVCR: false });
      character.cyberware = [];
      const result = validateJumpInRequirements(character, "vehicle");

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].code).toBe("NO_VCR");
      expect(result.vcrRating).toBe(0);
      expect(result.controlBonus).toBe(0);
      expect(result.initiativeBonus).toBe(0);
    });

    it("should include appropriate message for vehicle target", () => {
      const character = createTestCharacter({ hasVCR: false });
      character.cyberware = [];
      const result = validateJumpInRequirements(character, "vehicle");

      expect(result.errors[0].message).toContain("vehicle");
    });

    it("should include appropriate message for drone target", () => {
      const character = createTestCharacter({ hasVCR: false });
      character.cyberware = [];
      const result = validateJumpInRequirements(character, "drone");

      expect(result.errors[0].message).toContain("drone");
    });

    it("should warn about unusual VCR rating below 1", () => {
      const character = createTestCharacter();
      character.cyberware = [createTestVCRCyberware(0)];
      const result = validateJumpInRequirements(character, "vehicle");

      expect(result.valid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0].code).toBe("INVALID_VCR_RATING");
    });

    it("should warn about unusual VCR rating above 3", () => {
      const character = createTestCharacter();
      character.cyberware = [createTestVCRCyberware(4)];
      const result = validateJumpInRequirements(character, "vehicle");

      expect(result.valid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0].code).toBe("INVALID_VCR_RATING");
    });

    it("should not warn for VCR ratings 1-3", () => {
      const character1 = createTestCharacter({ hasVCR: true, vcrRating: 1 });
      const character2 = createTestCharacter({ hasVCR: true, vcrRating: 2 });
      const character3 = createTestCharacter({ hasVCR: true, vcrRating: 3 });

      expect(validateJumpInRequirements(character1, "vehicle").warnings).toHaveLength(0);
      expect(validateJumpInRequirements(character2, "vehicle").warnings).toHaveLength(0);
      expect(validateJumpInRequirements(character3, "vehicle").warnings).toHaveLength(0);
    });
  });

  // =============================================================================
  // BONUS CALCULATION TESTS
  // =============================================================================

  describe("calculateVCRControlBonus", () => {
    it("should return VCR rating as control bonus for rating 1", () => {
      expect(calculateVCRControlBonus(1)).toBe(1);
    });

    it("should return VCR rating as control bonus for rating 2", () => {
      expect(calculateVCRControlBonus(2)).toBe(2);
    });

    it("should return VCR rating as control bonus for rating 3", () => {
      expect(calculateVCRControlBonus(3)).toBe(3);
    });

    it("should clamp control bonus to minimum 0", () => {
      expect(calculateVCRControlBonus(-1)).toBe(0);
      expect(calculateVCRControlBonus(0)).toBe(0);
    });

    it("should clamp control bonus to maximum 3", () => {
      expect(calculateVCRControlBonus(4)).toBe(3);
      expect(calculateVCRControlBonus(10)).toBe(3);
    });
  });

  describe("calculateVCRInitiativeBonus", () => {
    it("should return +1 for cold-sim VR mode", () => {
      expect(calculateVCRInitiativeBonus(2, "cold-sim")).toBe(1);
    });

    it("should return +2 for hot-sim VR mode", () => {
      expect(calculateVCRInitiativeBonus(2, "hot-sim")).toBe(2);
    });

    it("should return same bonus regardless of VCR rating for cold-sim", () => {
      expect(calculateVCRInitiativeBonus(1, "cold-sim")).toBe(1);
      expect(calculateVCRInitiativeBonus(2, "cold-sim")).toBe(1);
      expect(calculateVCRInitiativeBonus(3, "cold-sim")).toBe(1);
    });

    it("should return same bonus regardless of VCR rating for hot-sim", () => {
      expect(calculateVCRInitiativeBonus(1, "hot-sim")).toBe(2);
      expect(calculateVCRInitiativeBonus(2, "hot-sim")).toBe(2);
      expect(calculateVCRInitiativeBonus(3, "hot-sim")).toBe(2);
    });
  });

  describe("calculateVCRBonuses", () => {
    it("should return both control and initiative bonuses for cold-sim", () => {
      const bonuses = calculateVCRBonuses(2, "cold-sim");

      expect(bonuses.controlBonus).toBe(2);
      expect(bonuses.initiativeDice).toBe(1);
    });

    it("should return both control and initiative bonuses for hot-sim", () => {
      const bonuses = calculateVCRBonuses(3, "hot-sim");

      expect(bonuses.controlBonus).toBe(3);
      expect(bonuses.initiativeDice).toBe(2);
    });

    it("should clamp control bonus for VCR rating 1", () => {
      const bonuses = calculateVCRBonuses(1, "cold-sim");

      expect(bonuses.controlBonus).toBe(1);
      expect(bonuses.initiativeDice).toBe(1);
    });
  });

  // =============================================================================
  // RIGGING CAPABILITY TESTS
  // =============================================================================

  describe("canPerformRiggingActions", () => {
    it("should return true for character with VCR", () => {
      const character = createTestCharacter({ hasVCR: true });
      expect(canPerformRiggingActions(character)).toBe(true);
    });

    it("should return true for character with RCC (no VCR)", () => {
      const character = createTestCharacter({ hasVCR: false, hasRCC: true });
      expect(canPerformRiggingActions(character)).toBe(true);
    });

    it("should return true for character with drones (no VCR, no RCC)", () => {
      const character = createTestCharacter({ hasVCR: false });
      character.cyberware = [];
      character.rccs = [];
      character.drones = [createTestCharacterDrone("drone-1")];
      expect(canPerformRiggingActions(character)).toBe(true);
    });

    it("should return false for character with no rigging equipment", () => {
      const character = createTestCharacter({ hasVCR: false });
      character.cyberware = [];
      character.rccs = [];
      character.drones = [];
      expect(canPerformRiggingActions(character)).toBe(false);
    });

    it("should return false for undefined equipment arrays", () => {
      const character = createTestCharacter({ hasVCR: false });
      character.cyberware = [];
      character.rccs = undefined as unknown as typeof character.rccs;
      character.drones = undefined as unknown as typeof character.drones;
      expect(canPerformRiggingActions(character)).toBe(false);
    });
  });

  // =============================================================================
  // MULTIPLE VCR TESTS
  // =============================================================================

  describe("getMaxVCRRating", () => {
    it("should return 0 for character with no cyberware", () => {
      const character = createTestCharacter({ hasVCR: false });
      character.cyberware = [];
      expect(getMaxVCRRating(character)).toBe(0);
    });

    it("should return 0 for character with no VCR", () => {
      const character = createTestCharacter({ hasVCR: false });
      character.cyberware = [
        {
          id: "datajack-1",
          catalogId: "datajack",
          name: "Datajack",
          category: "headware",
          grade: "standard",
          rating: 1,
          baseEssenceCost: 0.1,
          essenceCost: 0.1,
          cost: 1000,
          availability: 4,
        },
      ];
      expect(getMaxVCRRating(character)).toBe(0);
    });

    it("should return VCR rating for single VCR", () => {
      const character = createTestCharacter({ hasVCR: true, vcrRating: 2 });
      expect(getMaxVCRRating(character)).toBe(2);
    });

    it("should return highest rating when multiple VCRs exist", () => {
      const character = createTestCharacter();
      character.cyberware = [
        createTestVCRCyberware(1),
        createTestVCRCyberware(3, { id: "vcr-2", catalogId: "vehicle-control-rig-3" }),
        createTestVCRCyberware(2, { id: "vcr-3", catalogId: "vehicle-control-rig-2-mk2" }),
      ];
      expect(getMaxVCRRating(character)).toBe(3);
    });

    it("should handle VCR with undefined rating (defaults to 1)", () => {
      const character = createTestCharacter();
      character.cyberware = [
        {
          id: "vcr-1",
          catalogId: "vehicle-control-rig",
          name: "Vehicle Control Rig",
          category: "bodyware",
          grade: "standard",
          baseEssenceCost: 1,
          essenceCost: 1,
          cost: 43000,
          availability: 12,
        },
      ];
      expect(getMaxVCRRating(character)).toBe(1);
    });
  });
});
