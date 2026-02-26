"use client";

import { useState, useMemo } from "react";
import type { Character } from "@/lib/types";
import type { ActionDefinition } from "@/lib/types/action-definitions";
import { DisplayCard } from "./DisplayCard";
import { Zap, ChevronDown, ChevronRight, AlertTriangle } from "lucide-react";
import { useMatrixActions } from "@/lib/rules/RulesetContext";
import { useMatrixMarks } from "@/lib/matrix";

interface MatrixActionsDisplayProps {
  character: Character;
  onSelect?: (pool: number, label: string) => void;
  editable?: boolean;
}

// Category display order and labels
const CATEGORY_ORDER = ["attack", "sleaze", "device", "file", "persona"];
const CATEGORY_LABELS: Record<string, string> = {
  attack: "Attack",
  sleaze: "Sleaze",
  device: "Device",
  file: "File",
  persona: "Persona",
  hacking: "Hacking",
  cybercombat: "Cybercombat",
  "electronic-warfare": "Electronic Warfare",
};

/** Determine if an action is illegal based on its subcategory or tags */
function isActionIllegal(action: ActionDefinition): boolean {
  if (action.tags?.includes("illegal")) return true;
  if (action.subcategory === "hacking" || action.subcategory === "cybercombat") return true;
  return false;
}

/** Get marks required from action prerequisites */
function getMarksRequired(action: ActionDefinition): number {
  const markPrereq = action.prerequisites?.find(
    (p) => p.type === "resource" && p.requirement === "marks"
  );
  return markPrereq?.minimumValue ?? 0;
}

/** Estimate a dice pool from action's rollConfig and character attributes/skills */
function estimateDicePool(action: ActionDefinition, character: Character): number {
  const config = action.rollConfig;
  if (!config) return 0;

  let pool = 0;

  // Add skill rating
  if (config.skill && character.skills) {
    pool += character.skills[config.skill] ?? 0;
  }

  // Add attribute value
  if (config.attribute && character.attributes) {
    const attrMap: Record<string, keyof NonNullable<typeof character.attributes>> = {
      logic: "logic",
      intuition: "intuition",
      willpower: "willpower",
      charisma: "charisma",
      agility: "agility",
      body: "body",
      reaction: "reaction",
      strength: "strength",
    };
    const attrKey = attrMap[config.attribute];
    if (attrKey) {
      pool += character.attributes[attrKey] ?? 0;
    }
  }

  return pool;
}

function ActionRow({
  action,
  character,
  onSelect,
  hasMarksOnAnyTarget,
}: {
  action: ActionDefinition;
  character: Character;
  onSelect?: (pool: number, label: string) => void;
  hasMarksOnAnyTarget: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const illegal = isActionIllegal(action);
  const marks = getMarksRequired(action);
  const pool = estimateDicePool(action, character);

  return (
    <div className="[&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50">
      <div
        className="flex items-center gap-2 px-3 py-1.5 cursor-pointer transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700/30"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? (
          <ChevronDown className="h-3 w-3 shrink-0 text-zinc-400" />
        ) : (
          <ChevronRight className="h-3 w-3 shrink-0 text-zinc-400" />
        )}
        <span className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
          {action.name}
        </span>

        {/* Legality badge */}
        {illegal ? (
          <span className="rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide bg-red-100 text-red-700 border border-red-300/40 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/20">
            Illegal
          </span>
        ) : (
          <span className="rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide bg-emerald-100 text-emerald-700 border border-emerald-300/40 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/20">
            Legal
          </span>
        )}

        {/* Marks required */}
        {marks > 0 && (
          <span
            className={`rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold ${
              hasMarksOnAnyTarget
                ? "border-amber-300/40 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400"
                : "border-red-300/40 bg-red-50 text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
            }`}
            title={
              hasMarksOnAnyTarget
                ? `Requires ${marks} mark(s)`
                : `No marks held — requires ${marks}`
            }
          >
            {marks}M
          </span>
        )}

        <div className="flex-1" />

        {/* Dice pool pill */}
        {pool > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(pool, action.name);
            }}
            className="rounded bg-emerald-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:hover:bg-emerald-500/25 transition-colors"
            title={`Roll ${pool} dice for ${action.name}`}
          >
            {pool}d6
          </button>
        )}
      </div>

      {expanded && (
        <div className="ml-5 space-y-1 border-l-2 border-zinc-200 px-3 pb-2 dark:border-zinc-700">
          {action.description && (
            <p className="text-xs italic text-zinc-500 dark:text-zinc-400">{action.description}</p>
          )}

          {/* Roll formula */}
          {action.rollConfig && (
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              <span className="font-semibold">Pool:</span>{" "}
              {[action.rollConfig.skill, action.rollConfig.attribute].filter(Boolean).join(" + ")}
              {action.rollConfig.limitType && (
                <span className="ml-2 text-zinc-400">[Limit: {action.rollConfig.limitType}]</span>
              )}
            </div>
          )}

          {/* Action type */}
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-semibold">Type:</span>{" "}
            <span className="capitalize">{action.type}</span> Action
          </div>

          {/* Mark warning */}
          {marks > 0 && !hasMarksOnAnyTarget && (
            <div className="flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
              <AlertTriangle className="h-3 w-3" />
              <span>Requires {marks} mark(s) on target before use</span>
            </div>
          )}

          {/* OS risk indicator */}
          {illegal && (
            <div className="flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
              <AlertTriangle className="h-3 w-3" />
              <span>Generates Overwatch Score</span>
            </div>
          )}

          {/* Source reference */}
          {action.source && (
            <p className="text-[10px] text-zinc-400">
              {action.source.book} p.{action.source.page}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export function MatrixActionsDisplay({ character, onSelect }: MatrixActionsDisplayProps) {
  const matrixActions = useMatrixActions();
  const { marksHeld } = useMatrixMarks();

  // Group actions by subcategory first, then by domain category
  const categorizedActions = useMemo(() => {
    const groups: Record<string, ActionDefinition[]> = {};

    for (const action of matrixActions) {
      const category = action.subcategory ?? "general";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(action);
    }

    return groups;
  }, [matrixActions]);

  const sortedCategories = useMemo(() => {
    const keys = Object.keys(categorizedActions);
    return keys.sort((a, b) => {
      const aIdx = CATEGORY_ORDER.indexOf(a);
      const bIdx = CATEGORY_ORDER.indexOf(b);
      if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
      if (aIdx !== -1) return -1;
      if (bIdx !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [categorizedActions]);

  if (matrixActions.length === 0) return null;

  return (
    <DisplayCard
      id="sheet-matrix-actions"
      title="Matrix Actions"
      icon={<Zap className="h-4 w-4 text-emerald-400" />}
      collapsible
      defaultCollapsed
    >
      <div className="space-y-3">
        {sortedCategories.map((category) => (
          <div key={category}>
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              {CATEGORY_LABELS[category] ?? category}
            </div>
            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
              {categorizedActions[category].map((action) => (
                <ActionRow
                  key={action.id}
                  action={action}
                  character={character}
                  onSelect={onSelect}
                  hasMarksOnAnyTarget={marksHeld.length > 0}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </DisplayCard>
  );
}
