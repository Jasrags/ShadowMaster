"use client";

/**
 * useCombatReadiness Hook
 *
 * Bridges combat session state with equipment readiness transitions.
 * When in combat, gates readiness changes behind action economy checks.
 * When outside combat, all valid transitions are freely allowed.
 */

import { useCallback } from "react";
import type { EquipmentReadiness } from "@/lib/types/gear-state";
import type { ActionType } from "@/lib/rules/inventory/state-manager";
import { getTransitionActionCost } from "@/lib/rules/inventory/state-manager";
import { useCombatSession, useCanPerformAction } from "./CombatSessionContext";

export interface ReadinessChangeCheck {
  /** Whether the readiness change is allowed */
  allowed: boolean;
  /** Human-readable reason when blocked (for tooltip) */
  reason?: string;
  /** The action type this transition costs */
  actionCost: ActionType;
}

export interface CombatReadinessHook {
  /** Whether the character is currently in combat */
  isInCombat: boolean;
  /** Whether it's the character's turn */
  isMyTurn: boolean;
  /** Check if a readiness change is allowed */
  canChangeReadiness: (from: EquipmentReadiness, to: EquipmentReadiness) => ReadinessChangeCheck;
  /** Attempt a readiness change, spending action if in combat. Returns true on success. */
  performReadinessChange: (
    from: EquipmentReadiness,
    to: EquipmentReadiness,
    applyChange: () => void
  ) => Promise<boolean>;
}

export function useCombatReadiness(): CombatReadinessHook {
  const { isInCombat, isMyTurn, spendAction } = useCombatSession();

  const canPerformFree = useCanPerformAction("free");
  const canPerformSimple = useCanPerformAction("simple");
  const canPerformComplex = useCanPerformAction("complex");

  const canChangeReadiness = useCallback(
    (from: EquipmentReadiness, to: EquipmentReadiness): ReadinessChangeCheck => {
      const actionCost = getTransitionActionCost(from, to);

      // Same state = no-op
      if (actionCost === "none") {
        return { allowed: true, actionCost };
      }

      // Not in combat — always allowed
      if (!isInCombat) {
        return { allowed: true, actionCost };
      }

      // In combat but not my turn
      if (!isMyTurn) {
        return { allowed: false, reason: "Not your turn", actionCost };
      }

      // Narrative cost — not available during combat
      if (actionCost === "narrative") {
        return { allowed: false, reason: "Not available during combat", actionCost };
      }

      // Check action availability
      switch (actionCost) {
        case "free":
          return canPerformFree
            ? { allowed: true, actionCost }
            : { allowed: false, reason: "No free actions remaining", actionCost };
        case "simple":
          return canPerformSimple
            ? { allowed: true, actionCost }
            : { allowed: false, reason: "No simple actions remaining", actionCost };
        case "complex":
          return canPerformComplex
            ? { allowed: true, actionCost }
            : { allowed: false, reason: "No complex actions remaining", actionCost };
        default:
          return { allowed: false, reason: "Unknown action cost", actionCost };
      }
    },
    [isInCombat, isMyTurn, canPerformFree, canPerformSimple, canPerformComplex]
  );

  const performReadinessChange = useCallback(
    async (
      from: EquipmentReadiness,
      to: EquipmentReadiness,
      applyChange: () => void
    ): Promise<boolean> => {
      const check = canChangeReadiness(from, to);

      if (!check.allowed) {
        return false;
      }

      // Not in combat or no-cost transition — just apply
      if (!isInCombat || check.actionCost === "none") {
        applyChange();
        return true;
      }

      // In combat — spend the action first
      const spent = await spendAction(check.actionCost as "free" | "simple" | "complex");
      if (!spent) {
        return false;
      }

      applyChange();
      return true;
    },
    [isInCombat, canChangeReadiness, spendAction]
  );

  return {
    isInCombat,
    isMyTurn,
    canChangeReadiness,
    performReadinessChange,
  };
}
