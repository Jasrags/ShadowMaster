"use client";

import { useState, useMemo } from "react";
import type { Character, GearItem, Weapon, ArmorItem } from "@/lib/types";
import type {
  EquipmentReadiness,
  ContainerProperties,
  StashLocationType,
} from "@/lib/types/gear-state";
import { isContainer } from "@/lib/rules/inventory";
import { ContainerContentsDisplay } from "./ContainerContentsDisplay";
import { getReadinessLabel, getReadinessColor } from "./readiness-helpers";
import { ChevronDown, ChevronRight, Swords, Shield, Package } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface GearLocationViewProps {
  character: Character;
  onCharacterUpdate?: (updated: Character) => void;
  editable?: boolean;
}

type AnyItem = (GearItem | Weapon | ArmorItem) & { _type: "gear" | "weapon" | "armor" };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getItemIcon(type: string) {
  switch (type) {
    case "weapon":
      return <Swords className="h-3 w-3 shrink-0 text-zinc-400" />;
    case "armor":
      return <Shield className="h-3 w-3 shrink-0 text-zinc-400" />;
    default:
      return <Package className="h-3 w-3 shrink-0 text-zinc-400" />;
  }
}

function collectAllItems(character: Character): AnyItem[] {
  const items: AnyItem[] = [];

  for (const w of character.weapons || []) {
    items.push({ ...w, _type: "weapon" });
  }
  for (const a of character.armor || []) {
    items.push({ ...a, _type: "armor" });
  }
  for (const g of character.gear || []) {
    if (g.category === "drug") continue; // drugs displayed separately
    items.push({ ...g, _type: "gear" });
  }
  return items;
}

type Tier = "active" | "on-body" | "carried" | "stash";

function getTier(readiness: EquipmentReadiness): Tier {
  switch (readiness) {
    case "readied":
      return "active";
    case "holstered":
    case "worn":
    case "pocketed":
      return "on-body";
    case "carried":
    case "stored":
      return "carried";
    case "stashed":
      return "stash";
    default:
      return "carried";
  }
}

const TIER_CONFIG: {
  key: Tier;
  label: string;
  color: string;
}[] = [
  { key: "active", label: "Active", color: "text-emerald-400" },
  { key: "on-body", label: "On Body", color: "text-blue-400" },
  { key: "carried", label: "Carried", color: "text-orange-400" },
  { key: "stash", label: "Stash", color: "text-violet-400" },
];

const STASH_TYPE_LABELS: Record<StashLocationType, string> = {
  home: "Home",
  safehouse: "Safehouse",
  vehicle: "Vehicle",
  storage: "Storage",
  custom: "Other",
};

// ---------------------------------------------------------------------------
// GearLocationView
// ---------------------------------------------------------------------------

export function GearLocationView({
  character,
  onCharacterUpdate,
  editable,
}: GearLocationViewProps) {
  const [expandedTiers, setExpandedTiers] = useState<Set<string>>(
    new Set(["active", "on-body", "carried"])
  );

  const allItems = useMemo(() => collectAllItems(character), [character]);

  // Group by tier, excluding contained items
  const grouped = useMemo(() => {
    const tiers: Record<Tier, AnyItem[]> = {
      active: [],
      "on-body": [],
      carried: [],
      stash: [],
    };

    for (const item of allItems) {
      if (item.state?.containedIn) continue;
      const readiness =
        item.state?.readiness ??
        (item._type === "weapon" ? "holstered" : item._type === "armor" ? "worn" : "carried");
      tiers[getTier(readiness)].push(item);
    }

    return tiers;
  }, [allItems]);

  // Sub-group stash items by stash location type
  const stashSubGroups = useMemo(() => {
    const groups: Record<string, AnyItem[]> = {};
    for (const item of grouped.stash) {
      const locType = item.state?.stashLocation?.type ?? "default";
      const label =
        locType === "default"
          ? "Default"
          : (STASH_TYPE_LABELS[locType as StashLocationType] ?? locType);
      if (!groups[label]) groups[label] = [];
      groups[label].push(item);
    }
    return groups;
  }, [grouped.stash]);

  function toggleTier(tier: string) {
    setExpandedTiers((prev) => {
      const next = new Set(prev);
      if (next.has(tier)) next.delete(tier);
      else next.add(tier);
      return next;
    });
  }

  return (
    <div data-testid="gear-location-view" className="space-y-2">
      {TIER_CONFIG.map(({ key, label, color }) => {
        const items = key === "stash" ? grouped.stash : grouped[key];
        if (items.length === 0) return null;

        const isExpanded = expandedTiers.has(key);

        return (
          <div key={key} data-testid={`tier-${key}`}>
            <button
              data-testid={`tier-toggle-${key}`}
              onClick={() => toggleTier(key)}
              className="flex w-full items-center gap-1.5 py-1"
            >
              <span className="shrink-0 text-zinc-400">
                {isExpanded ? (
                  <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
              </span>
              <span className={`text-[10px] font-semibold uppercase tracking-wider ${color}`}>
                {label}
              </span>
              <span className="text-[10px] font-mono text-zinc-500">({items.length})</span>
            </button>

            {isExpanded && (
              <div className="ml-5 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                {key === "stash"
                  ? // Stash tier: sub-grouped by location type
                    Object.entries(stashSubGroups).map(([locLabel, locItems]) => (
                      <div key={locLabel}>
                        <div className="px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-violet-400/60 bg-violet-500/5">
                          {locLabel}
                        </div>
                        {locItems.map((item, idx) => (
                          <LocationItemRow
                            key={`${item.name}-${idx}`}
                            item={item}
                            character={character}
                            onCharacterUpdate={onCharacterUpdate}
                            editable={editable}
                          />
                        ))}
                      </div>
                    ))
                  : items.map((item, idx) => (
                      <LocationItemRow
                        key={`${item.name}-${idx}`}
                        item={item}
                        character={character}
                        onCharacterUpdate={onCharacterUpdate}
                        editable={editable}
                      />
                    ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// LocationItemRow
// ---------------------------------------------------------------------------

function LocationItemRow({
  item,
  character,
  onCharacterUpdate,
  editable,
}: {
  item: AnyItem;
  character: Character;
  onCharacterUpdate?: (updated: Character) => void;
  editable?: boolean;
}) {
  const readiness = item.state?.readiness ?? "carried";
  const itemId = "id" in item ? (item.id as string | undefined) : undefined;
  const itemIsContainer = isContainer(item);

  return (
    <div
      data-testid="location-item-row"
      className="px-3 py-1 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50"
    >
      <div className="flex items-center gap-1.5">
        {getItemIcon(item._type)}
        <span className="truncate text-[12px] font-medium text-zinc-800 dark:text-zinc-200">
          {item.name}
        </span>
        <span className="ml-auto" />
        <span
          className={`shrink-0 rounded border px-1 py-0.5 text-[9px] font-medium ${getReadinessColor(readiness)}`}
        >
          {getReadinessLabel(readiness)}
        </span>
      </div>

      {/* Container contents */}
      {itemIsContainer && itemId && "containerProperties" in item && item.containerProperties && (
        <ContainerContentsDisplay
          character={character}
          containerId={itemId}
          containerProperties={item.containerProperties as ContainerProperties}
          onCharacterUpdate={onCharacterUpdate}
          editable={editable}
        />
      )}
    </div>
  );
}
