"use client";

import { useMemo } from "react";
import type { Character } from "@/lib/types";
import type { MagicalPath } from "@/lib/types/core";
import { DisplayCard } from "./DisplayCard";
import { Sparkles } from "lucide-react";
import { useTraditions } from "@/lib/rules";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ATTR_ABBREV: Record<string, string> = {
  body: "BOD",
  agility: "AGI",
  reaction: "REA",
  strength: "STR",
  willpower: "WIL",
  logic: "LOG",
  intuition: "INT",
  charisma: "CHA",
};

const PATH_LABELS: Record<MagicalPath, string> = {
  mundane: "Mundane",
  "full-mage": "Full Mage",
  "aspected-mage": "Aspected Mage",
  "mystic-adept": "Mystic Adept",
  adept: "Adept",
  technomancer: "Technomancer",
  explorer: "Explorer",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface MagicSummaryDisplayProps {
  character: Character;
}

export function MagicSummaryDisplay({ character }: MagicSummaryDisplayProps) {
  const traditions = useTraditions();
  const isTechnomancer = character.magicalPath === "technomancer";

  const tradition = useMemo(() => {
    if (!character.tradition) return null;
    return traditions.find((t) => t.id === character.tradition) ?? null;
  }, [traditions, character.tradition]);

  const magicRating = useMemo(
    () =>
      isTechnomancer
        ? (character.specialAttributes.resonance ?? 0)
        : (character.specialAttributes.magic ?? 0),
    [character.specialAttributes, isTechnomancer]
  );

  const magicLost = character.essenceHole?.magicLost ?? 0;
  const baseMagicRating = magicRating + magicLost;

  const initiateGrade = character.initiateGrade ?? 0;

  const sustainedCount = character.sustainedSpells?.length ?? 0;
  const sustainedPenalty = sustainedCount > 0 ? sustainedCount * -2 : 0;

  const boundSpirits = useMemo(
    () => (character.spirits ?? []).filter((s) => s.bound),
    [character.spirits]
  );
  const totalServices = useMemo(
    () => boundSpirits.reduce((sum, s) => sum + s.services, 0),
    [boundSpirits]
  );

  const activeFociCount = character.activeFoci?.length ?? 0;

  const powerPointsSpent = useMemo(
    () => (character.adeptPowers ?? []).reduce((sum, p) => sum + p.powerPointCost, 0),
    [character.adeptPowers]
  );

  const hasAdeptPowers =
    character.magicalPath === "adept" || character.magicalPath === "mystic-adept";

  // Counts for bottom row
  const spellCount = character.spells?.length ?? 0;
  const adeptPowerCount = character.adeptPowers?.length ?? 0;
  const complexFormCount = character.complexForms?.length ?? 0;
  const fociCount = character.foci?.length ?? 0;

  const hasActiveEffects = sustainedCount > 0 || boundSpirits.length > 0 || activeFociCount > 0;
  const hasResourceCounts =
    spellCount > 0 || adeptPowerCount > 0 || complexFormCount > 0 || fociCount > 0;

  if (character.magicalPath === "mundane") return null;

  const drainFormula = tradition
    ? tradition.drainAttributes.map((a) => ATTR_ABBREV[a] ?? a.toUpperCase()).join(" + ")
    : null;

  return (
    <DisplayCard
      id="sheet-magic-summary"
      title={isTechnomancer ? "Resonance" : "Magic"}
      icon={<Sparkles className="h-4 w-4 text-violet-400" />}
      collapsible
    >
      <div className="space-y-3">
        {/* Magical Ability */}
        <div data-testid="magic-ability-section">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            {isTechnomancer ? "Resonance Ability" : "Magical Ability"}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              data-testid="magic-path"
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400"
            >
              {PATH_LABELS[character.magicalPath]}
            </span>
            <span
              data-testid="magic-rating"
              className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
            >
              {isTechnomancer ? "RES" : "MAG"} {magicRating}
              {magicLost > 0 && (
                <span className="text-rose-500 dark:text-rose-400"> / {baseMagicRating}</span>
              )}
            </span>
            {initiateGrade > 0 && (
              <span
                data-testid="initiate-grade"
                className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
              >
                {isTechnomancer ? "Submersion" : "Grade"} {initiateGrade}
              </span>
            )}
          </div>
          {/* Tradition / Stream */}
          {tradition && (
            <div
              data-testid="tradition-info"
              className="mt-1.5 text-[11px] text-zinc-500 dark:text-zinc-400"
            >
              <span className="font-medium text-zinc-700 dark:text-zinc-300">{tradition.name}</span>
              {drainFormula && (
                <span className="ml-1">
                  — Drain: <span className="font-mono font-semibold">{drainFormula}</span>
                </span>
              )}
            </div>
          )}
          {isTechnomancer && character.stream && (
            <div
              data-testid="stream-info"
              className="mt-1.5 text-[11px] text-zinc-500 dark:text-zinc-400"
            >
              Stream:{" "}
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {character.stream}
              </span>
            </div>
          )}
        </div>

        {/* Metamagics */}
        {initiateGrade > 0 && character.metamagics && character.metamagics.length > 0 && (
          <div data-testid="metamagics-section">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Metamagics
            </div>
            <div className="flex flex-wrap gap-1.5">
              {character.metamagics.map((m) => (
                <span
                  key={m}
                  className="rounded-full px-2 py-0.5 text-[10px] font-medium bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  {m.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Active Effects */}
        {hasActiveEffects && (
          <div data-testid="active-effects-section">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Active Effects
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-zinc-500 dark:text-zinc-400">
              {sustainedCount > 0 && (
                <span data-testid="sustained-spells" className="font-mono">
                  {sustainedCount} Sustained{" "}
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    ({sustainedPenalty})
                  </span>
                </span>
              )}
              {boundSpirits.length > 0 && (
                <span data-testid="bound-spirits" className="font-mono">
                  {boundSpirits.length} Bound Spirit{boundSpirits.length !== 1 ? "s" : ""}{" "}
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                    ({totalServices} service{totalServices !== 1 ? "s" : ""})
                  </span>
                </span>
              )}
              {activeFociCount > 0 && (
                <span data-testid="active-foci" className="font-mono">
                  {activeFociCount} Active {activeFociCount !== 1 ? "Foci" : "Focus"}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Power Points */}
        {hasAdeptPowers && (
          <div data-testid="power-points-section" className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Power Points</span>
            <span
              data-testid="power-points-value"
              className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
            >
              {powerPointsSpent} / {magicRating} PP
            </span>
          </div>
        )}

        {/* Resource Counts */}
        {hasResourceCounts && (
          <div
            data-testid="resource-counts"
            className="flex flex-wrap gap-x-2 text-[11px] text-zinc-500 dark:text-zinc-400"
          >
            {spellCount > 0 && (
              <span>
                {spellCount} Spell{spellCount !== 1 ? "s" : ""}
              </span>
            )}
            {spellCount > 0 && adeptPowerCount > 0 && <span>·</span>}
            {adeptPowerCount > 0 && (
              <span>
                {adeptPowerCount} Power{adeptPowerCount !== 1 ? "s" : ""}
              </span>
            )}
            {(spellCount > 0 || adeptPowerCount > 0) && complexFormCount > 0 && <span>·</span>}
            {complexFormCount > 0 && (
              <span>
                {complexFormCount} Complex Form{complexFormCount !== 1 ? "s" : ""}
              </span>
            )}
            {(spellCount > 0 || adeptPowerCount > 0 || complexFormCount > 0) && fociCount > 0 && (
              <span>·</span>
            )}
            {fociCount > 0 && (
              <span>
                {fociCount} {fociCount !== 1 ? "Foci" : "Focus"}
              </span>
            )}
          </div>
        )}
      </div>
    </DisplayCard>
  );
}
