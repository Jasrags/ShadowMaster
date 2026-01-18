import { describe, it, expect } from "vitest";
import {
  createDroneNetwork,
  calculateDroneConditionMonitor,
  slaveDroneToNetwork,
  releaseDroneFromNetwork,
  releaseAllDrones,
  shareAutosoftToNetwork,
  unshareAutosoftFromNetwork,
  getEffectiveAutosoftRating,
  getEffectiveAutosofts,
  issueDroneCommand,
  issueNetworkCommand,
  clearDroneCommand,
  clearAllCommands,
  updateDronePosition,
  updateAllDronePositions,
  getDroneFromNetwork,
  getSlavedDroneCount,
  getRemainingCapacity,
  isNetworkFull,
  getDronesWithCommand,
  getJumpedInDrone,
} from "../drone-network";
import {
  createTestDroneNetwork,
  createTestRCCConfiguration,
  createTestCharacterDrone,
  createTestCharacterAutosoft,
  createTestSharedAutosoft,
  createTestSlavedDrone,
  createNetworkWithDrones,
} from "./fixtures";

// =============================================================================
// NETWORK CREATION TESTS
// =============================================================================

describe("drone-network", () => {
  describe("createDroneNetwork", () => {
    it("should create network from RCC configuration", () => {
      const rccConfig = createTestRCCConfiguration({
        dataProcessing: 4,
        runningAutosofts: [],
      });
      const network = createDroneNetwork("network-1", rccConfig);

      expect(network.networkId).toBe("network-1");
      expect(network.rccId).toBe("rcc-1");
      expect(network.maxDrones).toBe(12); // 4 × 3
      expect(network.slavedDrones).toHaveLength(0);
      expect(network.sharedAutosofts).toHaveLength(0);
      expect(network.baseNoise).toBe(0);
    });

    it("should convert running autosofts to shared autosofts", () => {
      const rccConfig = createTestRCCConfiguration({
        runningAutosofts: [
          { autosoftId: "maneuvering-4", name: "Maneuvering", rating: 4, category: "movement" },
          {
            autosoftId: "targeting-3",
            name: "Targeting",
            rating: 3,
            category: "combat",
            target: "Ares Predator",
          },
        ],
      });
      const network = createDroneNetwork("network-1", rccConfig);

      expect(network.sharedAutosofts).toHaveLength(2);
      expect(network.sharedAutosofts[0].name).toBe("Maneuvering");
      expect(network.sharedAutosofts[1].target).toBe("Ares Predator");
    });
  });

  describe("calculateDroneConditionMonitor", () => {
    it("should calculate condition monitor from body", () => {
      // ceil(body/2) + 8
      expect(calculateDroneConditionMonitor(1)).toBe(9); // ceil(0.5) + 8 = 9
      expect(calculateDroneConditionMonitor(4)).toBe(10); // ceil(2) + 8 = 10
      expect(calculateDroneConditionMonitor(8)).toBe(12); // ceil(4) + 8 = 12
    });
  });

  // =============================================================================
  // SLAVING OPERATIONS TESTS
  // =============================================================================

  describe("slaveDroneToNetwork", () => {
    it("should slave drone to network", () => {
      const network = createTestDroneNetwork({ maxDrones: 12 });
      const drone = createTestCharacterDrone("drone-1", { body: 4, pilot: 3 });
      const result = slaveDroneToNetwork(network, drone, 4);

      expect(result.success).toBe(true);
      expect(result.network.slavedDrones).toHaveLength(1);
      expect(result.slavedDrone).toBeDefined();
      expect(result.slavedDrone!.droneId).toBe("drone-1");
      expect(result.slavedDrone!.pilotRating).toBe(3);
    });

    it("should calculate condition monitor for slaved drone", () => {
      const network = createTestDroneNetwork();
      const drone = createTestCharacterDrone("drone-1", { body: 4 });
      const result = slaveDroneToNetwork(network, drone, 4);

      // ceil(4/2) + 8 = 10
      expect(result.slavedDrone!.conditionMonitorMax).toBe(10);
    });

    it("should calculate noise for drone at distance", () => {
      const network = createTestDroneNetwork();
      const drone = createTestCharacterDrone("drone-1");
      const result = slaveDroneToNetwork(network, drone, 4, 5000); // 5km = 3 noise - 4 reduction = 0

      expect(result.slavedDrone!.distanceFromRigger).toBe(5000);
      expect(result.slavedDrone!.noisePenalty).toBe(0);
    });

    it("should fail when network is at capacity", () => {
      const network = createNetworkWithDrones(3, 3); // 3 drones, max 3
      const drone = createTestCharacterDrone("drone-4");
      const result = slaveDroneToNetwork(network, drone, 4);

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe("NETWORK_FULL");
    });

    it("should fail when drone is already slaved", () => {
      const network = createNetworkWithDrones(1);
      const drone = createTestCharacterDrone("drone-1");
      const result = slaveDroneToNetwork(network, drone, 4);

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe("ALREADY_SLAVED");
    });

    it("should resolve installed autosofts", () => {
      const network = createTestDroneNetwork();
      const autosofts = [createTestCharacterAutosoft("a1", { catalogId: "clearsight-4" })];
      const drone = createTestCharacterDrone("drone-1", { installedAutosofts: ["a1"] });
      const result = slaveDroneToNetwork(network, drone, 4, 0, autosofts);

      expect(result.slavedDrone!.installedAutosofts).toHaveLength(1);
      expect(result.slavedDrone!.installedAutosofts[0].autosoftId).toBe("clearsight-4");
    });
  });

  describe("releaseDroneFromNetwork", () => {
    it("should release drone from network", () => {
      const network = createNetworkWithDrones(3);
      const updated = releaseDroneFromNetwork(network, "drone-2");

      expect(updated.slavedDrones).toHaveLength(2);
      expect(updated.slavedDrones.find((d) => d.droneId === "drone-2")).toBeUndefined();
    });

    it("should do nothing when drone not in network", () => {
      const network = createNetworkWithDrones(3);
      const updated = releaseDroneFromNetwork(network, "nonexistent");

      expect(updated.slavedDrones).toHaveLength(3);
    });
  });

  describe("releaseAllDrones", () => {
    it("should release all drones", () => {
      const network = createNetworkWithDrones(5);
      const updated = releaseAllDrones(network);

      expect(updated.slavedDrones).toHaveLength(0);
      expect(updated.maxDrones).toBe(12); // Other properties preserved
    });

    it("should handle empty network", () => {
      const network = createTestDroneNetwork();
      const updated = releaseAllDrones(network);

      expect(updated.slavedDrones).toHaveLength(0);
    });
  });

  // =============================================================================
  // AUTOSOFT SHARING TESTS
  // =============================================================================

  describe("shareAutosoftToNetwork", () => {
    it("should add autosoft to shared list", () => {
      const network = createTestDroneNetwork();
      const autosoft = createTestCharacterAutosoft("a1", {
        catalogId: "maneuvering-5",
        name: "Maneuvering",
        rating: 5,
        category: "movement",
      });
      const updated = shareAutosoftToNetwork(network, autosoft);

      expect(updated.sharedAutosofts).toHaveLength(1);
      expect(updated.sharedAutosofts[0].rating).toBe(5);
    });

    it("should preserve existing shared autosofts", () => {
      const network = createTestDroneNetwork({
        sharedAutosofts: [createTestSharedAutosoft({ autosoftId: "existing" })],
      });
      const autosoft = createTestCharacterAutosoft("a1");
      const updated = shareAutosoftToNetwork(network, autosoft);

      expect(updated.sharedAutosofts).toHaveLength(2);
    });
  });

  describe("unshareAutosoftFromNetwork", () => {
    it("should remove autosoft from shared list", () => {
      const network = createTestDroneNetwork({
        sharedAutosofts: [
          createTestSharedAutosoft({ autosoftId: "a1" }),
          createTestSharedAutosoft({ autosoftId: "a2" }),
        ],
      });
      const updated = unshareAutosoftFromNetwork(network, "a1");

      expect(updated.sharedAutosofts).toHaveLength(1);
      expect(updated.sharedAutosofts[0].autosoftId).toBe("a2");
    });

    it("should do nothing when autosoft not shared", () => {
      const network = createTestDroneNetwork({
        sharedAutosofts: [createTestSharedAutosoft()],
      });
      const updated = unshareAutosoftFromNetwork(network, "nonexistent");

      expect(updated.sharedAutosofts).toHaveLength(1);
    });
  });

  describe("getEffectiveAutosoftRating", () => {
    it("should return installed autosoft rating when no shared", () => {
      const drone = createTestSlavedDrone("d1", {
        installedAutosofts: [
          { autosoftId: "a1", name: "Maneuvering", rating: 4, category: "movement" },
        ],
      });
      const rating = getEffectiveAutosoftRating(drone, "movement", []);

      expect(rating).toBe(4);
    });

    it("should return shared autosoft rating when no installed", () => {
      const drone = createTestSlavedDrone("d1", { installedAutosofts: [] });
      const sharedAutosofts = [createTestSharedAutosoft({ rating: 5, category: "movement" })];
      const rating = getEffectiveAutosoftRating(drone, "movement", sharedAutosofts);

      expect(rating).toBe(5);
    });

    it("should return higher of installed vs shared", () => {
      const drone = createTestSlavedDrone("d1", {
        installedAutosofts: [
          { autosoftId: "a1", name: "Maneuvering", rating: 3, category: "movement" },
        ],
      });
      const sharedAutosofts = [createTestSharedAutosoft({ rating: 5, category: "movement" })];
      const rating = getEffectiveAutosoftRating(drone, "movement", sharedAutosofts);

      expect(rating).toBe(5);
    });

    it("should return 0 when no matching autosoft", () => {
      const drone = createTestSlavedDrone("d1", { installedAutosofts: [] });
      const rating = getEffectiveAutosoftRating(drone, "combat", []);

      expect(rating).toBe(0);
    });

    it("should match by target when specified", () => {
      const drone = createTestSlavedDrone("d1", { installedAutosofts: [] });
      const sharedAutosofts = [
        createTestSharedAutosoft({ rating: 3, category: "combat", target: "Ares Predator" }),
        createTestSharedAutosoft({ rating: 5, category: "combat", target: "Colt M23" }),
      ];
      const rating = getEffectiveAutosoftRating(drone, "combat", sharedAutosofts, "Ares Predator");

      expect(rating).toBe(3);
    });
  });

  describe("getEffectiveAutosofts", () => {
    it("should merge installed and shared autosofts", () => {
      const drone = createTestSlavedDrone("d1", {
        installedAutosofts: [
          { autosoftId: "a1", name: "Clearsight", rating: 3, category: "perception" },
        ],
      });
      const sharedAutosofts = [
        createTestSharedAutosoft({
          autosoftId: "a2",
          name: "Maneuvering",
          rating: 4,
          category: "movement",
        }),
      ];
      const effective = getEffectiveAutosofts(drone, sharedAutosofts);

      expect(effective).toHaveLength(2);
    });

    it("should use higher rating when both installed and shared", () => {
      const drone = createTestSlavedDrone("d1", {
        installedAutosofts: [
          { autosoftId: "a1", name: "Maneuvering", rating: 5, category: "movement" },
        ],
      });
      const sharedAutosofts = [
        createTestSharedAutosoft({ autosoftId: "a2", rating: 3, category: "movement" }),
      ];
      const effective = getEffectiveAutosofts(drone, sharedAutosofts);

      expect(effective).toHaveLength(1);
      expect(effective[0].rating).toBe(5);
    });
  });

  // =============================================================================
  // COMMAND ISSUANCE TESTS
  // =============================================================================

  describe("issueDroneCommand", () => {
    it("should issue command to single drone", () => {
      const network = createNetworkWithDrones(3);
      const result = issueDroneCommand(network, "drone-2", "watch");

      expect(result.success).toBe(true);
      expect(result.affectedDrones).toEqual(["drone-2"]);
      expect(result.network.slavedDrones.find((d) => d.droneId === "drone-2")?.currentCommand).toBe(
        "watch"
      );
    });

    it("should not affect other drones", () => {
      const network = createNetworkWithDrones(3);
      const result = issueDroneCommand(network, "drone-2", "attack");

      expect(
        result.network.slavedDrones.find((d) => d.droneId === "drone-1")?.currentCommand
      ).toBeUndefined();
      expect(
        result.network.slavedDrones.find((d) => d.droneId === "drone-3")?.currentCommand
      ).toBeUndefined();
    });

    it("should fail for non-existent drone", () => {
      const network = createNetworkWithDrones(2);
      const result = issueDroneCommand(network, "nonexistent", "watch");

      expect(result.success).toBe(false);
      expect(result.errors.some((e) => e.code === "DRONE_NOT_FOUND")).toBe(true);
      expect(result.affectedDrones).toHaveLength(0);
    });

    it("should set custom description for custom command", () => {
      const network = createNetworkWithDrones(1);
      const result = issueDroneCommand(network, "drone-1", "custom", "Circle the building");

      expect(result.network.slavedDrones[0].currentCommand).toBe("custom");
      expect(result.network.slavedDrones[0].customCommandDescription).toBe("Circle the building");
    });
  });

  describe("issueNetworkCommand", () => {
    it("should issue command to all drones", () => {
      const network = createNetworkWithDrones(3);
      const result = issueNetworkCommand(network, "defend");

      expect(result.success).toBe(true);
      expect(result.affectedDrones).toHaveLength(3);
      expect(result.network.slavedDrones.every((d) => d.currentCommand === "defend")).toBe(true);
    });

    it("should handle empty network", () => {
      const network = createTestDroneNetwork();
      const result = issueNetworkCommand(network, "watch");

      expect(result.success).toBe(true);
      expect(result.affectedDrones).toHaveLength(0);
    });
  });

  describe("clearDroneCommand", () => {
    it("should clear command from single drone", () => {
      let network = createNetworkWithDrones(2);
      network = issueDroneCommand(network, "drone-1", "watch").network;
      network = issueDroneCommand(network, "drone-2", "attack").network;

      network = clearDroneCommand(network, "drone-1");

      expect(
        network.slavedDrones.find((d) => d.droneId === "drone-1")?.currentCommand
      ).toBeUndefined();
      expect(network.slavedDrones.find((d) => d.droneId === "drone-2")?.currentCommand).toBe(
        "attack"
      );
    });
  });

  describe("clearAllCommands", () => {
    it("should clear all commands", () => {
      let network = createNetworkWithDrones(3);
      network = issueNetworkCommand(network, "watch").network;

      network = clearAllCommands(network);

      expect(network.slavedDrones.every((d) => d.currentCommand === undefined)).toBe(true);
    });
  });

  // =============================================================================
  // POSITION & NOISE UPDATE TESTS
  // =============================================================================

  describe("updateDronePosition", () => {
    it("should update drone distance and recalculate noise", () => {
      const network = createNetworkWithDrones(1);
      const updated = updateDronePosition(network, "drone-1", 5000, 2); // 5km = 3 noise - 2 reduction = 1

      expect(updated.slavedDrones[0].distanceFromRigger).toBe(5000);
      expect(updated.slavedDrones[0].noisePenalty).toBe(1);
    });

    it("should include environment modifiers in noise calc", () => {
      const network = createNetworkWithDrones(1);
      const updated = updateDronePosition(network, "drone-1", 100, 0, {
        spamZone: "medium",
        staticZone: "light",
      });

      // 0 distance + 2 spam + 1 static = 3
      expect(updated.slavedDrones[0].noisePenalty).toBe(3);
    });

    it("should not affect other drones", () => {
      const network = createNetworkWithDrones(2);
      const updated = updateDronePosition(network, "drone-1", 10000, 0);

      expect(updated.slavedDrones.find((d) => d.droneId === "drone-2")?.distanceFromRigger).toBe(0);
    });
  });

  describe("updateAllDronePositions", () => {
    it("should update multiple drone positions", () => {
      const network = createNetworkWithDrones(3);
      const updated = updateAllDronePositions(
        network,
        [
          { droneId: "drone-1", distanceMeters: 100 },
          { droneId: "drone-3", distanceMeters: 5000 },
        ],
        3
      );

      expect(updated.slavedDrones.find((d) => d.droneId === "drone-1")?.distanceFromRigger).toBe(
        100
      );
      expect(updated.slavedDrones.find((d) => d.droneId === "drone-3")?.distanceFromRigger).toBe(
        5000
      );
      expect(updated.slavedDrones.find((d) => d.droneId === "drone-2")?.distanceFromRigger).toBe(0);
    });

    it("should ignore positions for non-existent drones", () => {
      const network = createNetworkWithDrones(1);
      const updated = updateAllDronePositions(
        network,
        [{ droneId: "nonexistent", distanceMeters: 1000 }],
        0
      );

      expect(updated.slavedDrones).toHaveLength(1);
    });
  });

  // =============================================================================
  // NETWORK QUERY TESTS
  // =============================================================================

  describe("getDroneFromNetwork", () => {
    it("should return drone when found", () => {
      const network = createNetworkWithDrones(3);
      const drone = getDroneFromNetwork(network, "drone-2");

      expect(drone).not.toBeNull();
      expect(drone!.droneId).toBe("drone-2");
    });

    it("should return null when not found", () => {
      const network = createNetworkWithDrones(2);
      const drone = getDroneFromNetwork(network, "nonexistent");

      expect(drone).toBeNull();
    });
  });

  describe("getSlavedDroneCount", () => {
    it("should return correct count", () => {
      const network = createNetworkWithDrones(5);
      expect(getSlavedDroneCount(network)).toBe(5);
    });

    it("should return 0 for empty network", () => {
      const network = createTestDroneNetwork();
      expect(getSlavedDroneCount(network)).toBe(0);
    });
  });

  describe("getRemainingCapacity", () => {
    it("should calculate remaining capacity", () => {
      const network = createNetworkWithDrones(5, 12);
      expect(getRemainingCapacity(network)).toBe(7);
    });

    it("should return full capacity for empty network", () => {
      const network = createTestDroneNetwork({ maxDrones: 12 });
      expect(getRemainingCapacity(network)).toBe(12);
    });

    it("should return 0 when at capacity", () => {
      const network = createNetworkWithDrones(6, 6);
      expect(getRemainingCapacity(network)).toBe(0);
    });
  });

  describe("isNetworkFull", () => {
    it("should return false when under capacity", () => {
      const network = createNetworkWithDrones(5, 12);
      expect(isNetworkFull(network)).toBe(false);
    });

    it("should return true when at capacity", () => {
      const network = createNetworkWithDrones(6, 6);
      expect(isNetworkFull(network)).toBe(true);
    });

    it("should return false for empty network", () => {
      const network = createTestDroneNetwork({ maxDrones: 12 });
      expect(isNetworkFull(network)).toBe(false);
    });
  });

  describe("getDronesWithCommand", () => {
    it("should return drones with specific command", () => {
      let network = createNetworkWithDrones(4);
      network = issueDroneCommand(network, "drone-1", "watch").network;
      network = issueDroneCommand(network, "drone-2", "attack").network;
      network = issueDroneCommand(network, "drone-3", "watch").network;

      const watchDrones = getDronesWithCommand(network, "watch");

      expect(watchDrones).toHaveLength(2);
      expect(watchDrones.map((d) => d.droneId)).toContain("drone-1");
      expect(watchDrones.map((d) => d.droneId)).toContain("drone-3");
    });

    it("should return empty array when no drones have command", () => {
      const network = createNetworkWithDrones(3);
      const drones = getDronesWithCommand(network, "attack");

      expect(drones).toHaveLength(0);
    });
  });

  describe("getJumpedInDrone", () => {
    it("should return null when no drone jumped in", () => {
      const network = createNetworkWithDrones(3);
      const drone = getJumpedInDrone(network);

      expect(drone).toBeNull();
    });

    it("should return jumped-in drone", () => {
      const network = createTestDroneNetwork({
        slavedDrones: [
          createTestSlavedDrone("d1", { isJumpedIn: false }),
          createTestSlavedDrone("d2", { isJumpedIn: true }),
          createTestSlavedDrone("d3", { isJumpedIn: false }),
        ],
      });
      const drone = getJumpedInDrone(network);

      expect(drone).not.toBeNull();
      expect(drone!.droneId).toBe("d2");
    });
  });
});
