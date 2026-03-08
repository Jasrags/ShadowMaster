"use client";

import { useState } from "react";
import type { Character } from "@/lib/types";
import type { VehicleActionType } from "@/lib/types/rigging";
import { DisplayCard } from "./DisplayCard";
import { Zap, ChevronDown, ChevronRight } from "lucide-react";
import {
  requiresJumpedIn,
  canPerformRemotely,
  getActionTypeDescription,
  getTestTypeForAction,
  getSkillForAction,
  hasVehicleControlRig,
  getVehicleControlRig,
} from "@/lib/rules/rigging";
import { useRiggingSession, useJumpedInState } from "@/lib/rigging";
import { CONTROL_MODE_BADGE } from "./rigging-helpers";

// ---------------------------------------------------------------------------
// Action definitions grouped by category
// ---------------------------------------------------------------------------

const ACTION_CATEGORIES: { key: string; label: string; actions: VehicleActionType[] }[] = [
  {
    key: "movement",
    label: "Movement",
    actions: ["accelerate", "decelerate", "turn"],
  },
  {
    key: "pursuit",
    label: "Pursuit",
    actions: ["catch_up", "cut_off", "evasive_driving"],
  },
  {
    key: "combat",
    label: "Combat",
    actions: ["ram", "fire_weapon", "sensor_targeting", "stunt"],
  },
];

// ---------------------------------------------------------------------------
// ActionRow
// ---------------------------------------------------------------------------

interface ActionRowProps {
  actionType: VehicleActionType;
  character: Character;
  onSelect?: (pool: number, label: string) => void;
  /** VCR control bonus (added when jumped in) */
  vcrBonus: number;
  /** Whether character is currently jumped in */
  isJumpedIn: boolean;
  /** Whether a rigging session is active */
  isSessionActive: boolean;
}

function ActionRow({
  actionType,
  character,
  onSelect,
  vcrBonus,
  isJumpedIn: jumpedIn,
  isSessionActive,
}: ActionRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const name = getActionTypeDescription(actionType);
  const needsJumpedIn = requiresJumpedIn(actionType);
  const canRemote = canPerformRemotely(actionType);
  const testType = getTestTypeForAction(actionType);
  const skill = getSkillForAction(actionType);

  // Base dice pool from character skills
  const skillRating =
    skill === "gunnery"
      ? (character.skills?.gunnery ?? 0)
      : skill === "perception"
        ? (character.skills?.perception ?? 0)
        : (character.skills?.["pilot-ground-craft"] ?? character.skills?.["pilot-aircraft"] ?? 0);

  const attrValue =
    skill === "gunnery"
      ? (character.attributes?.agility ?? 0)
      : skill === "perception"
        ? (character.attributes?.intuition ?? 0)
        : (character.attributes?.reaction ?? 0);

  const basePool = skillRating + attrValue;

  // Apply VCR bonus when jumped in
  const activeVcrBonus = jumpedIn ? vcrBonus : 0;
  const estimatedPool = basePool + activeVcrBonus;

  // Determine if action is disabled (requires jumped-in but not jumped in)
  const isDisabled = isSessionActive && needsJumpedIn && !jumpedIn;

  return (
    <div
      data-testid="action-row"
      onClick={() => !isDisabled && setIsExpanded(!isExpanded)}
      className={`px-3 py-1.5 transition-colors [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50 ${
        isDisabled
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700/30"
      }`}
    >
      {/* Collapsed row */}
      <div className="flex min-w-0 items-center gap-1.5">
        <span data-testid="expand-button" className="shrink-0 text-zinc-400">
          {isExpanded ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </span>
        <span className="truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
          {name}
        </span>

        {/* Requirement badge */}
        {needsJumpedIn && (
          <span
            data-testid="jumped-in-badge"
            className={`shrink-0 rounded border px-1 text-[9px] font-bold uppercase ${
              isDisabled
                ? "border-red-400/30 bg-red-400/10 text-red-500 dark:text-red-400"
                : "border-amber-400/30 bg-amber-400/10 text-amber-600 dark:text-amber-400"
            }`}
          >
            {isDisabled ? "Requires Jump-In" : "Jumped-In"}
          </span>
        )}
        {!needsJumpedIn && canRemote && (
          <span
            data-testid="remote-badge"
            className="shrink-0 rounded border border-blue-400/30 bg-blue-400/10 px-1 text-[9px] font-bold uppercase text-blue-600 dark:text-blue-400"
          >
            Remote
          </span>
        )}

        <span className="ml-auto" />

        {/* VCR bonus indicator */}
        {activeVcrBonus > 0 && (
          <span
            data-testid="vcr-bonus-badge"
            className="shrink-0 rounded bg-emerald-100 px-1 py-0.5 font-mono text-[9px] font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
          >
            +{activeVcrBonus} VCR
          </span>
        )}

        {/* Dice pool pill */}
        {estimatedPool > 0 && !isDisabled && (
          <button
            data-testid="pool-pill"
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(estimatedPool, name);
            }}
            className="shrink-0 rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-zinc-900 hover:bg-emerald-100 hover:text-emerald-700 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400"
          >
            {estimatedPool}d6
          </button>
        )}
      </div>

      {/* Expanded content */}
      {isExpanded && !isDisabled && (
        <div
          data-testid="expanded-content"
          onClick={(e) => e.stopPropagation()}
          className="ml-5 mt-2 space-y-1.5 border-l-2 border-zinc-200 pl-3 dark:border-zinc-700"
        >
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
            <span>
              Test:{" "}
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {testType.charAt(0).toUpperCase() + testType.slice(1).replace(/_/g, " ")}
              </span>
            </span>
            <span>
              Skill:{" "}
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {skill.charAt(0).toUpperCase() + skill.slice(1)}
              </span>
            </span>
          </div>
          <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Pool:{" "}
            <span className="font-mono font-medium text-zinc-700 dark:text-zinc-300">
              {attrValue} (attr) + {skillRating} (skill)
              {activeVcrBonus > 0 && ` + ${activeVcrBonus} (VCR)`} = {estimatedPool}
            </span>
          </div>
          {needsJumpedIn && (
            <div className="text-[11px] text-amber-600 dark:text-amber-400">
              Requires jumped-in control via VCR
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// VehicleActionsDisplay
// ---------------------------------------------------------------------------

interface VehicleActionsDisplayProps {
  character: Character;
  onSelect?: (pool: number, label: string) => void;
  editable?: boolean;
}

export function VehicleActionsDisplay({
  character,
  onSelect,
  editable = false,
}: VehicleActionsDisplayProps) {
  const hasVehicles = (character.vehicles?.length ?? 0) > 0;
  const hasDrones = (character.drones?.length ?? 0) > 0;

  const { isSessionActive } = useRiggingSession();
  const { isJumpedIn } = useJumpedInState();

  // Get VCR bonus
  const hasVCR = hasVehicleControlRig(character);
  const vcr = hasVCR ? getVehicleControlRig(character) : null;
  const vcrBonus = vcr?.controlBonus ?? 0;

  // Determine current control mode for badge
  const controlMode = isSessionActive ? (isJumpedIn ? "jumped-in" : "remote") : "manual";

  if (!hasVehicles && !hasDrones) return null;

  return (
    <DisplayCard
      id="sheet-vehicle-actions"
      title="Vehicle Actions"
      icon={<Zap className="h-4 w-4 text-zinc-400" />}
      collapsible
      defaultCollapsed
    >
      <div className="space-y-3">
        {/* Control mode badge */}
        {editable && isSessionActive && (
          <div data-testid="control-mode-indicator" className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Control Mode
            </span>
            <span
              data-testid="control-mode-badge"
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${CONTROL_MODE_BADGE[controlMode].style}`}
            >
              {CONTROL_MODE_BADGE[controlMode].label}
            </span>
            {hasVCR && vcr && (
              <span className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50">
                VCR R{vcr.rating}
              </span>
            )}
          </div>
        )}

        {ACTION_CATEGORIES.map(({ key, label, actions }) => (
          <div key={key}>
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              {label}
            </div>
            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
              {actions.map((actionType) => (
                <ActionRow
                  key={actionType}
                  actionType={actionType}
                  character={character}
                  onSelect={onSelect}
                  vcrBonus={vcrBonus}
                  isJumpedIn={isJumpedIn}
                  isSessionActive={isSessionActive}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </DisplayCard>
  );
}
