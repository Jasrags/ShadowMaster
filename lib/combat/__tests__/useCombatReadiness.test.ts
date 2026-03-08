/**
 * useCombatReadiness Hook Tests
 *
 * Tests combat-aware readiness change gating: outside combat all allowed,
 * in combat checks turn, action costs, and available actions.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import type { EquipmentReadiness } from "@/lib/types/gear-state";

// Mock the combat session context
const mockUseCombatSession = vi.fn();
const mockUseCanPerformAction = vi.fn();

vi.mock("../CombatSessionContext", () => ({
  useCombatSession: () => mockUseCombatSession(),
  useCanPerformAction: (type: string) => mockUseCanPerformAction(type),
}));

// Mock the inventory state-manager
vi.mock("@/lib/rules/inventory/state-manager", () => ({
  getTransitionActionCost: vi.fn((from: string, to: string) => {
    const costs: Record<string, string> = {
      "holstered->readied": "simple",
      "readied->holstered": "free",
      "carried->readied": "complex",
      "readied->carried": "complex",
      "readied->stashed": "narrative",
      "holstered->stashed": "narrative",
      "readied->readied": "none",
      "holstered->holstered": "none",
    };
    return costs[`${from}->${to}`] ?? "complex";
  }),
}));

import { useCombatReadiness } from "../useCombatReadiness";

// Defaults: not in combat
function setNotInCombat() {
  mockUseCombatSession.mockReturnValue({
    isInCombat: false,
    isMyTurn: false,
    spendAction: vi.fn().mockResolvedValue(false),
  });
  mockUseCanPerformAction.mockReturnValue(true);
}

function setInCombatMyTurn(actions: { free?: boolean; simple?: boolean; complex?: boolean } = {}) {
  const spendAction = vi.fn().mockResolvedValue(true);
  mockUseCombatSession.mockReturnValue({
    isInCombat: true,
    isMyTurn: true,
    spendAction,
  });
  mockUseCanPerformAction.mockImplementation((type: string) => {
    if (type === "free") return actions.free ?? true;
    if (type === "simple") return actions.simple ?? true;
    if (type === "complex") return actions.complex ?? true;
    return false;
  });
  return spendAction;
}

function setInCombatNotMyTurn() {
  mockUseCombatSession.mockReturnValue({
    isInCombat: true,
    isMyTurn: false,
    spendAction: vi.fn().mockResolvedValue(false),
  });
  mockUseCanPerformAction.mockReturnValue(true);
}

beforeEach(() => {
  vi.clearAllMocks();
  setNotInCombat();
});

describe("useCombatReadiness", () => {
  describe("canChangeReadiness", () => {
    it("allows all transitions outside combat", () => {
      const { result } = renderHook(() => useCombatReadiness());

      const check = result.current.canChangeReadiness(
        "holstered" as EquipmentReadiness,
        "readied" as EquipmentReadiness
      );
      expect(check.allowed).toBe(true);
      expect(check.actionCost).toBe("simple");
      expect(check.reason).toBeUndefined();
    });

    it("blocks all transitions when not your turn", () => {
      setInCombatNotMyTurn();
      const { result } = renderHook(() => useCombatReadiness());

      const check = result.current.canChangeReadiness(
        "holstered" as EquipmentReadiness,
        "readied" as EquipmentReadiness
      );
      expect(check.allowed).toBe(false);
      expect(check.reason).toBe("Not your turn");
    });

    it("blocks narrative-cost transitions during combat", () => {
      setInCombatMyTurn();
      const { result } = renderHook(() => useCombatReadiness());

      const check = result.current.canChangeReadiness(
        "readied" as EquipmentReadiness,
        "stashed" as EquipmentReadiness
      );
      expect(check.allowed).toBe(false);
      expect(check.reason).toBe("Not available during combat");
      expect(check.actionCost).toBe("narrative");
    });

    it("allows simple action when simple actions available", () => {
      setInCombatMyTurn({ simple: true });
      const { result } = renderHook(() => useCombatReadiness());

      const check = result.current.canChangeReadiness(
        "holstered" as EquipmentReadiness,
        "readied" as EquipmentReadiness
      );
      expect(check.allowed).toBe(true);
      expect(check.actionCost).toBe("simple");
    });

    it("blocks simple action when no simple actions remain", () => {
      setInCombatMyTurn({ simple: false });
      const { result } = renderHook(() => useCombatReadiness());

      const check = result.current.canChangeReadiness(
        "holstered" as EquipmentReadiness,
        "readied" as EquipmentReadiness
      );
      expect(check.allowed).toBe(false);
      expect(check.reason).toBe("No simple actions remaining");
    });

    it("allows free action when free actions available", () => {
      setInCombatMyTurn({ free: true });
      const { result } = renderHook(() => useCombatReadiness());

      const check = result.current.canChangeReadiness(
        "readied" as EquipmentReadiness,
        "holstered" as EquipmentReadiness
      );
      expect(check.allowed).toBe(true);
      expect(check.actionCost).toBe("free");
    });

    it("blocks free action when no free actions remain", () => {
      setInCombatMyTurn({ free: false });
      const { result } = renderHook(() => useCombatReadiness());

      const check = result.current.canChangeReadiness(
        "readied" as EquipmentReadiness,
        "holstered" as EquipmentReadiness
      );
      expect(check.allowed).toBe(false);
      expect(check.reason).toBe("No free actions remaining");
    });

    it("allows complex action when complex actions available", () => {
      setInCombatMyTurn({ complex: true });
      const { result } = renderHook(() => useCombatReadiness());

      const check = result.current.canChangeReadiness(
        "carried" as EquipmentReadiness,
        "readied" as EquipmentReadiness
      );
      expect(check.allowed).toBe(true);
      expect(check.actionCost).toBe("complex");
    });

    it("blocks complex action when no complex actions remain", () => {
      setInCombatMyTurn({ complex: false });
      const { result } = renderHook(() => useCombatReadiness());

      const check = result.current.canChangeReadiness(
        "carried" as EquipmentReadiness,
        "readied" as EquipmentReadiness
      );
      expect(check.allowed).toBe(false);
      expect(check.reason).toBe("No complex actions remaining");
    });

    it("allows same-state transition (no-op)", () => {
      setInCombatMyTurn();
      const { result } = renderHook(() => useCombatReadiness());

      const check = result.current.canChangeReadiness(
        "readied" as EquipmentReadiness,
        "readied" as EquipmentReadiness
      );
      expect(check.allowed).toBe(true);
      expect(check.actionCost).toBe("none");
    });
  });

  describe("performReadinessChange", () => {
    it("calls applyChange directly outside combat", async () => {
      const { result } = renderHook(() => useCombatReadiness());
      const applyChange = vi.fn();

      const success = await result.current.performReadinessChange(
        "holstered" as EquipmentReadiness,
        "readied" as EquipmentReadiness,
        applyChange
      );

      expect(success).toBe(true);
      expect(applyChange).toHaveBeenCalledTimes(1);
    });

    it("calls spendAction then applyChange in combat", async () => {
      const spendAction = setInCombatMyTurn();
      const { result } = renderHook(() => useCombatReadiness());
      const applyChange = vi.fn();

      const success = await result.current.performReadinessChange(
        "holstered" as EquipmentReadiness,
        "readied" as EquipmentReadiness,
        applyChange
      );

      expect(success).toBe(true);
      expect(spendAction).toHaveBeenCalledWith("simple");
      expect(applyChange).toHaveBeenCalledTimes(1);
    });

    it("does not call applyChange when spendAction fails", async () => {
      const spendAction = setInCombatMyTurn();
      spendAction.mockResolvedValue(false);
      const { result } = renderHook(() => useCombatReadiness());
      const applyChange = vi.fn();

      const success = await result.current.performReadinessChange(
        "holstered" as EquipmentReadiness,
        "readied" as EquipmentReadiness,
        applyChange
      );

      expect(success).toBe(false);
      expect(spendAction).toHaveBeenCalledWith("simple");
      expect(applyChange).not.toHaveBeenCalled();
    });

    it("returns false when change is not allowed", async () => {
      setInCombatNotMyTurn();
      const { result } = renderHook(() => useCombatReadiness());
      const applyChange = vi.fn();

      const success = await result.current.performReadinessChange(
        "holstered" as EquipmentReadiness,
        "readied" as EquipmentReadiness,
        applyChange
      );

      expect(success).toBe(false);
      expect(applyChange).not.toHaveBeenCalled();
    });

    it("applies no-cost transitions without spending action in combat", async () => {
      const spendAction = setInCombatMyTurn();
      const { result } = renderHook(() => useCombatReadiness());
      const applyChange = vi.fn();

      const success = await result.current.performReadinessChange(
        "readied" as EquipmentReadiness,
        "readied" as EquipmentReadiness,
        applyChange
      );

      expect(success).toBe(true);
      expect(spendAction).not.toHaveBeenCalled();
      expect(applyChange).toHaveBeenCalledTimes(1);
    });
  });
});
