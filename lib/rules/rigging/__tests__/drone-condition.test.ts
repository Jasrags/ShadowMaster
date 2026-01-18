import { describe, it, expect } from "vitest";
import {
  calculateDroneConditionMonitor,
  getDroneDamageModifier,
  getDroneConditionStatus,
  applyDroneDamage,
  applyDamageToNetworkDrone,
  repairDroneDamage,
  fullyRepairDrone,
  repairNetworkDrone,
  isDroneDestroyed,
  isDroneDisabled,
  isDroneOperational,
  isDroneLightlyDamaged,
  isDroneModeratelyDamaged,
  isDroneHeavilyDamaged,
  isDroneCriticallyDamaged,
  getDroneDamageSeverity,
  getOperationalDrones,
  getDestroyedDrones,
  getDisabledDrones,
  getOperationalDroneCount,
  getNetworkHealthSummary,
  removeDestroyedDrones,
} from "../drone-condition";
import {
  createTestSlavedDrone,
  createTestDroneNetwork,
  createTestDamagedDrone,
  createNetworkWithDrones,
} from "./fixtures";

// =============================================================================
// CONDITION MONITOR CALCULATION TESTS
// =============================================================================

describe("drone-condition", () => {
  describe("calculateDroneConditionMonitor", () => {
    it("should calculate ceil(Body/2) + 8 for Body 1", () => {
      // ceil(1/2) + 8 = 1 + 8 = 9
      expect(calculateDroneConditionMonitor(1)).toBe(9);
    });

    it("should calculate ceil(Body/2) + 8 for Body 2", () => {
      // ceil(2/2) + 8 = 1 + 8 = 9
      expect(calculateDroneConditionMonitor(2)).toBe(9);
    });

    it("should calculate ceil(Body/2) + 8 for Body 3", () => {
      // ceil(3/2) + 8 = 2 + 8 = 10
      expect(calculateDroneConditionMonitor(3)).toBe(10);
    });

    it("should calculate ceil(Body/2) + 8 for Body 4", () => {
      // ceil(4/2) + 8 = 2 + 8 = 10
      expect(calculateDroneConditionMonitor(4)).toBe(10);
    });

    it("should calculate ceil(Body/2) + 8 for Body 6", () => {
      // ceil(6/2) + 8 = 3 + 8 = 11
      expect(calculateDroneConditionMonitor(6)).toBe(11);
    });

    it("should calculate ceil(Body/2) + 8 for Body 12", () => {
      // ceil(12/2) + 8 = 6 + 8 = 14
      expect(calculateDroneConditionMonitor(12)).toBe(14);
    });

    it("should handle Body 0", () => {
      // ceil(0/2) + 8 = 0 + 8 = 8
      expect(calculateDroneConditionMonitor(0)).toBe(8);
    });
  });

  describe("getDroneDamageModifier", () => {
    it("should return 0 for 0 damage", () => {
      // -Math.floor(0/3) returns -0, which is == 0 but !== 0
      expect(getDroneDamageModifier(0) === 0).toBe(true);
    });

    it("should return 0 for 1-2 damage", () => {
      // -Math.floor(1/3) returns -0
      expect(getDroneDamageModifier(1) === 0).toBe(true);
      expect(getDroneDamageModifier(2) === 0).toBe(true);
    });

    it("should return -1 for 3-5 damage", () => {
      expect(getDroneDamageModifier(3)).toBe(-1);
      expect(getDroneDamageModifier(4)).toBe(-1);
      expect(getDroneDamageModifier(5)).toBe(-1);
    });

    it("should return -2 for 6-8 damage", () => {
      expect(getDroneDamageModifier(6)).toBe(-2);
      expect(getDroneDamageModifier(7)).toBe(-2);
      expect(getDroneDamageModifier(8)).toBe(-2);
    });

    it("should return -3 for 9-11 damage", () => {
      expect(getDroneDamageModifier(9)).toBe(-3);
      expect(getDroneDamageModifier(10)).toBe(-3);
      expect(getDroneDamageModifier(11)).toBe(-3);
    });
  });

  describe("getDroneConditionStatus", () => {
    it("should return full status for undamaged drone", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 0,
        conditionMonitorMax: 10,
      });
      const status = getDroneConditionStatus(drone);

      expect(status.conditionMonitorMax).toBe(10);
      expect(status.currentDamage).toBe(0);
      expect(status.remainingBoxes).toBe(10);
      expect(status.damageModifier === 0).toBe(true); // -0 == 0
      expect(status.isDisabled).toBe(false);
      expect(status.isDestroyed).toBe(false);
    });

    it("should return correct status for damaged drone", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 6,
        conditionMonitorMax: 10,
      });
      const status = getDroneConditionStatus(drone);

      expect(status.currentDamage).toBe(6);
      expect(status.remainingBoxes).toBe(4);
      expect(status.damageModifier).toBe(-2); // 6/3 = 2
      expect(status.isDisabled).toBe(false);
      expect(status.isDestroyed).toBe(false);
    });

    it("should mark drone as disabled at max damage", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 10,
        conditionMonitorMax: 10,
      });
      const status = getDroneConditionStatus(drone);

      expect(status.remainingBoxes).toBe(0);
      expect(status.isDisabled).toBe(true);
      expect(status.isDestroyed).toBe(false);
    });

    it("should mark drone as destroyed with overflow", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 11,
        conditionMonitorMax: 10,
      });
      const status = getDroneConditionStatus(drone);

      expect(status.isDisabled).toBe(true);
      expect(status.isDestroyed).toBe(true);
    });
  });

  // =============================================================================
  // DAMAGE APPLICATION TESTS
  // =============================================================================

  describe("applyDroneDamage", () => {
    it("should apply damage to undamaged drone", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 0,
        conditionMonitorMax: 10,
      });
      const result = applyDroneDamage(drone, 3);

      expect(result.drone.conditionDamageTaken).toBe(3);
      expect(result.damageApplied).toBe(3);
      expect(result.overflow).toBe(0);
      expect(result.wasDestroyed).toBe(false);
      expect(result.previousDamage).toBe(0);
    });

    it("should accumulate damage", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 4,
        conditionMonitorMax: 10,
      });
      const result = applyDroneDamage(drone, 3);

      expect(result.drone.conditionDamageTaken).toBe(7);
      expect(result.previousDamage).toBe(4);
    });

    it("should calculate overflow damage", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 8,
        conditionMonitorMax: 10,
      });
      const result = applyDroneDamage(drone, 5);

      expect(result.overflow).toBe(3); // 8 + 5 = 13, overflow = 13 - 10 = 3
      expect(result.wasDestroyed).toBe(true);
    });

    it("should mark drone as destroyed with overflow", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 5,
        conditionMonitorMax: 10,
      });
      const result = applyDroneDamage(drone, 6);

      expect(result.wasDestroyed).toBe(true);
      expect(result.drone.conditionDamageTaken).toBe(11); // max + 1 for destroyed state
    });

    it("should cap damage at conditionMonitorMax + 1", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 0,
        conditionMonitorMax: 10,
      });
      const result = applyDroneDamage(drone, 100);

      expect(result.drone.conditionDamageTaken).toBe(11);
      expect(result.overflow).toBe(90);
    });
  });

  describe("applyDamageToNetworkDrone", () => {
    it("should apply damage to drone in network", () => {
      const network = createNetworkWithDrones(3);
      const { network: updated, result } = applyDamageToNetworkDrone(network, "drone-1", 5);

      expect(result).not.toBeNull();
      expect(result!.drone.conditionDamageTaken).toBe(5);
      expect(updated.slavedDrones.find((d) => d.droneId === "drone-1")?.conditionDamageTaken).toBe(
        5
      );
    });

    it("should return null result for non-existent drone", () => {
      const network = createNetworkWithDrones(3);
      const { network: updated, result } = applyDamageToNetworkDrone(network, "nonexistent", 5);

      expect(result).toBeNull();
      expect(updated).toBe(network);
    });

    it("should not affect other drones", () => {
      const network = createNetworkWithDrones(3);
      const { network: updated } = applyDamageToNetworkDrone(network, "drone-1", 5);

      expect(updated.slavedDrones.find((d) => d.droneId === "drone-2")?.conditionDamageTaken).toBe(
        0
      );
      expect(updated.slavedDrones.find((d) => d.droneId === "drone-3")?.conditionDamageTaken).toBe(
        0
      );
    });
  });

  // =============================================================================
  // REPAIR TESTS
  // =============================================================================

  describe("repairDroneDamage", () => {
    it("should repair damage", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 6,
        conditionMonitorMax: 10,
      });
      const result = repairDroneDamage(drone, 3);

      expect(result.drone.conditionDamageTaken).toBe(3);
      expect(result.healedAmount).toBe(3);
      expect(result.previousDamage).toBe(6);
      expect(result.currentDamage).toBe(3);
    });

    it("should not overheal", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 4,
        conditionMonitorMax: 10,
      });
      const result = repairDroneDamage(drone, 10);

      expect(result.drone.conditionDamageTaken).toBe(0);
      expect(result.healedAmount).toBe(4);
    });

    it("should do nothing for undamaged drone", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 0,
        conditionMonitorMax: 10,
      });
      const result = repairDroneDamage(drone, 5);

      expect(result.drone.conditionDamageTaken).toBe(0);
      expect(result.healedAmount).toBe(0);
    });
  });

  describe("fullyRepairDrone", () => {
    it("should fully repair damaged drone", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 8,
        conditionMonitorMax: 10,
      });
      const repaired = fullyRepairDrone(drone);

      expect(repaired.conditionDamageTaken).toBe(0);
    });

    it("should return undamaged drone unchanged", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 0,
        conditionMonitorMax: 10,
      });
      const repaired = fullyRepairDrone(drone);

      expect(repaired.conditionDamageTaken).toBe(0);
    });
  });

  describe("repairNetworkDrone", () => {
    it("should repair drone in network", () => {
      const network = createTestDroneNetwork({
        slavedDrones: [
          createTestSlavedDrone("d1", { conditionDamageTaken: 6, conditionMonitorMax: 10 }),
          createTestSlavedDrone("d2", { conditionDamageTaken: 4, conditionMonitorMax: 10 }),
        ],
      });
      const { network: updated, result } = repairNetworkDrone(network, "d1", 3);

      expect(result).not.toBeNull();
      expect(result!.drone.conditionDamageTaken).toBe(3);
      expect(updated.slavedDrones.find((d) => d.droneId === "d1")?.conditionDamageTaken).toBe(3);
    });

    it("should return null for non-existent drone", () => {
      const network = createNetworkWithDrones(2);
      const { result } = repairNetworkDrone(network, "nonexistent", 5);

      expect(result).toBeNull();
    });
  });

  // =============================================================================
  // STATUS CHECK TESTS
  // =============================================================================

  describe("isDroneDestroyed", () => {
    it("should return false for undamaged drone", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 0,
        conditionMonitorMax: 10,
      });
      expect(isDroneDestroyed(drone)).toBe(false);
    });

    it("should return false for damaged but not destroyed drone", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 9,
        conditionMonitorMax: 10,
      });
      expect(isDroneDestroyed(drone)).toBe(false);
    });

    it("should return false at exactly max damage (disabled, not destroyed)", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 10,
        conditionMonitorMax: 10,
      });
      expect(isDroneDestroyed(drone)).toBe(false);
    });

    it("should return true for destroyed drone (overflow)", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 11,
        conditionMonitorMax: 10,
      });
      expect(isDroneDestroyed(drone)).toBe(true);
    });
  });

  describe("isDroneDisabled", () => {
    it("should return false for operational drone", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 9,
        conditionMonitorMax: 10,
      });
      expect(isDroneDisabled(drone)).toBe(false);
    });

    it("should return true at exactly max damage", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 10,
        conditionMonitorMax: 10,
      });
      expect(isDroneDisabled(drone)).toBe(true);
    });

    it("should return true for destroyed drone", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 11,
        conditionMonitorMax: 10,
      });
      expect(isDroneDisabled(drone)).toBe(true);
    });
  });

  describe("isDroneOperational", () => {
    it("should return true for undamaged drone", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 0,
        conditionMonitorMax: 10,
      });
      expect(isDroneOperational(drone)).toBe(true);
    });

    it("should return true for damaged but operational drone", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 9,
        conditionMonitorMax: 10,
      });
      expect(isDroneOperational(drone)).toBe(true);
    });

    it("should return false at max damage", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 10,
        conditionMonitorMax: 10,
      });
      expect(isDroneOperational(drone)).toBe(false);
    });

    it("should return false for destroyed drone", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 11,
        conditionMonitorMax: 10,
      });
      expect(isDroneOperational(drone)).toBe(false);
    });
  });

  // =============================================================================
  // DAMAGE SEVERITY TESTS
  // =============================================================================

  describe("isDroneLightlyDamaged", () => {
    it("should return false for undamaged drone", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 0,
        conditionMonitorMax: 10,
      });
      expect(isDroneLightlyDamaged(drone)).toBe(false);
    });

    it("should return true for <25% damage", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 2,
        conditionMonitorMax: 10,
      }); // 20%
      expect(isDroneLightlyDamaged(drone)).toBe(true);
    });

    it("should return false at 25% damage", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 3,
        conditionMonitorMax: 12,
      }); // 25%
      expect(isDroneLightlyDamaged(drone)).toBe(false);
    });
  });

  describe("isDroneModeratelyDamaged", () => {
    it("should return false for <25% damage", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 2,
        conditionMonitorMax: 10,
      });
      expect(isDroneModeratelyDamaged(drone)).toBe(false);
    });

    it("should return true for 25-50% damage", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 3,
        conditionMonitorMax: 10,
      }); // 30%
      expect(isDroneModeratelyDamaged(drone)).toBe(true);
    });

    it("should return false at 50% damage", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 5,
        conditionMonitorMax: 10,
      }); // 50%
      expect(isDroneModeratelyDamaged(drone)).toBe(false);
    });
  });

  describe("isDroneHeavilyDamaged", () => {
    it("should return false for <50% damage", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 4,
        conditionMonitorMax: 10,
      }); // 40%
      expect(isDroneHeavilyDamaged(drone)).toBe(false);
    });

    it("should return true for 50-75% damage", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 6,
        conditionMonitorMax: 10,
      }); // 60%
      expect(isDroneHeavilyDamaged(drone)).toBe(true);
    });

    it("should return false at 75% damage", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 9,
        conditionMonitorMax: 12,
      }); // 75%
      expect(isDroneHeavilyDamaged(drone)).toBe(false);
    });
  });

  describe("isDroneCriticallyDamaged", () => {
    it("should return false for <75% damage", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 7,
        conditionMonitorMax: 10,
      }); // 70%
      expect(isDroneCriticallyDamaged(drone)).toBe(false);
    });

    it("should return true for 75-99% damage", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 8,
        conditionMonitorMax: 10,
      }); // 80%
      expect(isDroneCriticallyDamaged(drone)).toBe(true);
    });

    it("should return false at max damage (disabled)", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 10,
        conditionMonitorMax: 10,
      });
      expect(isDroneCriticallyDamaged(drone)).toBe(false);
    });
  });

  describe("getDroneDamageSeverity", () => {
    it("should return undamaged for 0 damage", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 0,
        conditionMonitorMax: 10,
      });
      expect(getDroneDamageSeverity(drone)).toBe("undamaged");
    });

    it("should return light for <25% damage", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 2,
        conditionMonitorMax: 10,
      });
      expect(getDroneDamageSeverity(drone)).toBe("light");
    });

    it("should return moderate for 25-50% damage", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 3,
        conditionMonitorMax: 10,
      });
      expect(getDroneDamageSeverity(drone)).toBe("moderate");
    });

    it("should return heavy for 50-75% damage", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 6,
        conditionMonitorMax: 10,
      });
      expect(getDroneDamageSeverity(drone)).toBe("heavy");
    });

    it("should return critical for 75-99% damage", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 8,
        conditionMonitorMax: 10,
      });
      expect(getDroneDamageSeverity(drone)).toBe("critical");
    });

    it("should return disabled at max damage", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 10,
        conditionMonitorMax: 10,
      });
      expect(getDroneDamageSeverity(drone)).toBe("disabled");
    });

    it("should return destroyed for overflow damage", () => {
      const drone = createTestSlavedDrone("d1", {
        conditionDamageTaken: 11,
        conditionMonitorMax: 10,
      });
      expect(getDroneDamageSeverity(drone)).toBe("destroyed");
    });
  });

  // =============================================================================
  // NETWORK-LEVEL QUERY TESTS
  // =============================================================================

  describe("getOperationalDrones", () => {
    it("should return all drones when none damaged", () => {
      const network = createNetworkWithDrones(3);
      const operational = getOperationalDrones(network);

      expect(operational.length).toBe(3);
    });

    it("should exclude disabled drones", () => {
      const network = createTestDroneNetwork({
        slavedDrones: [
          createTestSlavedDrone("d1", { conditionDamageTaken: 0, conditionMonitorMax: 10 }),
          createTestSlavedDrone("d2", { conditionDamageTaken: 10, conditionMonitorMax: 10 }),
          createTestSlavedDrone("d3", { conditionDamageTaken: 5, conditionMonitorMax: 10 }),
        ],
      });
      const operational = getOperationalDrones(network);

      expect(operational.length).toBe(2);
      expect(operational.map((d) => d.droneId)).toContain("d1");
      expect(operational.map((d) => d.droneId)).toContain("d3");
    });
  });

  describe("getDestroyedDrones", () => {
    it("should return empty array when no destroyed drones", () => {
      const network = createNetworkWithDrones(3);
      const destroyed = getDestroyedDrones(network);

      expect(destroyed.length).toBe(0);
    });

    it("should return only destroyed drones", () => {
      const network = createTestDroneNetwork({
        slavedDrones: [
          createTestSlavedDrone("d1", { conditionDamageTaken: 11, conditionMonitorMax: 10 }),
          createTestSlavedDrone("d2", { conditionDamageTaken: 10, conditionMonitorMax: 10 }),
          createTestSlavedDrone("d3", { conditionDamageTaken: 12, conditionMonitorMax: 10 }),
        ],
      });
      const destroyed = getDestroyedDrones(network);

      expect(destroyed.length).toBe(2);
      expect(destroyed.map((d) => d.droneId)).toContain("d1");
      expect(destroyed.map((d) => d.droneId)).toContain("d3");
    });
  });

  describe("getDisabledDrones", () => {
    it("should return all disabled drones (including destroyed)", () => {
      const network = createTestDroneNetwork({
        slavedDrones: [
          createTestSlavedDrone("d1", { conditionDamageTaken: 0, conditionMonitorMax: 10 }),
          createTestSlavedDrone("d2", { conditionDamageTaken: 10, conditionMonitorMax: 10 }), // disabled
          createTestSlavedDrone("d3", { conditionDamageTaken: 11, conditionMonitorMax: 10 }), // destroyed
        ],
      });
      const disabled = getDisabledDrones(network);

      expect(disabled.length).toBe(2);
    });
  });

  describe("getOperationalDroneCount", () => {
    it("should return correct count", () => {
      const network = createTestDroneNetwork({
        slavedDrones: [
          createTestSlavedDrone("d1", { conditionDamageTaken: 0, conditionMonitorMax: 10 }),
          createTestSlavedDrone("d2", { conditionDamageTaken: 10, conditionMonitorMax: 10 }),
          createTestSlavedDrone("d3", { conditionDamageTaken: 5, conditionMonitorMax: 10 }),
        ],
      });
      expect(getOperationalDroneCount(network)).toBe(2);
    });
  });

  describe("getNetworkHealthSummary", () => {
    it("should return correct summary for mixed network", () => {
      const network = createTestDroneNetwork({
        slavedDrones: [
          createTestSlavedDrone("d1", { conditionDamageTaken: 0, conditionMonitorMax: 10 }),
          createTestSlavedDrone("d2", { conditionDamageTaken: 5, conditionMonitorMax: 10 }),
          createTestSlavedDrone("d3", { conditionDamageTaken: 10, conditionMonitorMax: 10 }),
          createTestSlavedDrone("d4", { conditionDamageTaken: 11, conditionMonitorMax: 10 }),
        ],
      });
      const summary = getNetworkHealthSummary(network);

      expect(summary.total).toBe(4);
      expect(summary.operational).toBe(2); // d1, d2
      expect(summary.disabled).toBe(1); // d3 (disabled but not destroyed)
      expect(summary.destroyed).toBe(1); // d4
      expect(summary.averageDamagePercent).toBeCloseTo(65); // (0 + 50 + 100 + 110) / 4 = 65%
    });

    it("should handle empty network", () => {
      const network = createTestDroneNetwork({ slavedDrones: [] });
      const summary = getNetworkHealthSummary(network);

      expect(summary.total).toBe(0);
      expect(summary.operational).toBe(0);
      expect(summary.disabled).toBe(0);
      expect(summary.destroyed).toBe(0);
      expect(summary.averageDamagePercent).toBe(0);
    });
  });

  describe("removeDestroyedDrones", () => {
    it("should remove only destroyed drones", () => {
      const network = createTestDroneNetwork({
        slavedDrones: [
          createTestSlavedDrone("d1", { conditionDamageTaken: 0, conditionMonitorMax: 10 }),
          createTestSlavedDrone("d2", { conditionDamageTaken: 10, conditionMonitorMax: 10 }),
          createTestSlavedDrone("d3", { conditionDamageTaken: 11, conditionMonitorMax: 10 }),
        ],
      });
      const cleaned = removeDestroyedDrones(network);

      expect(cleaned.slavedDrones.length).toBe(2);
      expect(cleaned.slavedDrones.map((d) => d.droneId)).toContain("d1");
      expect(cleaned.slavedDrones.map((d) => d.droneId)).toContain("d2");
    });

    it("should keep all drones when none destroyed", () => {
      const network = createNetworkWithDrones(3);
      const cleaned = removeDestroyedDrones(network);

      expect(cleaned.slavedDrones.length).toBe(3);
    });
  });
});
