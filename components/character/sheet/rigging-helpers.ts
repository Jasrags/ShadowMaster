/**
 * Shared utilities for rigging display components.
 *
 * Provides guard function, common props interface, and badge style constants
 * used across all rigging display components.
 */

import type { Character } from "@/lib/types";
import { canPerformRiggingActions } from "@/lib/rules/rigging";

/**
 * Check if a character has rigging-related capabilities.
 * Mirrors `hasMatrixAccess` pattern for conditional rendering.
 */
export const hasRiggingAccess = (character: Character): boolean =>
  canPerformRiggingActions(character);

/** Standard props interface for rigging display components */
export interface RiggingDisplayProps {
  character: Character;
  onCharacterUpdate?: (updated: Character) => void;
  editable?: boolean;
  onSelect?: (pool: number, label: string) => void;
}

/** Control mode badge styles */
export const CONTROL_MODE_BADGE: Record<string, { label: string; style: string }> = {
  manual: {
    label: "Manual",
    style: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  },
  remote: {
    label: "Remote",
    style: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  },
  "jumped-in": {
    label: "Jumped-In",
    style: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
};

/** VR mode badge styles */
export const VR_MODE_BADGE: Record<string, { label: string; style: string }> = {
  "cold-sim": {
    label: "Cold-Sim",
    style: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  },
  "hot-sim": {
    label: "Hot-Sim",
    style: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  },
};

/** Drone command type badge styles */
export const COMMAND_TYPE_BADGE: Record<string, { label: string; style: string }> = {
  watch: {
    label: "Watch",
    style: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  },
  defend: {
    label: "Defend",
    style: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  },
  attack: {
    label: "Attack",
    style: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  },
  pursue: {
    label: "Pursue",
    style: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400",
  },
  return: {
    label: "Return",
    style: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  },
  hold: {
    label: "Hold",
    style: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  },
  custom: {
    label: "Custom",
    style: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
};

/** Autosoft category badge styles */
export const AUTOSOFT_CATEGORY_BADGE: Record<string, { label: string; style: string }> = {
  perception: {
    label: "Perception",
    style:
      "bg-blue-100 text-blue-700 border-blue-300/40 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/20",
  },
  defense: {
    label: "Defense",
    style:
      "bg-amber-100 text-amber-700 border-amber-300/40 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/20",
  },
  movement: {
    label: "Movement",
    style:
      "bg-emerald-100 text-emerald-700 border-emerald-300/40 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/20",
  },
  combat: {
    label: "Combat",
    style:
      "bg-red-100 text-red-700 border-red-300/40 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/20",
  },
  "electronic-warfare": {
    label: "EW",
    style:
      "bg-violet-100 text-violet-700 border-violet-300/40 dark:bg-violet-500/15 dark:text-violet-400 dark:border-violet-500/20",
  },
  stealth: {
    label: "Stealth",
    style:
      "bg-zinc-100 text-zinc-600 border-zinc-300/40 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
  },
};
