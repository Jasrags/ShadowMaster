/**
 * Shared readiness helpers for equipment display components.
 *
 * Centralizes readiness state labels, colors, and valid state arrays
 * previously duplicated across GearDisplay, WeaponsDisplay, and ArmorDisplay.
 */

import type { EquipmentReadiness, TransitionActionCost } from "@/lib/types/gear-state";
import type { ActionType } from "@/lib/rules/inventory";

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------

export function getReadinessLabel(readiness: EquipmentReadiness): string {
  switch (readiness) {
    case "readied":
      return "Readied";
    case "holstered":
      return "Holstered";
    case "worn":
      return "Worn";
    case "pocketed":
      return "Pocketed";
    case "carried":
      return "Carried";
    case "stored":
      return "Stored";
    case "stashed":
      return "Stashed";
    default:
      return readiness;
  }
}

// ---------------------------------------------------------------------------
// Colors
// ---------------------------------------------------------------------------

export function getReadinessColor(readiness: EquipmentReadiness): string {
  switch (readiness) {
    case "readied":
      return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    case "holstered":
      return "text-amber-400 bg-amber-500/10 border-amber-500/30";
    case "worn":
      return "text-blue-400 bg-blue-500/10 border-blue-500/30";
    case "pocketed":
      return "text-cyan-400 bg-cyan-500/10 border-cyan-500/30";
    case "carried":
      return "text-orange-400 bg-orange-500/10 border-orange-500/30";
    case "stored":
      return "text-zinc-400 bg-zinc-500/10 border-zinc-500/30 dark:text-zinc-500";
    case "stashed":
      return "text-violet-400 bg-violet-500/10 border-violet-500/30";
    default:
      return "text-zinc-400";
  }
}

// ---------------------------------------------------------------------------
// Action cost labels
// ---------------------------------------------------------------------------

export function getActionCostLabel(cost: TransitionActionCost | ActionType): string {
  switch (cost) {
    case "free":
      return "Free Action";
    case "simple":
      return "Simple Action";
    case "complex":
      return "Complex Action";
    case "narrative":
      return "Narrative Time";
    default:
      return "";
  }
}

// ---------------------------------------------------------------------------
// Short action cost labels & colors (for readiness button badges)
// ---------------------------------------------------------------------------

export function getShortActionCostLabel(cost: ActionType): string {
  switch (cost) {
    case "free":
      return "F";
    case "simple":
      return "S";
    case "complex":
      return "C";
    case "narrative":
      return "N";
    default:
      return "";
  }
}

export function getActionCostColor(cost: ActionType): string {
  switch (cost) {
    case "free":
      return "text-emerald-400";
    case "simple":
      return "text-blue-400";
    case "complex":
      return "text-violet-400";
    case "narrative":
      return "text-zinc-400";
    default:
      return "text-zinc-500";
  }
}

// ---------------------------------------------------------------------------
// Valid readiness states per equipment type
// ---------------------------------------------------------------------------

export const READINESS_BY_EQUIPMENT: Record<string, EquipmentReadiness[]> = {
  weapon: ["readied", "holstered", "carried", "stashed"],
  armor: ["worn", "carried", "stashed"],
  gear: ["worn", "holstered", "pocketed", "carried", "stashed"],
  electronics: ["holstered", "pocketed", "carried", "stashed"],
};
