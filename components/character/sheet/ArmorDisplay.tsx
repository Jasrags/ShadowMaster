"use client";

import { useState } from "react";
import { Button as AriaButton } from "react-aria-components";
import type { Character, ArmorItem } from "@/lib/types";
import type { ArmorData, GearCatalogData } from "@/lib/rules/RulesetContext";
import type { EquipmentReadiness } from "@/lib/types/gear-state";
import { useGear } from "@/lib/rules";
import { calculateArmorTotal } from "@/lib/rules/gameplay";
import { isGlobalWirelessEnabled } from "@/lib/rules/wireless";
import { Tooltip } from "@/components/ui";
import { DisplayCard } from "./DisplayCard";
import { WirelessIndicator } from "./WirelessIndicator";
import { getReadinessLabel, getReadinessColor, READINESS_BY_EQUIPMENT } from "./readiness-helpers";
import { ChevronDown, ChevronRight, Shield, Wifi, WifiOff } from "lucide-react";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isWorn(a: ArmorItem): boolean {
  return a.state?.readiness === "worn" || (!a.state && a.equipped);
}

function formatLegality(legality: string): string {
  if (legality === "restricted") return "R";
  if (legality === "forbidden") return "F";
  return "";
}

/** Search the armor catalog array by id. */
function findCatalogArmor(
  catalog: GearCatalogData | null,
  catalogId: string
): ArmorData | undefined {
  if (!catalog?.armor) return undefined;
  return catalog.armor.find((item) => item.id === catalogId);
}

// ---------------------------------------------------------------------------
// Local state update handlers
// ---------------------------------------------------------------------------

function changeArmorReadiness(
  character: Character,
  armorIndex: number,
  newState: EquipmentReadiness,
  onCharacterUpdate: (updated: Character) => void
) {
  const updatedArmor = character.armor?.map((a, idx) =>
    idx === armorIndex
      ? {
          ...a,
          equipped: newState === "worn",
          state: {
            ...a.state,
            readiness: newState,
            wirelessEnabled: a.state?.wirelessEnabled ?? true,
          },
        }
      : a
  );

  onCharacterUpdate({ ...character, armor: updatedArmor });
}

function toggleArmorWireless(
  character: Character,
  armorIndex: number,
  enabled: boolean,
  onCharacterUpdate: (updated: Character) => void
) {
  const updatedArmor = character.armor?.map((a, idx) =>
    idx === armorIndex
      ? {
          ...a,
          state: {
            ...a.state,
            readiness: a.state?.readiness ?? ("worn" as const),
            wirelessEnabled: enabled,
          },
        }
      : a
  );

  onCharacterUpdate({ ...character, armor: updatedArmor });
}

// ---------------------------------------------------------------------------
// Section config
// ---------------------------------------------------------------------------

const ARMOR_SECTIONS = [
  { key: "worn" as const, label: "Worn" },
  { key: "stored" as const, label: "Stored" },
];

// ---------------------------------------------------------------------------
// ArmorTotalTooltipContent
// ---------------------------------------------------------------------------

function ArmorTotalTooltipContent({
  breakdown,
}: {
  breakdown: {
    baseArmorName?: string;
    baseArmor: number;
    accessories: Array<{ name: string; rating: number }>;
    effectiveAccessoryBonus: number;
    rawAccessoryBonus: number;
    strength: number;
    totalArmor: number;
  };
}) {
  const isAccessoryCapped = breakdown.rawAccessoryBonus > breakdown.strength;

  return (
    <div className="space-y-1" data-testid="armor-total-tooltip">
      {breakdown.baseArmorName && (
        <div className="flex items-center justify-between gap-4">
          <span className="text-zinc-400">{breakdown.baseArmorName}</span>
          <span className="font-mono font-semibold text-blue-400">{breakdown.baseArmor}</span>
        </div>
      )}
      {breakdown.accessories.map((acc, i) => (
        <div key={i} className="flex items-center justify-between gap-4">
          <span className="text-zinc-400">{acc.name}</span>
          <span className="font-mono font-semibold text-blue-400">+{acc.rating}</span>
        </div>
      ))}
      {isAccessoryCapped && (
        <div className="text-[10px] text-amber-400">
          Accessory bonus capped at STR {breakdown.strength} (+{breakdown.effectiveAccessoryBonus}{" "}
          of +{breakdown.rawAccessoryBonus})
        </div>
      )}
      {(breakdown.baseArmorName || breakdown.accessories.length > 0) && (
        <>
          <div className="border-t border-zinc-600" />
          <div className="flex items-center justify-between gap-4">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-200">
              Total
            </span>
            <span className="font-mono font-bold text-blue-300">{breakdown.totalArmor}</span>
          </div>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ArmorRow
// ---------------------------------------------------------------------------

function ArmorRow({
  item,
  itemIndex,
  character,
  catalogArmor,
  onCharacterUpdate,
  editable,
  isExpanded,
  onToggleExpand,
}: {
  item: ArmorItem;
  itemIndex: number;
  character: Character;
  catalogArmor?: ArmorData;
  onCharacterUpdate?: (updated: Character) => void;
  editable?: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) {
  // Readiness state
  const readiness: EquipmentReadiness =
    item.state?.readiness ?? (item.equipped ? "worn" : "stored");

  // Wireless state
  const hasWireless = true;
  const globalWireless = isGlobalWirelessEnabled(character);
  const wirelessEnabled = item.state?.wirelessEnabled ?? true;
  const isWirelessActive = hasWireless && globalWireless && wirelessEnabled;

  return (
    <div
      data-testid="armor-row"
      className="cursor-pointer px-3 py-1.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700/30 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50"
      onClick={onToggleExpand}
    >
      {/* Collapsed row: Chevron + Name + Accessory badge + [Readiness] [Wifi] Rating pill */}
      <div className="flex min-w-0 items-center gap-1.5">
        <span data-testid="expand-button" className="shrink-0 text-zinc-400">
          {isExpanded ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </span>
        <span className="truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
          {item.name}
        </span>
        {item.subcategory && (
          <span
            data-testid="subcategory-label"
            className="truncate text-[10px] text-zinc-400 dark:text-zinc-500"
          >
            ({item.subcategory.charAt(0).toUpperCase() + item.subcategory.slice(1)})
          </span>
        )}

        {/* Spacer to push badges to the right */}
        <span className="ml-auto" />

        {/* Readiness badge (always visible) */}
        <span
          data-testid="readiness-badge"
          className={`shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-medium ${getReadinessColor(readiness)}`}
        >
          {getReadinessLabel(readiness)}
        </span>

        {/* State-aware wifi icon */}
        {hasWireless &&
          (isWirelessActive ? (
            <Wifi
              data-testid="wireless-icon"
              className="h-3 w-3 shrink-0 text-cyan-500 dark:text-cyan-400"
            />
          ) : (
            <WifiOff
              data-testid="wireless-icon-off"
              className="h-3 w-3 shrink-0 text-zinc-400 dark:text-zinc-500"
            />
          ))}

        <span
          data-testid="rating-pill"
          className="shrink-0 rounded border border-sky-500/20 bg-sky-500/12 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-sky-600 dark:text-sky-300"
        >
          {item.armorRating}
        </span>
      </div>

      {/* Expanded section */}
      {isExpanded && (
        <div
          data-testid="expanded-content"
          className="ml-5 mt-2 space-y-2 border-l-2 border-zinc-200 pl-3 dark:border-zinc-700"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Stats row */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
            {item.availability != null && (
              <span data-testid="stat-availability">
                Avail{" "}
                <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                  {item.availability}
                  {item.legality ? formatLegality(item.legality) : ""}
                </span>
              </span>
            )}
            {item.weight != null && (
              <span data-testid="stat-weight">
                Weight{" "}
                <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                  {item.weight}kg
                </span>
              </span>
            )}
          </div>

          {/* Capacity (non-custom items only) */}
          {!item.isCustom && (
            <div
              data-testid="capacity-section"
              className="text-xs text-zinc-500 dark:text-zinc-400"
            >
              Capacity{" "}
              <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                {item.capacityUsed ?? 0}/{item.capacity ?? item.armorRating}
              </span>
            </div>
          )}

          {/* Inventory controls section (editable only) */}
          {editable && onCharacterUpdate && (
            <div data-testid="inventory-controls" className="space-y-2">
              {/* Readiness controls */}
              <div data-testid="readiness-controls" className="flex flex-wrap items-center gap-1">
                <span className="mr-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  Readiness
                </span>
                {READINESS_BY_EQUIPMENT.armor.map((state) => (
                  <button
                    key={state}
                    data-testid={`readiness-${state}`}
                    disabled={state === readiness}
                    onClick={(e) => {
                      e.stopPropagation();
                      changeArmorReadiness(character, itemIndex, state, onCharacterUpdate);
                    }}
                    className={`rounded border px-2 py-0.5 text-[10px] font-medium transition-colors ${
                      state === readiness
                        ? getReadinessColor(state)
                        : "border-zinc-300 text-zinc-400 hover:border-zinc-400 hover:text-zinc-300 dark:border-zinc-700 dark:text-zinc-500 dark:hover:border-zinc-600"
                    }`}
                  >
                    {getReadinessLabel(state)}
                  </button>
                ))}
              </div>

              {/* Wireless toggle */}
              {hasWireless && (
                <div data-testid="wireless-toggle" className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                    Wireless
                  </span>
                  <WirelessIndicator
                    enabled={wirelessEnabled}
                    globalEnabled={globalWireless}
                    bonusDescription={item.wirelessBonus || catalogArmor?.wirelessBonus}
                    onToggle={(enabled) =>
                      toggleArmorWireless(character, itemIndex, enabled, onCharacterUpdate)
                    }
                    size="sm"
                  />
                </div>
              )}
            </div>
          )}

          {/* Modifications */}
          {item.modifications && item.modifications.length > 0 && (
            <div data-testid="modifications-section">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Modifications
              </div>
              <div className="space-y-0.5">
                {item.modifications.map((mod, idx) => (
                  <div
                    key={`${mod.catalogId}-${idx}`}
                    data-testid="mod-row"
                    className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400"
                  >
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">{mod.name}</span>
                    {mod.rating != null && (
                      <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-500">
                        {mod.rating}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ArmorDisplay
// ---------------------------------------------------------------------------

interface ArmorDisplayProps {
  character: Character;
  onCharacterUpdate?: (updatedCharacter: Character) => void;
  editable?: boolean;
}

export function ArmorDisplay({ character, onCharacterUpdate, editable }: ArmorDisplayProps) {
  const catalog = useGear();
  const [expandedIndices, setExpandedIndices] = useState<Set<number>>(new Set());
  const armor = character.armor || [];

  if (armor.length === 0) return null;

  const grouped: Record<"worn" | "stored", { item: ArmorItem; index: number }[]> = {
    worn: [],
    stored: [],
  };

  armor.forEach((item, index) => {
    if (isWorn(item)) {
      grouped.worn.push({ item, index });
    } else {
      grouped.stored.push({ item, index });
    }
  });

  // Compute armor total for worn armor
  const strength = character.attributes?.strength || 0;
  const armorCalc = calculateArmorTotal(armor, strength);

  // Build accessory breakdown for tooltip
  const wornAccessories = grouped.worn
    .filter(({ item }) => item.armorModifier === true)
    .map(({ item }) => ({ name: item.name, rating: item.armorRating }));

  const armorBreakdown = {
    baseArmorName: armorCalc.baseArmorName,
    baseArmor: armorCalc.baseArmor,
    accessories: wornAccessories,
    effectiveAccessoryBonus: armorCalc.effectiveAccessoryBonus,
    rawAccessoryBonus: armorCalc.rawAccessoryBonus,
    strength,
    totalArmor: armorCalc.totalArmor,
  };

  return (
    <DisplayCard
      id="sheet-armor"
      title="Armor"
      icon={<Shield className="h-4 w-4 text-zinc-400" />}
      collapsible
      headerAction={
        grouped.worn.length > 0 ? (
          <Tooltip
            content={<ArmorTotalTooltipContent breakdown={armorBreakdown} />}
            delay={200}
            showArrow={false}
          >
            <AriaButton
              aria-label="Armor total breakdown"
              className="inline-flex items-center gap-0.5 rounded bg-blue-500/15 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="armor-total-pill"
            >
              {armorCalc.totalArmor}
              <Shield className="h-2.5 w-2.5" />
            </AriaButton>
          </Tooltip>
        ) : undefined
      }
    >
      <div className="space-y-3">
        {ARMOR_SECTIONS.map(({ key, label }) => {
          if (grouped[key].length === 0) return null;
          return (
            <div key={key}>
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                {label}
              </div>
              <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                {grouped[key].map(({ item, index }) => (
                  <ArmorRow
                    key={`${item.name}-${index}`}
                    item={item}
                    itemIndex={index}
                    character={character}
                    catalogArmor={
                      item.catalogId ? findCatalogArmor(catalog, item.catalogId) : undefined
                    }
                    onCharacterUpdate={onCharacterUpdate}
                    editable={editable}
                    isExpanded={expandedIndices.has(index)}
                    onToggleExpand={() => {
                      setExpandedIndices((prev) => {
                        const next = new Set(prev);
                        if (next.has(index)) next.delete(index);
                        else next.add(index);
                        return next;
                      });
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </DisplayCard>
  );
}
