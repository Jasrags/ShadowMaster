"use client";

/**
 * EffectsSummaryDisplay
 *
 * Collapsible DisplayCard showing all active effects on a character,
 * grouped by source type (Qualities, Cyberware, Bioware, Gear, Adept Powers,
 * Active Modifiers). Each row shows source name, effect type badge,
 * value pill, and wireless indicator.
 *
 * @see Issue #113
 */

import type { EffectSourceType } from "@/lib/types/effects";
import type { SourcedEffect } from "@/lib/rules/effects";
import { DisplayCard } from "./DisplayCard";
import { Zap, Wifi } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface EffectsSummaryDisplayProps {
  sources: SourcedEffect[];
}

// ---------------------------------------------------------------------------
// Section config
// ---------------------------------------------------------------------------

const SOURCE_SECTIONS: Array<{ key: EffectSourceType; label: string }> = [
  { key: "quality", label: "Qualities" },
  { key: "cyberware", label: "Cyberware" },
  { key: "bioware", label: "Bioware" },
  { key: "gear", label: "Gear" },
  { key: "adept-power", label: "Adept Powers" },
  { key: "active-modifier", label: "Active Modifiers" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatEffectType(type: string): string {
  return type.replace(/-/g, " ");
}

function resolveDisplayValue(source: SourcedEffect): number {
  const { effect, source: src } = source;
  let value: number;
  if (typeof effect.value === "number") {
    value = effect.value;
  } else if (effect.value && typeof effect.value === "object" && "perRating" in effect.value) {
    value = effect.value.perRating * (src.rating ?? 1);
  } else {
    return 0;
  }

  if (src.wirelessEnabled && effect.wirelessOverride?.bonusValue !== undefined) {
    value += effect.wirelessOverride.bonusValue;
  }

  if (effect.requiresWireless && !src.wirelessEnabled) {
    value = 0;
  }

  return value;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function EffectRow({ sourced }: { sourced: SourcedEffect }) {
  const { effect, source } = sourced;
  const value = resolveDisplayValue(sourced);
  const isWireless =
    source.wirelessEnabled &&
    (effect.wirelessOverride !== undefined || effect.requiresWireless === true);

  return (
    <div className="flex min-w-0 items-center gap-1.5 px-3 py-1.5 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50">
      {/* Source name */}
      <span className="truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
        {source.name}
      </span>

      {/* Effect type badge */}
      <span className="shrink-0 rounded-full border border-blue-500/20 bg-blue-500/10 px-1.5 py-px font-mono text-[9px] uppercase text-blue-400">
        {formatEffectType(effect.type)}
      </span>

      {/* Wireless indicator */}
      {isWireless && (
        <span title="Wireless bonus active">
          <Wifi className="h-3 w-3 shrink-0 text-cyan-400" />
        </span>
      )}

      {/* Value pill */}
      <span
        className={`ml-auto shrink-0 rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold ${
          value > 0
            ? "border-emerald-500/20 bg-emerald-500/12 text-emerald-600 dark:text-emerald-300"
            : value < 0
              ? "border-red-500/20 bg-red-500/12 text-red-600 dark:text-red-300"
              : "border-zinc-500/20 bg-zinc-500/12 text-zinc-500"
        }`}
      >
        {value > 0 ? "+" : ""}
        {value}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function EffectsSummaryDisplay({ sources }: EffectsSummaryDisplayProps) {
  if (sources.length === 0) return null;

  // Group by source type
  const grouped = new Map<EffectSourceType, SourcedEffect[]>();
  for (const s of sources) {
    const list = grouped.get(s.source.type) || [];
    list.push(s);
    grouped.set(s.source.type, list);
  }

  return (
    <DisplayCard
      id="sheet-effects-summary"
      title="Active Effects"
      icon={<Zap className="h-4 w-4 text-zinc-400" />}
      collapsible
      defaultCollapsed
      collapsedSummary={
        <span className="text-xs text-zinc-500 font-mono">{sources.length} effects</span>
      }
    >
      <div className="space-y-3">
        {SOURCE_SECTIONS.filter((section) => grouped.has(section.key)).map((section) => {
          const sectionSources = grouped.get(section.key)!;
          return (
            <div key={section.key}>
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                {section.label}
              </div>
              <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                {sectionSources.map((s, idx) => (
                  <EffectRow key={`${s.source.id}-${s.effect.id}-${idx}`} sourced={s} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </DisplayCard>
  );
}
