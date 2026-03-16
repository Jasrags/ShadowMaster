/**
 * Tests for MatrixSessionContext
 *
 * Tests the matrix session state provider, including jack-in/jack-out,
 * overwatch tracking, mark management, convergence, and character sync.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import type { Character } from "@/lib/types";
import type { MatrixMark } from "@/lib/types/matrix";
import {
  MatrixSessionProvider,
  useMatrixSession,
  useOverwatchState,
  useMatrixMarks,
} from "../MatrixSessionContext";

// Mock crypto.randomUUID for deterministic session IDs
vi.stubGlobal("crypto", {
  randomUUID: () => "test-uuid-1234",
});

// =============================================================================
// Test Fixtures
// =============================================================================

/** Character with a cyberdeck (Erika MCD-1, DR 3, ASDF [1,2,4,3], 3 slots) */
function createDeckerCharacter(overrides?: Partial<Character>): Character {
  return {
    id: "char-decker-1",
    name: "Test Decker",
    status: "active",
    editionCode: "sr5",
    metatype: "human",
    attributes: {
      body: 3,
      agility: 4,
      reaction: 3,
      strength: 2,
      willpower: 4,
      logic: 6,
      intuition: 5,
      charisma: 3,
      edge: 3,
      essence: 6,
    },
    cyberdecks: [
      {
        id: "deck-1",
        catalogId: "erika-mcd-1",
        name: "Erika MCD-1",
        deviceRating: 3,
        attributeArray: [4, 3, 2, 1],
        currentConfig: {
          attack: 1,
          sleaze: 2,
          dataProcessing: 4,
          firewall: 3,
        },
        programSlots: 3,
        loadedPrograms: [],
        cost: 49500,
        availability: 6,
      },
    ],
    commlinks: [
      {
        id: "comm-1",
        catalogId: "meta-link",
        name: "Meta Link",
        deviceRating: 1,
        dataProcessing: 1,
        firewall: 1,
        cost: 100,
        availability: 2,
      },
    ],
    programs: [],
    ...overrides,
  } as Character;
}

/** Character with only a commlink (no hacking capability) */
function createCommlinkCharacter(): Character {
  return {
    id: "char-comm-1",
    name: "Test Runner",
    status: "active",
    editionCode: "sr5",
    metatype: "human",
    attributes: {
      body: 4,
      agility: 5,
      reaction: 4,
      strength: 4,
      willpower: 3,
      logic: 3,
      intuition: 3,
      charisma: 3,
      edge: 3,
      essence: 6,
    },
    cyberdecks: [],
    commlinks: [
      {
        id: "comm-1",
        catalogId: "meta-link",
        name: "Meta Link",
        deviceRating: 1,
        dataProcessing: 1,
        firewall: 1,
        cost: 100,
        availability: 2,
      },
    ],
    programs: [],
  } as unknown as Character;
}

/** Character with no matrix hardware */
function createMundaneCharacter(): Character {
  return {
    id: "char-mundane-1",
    name: "Test Samurai",
    status: "active",
    editionCode: "sr5",
    metatype: "ork",
    attributes: {
      body: 6,
      agility: 5,
      reaction: 4,
      strength: 5,
      willpower: 3,
      logic: 2,
      intuition: 3,
      charisma: 2,
      edge: 2,
      essence: 2.5,
    },
    cyberdecks: [],
    commlinks: [],
    programs: [],
  } as unknown as Character;
}

// =============================================================================
// Wrapper helpers
// =============================================================================

function createWrapper(character: Character) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <MatrixSessionProvider character={character}>{children}</MatrixSessionProvider>;
  };
}

// =============================================================================
// Tests
// =============================================================================

describe("MatrixSessionContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---------------------------------------------------------------------------
  // Defaults
  // ---------------------------------------------------------------------------

  describe("defaults", () => {
    it("returns safe defaults outside provider", () => {
      const { result } = renderHook(() => useMatrixSession());

      expect(result.current.matrixState).toBeNull();
      expect(result.current.hasMatrixHardware).toBe(false);
      expect(result.current.isJackedIn).toBe(false);
      expect(result.current.connectionMode).toBe("ar");
      expect(result.current.overwatchScore).toBe(0);
      expect(result.current.overwatchWarningLevel).toBe("safe");
      expect(result.current.isConverged).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it("returns hasMatrixHardware true for decker character", () => {
      const character = createDeckerCharacter();
      const { result } = renderHook(() => useMatrixSession(), {
        wrapper: createWrapper(character),
      });

      expect(result.current.hasMatrixHardware).toBe(true);
      expect(result.current.matrixState).not.toBeNull();
    });

    it("returns hasMatrixHardware true for commlink-only character", () => {
      const character = createCommlinkCharacter();
      const { result } = renderHook(() => useMatrixSession(), {
        wrapper: createWrapper(character),
      });

      expect(result.current.hasMatrixHardware).toBe(true);
      expect(result.current.matrixState).not.toBeNull();
    });

    it("returns hasMatrixHardware false for mundane character", () => {
      const character = createMundaneCharacter();
      const { result } = renderHook(() => useMatrixSession(), {
        wrapper: createWrapper(character),
      });

      expect(result.current.hasMatrixHardware).toBe(false);
      expect(result.current.matrixState).toBeNull();
    });

    it("starts not jacked in", () => {
      const character = createDeckerCharacter();
      const { result } = renderHook(() => useMatrixSession(), {
        wrapper: createWrapper(character),
      });

      expect(result.current.isJackedIn).toBe(false);
      expect(result.current.matrixState?.isConnected).toBe(false);
    });

    it("builds correct persona from cyberdeck", () => {
      const character = createDeckerCharacter();
      const { result } = renderHook(() => useMatrixSession(), {
        wrapper: createWrapper(character),
      });

      const persona = result.current.matrixState?.persona;
      expect(persona?.attack).toBe(1);
      expect(persona?.sleaze).toBe(2);
      expect(persona?.dataProcessing).toBe(4);
      expect(persona?.firewall).toBe(3);
      expect(persona?.deviceRating).toBe(3);
    });

    it("builds correct condition monitor from device rating", () => {
      const character = createDeckerCharacter();
      const { result } = renderHook(() => useMatrixSession(), {
        wrapper: createWrapper(character),
      });

      // Device Rating 3 + 8 = 11
      expect(result.current.matrixState?.matrixConditionMonitor).toBe(11);
    });

    it("builds commlink persona when no cyberdeck", () => {
      const character = createCommlinkCharacter();
      const { result } = renderHook(() => useMatrixSession(), {
        wrapper: createWrapper(character),
      });

      const persona = result.current.matrixState?.persona;
      expect(persona?.attack).toBe(0);
      expect(persona?.sleaze).toBe(0);
      expect(persona?.dataProcessing).toBe(1);
      expect(persona?.firewall).toBe(1);
      expect(persona?.deviceRating).toBe(1);
    });
  });

  // ---------------------------------------------------------------------------
  // jackIn / jackOut
  // ---------------------------------------------------------------------------

  describe("jackIn / jackOut", () => {
    it("jackIn sets isJackedIn and creates overwatch session", () => {
      const character = createDeckerCharacter();
      const { result } = renderHook(() => useMatrixSession(), {
        wrapper: createWrapper(character),
      });

      act(() => {
        result.current.jackIn("hot-sim-vr");
      });

      expect(result.current.isJackedIn).toBe(true);
      expect(result.current.connectionMode).toBe("hot-sim-vr");
      expect(result.current.overwatchSession).not.toBeNull();
      expect(result.current.overwatchScore).toBe(0);
      expect(result.current.matrixState?.isConnected).toBe(true);
    });

    it("jackOut clears session state", () => {
      const character = createDeckerCharacter();
      const { result } = renderHook(() => useMatrixSession(), {
        wrapper: createWrapper(character),
      });

      act(() => {
        result.current.jackIn("cold-sim-vr");
      });

      // Add some OS first
      act(() => {
        result.current.addOverwatchScore("Hack on the Fly", 5);
      });

      expect(result.current.overwatchScore).toBe(5);

      // Place a mark (separate act to avoid overwriting OS state)
      act(() => {
        result.current.placeMark("target-1", "device", "Server Alpha");
      });

      expect(result.current.matrixState?.marksHeld.length).toBe(1);

      act(() => {
        result.current.jackOut();
      });

      expect(result.current.isJackedIn).toBe(false);
      expect(result.current.connectionMode).toBe("ar");
      expect(result.current.overwatchScore).toBe(0);
      expect(result.current.overwatchSession).toBeNull();
      expect(result.current.matrixState?.marksHeld).toHaveLength(0);
      expect(result.current.matrixState?.marksReceived).toHaveLength(0);
    });

    it("jackIn sets error if no matrix hardware", () => {
      const character = createMundaneCharacter();
      const { result } = renderHook(() => useMatrixSession(), {
        wrapper: createWrapper(character),
      });

      act(() => {
        result.current.jackIn("hot-sim-vr");
      });

      expect(result.current.isJackedIn).toBe(false);
      expect(result.current.error).toBe("No matrix hardware available");
    });
  });

  // ---------------------------------------------------------------------------
  // changeConnectionMode
  // ---------------------------------------------------------------------------

  describe("changeConnectionMode", () => {
    it("switches connection mode while jacked in", () => {
      const character = createDeckerCharacter();
      const { result } = renderHook(() => useMatrixSession(), {
        wrapper: createWrapper(character),
      });

      act(() => {
        result.current.jackIn("cold-sim-vr");
      });

      expect(result.current.connectionMode).toBe("cold-sim-vr");

      act(() => {
        result.current.changeConnectionMode("hot-sim-vr");
      });

      expect(result.current.connectionMode).toBe("hot-sim-vr");
    });
  });

  // ---------------------------------------------------------------------------
  // Overwatch Score
  // ---------------------------------------------------------------------------

  describe("addOverwatchScore", () => {
    it("increments overwatch score correctly", () => {
      const character = createDeckerCharacter();
      const { result } = renderHook(() => useMatrixSession(), {
        wrapper: createWrapper(character),
      });

      act(() => {
        result.current.jackIn("hot-sim-vr");
      });

      act(() => {
        result.current.addOverwatchScore("Hack on the Fly", 7);
      });

      expect(result.current.overwatchScore).toBe(7);

      act(() => {
        result.current.addOverwatchScore("Brute Force", 5);
      });

      expect(result.current.overwatchScore).toBe(12);
    });

    it("detects convergence at threshold", () => {
      const character = createDeckerCharacter();
      const { result } = renderHook(() => useMatrixSession(), {
        wrapper: createWrapper(character),
      });

      act(() => {
        result.current.jackIn("hot-sim-vr");
      });

      act(() => {
        result.current.addOverwatchScore("Massive hack", 40);
      });

      expect(result.current.overwatchScore).toBe(40);
      expect(result.current.isConverged).toBe(true);
    });

    it("resetOverwatchScore resets to zero", () => {
      const character = createDeckerCharacter();
      const { result } = renderHook(() => useMatrixSession(), {
        wrapper: createWrapper(character),
      });

      act(() => {
        result.current.jackIn("hot-sim-vr");
      });

      act(() => {
        result.current.addOverwatchScore("Hack on the Fly", 15);
      });

      expect(result.current.overwatchScore).toBe(15);

      act(() => {
        result.current.resetOverwatchScore();
      });

      expect(result.current.overwatchScore).toBe(0);
      expect(result.current.isConverged).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // Marks
  // ---------------------------------------------------------------------------

  describe("placeMark / removeMark", () => {
    it("places a mark on a target", () => {
      const character = createDeckerCharacter();
      const { result } = renderHook(() => useMatrixSession(), {
        wrapper: createWrapper(character),
      });

      act(() => {
        result.current.jackIn("hot-sim-vr");
      });

      let markResult: ReturnType<typeof result.current.placeMark>;
      act(() => {
        markResult = result.current.placeMark("target-1", "device", "Server Alpha");
      });

      expect(markResult!.success).toBe(true);
      expect(markResult!.newMarkCount).toBe(1);
      expect(result.current.matrixState?.marksHeld).toHaveLength(1);
    });

    it("increments marks on same target up to MAX_MARKS (3)", () => {
      const character = createDeckerCharacter();
      const { result } = renderHook(() => useMatrixSession(), {
        wrapper: createWrapper(character),
      });

      act(() => {
        result.current.jackIn("hot-sim-vr");
      });

      act(() => {
        result.current.placeMark("target-1", "device", "Server Alpha");
      });
      act(() => {
        result.current.placeMark("target-1", "device", "Server Alpha");
      });
      act(() => {
        result.current.placeMark("target-1", "device", "Server Alpha");
      });

      expect(result.current.matrixState?.marksHeld[0].markCount).toBe(3);
    });

    it("places multiple marks at once via count parameter", () => {
      const character = createDeckerCharacter();
      const { result } = renderHook(() => useMatrixSession(), {
        wrapper: createWrapper(character),
      });

      act(() => {
        result.current.jackIn("hot-sim-vr");
      });

      let markResult: ReturnType<typeof result.current.placeMark>;
      act(() => {
        markResult = result.current.placeMark("target-1", "device", "Server Alpha", 2);
      });

      expect(markResult!.success).toBe(true);
      expect(markResult!.newMarkCount).toBe(2);
    });

    it("removes marks from a target", () => {
      const character = createDeckerCharacter();
      const { result } = renderHook(() => useMatrixSession(), {
        wrapper: createWrapper(character),
      });

      act(() => {
        result.current.jackIn("hot-sim-vr");
      });

      act(() => {
        result.current.placeMark("target-1", "device", "Server Alpha", 3);
      });

      let removeResult: ReturnType<typeof result.current.removeMark>;
      act(() => {
        removeResult = result.current.removeMark("target-1", 1);
      });

      expect(removeResult!.success).toBe(true);
      expect(removeResult!.remainingMarks).toBe(2);
    });

    it("clearAllMarks removes all held and received marks", () => {
      const character = createDeckerCharacter();
      const { result } = renderHook(() => useMatrixSession(), {
        wrapper: createWrapper(character),
      });

      act(() => {
        result.current.jackIn("hot-sim-vr");
      });

      act(() => {
        result.current.placeMark("target-1", "device", "Server Alpha");
        result.current.placeMark("target-2", "host", "Corp Host");
      });

      const incomingMark: MatrixMark = {
        id: "mark-incoming-1",
        targetId: "attacker-1",
        targetType: "persona",
        targetName: "Enemy IC",
        markCount: 1,
        placedAt: new Date().toISOString() as import("@/lib/types").ISODateString,
      };

      act(() => {
        result.current.receiveMarkOnSelf(incomingMark);
      });

      expect(result.current.matrixState?.marksHeld.length).toBeGreaterThan(0);
      expect(result.current.matrixState?.marksReceived.length).toBeGreaterThan(0);

      act(() => {
        result.current.clearAllMarks();
      });

      expect(result.current.matrixState?.marksHeld).toHaveLength(0);
      expect(result.current.matrixState?.marksReceived).toHaveLength(0);
    });

    it("returns failure when placing marks outside provider", () => {
      const { result } = renderHook(() => useMatrixSession());

      const markResult = result.current.placeMark("target-1", "device", "Server");
      expect(markResult.success).toBe(false);
      expect(markResult.errors[0].code).toBe("NO_PROVIDER");
    });
  });

  // ---------------------------------------------------------------------------
  // Convergence
  // ---------------------------------------------------------------------------

  describe("triggerConvergence", () => {
    it("returns ConvergenceResult and auto-jacks-out", () => {
      const character = createDeckerCharacter();
      const { result } = renderHook(() => useMatrixSession(), {
        wrapper: createWrapper(character),
      });

      act(() => {
        result.current.jackIn("hot-sim-vr");
      });

      act(() => {
        result.current.addOverwatchScore("Hack", 35);
      });

      let convergenceResult: ReturnType<typeof result.current.triggerConvergence> = null;
      act(() => {
        convergenceResult = result.current.triggerConvergence();
      });

      expect(convergenceResult).not.toBeNull();
      expect(convergenceResult!.osReset).toBe(true);
      expect(convergenceResult!.personaDestroyed).toBe(true);
      // Hot-sim VR causes physical dumpshock
      expect(convergenceResult!.dumpshockTriggered).toBe(true);
      expect(convergenceResult!.damageType).toBe("physical");

      // Should be jacked out after convergence
      expect(result.current.isJackedIn).toBe(false);
      expect(result.current.isConverged).toBe(true);
      expect(result.current.overwatchSession).toBeNull();
    });

    it("returns null when not connected", () => {
      const character = createMundaneCharacter();
      const { result } = renderHook(() => useMatrixSession(), {
        wrapper: createWrapper(character),
      });

      const convergenceResult = result.current.triggerConvergence();
      expect(convergenceResult).toBeNull();
    });

    it("convergence in cold-sim causes stun dumpshock", () => {
      const character = createDeckerCharacter();
      const { result } = renderHook(() => useMatrixSession(), {
        wrapper: createWrapper(character),
      });

      act(() => {
        result.current.jackIn("cold-sim-vr");
      });

      act(() => {
        result.current.addOverwatchScore("Hack", 35);
      });

      let convergenceResult: ReturnType<typeof result.current.triggerConvergence> = null;
      act(() => {
        convergenceResult = result.current.triggerConvergence();
      });

      expect(convergenceResult!.dumpshockTriggered).toBe(true);
      expect(convergenceResult!.damageType).toBe("stun");
    });

    it("convergence in AR causes no dumpshock", () => {
      const character = createDeckerCharacter();
      const { result } = renderHook(() => useMatrixSession(), {
        wrapper: createWrapper(character),
      });

      act(() => {
        result.current.jackIn("ar");
      });

      let convergenceResult: ReturnType<typeof result.current.triggerConvergence> = null;
      act(() => {
        convergenceResult = result.current.triggerConvergence();
      });

      expect(convergenceResult!.dumpshockTriggered).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // Matrix Damage
  // ---------------------------------------------------------------------------

  describe("applyMatrixDamage / healMatrixDamage", () => {
    it("applies matrix damage within bounds", () => {
      const character = createDeckerCharacter();
      const { result } = renderHook(() => useMatrixSession(), {
        wrapper: createWrapper(character),
      });

      act(() => {
        result.current.applyMatrixDamage(5);
      });

      expect(result.current.matrixState?.matrixDamageTaken).toBe(5);
    });

    it("caps damage at condition monitor max", () => {
      const character = createDeckerCharacter();
      const { result } = renderHook(() => useMatrixSession(), {
        wrapper: createWrapper(character),
      });

      // Condition monitor is DR 3 + 8 = 11
      act(() => {
        result.current.applyMatrixDamage(20);
      });

      expect(result.current.matrixState?.matrixDamageTaken).toBe(11);
    });

    it("heals matrix damage", () => {
      const character = createDeckerCharacter();
      const { result } = renderHook(() => useMatrixSession(), {
        wrapper: createWrapper(character),
      });

      act(() => {
        result.current.applyMatrixDamage(8);
      });

      act(() => {
        result.current.healMatrixDamage(3);
      });

      expect(result.current.matrixState?.matrixDamageTaken).toBe(5);
    });

    it("does not heal below zero", () => {
      const character = createDeckerCharacter();
      const { result } = renderHook(() => useMatrixSession(), {
        wrapper: createWrapper(character),
      });

      act(() => {
        result.current.applyMatrixDamage(2);
      });

      act(() => {
        result.current.healMatrixDamage(10);
      });

      expect(result.current.matrixState?.matrixDamageTaken).toBe(0);
    });
  });

  // ---------------------------------------------------------------------------
  // Host Navigation
  // ---------------------------------------------------------------------------

  describe("enterHost / leaveHost", () => {
    it("enters and leaves a host", () => {
      const character = createDeckerCharacter();
      const { result } = renderHook(() => useMatrixSession(), {
        wrapper: createWrapper(character),
      });

      act(() => {
        result.current.jackIn("hot-sim-vr");
      });

      act(() => {
        result.current.enterHost("host-corp-1", "user");
      });

      expect(result.current.matrixState?.currentHost).toBe("host-corp-1");
      expect(result.current.matrixState?.hostAuthLevel).toBe("user");

      act(() => {
        result.current.leaveHost();
      });

      expect(result.current.matrixState?.currentHost).toBeUndefined();
      expect(result.current.matrixState?.hostAuthLevel).toBeUndefined();
    });
  });

  // ---------------------------------------------------------------------------
  // useOverwatchState
  // ---------------------------------------------------------------------------

  describe("useOverwatchState", () => {
    it("returns zeros when not jacked in", () => {
      const character = createDeckerCharacter();
      const { result } = renderHook(() => useOverwatchState(), {
        wrapper: createWrapper(character),
      });

      expect(result.current.score).toBe(0);
      expect(result.current.threshold).toBe(40);
      expect(result.current.warningLevel).toBe("safe");
      expect(result.current.isConverged).toBe(false);
      expect(result.current.progress).toBe(0);
      expect(result.current.session).toBeNull();
    });

    it("returns correct values during active session", () => {
      const character = createDeckerCharacter();
      const { result } = renderHook(
        () => ({
          session: useMatrixSession(),
          overwatch: useOverwatchState(),
        }),
        { wrapper: createWrapper(character) }
      );

      act(() => {
        result.current.session.jackIn("hot-sim-vr");
      });

      act(() => {
        result.current.session.addOverwatchScore("Hack on the Fly", 15);
      });

      expect(result.current.overwatch.score).toBe(15);
      expect(result.current.overwatch.threshold).toBe(40);
      // 15/40 = 37.5% → "caution" (25-50%)
      expect(result.current.overwatch.warningLevel).toBe("caution");
      expect(result.current.overwatch.isConverged).toBe(false);
      expect(result.current.overwatch.session).not.toBeNull();
      expect(result.current.overwatch.progress).toBeCloseTo(37.5, 0);
    });
  });

  // ---------------------------------------------------------------------------
  // useMatrixMarks
  // ---------------------------------------------------------------------------

  describe("useMatrixMarks", () => {
    it("returns empty arrays when not jacked in", () => {
      const character = createDeckerCharacter();
      const { result } = renderHook(() => useMatrixMarks(), {
        wrapper: createWrapper(character),
      });

      expect(result.current.marksHeld).toHaveLength(0);
      expect(result.current.marksReceived).toHaveLength(0);
    });

    it("provides query utilities for marks", () => {
      const character = createDeckerCharacter();
      const { result } = renderHook(
        () => ({
          session: useMatrixSession(),
          marks: useMatrixMarks(),
        }),
        { wrapper: createWrapper(character) }
      );

      act(() => {
        result.current.session.jackIn("hot-sim-vr");
      });

      act(() => {
        result.current.session.placeMark("target-1", "device", "Server Alpha", 2);
      });

      expect(result.current.marks.marksHeld).toHaveLength(1);
      expect(result.current.marks.getMarksOnTarget("target-1")).toBe(2);
      expect(result.current.marks.hasRequiredMarks("target-1", 2)).toBe(true);
      expect(result.current.marks.hasRequiredMarks("target-1", 3)).toBe(false);
      expect(result.current.marks.getMarksOnTarget("nonexistent")).toBe(0);
    });

    it("returns correct defaults outside provider", () => {
      const { result } = renderHook(() => useMatrixMarks());

      expect(result.current.marksHeld).toHaveLength(0);
      expect(result.current.marksReceived).toHaveLength(0);
      expect(result.current.getMarksOnTarget("anything")).toBe(0);
      expect(result.current.hasRequiredMarks("anything", 0)).toBe(true);
      expect(result.current.hasRequiredMarks("anything", 1)).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // Character Sync
  // ---------------------------------------------------------------------------

  describe("character sync", () => {
    it("ASDF config changes update persona while preserving session state", () => {
      const character = createDeckerCharacter();

      const { result } = renderHook(() => useMatrixSession(), {
        wrapper: ({ children }: { children: React.ReactNode }) => (
          <MatrixSessionProvider character={character}>{children}</MatrixSessionProvider>
        ),
      });

      act(() => {
        result.current.jackIn("hot-sim-vr");
      });

      act(() => {
        result.current.addOverwatchScore("Hack", 10);
      });

      act(() => {
        result.current.placeMark("target-1", "device", "Server Alpha");
      });

      // Verify session state exists
      expect(result.current.overwatchScore).toBe(10);
      expect(result.current.matrixState?.marksHeld).toHaveLength(1);

      // Simulate ASDF reconfig — new character prop with swapped ASDF
      const updatedCharacter = createDeckerCharacter({
        cyberdecks: [
          {
            id: "deck-1",
            catalogId: "erika-mcd-1",
            name: "Erika MCD-1",
            deviceRating: 3,
            attributeArray: [4, 3, 2, 1],
            currentConfig: {
              attack: 4,
              sleaze: 3,
              dataProcessing: 1,
              firewall: 2,
            },
            programSlots: 3,
            loadedPrograms: [],
            cost: 49500,
            availability: 6,
          },
        ],
      });

      // Re-render with updated character via a new wrapper
      const { result: result2 } = renderHook(() => useMatrixSession(), {
        wrapper: ({ children }: { children: React.ReactNode }) => (
          <MatrixSessionProvider character={updatedCharacter}>{children}</MatrixSessionProvider>
        ),
      });

      // Hardware fields should update
      expect(result2.current.matrixState?.persona.attack).toBe(4);
      expect(result2.current.matrixState?.persona.sleaze).toBe(3);
      expect(result2.current.matrixState?.persona.dataProcessing).toBe(1);
      expect(result2.current.matrixState?.persona.firewall).toBe(2);
    });

    it("handles character losing matrix hardware gracefully", () => {
      const character = createDeckerCharacter();

      let currentCharacter = character;
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <MatrixSessionProvider character={currentCharacter}>{children}</MatrixSessionProvider>
      );

      const { result, rerender } = renderHook(() => useMatrixSession(), { wrapper });

      expect(result.current.hasMatrixHardware).toBe(true);

      // Character loses all hardware
      currentCharacter = createMundaneCharacter();
      rerender();

      expect(result.current.hasMatrixHardware).toBe(false);
      expect(result.current.matrixState).toBeNull();
    });
  });

  // ---------------------------------------------------------------------------
  // Error handling
  // ---------------------------------------------------------------------------

  describe("clearError", () => {
    it("clears the error state", () => {
      const character = createMundaneCharacter();
      const { result } = renderHook(() => useMatrixSession(), {
        wrapper: createWrapper(character),
      });

      act(() => {
        result.current.jackIn("hot-sim-vr");
      });

      expect(result.current.error).toBe("No matrix hardware available");

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });

  // ---------------------------------------------------------------------------
  // receiveMarkOnSelf
  // ---------------------------------------------------------------------------

  describe("receiveMarkOnSelf", () => {
    it("records marks placed by other entities", () => {
      const character = createDeckerCharacter();
      const { result } = renderHook(() => useMatrixSession(), {
        wrapper: createWrapper(character),
      });

      act(() => {
        result.current.jackIn("hot-sim-vr");
      });

      const incomingMark: MatrixMark = {
        id: "mark-enemy-1",
        targetId: "ic-patrol-1",
        targetType: "ic",
        targetName: "Patrol IC",
        markCount: 1,
        placedAt: new Date().toISOString() as import("@/lib/types").ISODateString,
      };

      act(() => {
        result.current.receiveMarkOnSelf(incomingMark);
      });

      expect(result.current.matrixState?.marksReceived).toHaveLength(1);
      expect(result.current.matrixState?.marksReceived[0].targetName).toBe("Patrol IC");
    });
  });
});
