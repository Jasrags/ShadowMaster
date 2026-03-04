"use client";

import { useMemo } from "react";
import type { Character } from "@/lib/types";
import { DisplayCard } from "./DisplayCard";
import { Weight, AlertTriangle } from "lucide-react";
import {
  calculateEncumbrance,
  getEncumbranceStatus,
  calculateWeaponWeight,
  calculateArmorWeight,
  calculateGearWeight,
  calculateAmmunitionWeight,
} from "@/lib/rules/encumbrance/calculator";
import { isContainer, getContainerContentWeight } from "@/lib/rules/inventory";

interface EncumbranceDisplayProps {
  character: Character;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatWeight(kg: number): string {
  if (kg < 1 && kg > 0) {
    return `${Math.round(kg * 1000)}g`;
  }
  return `${kg.toFixed(1)}kg`;
}

const BAR_COLORS: Record<string, { fill: string; badge: string; text: string }> = {
  green: {
    fill: "bg-emerald-500",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  blue: {
    fill: "bg-blue-500",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
    text: "text-blue-600 dark:text-blue-400",
  },
  yellow: {
    fill: "bg-amber-500",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
    text: "text-amber-600 dark:text-amber-400",
  },
  red: {
    fill: "bg-red-500",
    badge: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
    text: "text-red-600 dark:text-red-400",
  },
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function WeightRow({ label, weight }: { label: string; weight: number }) {
  if (weight === 0) return null;
  return (
    <div className="flex items-center justify-between px-3 py-1.5 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50">
      <span className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200">{label}</span>
      <span className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50">
        {formatWeight(weight)}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function EncumbranceDisplay({ character }: EncumbranceDisplayProps) {
  const encumbrance = useMemo(() => calculateEncumbrance(character), [character]);
  const status = useMemo(() => getEncumbranceStatus(encumbrance), [encumbrance]);

  const categoryWeights = useMemo(
    () => ({
      weapons: calculateWeaponWeight(character.weapons || []),
      armor: calculateArmorWeight(character.armor || []),
      gear: calculateGearWeight(character.gear || []),
      ammo: calculateAmmunitionWeight(character.ammunition || []),
    }),
    [character]
  );

  const colors = BAR_COLORS[status.color] || BAR_COLORS.green;
  const fillPercent = Math.min((encumbrance.currentWeight / encumbrance.maxCapacity) * 100, 100);
  const isOverflow = encumbrance.currentWeight > encumbrance.maxCapacity;
  const hasBreakdown =
    categoryWeights.weapons > 0 ||
    categoryWeights.armor > 0 ||
    categoryWeights.gear > 0 ||
    categoryWeights.ammo > 0;

  const containers = useMemo(() => {
    return (character.gear || [])
      .filter((g) => g.id && isContainer(g))
      .map((g) => {
        const contentWeight = getContainerContentWeight(character, g.id!);
        const maxWeight = g.containerProperties?.weightCapacity ?? 0;
        return { name: g.name, contentWeight, maxWeight, id: g.id! };
      })
      .filter((c) => c.maxWeight > 0);
  }, [character]);

  return (
    <DisplayCard
      id="sheet-encumbrance"
      title="Encumbrance"
      icon={<Weight className="h-4 w-4 text-zinc-400" />}
      collapsible
    >
      <div className="space-y-3">
        {/* Header: status badge + weight */}
        <div className="flex items-center justify-between">
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${colors.badge}`}
          >
            {status.description}
          </span>
          <span className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50">
            {formatWeight(encumbrance.currentWeight)} / {formatWeight(encumbrance.maxCapacity)}
          </span>
        </div>

        {/* Progress bar */}
        <div className="relative h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
          <div
            className={`absolute left-0 top-0 h-full ${colors.fill} transition-all duration-300 rounded-full`}
            style={{ width: `${fillPercent}%` }}
          />
          {isOverflow && (
            <div className="absolute inset-0 h-full bg-red-500 animate-pulse rounded-full" />
          )}
        </div>

        {/* Penalty warning */}
        {encumbrance.isEncumbered && (
          <div className="flex items-start gap-2 rounded-lg bg-red-100 px-3 py-2 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-600 dark:text-red-400" />
            <p className="text-xs text-red-600 dark:text-red-400">
              Carrying {formatWeight(encumbrance.currentWeight - encumbrance.maxCapacity)} over
              capacity. Physical pools suffer {encumbrance.overweightPenalty} penalty.
            </p>
          </div>
        )}

        {/* Weight breakdown */}
        {hasBreakdown && (
          <div>
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Weight Breakdown
            </div>
            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
              <WeightRow label="Weapons" weight={categoryWeights.weapons} />
              <WeightRow label="Armor" weight={categoryWeights.armor} />
              <WeightRow label="Gear" weight={categoryWeights.gear} />
              <WeightRow label="Ammo" weight={categoryWeights.ammo} />
            </div>
          </div>
        )}

        {/* Container weights */}
        {containers.length > 0 && (
          <div data-testid="container-weights">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Container Weights
            </div>
            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
              {containers.map((c) => {
                const cPct =
                  c.maxWeight > 0 ? Math.min((c.contentWeight / c.maxWeight) * 100, 100) : 0;
                const cBarColor =
                  cPct >= 90 ? "bg-red-500" : cPct >= 70 ? "bg-amber-500" : "bg-emerald-500";
                return (
                  <div
                    key={c.id}
                    className="px-3 py-1.5 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
                        {c.name}
                      </span>
                      <span className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50">
                        {formatWeight(c.contentWeight)} / {formatWeight(c.maxWeight)}
                      </span>
                    </div>
                    <div className="h-1 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${cBarColor}`}
                        style={{ width: `${cPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </DisplayCard>
  );
}
