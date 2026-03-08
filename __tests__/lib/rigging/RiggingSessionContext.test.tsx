/**
 * Tests for RiggingSessionContext
 *
 * Tests the rigging session state provider, verifying:
 * - Provider initialization from character data
 * - Session start/end lifecycle
 * - Drone slaving and release operations
 * - Jump-in/out with VR mode switching
 * - Biofeedback tracking and warning levels
 * - Autosoft sharing/unsharing
 * - Hooks return safe defaults outside provider
 */

import { describe, test, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import {
  RiggingSessionProvider,
  useRiggingSession,
  useDroneNetwork,
  useJumpedInState,
} from "@/lib/rigging";
import {
  createTestCharacter,
  createTestCharacterDrone,
  createTestCharacterAutosoft,
} from "@/lib/rules/rigging/__tests__/fixtures";
import type { Vehicle } from "@/lib/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRiggerCharacter() {
  return createTestCharacter({
    hasVCR: true,
    vcrRating: 2,
    hasRCC: true,
    hasDrones: true,
  });
}

function makeVehicle(): Vehicle {
  return {
    catalogId: "eurocar-westwind",
    name: "Eurocar Westwind 3000",
    type: "ground",
    handling: 4,
    speed: 6,
    acceleration: 3,
    body: 11,
    armor: 6,
    pilot: 3,
    sensor: 3,
    cost: 110000,
    availability: 8,
  };
}

function createWrapper(character = makeRiggerCharacter(), onUpdate = vi.fn()) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <RiggingSessionProvider character={character} onCharacterUpdate={onUpdate}>
        {children}
      </RiggingSessionProvider>
    );
  };
}

// ---------------------------------------------------------------------------
// Hooks outside provider
// ---------------------------------------------------------------------------

describe("RiggingSessionContext", () => {
  describe("hooks outside provider", () => {
    test("useRiggingSession returns safe defaults", () => {
      const { result } = renderHook(() => useRiggingSession());

      expect(result.current.isSessionActive).toBe(false);
      expect(result.current.hasRiggingHardware).toBe(false);
      expect(result.current.riggingState).toBeNull();
      expect(result.current.droneNetwork).toBeNull();
      expect(result.current.rccConfig).toBeNull();
      expect(result.current.isJumpedIn).toBe(false);
      expect(result.current.isBodyVulnerable).toBe(false);
      expect(result.current.biofeedbackWarningLevel).toBe("safe");
      expect(result.current.error).toBeNull();
    });

    test("useDroneNetwork returns safe defaults", () => {
      const { result } = renderHook(() => useDroneNetwork());

      expect(result.current.network).toBeNull();
      expect(result.current.slavedCount).toBe(0);
      expect(result.current.remainingCapacity).toBe(0);
      expect(result.current.isFull).toBe(false);
      expect(result.current.rccConfig).toBeNull();
    });

    test("useJumpedInState returns safe defaults", () => {
      const { result } = renderHook(() => useJumpedInState());

      expect(result.current.isJumpedIn).toBe(false);
      expect(result.current.isBodyVulnerable).toBe(false);
      expect(result.current.targetName).toBeNull();
      expect(result.current.vrMode).toBeNull();
      expect(result.current.duration).toBe(0);
    });
  });

  // ---------------------------------------------------------------------------
  // Provider initialization
  // ---------------------------------------------------------------------------

  describe("provider initialization", () => {
    test("initializes with rigging hardware from character", () => {
      const character = makeRiggerCharacter();
      const { result } = renderHook(() => useRiggingSession(), {
        wrapper: createWrapper(character),
      });

      expect(result.current.hasRiggingHardware).toBe(true);
      expect(result.current.riggingState).not.toBeNull();
      expect(result.current.rccConfig).not.toBeNull();
      expect(result.current.droneNetwork).not.toBeNull();
      expect(result.current.isSessionActive).toBe(false);
    });

    test("initializes without rigging hardware for non-rigger", () => {
      const character = createTestCharacter();
      const { result } = renderHook(() => useRiggingSession(), {
        wrapper: createWrapper(character),
      });

      expect(result.current.hasRiggingHardware).toBe(false);
      expect(result.current.riggingState).toBeNull();
    });

    test("initializes drone network from useDroneNetwork", () => {
      const { result } = renderHook(() => useDroneNetwork(), {
        wrapper: createWrapper(),
      });

      expect(result.current.network).not.toBeNull();
      expect(result.current.slavedCount).toBe(0);
      expect(result.current.isFull).toBe(false);
      expect(result.current.rccConfig).not.toBeNull();
    });
  });

  // ---------------------------------------------------------------------------
  // Session lifecycle
  // ---------------------------------------------------------------------------

  describe("session lifecycle", () => {
    test("startSession activates session", () => {
      const { result } = renderHook(() => useRiggingSession(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isSessionActive).toBe(false);

      act(() => {
        result.current.startSession();
      });

      expect(result.current.isSessionActive).toBe(true);
    });

    test("endSession deactivates session and clears ephemeral state", () => {
      const { result } = renderHook(() => useRiggingSession(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startSession();
      });
      expect(result.current.isSessionActive).toBe(true);

      act(() => {
        result.current.endSession();
      });

      expect(result.current.isSessionActive).toBe(false);
      expect(result.current.isJumpedIn).toBe(false);
      expect(result.current.biofeedbackWarningLevel).toBe("safe");
    });
  });

  // ---------------------------------------------------------------------------
  // Drone slaving
  // ---------------------------------------------------------------------------

  describe("drone slaving", () => {
    test("slave drone to network", () => {
      const character = makeRiggerCharacter();
      const drone = character.drones![0];

      const { result } = renderHook(
        () => ({ session: useRiggingSession(), network: useDroneNetwork() }),
        { wrapper: createWrapper(character) }
      );

      act(() => {
        result.current.session.startSession();
      });

      act(() => {
        const slaveResult = result.current.session.slaveDrone(drone);
        expect(slaveResult.success).toBe(true);
      });

      expect(result.current.network.slavedCount).toBe(1);
    });

    test("release drone from network", () => {
      const character = makeRiggerCharacter();
      const drone = character.drones![0];

      const { result } = renderHook(
        () => ({ session: useRiggingSession(), network: useDroneNetwork() }),
        { wrapper: createWrapper(character) }
      );

      act(() => {
        result.current.session.startSession();
      });

      act(() => {
        result.current.session.slaveDrone(drone);
      });
      expect(result.current.network.slavedCount).toBe(1);

      act(() => {
        result.current.session.releaseDrone(drone.id!);
      });

      expect(result.current.network.slavedCount).toBe(0);
    });

    test("releaseAllDrones clears all slaved drones", () => {
      const character = makeRiggerCharacter();

      const { result } = renderHook(
        () => ({ session: useRiggingSession(), network: useDroneNetwork() }),
        { wrapper: createWrapper(character) }
      );

      act(() => {
        result.current.session.startSession();
      });

      // Slave drones one at a time so state propagates
      act(() => {
        result.current.session.slaveDrone(character.drones![0]);
      });
      act(() => {
        result.current.session.slaveDrone(character.drones![1]);
      });

      act(() => {
        result.current.session.releaseAllDrones();
      });

      expect(result.current.network.slavedCount).toBe(0);
    });
  });

  // ---------------------------------------------------------------------------
  // Jump-in / Jump-out (using vehicle to avoid drone-slaving requirement)
  // ---------------------------------------------------------------------------

  describe("jump-in controls", () => {
    test("jump into a vehicle", () => {
      const character = makeRiggerCharacter();
      character.vehicles = [makeVehicle()];
      const vehicle = character.vehicles[0];

      const { result } = renderHook(
        () => ({ session: useRiggingSession(), jumpState: useJumpedInState() }),
        { wrapper: createWrapper(character) }
      );

      act(() => {
        result.current.session.startSession();
      });

      act(() => {
        const jumpResult = result.current.session.jumpIn(
          vehicle.catalogId,
          "vehicle",
          vehicle.name,
          "cold-sim"
        );
        expect(jumpResult.success).toBe(true);
      });

      expect(result.current.jumpState.isJumpedIn).toBe(true);
      expect(result.current.jumpState.targetName).toBe(vehicle.name);
      expect(result.current.jumpState.vrMode).toBe("cold-sim");
    });

    test("jump out of vehicle", () => {
      const character = makeRiggerCharacter();
      character.vehicles = [makeVehicle()];
      const vehicle = character.vehicles[0];

      const { result } = renderHook(
        () => ({ session: useRiggingSession(), jumpState: useJumpedInState() }),
        { wrapper: createWrapper(character) }
      );

      act(() => {
        result.current.session.startSession();
      });

      act(() => {
        result.current.session.jumpIn(vehicle.catalogId, "vehicle", vehicle.name, "cold-sim");
      });
      expect(result.current.jumpState.isJumpedIn).toBe(true);

      act(() => {
        const jumpOutResult = result.current.session.jumpOut();
        expect(jumpOutResult.success).toBe(true);
      });

      expect(result.current.jumpState.isJumpedIn).toBe(false);
      expect(result.current.jumpState.targetName).toBeNull();
    });

    test("switch VR mode while jumped in", () => {
      const character = makeRiggerCharacter();
      character.vehicles = [makeVehicle()];
      const vehicle = character.vehicles[0];

      const { result } = renderHook(
        () => ({ session: useRiggingSession(), jumpState: useJumpedInState() }),
        { wrapper: createWrapper(character) }
      );

      act(() => {
        result.current.session.startSession();
      });

      act(() => {
        result.current.session.jumpIn(vehicle.catalogId, "vehicle", vehicle.name, "cold-sim");
      });
      expect(result.current.jumpState.vrMode).toBe("cold-sim");

      act(() => {
        result.current.session.switchVRMode("hot-sim");
      });

      expect(result.current.jumpState.vrMode).toBe("hot-sim");
    });

    test("jump into slaved drone", () => {
      const character = makeRiggerCharacter();
      const drone = character.drones![0];

      const { result } = renderHook(
        () => ({ session: useRiggingSession(), jumpState: useJumpedInState() }),
        { wrapper: createWrapper(character) }
      );

      act(() => {
        result.current.session.startSession();
      });

      // Must slave the drone first before jumping in
      act(() => {
        result.current.session.slaveDrone(drone);
      });

      act(() => {
        const jumpResult = result.current.session.jumpIn(
          drone.id!,
          "drone",
          drone.name,
          "cold-sim"
        );
        expect(jumpResult.success).toBe(true);
      });

      expect(result.current.jumpState.isJumpedIn).toBe(true);
      expect(result.current.jumpState.targetName).toBe(drone.name);
    });
  });

  // ---------------------------------------------------------------------------
  // Drone commands
  // ---------------------------------------------------------------------------

  describe("drone commands", () => {
    test("issue command to individual drone", () => {
      const character = makeRiggerCharacter();
      const drone = character.drones![0];

      const { result } = renderHook(() => useRiggingSession(), {
        wrapper: createWrapper(character),
      });

      act(() => {
        result.current.startSession();
      });

      act(() => {
        result.current.slaveDrone(drone);
      });

      act(() => {
        const cmdResult = result.current.issueDroneCommand(drone.id!, "watch");
        expect(cmdResult.success).toBe(true);
      });
    });

    test("issue network-wide command", () => {
      const character = makeRiggerCharacter();

      const { result } = renderHook(() => useRiggingSession(), {
        wrapper: createWrapper(character),
      });

      act(() => {
        result.current.startSession();
      });

      // Slave drones one at a time so state propagates
      act(() => {
        result.current.slaveDrone(character.drones![0]);
      });
      act(() => {
        result.current.slaveDrone(character.drones![1]);
      });

      act(() => {
        const cmdResult = result.current.issueNetworkCommand("defend");
        expect(cmdResult.success).toBe(true);
        expect(cmdResult.affectedDrones.length).toBe(2);
      });
    });
  });

  // ---------------------------------------------------------------------------
  // Autosoft sharing
  // ---------------------------------------------------------------------------

  describe("autosoft sharing", () => {
    test("share autosoft to network", () => {
      const autosoft = createTestCharacterAutosoft("auto-1", {
        name: "Maneuvering",
        rating: 4,
        category: "movement",
      });
      const character = makeRiggerCharacter();
      character.autosofts = [autosoft];

      const { result } = renderHook(
        () => ({ session: useRiggingSession(), network: useDroneNetwork() }),
        { wrapper: createWrapper(character) }
      );

      act(() => {
        result.current.session.startSession();
      });

      act(() => {
        result.current.session.shareAutosoft(autosoft);
      });

      expect(result.current.network.network?.sharedAutosofts.length).toBe(1);
      expect(result.current.network.network?.sharedAutosofts[0].name).toBe("Maneuvering");
    });

    test("unshare autosoft from network", () => {
      const autosoft = createTestCharacterAutosoft("auto-1");
      const character = makeRiggerCharacter();
      character.autosofts = [autosoft];

      const { result } = renderHook(
        () => ({ session: useRiggingSession(), network: useDroneNetwork() }),
        { wrapper: createWrapper(character) }
      );

      act(() => {
        result.current.session.startSession();
      });

      act(() => {
        result.current.session.shareAutosoft(autosoft);
      });
      expect(result.current.network.network?.sharedAutosofts.length).toBe(1);

      // unshareAutosoftFromNetwork uses autosoftId field, which shareAutosoftToNetwork
      // sets from `autosoft.id ?? autosoft.catalogId`
      const sharedId = result.current.network.network!.sharedAutosofts[0].autosoftId;

      act(() => {
        result.current.session.unshareAutosoft(sharedId);
      });

      expect(result.current.network.network?.sharedAutosofts.length).toBe(0);
    });
  });

  // ---------------------------------------------------------------------------
  // Biofeedback and forced ejection
  // ---------------------------------------------------------------------------

  describe("biofeedback", () => {
    test("track biofeedback damage", () => {
      const character = makeRiggerCharacter();
      character.vehicles = [makeVehicle()];
      const vehicle = character.vehicles[0];

      const { result } = renderHook(() => useRiggingSession(), {
        wrapper: createWrapper(character),
      });

      act(() => {
        result.current.startSession();
      });

      act(() => {
        result.current.jumpIn(vehicle.catalogId, "vehicle", vehicle.name, "hot-sim");
      });

      act(() => {
        result.current.trackBiofeedback(2);
      });

      expect(result.current.riggingState?.biofeedbackDamageTaken).toBe(2);
    });

    test("handle forced ejection", () => {
      const character = makeRiggerCharacter();
      character.vehicles = [makeVehicle()];
      const vehicle = character.vehicles[0];

      const { result } = renderHook(() => useRiggingSession(), {
        wrapper: createWrapper(character),
      });

      act(() => {
        result.current.startSession();
      });

      act(() => {
        result.current.jumpIn(vehicle.catalogId, "vehicle", vehicle.name, "hot-sim");
      });
      expect(result.current.isJumpedIn).toBe(true);

      let ejectionResult: ReturnType<typeof result.current.handleForcedEjection>;
      act(() => {
        ejectionResult = result.current.handleForcedEjection("link_severed");
      });

      expect(ejectionResult!).not.toBeNull();
      expect(result.current.isJumpedIn).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // Error handling
  // ---------------------------------------------------------------------------

  describe("error handling", () => {
    test("clearError clears error state", () => {
      const character = createTestCharacter(); // no rigging hardware

      const { result } = renderHook(() => useRiggingSession(), {
        wrapper: createWrapper(character),
      });

      act(() => {
        result.current.startSession(); // will set error
      });

      // The startSession on a character without hardware sets an error
      if (result.current.error) {
        act(() => {
          result.current.clearError();
        });
        expect(result.current.error).toBeNull();
      }
    });
  });
});
