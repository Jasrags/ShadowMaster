"use client";

/**
 * EffectsSummaryDisplay
 *
 * Collapsible DisplayCard showing all active effects on a character,
 * grouped by source type (Qualities, Cyberware, Bioware, Gear, Adept Powers,
 * Active Modifiers) and sub-grouped by source item. Each source item shows
 * its name (with parent attribution for mods) and colored effect badges.
 *
 * @see Issue #113, #486
 */

import type { EffectSourceType } from "@/lib/types/effects";
import type { SourcedEffect } from "@/lib/rules/effects";
import { formatEffectBadge } from "@/lib/rules/effects";
import type { EffectBadge } from "@/lib/rules/effects";
import { DisplayCard } from "./DisplayCard";
import { Zap, Wifi } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface EffectsSummaryDisplayProps {
  sources: SourcedEffect[];
}

interface GroupedSourceItem {
  id: string;
  name: string;
  parentName?: string;
  hasWireless: boolean;
  effects: SourcedEffect[];
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

/**
 * Sub-group effects by source.id within a source-type section.
 * Preserves insertion order.
 */
function groupBySourceId(effects: SourcedEffect[]): GroupedSourceItem[] {
  const map = new Map<string, GroupedSourceItem>();

  for (const s of effects) {
    const existing = map.get(s.source.id);
    if (existing) {
      existing.effects.push(s);
      if (isWirelessEffect(s)) {
        existing.hasWireless = true;
      }
    } else {
      map.set(s.source.id, {
        id: s.source.id,
        name: s.source.name,
        parentName: s.source.parentName,
        hasWireless: isWirelessEffect(s),
        effects: [s],
      });
    }
  }

  return Array.from(map.values());
}

function isWirelessEffect(s: SourcedEffect): boolean {
  return !!(
    s.source.wirelessEnabled &&
    (s.effect.wirelessOverride !== undefined || s.effect.requiresWireless === true)
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SourceItemRow({ item }: { item: GroupedSourceItem }) {
  const badges: Array<EffectBadge & { value: number }> = [];

  for (const s of item.effects) {
    const value = resolveDisplayValue(s);
    const badge = formatEffectBadge(s.effect, { resolvedValue: value });
    if (badge) {
      badges.push({ ...badge, value });
    }
  }

  return (
    <div className="flex min-w-0 flex-wrap items-center gap-1.5 px-3 py-1.5 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50">
      {/* Source name with optional parent attribution */}
      <span className="truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
        {item.name}
        {item.parentName && <span className="text-zinc-500"> ({item.parentName})</span>}
      </span>

      {/* Wireless indicator */}
      {item.hasWireless && (
        <span title="Wireless bonus active">
          <Wifi className="h-3 w-3 shrink-0 text-cyan-400" />
        </span>
      )}

      {/* Effect badges */}
      {badges.map((badge, idx) => (
        <span
          key={idx}
          data-testid="effect-badge"
          className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium ${badge.colorClass}`}
        >
          {badge.label}
          {badge.trigger && (
            <span className={badge.triggerActive ? "font-semibold text-red-400" : "opacity-50"}>
              · {badge.trigger}
            </span>
          )}
        </span>
      ))}
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
          const items = groupBySourceId(sectionSources);
          return (
            <div key={section.key}>
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                {section.label}
              </div>
              <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                {items.map((item) => (
                  <SourceItemRow key={item.id} item={item} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </DisplayCard>
  );
}
