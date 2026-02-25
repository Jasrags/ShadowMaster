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
} from "@/lib/rules/rigging";

// ---------------------------------------------------------------------------
// Action definitions grouped by category
// ---------------------------------------------------------------------------

interface ActionDef {
  type: VehicleActionType;
  category: string;
}

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
}

function ActionRow({ actionType, character, onSelect }: ActionRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const name = getActionTypeDescription(actionType);
  const needsJumpedIn = requiresJumpedIn(actionType);
  const canRemote = canPerformRemotely(actionType);
  const testType = getTestTypeForAction(actionType);
  const skill = getSkillForAction(actionType);

  // Estimate a dice pool from character skills (simplified, no rigging state)
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

  const estimatedPool = skillRating + attrValue;

  return (
    <div
      data-testid="action-row"
      onClick={() => setIsExpanded(!isExpanded)}
      className="cursor-pointer px-3 py-1.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700/30 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50"
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
            className="shrink-0 rounded border border-amber-400/30 bg-amber-400/10 px-1 text-[9px] font-bold uppercase text-amber-600 dark:text-amber-400"
          >
            Jumped-In
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

        {/* Dice pool pill */}
        {estimatedPool > 0 && (
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
      {isExpanded && (
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
          {estimatedPool > 0 && (
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Pool:{" "}
              <span className="font-mono font-medium text-zinc-700 dark:text-zinc-300">
                {attrValue} (attr) + {skillRating} (skill) = {estimatedPool}
              </span>
            </div>
          )}
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

export function VehicleActionsDisplay({ character, onSelect }: VehicleActionsDisplayProps) {
  const hasVehicles = (character.vehicles?.length ?? 0) > 0;
  const hasDrones = (character.drones?.length ?? 0) > 0;

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
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </DisplayCard>
  );
}
